// Transform backend data format to frontend format
import type { ClusterData, PersonaData, ConversationData } from './dataService';
import type { ScammerProfile, ConversationLog, Message } from '../App';

// Convert active hours array to string format
function formatActiveHours(hours: number[]): string {
  if (!hours || hours.length === 0) return 'Unknown';
  const sorted = [...hours].sort((a, b) => a - b);
  const start = sorted[0];
  const end = sorted[sorted.length - 1];
  const startHour = start < 12 ? `${start}am` : start === 12 ? '12pm' : start === 0 ? '12am' : `${start - 12}pm`;
  const endHour = end < 12 ? `${end}am` : end === 12 ? '12pm' : end === 0 ? '12am' : `${end - 12}pm`;
  return `${startHour}-${endHour}`;
}

// Get peak hour from active hours
function getPeakHour(hours: number[]): number {
  if (!hours || hours.length === 0) return 12;
  // Return the hour that appears most frequently, or middle of range
  return Math.round(hours.reduce((a, b) => a + b, 0) / hours.length);
}

// Generate color based on persona ID
function generateColor(personaId: string): string {
  const colors = [
    '#3b82f6', '#ec4899', '#8b5cf6', '#f59e0b', '#10b981',
    '#ef4444', '#06b6d4', '#a855f7', '#f97316', '#84cc16'
  ];
  // Extract number from ID like "C000" -> 0
  const num = parseInt(personaId.replace(/\D/g, '')) || 0;
  return colors[num % colors.length];
}

// Transform backend persona data to frontend ScammerProfile
export function transformPersonas(
  clusters: ClusterData[],
  personas: PersonaData
): ScammerProfile[] {
  return clusters.map((cluster) => {
    const personaId = normalizePersonaId(String(cluster.persona_id));
    const persona = personas[personaId] || personas[String(cluster.persona_id)];
    
    if (!persona) {
      // Fallback if persona details not found
      return {
        id: personaId,
        name: cluster.name,
        type: cluster.archetype || 'Generic Scam',
        riskScore: cluster.risk,
        activeHours: 'Unknown',
        platform: ['Email'],
        tone: 'Unknown',
        avgMessageLength: 0,
        commonPhrases: cluster.keywords.slice(0, 4),
        conversations: 0,
        peakHour: 12,
        keywords: cluster.keywords,
        color: generateColor(personaId),
        tactics: [],
        firstSeen: new Date().toISOString().split('T')[0],
        lastSeen: new Date().toISOString().split('T')[0],
        successRate: 0,
        averageScamDuration: 'Unknown',
      };
    }

    const traits = persona.traits || {};
    const activeHours = persona.active_hours || [];
    
    // Try to classify based on keywords if archetype is generic
    const archetype = persona.archetype || cluster.archetype || 'Generic Scam';
    const classifiedType = archetype === 'Generic Scam' 
      ? classifyScamType(cluster.keywords, cluster.description || '')
      : archetype;
    
    return {
      id: personaId,
      name: persona.name || cluster.name,
      type: classifiedType,
      riskScore: persona.risk_score || cluster.risk,
      activeHours: formatActiveHours(activeHours),
      platform: traits.platform || ['Email'],
      tone: traits.tone || 'Unknown',
      avgMessageLength: traits.avg_message_length || 0,
      commonPhrases: traits.common_phrases || cluster.keywords.slice(0, 4),
      conversations: persona.conversations || 0,
      peakHour: getPeakHour(activeHours),
      keywords: cluster.keywords,
      color: persona.color || generateColor(personaId),
      tactics: traits.tactics || [],
      crewId: persona.crew_id,
      firstSeen: persona.first_seen || new Date().toISOString().split('T')[0],
      lastSeen: persona.last_seen || new Date().toISOString().split('T')[0],
      successRate: persona.success_rate || 0,
      averageScamDuration: 'Unknown', // Not in backend data
    };
  });
}

