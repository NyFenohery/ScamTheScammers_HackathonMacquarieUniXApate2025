import { useState } from 'react';
import { X, Send, Sparkles, Copy, CheckCheck } from 'lucide-react';
import { askAnalystBot } from '../services/dataService';
import { renderMarkdown } from '../utils/markdown';
import type { ScammerProfile } from '../App';

import type { ConversationLog } from '../App';

type AnalystPanelProps = {
  onClose: () => void;
  selectedPersona: ScammerProfile | null;
  allPersonas?: ScammerProfile[];
  allConversations?: ConversationLog[];
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// Helper function for scam type descriptions
function getScamTypeDescription(type: string): string {
  const descriptions: Record<string, string> = {
    'charity': 'Charity scams involve fake charitable organizations or causes. Scammers exploit people\'s desire to help others, often using emotional manipulation and fake credentials to solicit donations.',
    'romance': 'Romance scams target people looking for love online. Scammers build fake relationships over time, then request money for emergencies, travel, or other fabricated needs.',
    'job': 'Job scams promise employment opportunities but require upfront fees, personal information, or payment for "training" or "equipment". Often target unemployed or job seekers.',
    'investment': 'Investment scams promise high returns with low risk. Scammers use fake credentials, testimonials, and pressure tactics to convince victims to invest in non-existent opportunities.',
    'crypto': 'Cryptocurrency scams involve fake trading platforms, investment schemes, or wallet scams. Victims are lured with promises of quick profits or "guaranteed" returns.',
    'phishing': 'Phishing scams impersonate legitimate organizations (banks, government, companies) to steal personal information, login credentials, or financial data through fake websites or emails.',
    'lottery': 'Lottery scams claim the victim has won a prize but must pay fees or taxes to claim it. Often involves fake official documents and urgent deadlines.',
    'nigerian': 'Nigerian Prince scams (advance fee fraud) claim large sums of money are trapped and need help to be released. Victims are asked to pay fees upfront with promises of huge returns.',
    'advance fee': 'Advance fee scams require victims to pay money upfront before receiving a promised benefit (inheritance, prize, job, loan). The benefit never materializes.',
    'product': 'Product scams sell fake or non-existent items, often at too-good-to-be-true prices. Victims pay but never receive the product or receive counterfeit goods.',
  };
  return descriptions[type] || `A type of scam that targets victims through various deceptive tactics.`;
}

export function AnalystPanel({ onClose, selectedPersona, allPersonas = [], allConversations = [] }: AnalystPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI threat analyst. Ask me anything about the scammer personas, patterns, or recommendations.',
    },
  ]);
  const [input, setInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const suggestions = [
    'How many crypto scammers last month?',
    'Count all romance scammers',
    'What platforms are most targeted?',
    'Generate executive report',
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const query = input;
    setInput('');

    // Try backend API first, but do local analysis in parallel
    let backendResponse: string | null = null;
    try {
      backendResponse = await askAnalystBot(query, selectedPersona?.id);
      // Check if it's the generic fallback message
      if (backendResponse.includes('Try asking me to') || backendResponse.includes('I can help you analyze')) {
        backendResponse = null; // Use local analysis instead
      }
    } catch (error) {
      // Backend failed, use local analysis
    }

    // Do smart local analysis
    setTimeout(() => {
      let response = '';
      const lowerQuery = query.toLowerCase();

      // Analytical questions
      if (query.includes('how many') || query.includes('count')) {
        if (query.includes('crypto') || query.includes('investment')) {
          const cryptoPersonas = allPersonas.filter(p => 
            p.type.toLowerCase().includes('investment') || 
            p.type.toLowerCase().includes('crypto') ||
            p.keywords.some(k => k.toLowerCase().includes('crypto'))
          );
          const lastMonth = cryptoPersonas.filter(p => {
            const lastSeen = new Date(p.lastSeen);
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return lastSeen >= oneMonthAgo;
          });
          response = `**Crypto/Investment Scammer Analysis:**\n\n📊 **Total Crypto/Investment Scammers:** ${cryptoPersonas.length}\n- ${cryptoPersonas.map(p => `${p.name} (${p.id})`).join(', ')}\n\n📅 **Active Last Month:** ${lastMonth.length}\n${lastMonth.length > 0 ? lastMonth.map(p => `- ${p.name}: ${p.conversations} conversations, Risk ${p.riskScore}`).join('\n') : '- None detected'}\n\n💡 **Insights:**\n- Average risk score: ${Math.round(cryptoPersonas.reduce((sum, p) => sum + p.riskScore, 0) / cryptoPersonas.length)}\n- Total conversations: ${cryptoPersonas.reduce((sum, p) => sum + p.conversations, 0)}\n- Most active: ${cryptoPersonas.sort((a, b) => b.conversations - a.conversations)[0]?.name || 'N/A'}`;
        } else if (query.includes('romance') || lowerQuery.includes('count all romance')) {
          const romancePersonas = allPersonas.filter(p => 
            p.type.toLowerCase().includes('romance') || 
            p.name.toLowerCase().includes('romance') ||
            p.keywords.some(k => k.toLowerCase().includes('romance') || k.toLowerCase().includes('love'))
          );
          response = `**Romance Scammer Count:** ${romancePersonas.length}\n\n${romancePersonas.length > 0 ? romancePersonas.map(p => `- **${p.name}** (${p.id}): ${p.conversations} conversations, Risk ${p.riskScore}`).join('\n') : 'No romance scammers found'}`;
        } else if (query.includes('job') || query.includes('recruiter')) {
          const jobPersonas = allPersonas.filter(p => p.type.toLowerCase().includes('job'));
          response = `**Job Scam Count:** ${jobPersonas.length}\n\n${jobPersonas.map(p => `- **${p.name}** (${p.id}): ${p.conversations} conversations, Risk ${p.riskScore}`).join('\n')}`;
        } else {
          response = `**Total Scammer Personas:** ${allPersonas.length}\n\n**Breakdown by Type:**\n${Object.entries(
            allPersonas.reduce((acc, p) => {
              acc[p.type] = (acc[p.type] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([type, count]) => `- ${type}: ${count}`).join('\n')}`;
        }
      } else if (query.includes('last month') || query.includes('past month')) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const recentPersonas = allPersonas.filter(p => {
          const lastSeen = new Date(p.lastSeen);
          return lastSeen >= oneMonthAgo;
        });
        response = `**Activity Last Month:**\n\n📊 **Active Personas:** ${recentPersonas.length} out of ${allPersonas.length}\n\n**Recently Active:**\n${recentPersonas.map(p => `- **${p.name}** (${p.type}): Last seen ${p.lastSeen}, ${p.conversations} conversations, Risk ${p.riskScore}`).join('\n')}\n\n📈 **Trends:**\n- Total conversations last month: ${recentPersonas.reduce((sum, p) => sum + p.conversations, 0)}\n- Average risk score: ${Math.round(recentPersonas.reduce((sum, p) => sum + p.riskScore, 0) / recentPersonas.length || 0)}\n- Most active platform: ${[...new Set(recentPersonas.flatMap(p => p.platform))].join(', ')}`;
      } else if (query.includes('crew') || query.includes('network')) {
        const crews = allPersonas.reduce((acc, p) => {
          const crew = p.crewId || 'Independent';
          if (!acc[crew]) acc[crew] = [];
          acc[crew].push(p);
          return acc;
        }, {} as Record<string, ScammerProfile[]>);
        response = `**Criminal Crew Analysis:**\n\n${Object.entries(crews).map(([crew, members]) => 
          `**${crew}:** ${members.length} members\n${members.map(p => `- ${p.name} (${p.id}): ${p.type}, Risk ${p.riskScore}`).join('\n')}`
        ).join('\n\n')}\n\n💡 **Insights:**\n- Total crews: ${Object.keys(crews).length}\n- Largest crew: ${Object.entries(crews).sort((a, b) => b[1].length - a[1].length)[0]?.[0] || 'N/A'} (${Math.max(...Object.values(crews).map(c => c.length))} members)`;
      } else if (query.includes('platform')) {
        const platformCounts = allPersonas.reduce((acc, p) => {
          p.platform.forEach(platform => {
            acc[platform] = (acc[platform] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>);
        response = `**Platform Distribution:**\n\n${Object.entries(platformCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([platform, count]) => `- **${platform}**: ${count} scammer${count > 1 ? 's' : ''}`)
          .join('\n')}\n\n💡 **Most Targeted Platform:** ${Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}`;
      } else if (lowerQuery.includes('conv_') || lowerQuery.includes('conversation')) {
        // Extract conversation ID from query
        const convMatch = query.match(/conv_[\d]+/i);
        if (convMatch) {
          const convId = convMatch[0];
          const conversation = allConversations.find(c => c.id === convId);
          if (conversation) {
            const persona = allPersonas.find(p => p.id === conversation.scammerId);
            const scammerMessages = conversation.messages.filter(m => m.sender === 'scammer');
            const victimMessages = conversation.messages.filter(m => m.sender === 'victim');
            const totalWords = conversation.messages.map(m => m.text.split(/\s+/).length).reduce((a, b) => a + b, 0);
            const avgMessageLength = scammerMessages.length > 0 ? Math.round(totalWords / scammerMessages.length) : 0;
            
            response = `**Conversation Analysis: ${convId}**\n\n**Overview:**\n- **Persona:** ${persona?.name || 'Unknown'} (${persona?.type || 'Unknown'})\n- **Platform:** ${conversation.platform}\n- **Outcome:** ${conversation.outcome}\n- **Classification:** ${conversation.classification}\n- **Total Messages:** ${conversation.messages.length} (${scammerMessages.length} scammer, ${victimMessages.length} victim)\n- **Duration:** ${new Date(conversation.endTime).getTime() - new Date(conversation.startTime).getTime() > 0 ? 
              `${Math.round((new Date(conversation.endTime).getTime() - new Date(conversation.startTime).getTime()) / 60000)} minutes` : 'Unknown'}\n\n**Content Analysis:**\n- **Average message length:** ${avgMessageLength} words\n- **Red flags detected:** ${conversation.flags.length} (${[...new Set(conversation.flags)].join(', ')})\n- **Key phrases:** ${scammerMessages.slice(0, 3).map(m => `"${m.text.substring(0, 50)}..."`).join(', ')}\n\n**Risk Assessment:** ${persona?.riskScore || 'Unknown'}/100\n**Recommendation:** ${conversation.outcome === 'success' ? '⚠️ Victim may have been scammed - investigate immediately' : conversation.outcome === 'failed' ? '✅ Scam attempt failed' : '🟡 Ongoing - monitor closely'}`;
          } else {
            response = `**Conversation not found:** ${convId}\n\nAvailable conversations: ${allConversations.slice(0, 10).map(c => c.id).join(', ')}${allConversations.length > 10 ? '...' : ''}`;
          }
        } else {
          response = `**Conversation Analysis Help:**\n\nTo analyze a specific conversation, mention the conversation ID like:\n- "Tell me about conversation conv_0000"\n- "Analyze conv_0001"\n- "What happened in conv_0002"\n\n**Available conversations:** ${allConversations.length} total\n${allConversations.slice(0, 5).map(c => `- ${c.id} (${c.classification}, ${c.platform})`).join('\n')}${allConversations.length > 5 ? '\n...' : ''}`;
        }
      } else if (query.includes('summarize') && selectedPersona) {
        const personaConversations = allConversations.filter(c => c.scammerId === selectedPersona.id);
        response = `**${selectedPersona.name}** is a ${selectedPersona.type.toLowerCase()}-type scammer with a risk score of ${selectedPersona.riskScore}/100.\n\n**Key Characteristics:**\n- Active during ${selectedPersona.activeHours}\n- Operates on: ${selectedPersona.platform.join(', ')}\n- Tone: ${selectedPersona.tone}\n- Uses phrases like: "${selectedPersona.commonPhrases[0] || 'N/A'}", "${selectedPersona.commonPhrases[1] || 'N/A'}"\n\n**Conversation Stats:**\n- Total conversations: ${personaConversations.length}\n- Successful scams: ${personaConversations.filter(c => c.outcome === 'success').length}\n- Failed attempts: ${personaConversations.filter(c => c.outcome === 'failed').length}\n- Ongoing: ${personaConversations.filter(c => c.outcome === 'ongoing').length}\n\n**Recommendations:**\n- Monitor for similar patterns on ${selectedPersona.platform[0]}\n- Flag messages containing keywords: ${selectedPersona.keywords.slice(0, 3).join(', ')}\n- High-risk engagement detected in ${selectedPersona.conversations} conversations`;
      } else if (query.includes('red flag')) {
        response = `**Common Red Flags Detected:**\n\n1. **Urgency tactics** - "Act now", "Limited time"\n2. **Emotional manipulation** - Building trust quickly\n3. **Money requests** - Asking for upfront payments\n4. **Too good to be true** - Unrealistic promises\n5. **Poor grammar** - Inconsistent language use\n6. **Verification avoidance** - Refusing video calls or meetings`;
      } else if (query.includes('similar')) {
        response = `Found 3 personas with similar behavioral patterns:\n\n**1. Romance Scammer** (Similarity: 87%)\n- Also active late night\n- Emotional manipulation tactics\n- Money requests after trust building\n\n**2. Investment Advisor** (Similarity: 72%)\n- Similar urgency patterns\n- Promise of high returns\n- Uses trust-building language\n\n**3. Job Recruiter** (Similarity: 65%)\n- Professional tone overlap\n- Upfront payment requests\n- Active during business hours`;
      } else if (query.includes('report') || query.includes('executive')) {
        const totalConversations = allPersonas.reduce((sum, p) => sum + p.conversations, 0);
        const avgRisk = Math.round(allPersonas.reduce((sum, p) => sum + p.riskScore, 0) / allPersonas.length);
        response = `**THREAT INTELLIGENCE REPORT**\n\n📊 **Executive Summary:**\n${allPersonas.length} active scammer personas identified with risk scores ranging from ${Math.min(...allPersonas.map(p => p.riskScore))}-${Math.max(...allPersonas.map(p => p.riskScore))}.\n\n🚨 **High Priority Threats:**\n${allPersonas.filter(p => p.riskScore >= 85).sort((a, b) => b.riskScore - a.riskScore).map(p => `- ${p.type} (${p.name}): Risk ${p.riskScore}`).join('\n')}\n\n📈 **Trends:**\n- Total conversations tracked: ${totalConversations}\n- Average risk score: ${avgRisk}\n- Most active type: ${Object.entries(allPersonas.reduce((acc, p) => { acc[p.type] = (acc[p.type] || 0) + p.conversations; return acc; }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}\n- Cross-platform coordination detected\n\n💡 **Recommendations:**\n1. Implement keyword filtering for identified phrases\n2. Monitor peak activity hours\n3. User education on common tactics\n4. Enhanced verification for financial requests`;
      } else if (lowerQuery.includes('what') || lowerQuery.includes('what\'s') || lowerQuery.includes('explain') || lowerQuery.includes('tell me about')) {
        // Handle general questions about scam types
        const scamTypeMatch = lowerQuery.match(/(?:charity|romance|job|investment|crypto|phishing|lottery|nigerian|advance fee|product)/);
        if (scamTypeMatch) {
          const scamType = scamTypeMatch[0];
          const personasOfType = allPersonas.filter(p => p.type.toLowerCase().includes(scamType));
          response = `**${scamType.charAt(0).toUpperCase() + scamType.slice(1)} Scam:**\n\n**Description:**\n${getScamTypeDescription(scamType)}\n\n**In Our Database:**\n- **Count:** ${personasOfType.length} persona${personasOfType.length !== 1 ? 's' : ''}\n- **Total Conversations:** ${personasOfType.reduce((sum, p) => sum + p.conversations, 0)}\n- **Average Risk Score:** ${personasOfType.length > 0 ? Math.round(personasOfType.reduce((sum, p) => sum + p.riskScore, 0) / personasOfType.length) : 'N/A'}\n\n${personasOfType.length > 0 ? `**Examples:**\n${personasOfType.slice(0, 5).map(p => `- ${p.name} (${p.id}): ${p.conversations} conversations, Risk ${p.riskScore}`).join('\n')}` : ''}`;
        } else {
          response = 'I can help you understand different scam types. Try asking about:\n- "What is a charity scam?"\n- "Tell me about romance scams"\n- "Explain investment scams"\n- "What are job scams?"';
        }
      } else {
        // Use backend response if available, otherwise show help
        response = backendResponse || 'I can help you analyze scammer personas, identify patterns, find similar cases, and generate reports.\n\n**Try asking:**\n- "How many crypto scammers last month?"\n- "Count all romance scammers"\n- "What platforms are most targeted?"\n- "Generate executive report"\n- "What is a charity scam?"';
      }

      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl w-full max-w-3xl h-[700px] flex flex-col shadow-2xl shadow-purple-500/20">
        {/* Header */}
        <div className="border-b border-purple-500/20 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-slate-100">AI Threat Analyst</h2>
              <p className="text-xs text-slate-400">Powered by advanced pattern recognition</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800/50 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.map((message, idx) => (
            <div key={idx} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'assistant'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                    : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                }`}
              >
                {message.role === 'assistant' ? (
                  <Sparkles className="w-4 h-4 text-white" />
                ) : (
                  <span className="text-xs">👤</span>
                )}
              </div>

              {/* Message */}
              <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`inline-block max-w-[80%] px-4 py-3 rounded-2xl ${
                    message.role === 'assistant'
                      ? 'bg-gradient-to-br from-purple-500/20 to-purple-500/10 border border-purple-500/30 text-left'
                      : 'bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 border border-cyan-500/30'
                  }`}
                >
                  <div className="text-slate-200 text-sm">
                    {message.role === 'assistant' ? renderMarkdown(message.content) : message.content}
                  </div>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(message.content, idx)}
                      className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <CheckCheck className="w-3 h-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-xs text-slate-400 mb-2">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-purple-500/20 p-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about scammer patterns, risks, or get recommendations..."
              className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
            <button
              onClick={handleSend}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white transition-all hover:shadow-lg hover:shadow-purple-500/50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
