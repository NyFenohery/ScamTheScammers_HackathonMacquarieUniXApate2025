import { User, ShieldAlert, Bot, Phone, Image as ImageIcon, Flag } from 'lucide-react';
import type { Message } from '../App';

type FullTranscriptProps = {
  messages: Message[];
  personaColor: string;
};

export function FullTranscript({ messages, personaColor }: FullTranscriptProps) {
  const getIconForSender = (sender: string) => {
    if (sender === 'scammer') return ShieldAlert;
    if (sender === 'bot') return Bot;
    return User;
  };

  const getColorForSender = (sender: string) => {
    if (sender === 'scammer') return { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', icon: 'text-red-400' };
    if (sender === 'bot') return { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400', icon: 'text-purple-400' };
    return { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400', icon: 'text-blue-400' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Transcript */}
      <div className="lg:col-span-2">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-200">Conversation Log</h3>
            <div className="text-xs text-slate-400">
              {messages.length} messages | Duration: ~30 min
            </div>
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No messages in this conversation
              </div>
            ) : (
              messages.map((message, idx) => {
              const colors = getColorForSender(message.sender);
              const Icon = getIconForSender(message.sender);
              
              return (
                <div
                  key={idx}
                  className={`flex gap-3 ${message.sender === 'victim' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colors.bg} border-2 ${colors.border}`}
                  >
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>

                  {/* Message Content */}
                  <div
                    className={`flex-1 max-w-lg ${message.sender === 'victim' ? 'text-right' : ''}`}
                  >
                    {/* Sender Label */}
                    <div className={`text-xs ${colors.text} mb-1 px-2`}>
                      {message.sender === 'scammer' ? 'SCAMMER' : message.sender === 'bot' ? 'BOT (Victim Simulation)' : 'VICTIM'}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`inline-block px-4 py-3 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border}`}
                    >
                      {message.type === 'voice' ? (
                        <div className="flex items-center gap-2">
                          <Phone className={`w-4 h-4 ${colors.icon}`} />
                          <span className="text-slate-200 text-sm">Voice Call</span>
                          <span className="text-xs text-slate-400">({message.duration})</span>
                        </div>
                      ) : message.type === 'image' ? (
                        <div className="flex items-center gap-2">
                          <ImageIcon className={`w-4 h-4 ${colors.icon}`} />
                          <span className="text-slate-200 text-sm">Image Attachment</span>
                        </div>
                      ) : (
                        <p className="text-slate-200 text-sm">{message.text}</p>
                      )}

                      {/* Flags */}
                      {message.flags && message.flags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.flags.map((flag, fidx) => (
                            <span
                              key={fidx}
                              className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/40 rounded text-xs text-orange-400"
                            >
                              {flag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="text-xs text-slate-500 mt-1 px-2">{message.time}</div>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>
      </div>

      {/* Analysis Panel */}
      <div className="space-y-4">
        {/* Detected Flags Summary */}
        <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <Flag className="w-5 h-5 text-orange-400" />
            <h4 className="text-slate-200">Detected Red Flags</h4>
          </div>
          <div className="space-y-2">
            {(() => {
              const flagCounts: Record<string, number> = {};
              messages.forEach(msg => {
                (msg.flags || []).forEach(flag => {
                  flagCounts[flag] = (flagCounts[flag] || 0) + 1;
                });
              });
              const flags = Object.entries(flagCounts)
                .map(([flag, count]) => ({
                  flag: flag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                  count,
                  severity: count >= 3 ? 'high' : count >= 2 ? 'medium' : 'low'
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);
              
              return flags.length > 0 ? flags.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{item.flag}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{item.count}x</span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.severity === 'high' ? 'bg-red-400' : 'bg-orange-400'
                      }`}
                    />
                  </div>
                </div>
              )) : (
                <div className="text-slate-400 text-sm">No flags detected</div>
              );
            })()}
          </div>
        </div>

        {/* Conversation Metrics */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
          <h4 className="text-slate-200 mb-3">Conversation Metrics</h4>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-400">Scammer Messages</span>
                <span className="text-red-400">{messages.filter(m => m.sender === 'scammer').length}</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full" 
                  style={{ width: `${(messages.filter(m => m.sender === 'scammer').length / messages.length) * 100}%` }} 
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-400">Victim Messages</span>
                <span className="text-blue-400">{messages.filter(m => m.sender === 'victim').length}</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${(messages.filter(m => m.sender === 'victim').length / messages.length) * 100}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Avg Response Time</span>
              <span className="text-slate-200">2.3 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Conversation Stage</span>
              <span className="text-orange-400">Closing</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Risk Assessment</span>
              <span className="text-red-400">Critical</span>
            </div>
          </div>
        </div>

        {/* Contact Info - Only show if we have real data */}
        {(() => {
          // Extract phone numbers from messages if any
          const phoneRegex = /\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
          const phoneNumbers = new Set<string>();
          messages.forEach(msg => {
            const matches = msg.text.match(phoneRegex);
            if (matches) matches.forEach(p => phoneNumbers.add(p));
          });
          
          // Only show if we have at least platform info
          const hasPlatform = messages.length > 0;
          if (!hasPlatform && phoneNumbers.size === 0) return null;
          
          return (
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm">
              <h4 className="text-slate-200 mb-3">Contact Details</h4>
              <div className="space-y-2 text-sm">
                {phoneNumbers.size > 0 ? (
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Phone Numbers</div>
                    {Array.from(phoneNumbers).slice(0, 3).map((phone, idx) => (
                      <div key={idx} className="text-slate-300 font-mono text-xs">{phone}</div>
                    ))}
                  </div>
                ) : null}
                {hasPlatform && (
                  <div className={phoneNumbers.size > 0 ? "pt-2 border-t border-slate-700/50" : ""}>
                    <div className="text-xs text-slate-500 mb-1">Platform</div>
                    <div className="text-slate-300">
                      {messages[0]?.text.toLowerCase().includes('whatsapp') ? 'WhatsApp' :
                       messages[0]?.text.toLowerCase().includes('sms') ? 'SMS' :
                       messages[0]?.text.toLowerCase().includes('email') ? 'Email' : 'Unknown'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