// Transform backend conversation data to frontend ConversationLog
export function transformConversations(
  conversations: ConversationData[]
): ConversationLog[] {
  return conversations.map((conv, index) => {
    // Ensure messages are properly formatted and filter out empty messages
    const messages: Message[] = (conv.messages || [])
      .filter(msg => msg && msg.text && msg.text.trim()) // Filter out empty messages
      .map((msg) => ({
        sender: msg.sender || 'scammer',
        text: msg.text || '',
        time: msg.time || '00:00',
        type: msg.type || 'text',
        flags: msg.flags || [],
      }));

    // Sort messages by time if available (chronological order)
    const sortedMessages = [...messages].sort((a, b) => {
      if (a.time && b.time) {
        try {
          const timeA = a.time.split(':').map(Number);
          const timeB = b.time.split(':').map(Number);
          const minutesA = (timeA[0] || 0) * 60 + (timeA[1] || 0);
          const minutesB = (timeB[0] || 0) * 60 + (timeB[1] || 0);
          return minutesA - minutesB;
        } catch {
          return 0;
        }
      }
      return 0;
    });

    // Classify conversation type based on content
    const messageTexts = sortedMessages.map(m => m.text).join(' ');
    const classification = conv.classification === 'Generic Scam' || !conv.classification
      ? classifyScamType([], '', [messageTexts])
      : conv.classification;

    // Calculate actual linguistic markers from messages
    const scammerMessages = sortedMessages.filter(m => m.sender === 'scammer');
    const victimMessages = sortedMessages.filter(m => m.sender === 'victim');
    const allText = scammerMessages.map(m => m.text).join(' ').toLowerCase();
    
    // Calculate urgency score
    const urgencyWords = ['urgent', 'immediately', 'asap', 'now', 'hurry', 'quickly', 'deadline', 'expire', 'limited time', 'act now'];
    const urgencyCount = urgencyWords.reduce((count, word) => {
      return count + (allText.match(new RegExp(word, 'gi')) || []).length;
    }, 0);
    const urgencyScore = Math.min(100, urgencyCount * 8);

    // Calculate emotional manipulation
    const manipulationWords = ['trust', 'believe', 'promise', 'guarantee', 'safe', 'secure', 'proven', 'tested'];
    const manipulationCount = manipulationWords.reduce((count, word) => {
      return count + (allText.match(new RegExp(word, 'gi')) || []).length;
    }, 0);
    const manipulationScore = Math.min(100, manipulationCount * 5);

    return {
      id: conv.conversation_id || `conv_${index}`,
      scammerId: normalizePersonaId(String(conv.persona_id)),
      victimId: 'victim_001',
      platform: conv.platform || 'Email',
      startTime: conv.start_time || new Date().toISOString(),
      endTime: conv.end_time || new Date().toISOString(),
      messages: sortedMessages,
      classification,
      outcome: conv.outcome || 'ongoing',
      amountLost: conv.amount_lost,
      flags: [...new Set(sortedMessages.flatMap(m => m.flags || []))], // Remove duplicates
      linguisticMarkers: {
        urgencyScore,
        emotionalManipulation: manipulationScore,
        grammarErrors: Math.floor((allText.match(/[A-Z]{3,}/g) || []).length / 2), // Count ALL CAPS
        scriptedResponses: Math.min(100, (scammerMessages.length - new Set(scammerMessages.map(m => m.text.substring(0, 50))).size) * 20),
      },
    };
  });
}

// Normalize persona ID format (handles R001, P001, C001, C-01, etc.)
// Handles formats: "R001", "P001", "C001", "C-01", "C000" (from different backends)
export function normalizePersonaId(id: string): string {
  if (!id) return id;
  
  // Convert C-01 or P-01 or R-01 to C001/P001/R001 format (from conversations.json)
  if (id.includes('-')) {
    const parts = id.split('-');
    const prefix = parts[0];
    const numStr = parts[1] || '0';
    const num = parseInt(numStr, 10);
    const paddedNum = num.toString().padStart(3, '0');
    return `${prefix}${paddedNum}`;
  }
  
  // Handle R001, P001, C001 format - ensure 3 digits
  const match = id.match(/^([A-Z]+)(\d+)$/);
  if (match) {
    const prefix = match[1];
    const num = parseInt(match[2], 10);
    const paddedNum = num.toString().padStart(3, '0');
    return `${prefix}${paddedNum}`;
  }
  
  return id;
}

// Classify scam type based on keywords and message content
function classifyScamType(keywords: string[], description: string, messages?: string[]): string {
  const allText = [...keywords, description, ...(messages || [])].join(' ').toLowerCase();
  
  // Nigerian Prince / Advance Fee Scam (check first - most common in this dataset)
  if (allText.includes('nigerian') || allText.includes('nigeria') || 
      allText.includes('royal') || allText.includes('prince') || allText.includes('king') ||
      allText.includes('abacha') || allText.includes('lagos') || allText.includes('sierra leone') ||
      allText.includes('congolese') || allText.includes('minister') && allText.includes('government') ||
      allText.includes('assistance') && allText.includes('million') ||
      allText.includes('trapped fund') || allText.includes('inheritance') ||
      allText.includes('late') && allText.includes('million')) {
    return 'Nigerian Prince / Advance Fee Scam';
  }
  
  // Job Scam
  if (allText.includes('job') || allText.includes('salary') || allText.includes('opportunity') || 
      allText.includes('hire') || allText.includes('recruitment') || allText.includes('position')) {
    return 'Job Scam';
  }
  
  // Romance Scam
  if (allText.includes('love') || allText.includes('romance') || allText.includes('relationship') || 
      allText.includes('trust') || allText.includes('soulmate')) {
    return 'Romance Scam';
  }
  
  // Investment Scam
  if (allText.includes('crypto') || allText.includes('bitcoin') || allText.includes('investment') || 
      allText.includes('trading') || allText.includes('profit') || allText.includes('returns')) {
    return 'Investment Scam';
  }
  
  // Phishing / Impersonation
  if (allText.includes('verify') || allText.includes('account') || allText.includes('suspended') || 
      allText.includes('security') || allText.includes('bank') && allText.includes('verify')) {
    return 'Phishing / Impersonation';
  }
  
  // Product Scam
  if (allText.includes('buy') || allText.includes('product') || allText.includes('marketplace') || 
      allText.includes('deal') && !allText.includes('job')) {
    return 'Product Scam';
  }
  
  // Advance Fee Scam (general)
  if (allText.includes('inheritance') || allText.includes('lottery') || allText.includes('prize') || 
      allText.includes('win') || allText.includes('unclaimed') || allText.includes('fund') && allText.includes('transfer')) {
    return 'Advance Fee Scam';
  }
  
  return 'Generic Scam';
}

// Group conversations by persona ID for easy lookup
export function groupConversationsByPersona(
  conversations: ConversationLog[]
): Record<string, Message[]> {
  const grouped: Record<string, Message[]> = {};
  
  conversations.forEach((conv) => {
    // conv.scammerId is already normalized in transformConversations
    const personaId = conv.scammerId;
    if (!grouped[personaId]) {
      grouped[personaId] = [];
    }
    grouped[personaId].push(...conv.messages);
  });
  
  return grouped;
}

