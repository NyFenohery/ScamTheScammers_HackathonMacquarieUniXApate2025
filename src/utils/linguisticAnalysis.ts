// Linguistic analysis utilities
import type { Message } from '../App';

// Analyze word frequency from actual messages
export function analyzeWordFrequency(messages: Message[], topN: number = 8) {
  const wordCounts: Record<string, number> = {};
  const scammerMessages = messages.filter(m => m.sender === 'scammer');
  
  scammerMessages.forEach(msg => {
    const words = msg.text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3); // Only words longer than 3 chars
    
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
  });
  
  return Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .map(([word, count]) => ({ word, count }));
}

// Detect urgency words
const urgencyWords = ['urgent', 'immediately', 'asap', 'now', 'hurry', 'quickly', 'deadline', 'expire', 'limited time', 'act now'];
// Detect authority words
const authorityWords = ['official', 'government', 'bank', 'lawyer', 'attorney', 'minister', 'president', 'director', 'manager', 'supervisor'];
// Detect social proof words
const socialProofWords = ['many people', 'others', 'already', 'successful', 'trusted', 'proven', 'tested'];
// Detect scarcity words
const scarcityWords = ['limited', 'only', 'few', 'last chance', 'exclusive', 'rare'];
// Detect reciprocity words
const reciprocityWords = ['help', 'assist', 'favor', 'kindness', 'grateful', 'appreciate'];

// Calculate persuasion tactics scores
export function calculatePersuasionTactics(messages: Message[]) {
  const scammerMessages = messages.filter(m => m.sender === 'scammer');
  const allText = scammerMessages.map(m => m.text.toLowerCase()).join(' ');
  
  const urgencyScore = urgencyWords.reduce((score, word) => {
    const matches = (allText.match(new RegExp(word, 'gi')) || []).length;
    return score + matches * 10;
  }, 0);
  
  const authorityScore = authorityWords.reduce((score, word) => {
    const matches = (allText.match(new RegExp(word, 'gi')) || []).length;
    return score + matches * 8;
  }, 0);
  
  const socialProofScore = socialProofWords.reduce((score, word) => {
    const matches = (allText.match(new RegExp(word, 'gi')) || []).length;
    return score + matches * 7;
  }, 0);
  
  const scarcityScore = scarcityWords.reduce((score, word) => {
    const matches = (allText.match(new RegExp(word, 'gi')) || []).length;
    return score + matches * 9;
  }, 0);
  
  const reciprocityScore = reciprocityWords.reduce((score, word) => {
    const matches = (allText.match(new RegExp(word, 'gi')) || []).length;
    return score + matches * 6;
  }, 0);
  
  return {
    Urgency: Math.min(100, urgencyScore),
    Authority: Math.min(100, authorityScore),
    'Social Proof': Math.min(100, socialProofScore),
    Scarcity: Math.min(100, scarcityScore),
    Reciprocity: Math.min(100, reciprocityScore),
  };
}

// Calculate urgency and manipulation progression
export function calculatePressureEscalation(messages: Message[]) {
  const scammerMessages = messages.filter(m => m.sender === 'scammer');
  
  return scammerMessages.map((msg, idx) => {
    const text = msg.text.toLowerCase();
    const urgencyCount = urgencyWords.reduce((count, word) => {
      return count + (text.match(new RegExp(word, 'gi')) || []).length;
    }, 0);
    const manipulationCount = [...authorityWords, ...socialProofWords, ...scarcityWords].reduce((count, word) => {
      return count + (text.match(new RegExp(word, 'gi')) || []).length;
    }, 0);
    
    return {
      message: idx + 1,
      urgency: Math.min(100, urgencyCount * 15),
      manipulation: Math.min(100, manipulationCount * 10),
    };
  });
}

// Calculate overall scores
export function calculateLinguisticScores(messages: Message[]) {
  const scammerMessages = messages.filter(m => m.sender === 'scammer');
  const allText = scammerMessages.map(m => m.text).join(' ');
  
  // Urgency score
  const urgencyCount = urgencyWords.reduce((count, word) => {
    return count + (allText.toLowerCase().match(new RegExp(word, 'gi')) || []).length;
  }, 0);
  const urgencyScore = Math.min(100, urgencyCount * 8);
  
  // Emotional manipulation
  const manipulationWords = [...authorityWords, ...socialProofWords, ...scarcityWords, ...reciprocityWords];
  const manipulationCount = manipulationWords.reduce((count, word) => {
    return count + (allText.toLowerCase().match(new RegExp(word, 'gi')) || []).length;
  }, 0);
  const manipulationScore = Math.min(100, manipulationCount * 5);
  
  // Grammar errors (simple heuristic - count common errors)
  const grammarErrors = [
    (allText.match(/[A-Z]{3,}/g) || []).length, // ALL CAPS
    (allText.match(/[!]{2,}/g) || []).length, // Multiple exclamation marks
    (allText.match(/\b(?:i|we|you)\s+(?:is|are|was|were)\b/gi) || []).length, // Subject-verb disagreement
  ].reduce((a, b) => a + b, 0);
  
  // Script match (check for repeated phrases)
  const phrases = scammerMessages.map(m => m.text.toLowerCase().substring(0, 50));
  const uniquePhrases = new Set(phrases);
  const scriptScore = Math.min(100, ((phrases.length - uniquePhrases.size) / phrases.length) * 100);
  
  return {
    urgencyScore,
    manipulationScore,
    grammarErrors,
    scriptScore,
  };
}

// Extract language patterns
export function extractLanguagePatterns(messages: Message[]) {
  const scammerMessages = messages.filter(m => m.sender === 'scammer');
  const allText = scammerMessages.map(m => m.text).join(' ').toLowerCase();
  
  const patterns: Array<{ pattern: string; examples: string[]; count: number }> = [];
  
  // Time pressure
  const timePressureMatches = allText.match(/(?:only|just|within|before|deadline|expire|limited time|act now|hurry|asap)/gi) || [];
  if (timePressureMatches.length > 0) {
    patterns.push({
      pattern: 'Time Pressure Language',
      examples: timePressureMatches.slice(0, 3).map(m => `"${m}"`),
      count: timePressureMatches.length,
    });
  }
  
  // Authority references
  const authorityMatches = allText.match(/(?:government|bank|lawyer|attorney|minister|president|director|official|officer)/gi) || [];
  if (authorityMatches.length > 0) {
    patterns.push({
      pattern: 'Authority References',
      examples: authorityMatches.slice(0, 3).map(m => `"${m}"`),
      count: authorityMatches.length,
    });
  }
  
  // Financial mentions
  const financialMatches = allText.match(/(?:\$|usd|million|thousand|payment|fee|money|fund|transfer|wire)/gi) || [];
  if (financialMatches.length > 0) {
    patterns.push({
      pattern: 'Financial Incentives',
      examples: financialMatches.slice(0, 3).map(m => `"${m}"`),
      count: financialMatches.length,
    });
  }
  
  return patterns;
}

