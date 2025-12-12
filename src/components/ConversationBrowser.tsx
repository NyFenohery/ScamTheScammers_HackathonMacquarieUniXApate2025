import { useState } from 'react';
import { Search, Filter, Calendar, MessageSquare, Clock, ShieldAlert, User } from 'lucide-react';
import type { ConversationLog, Message } from '../App';

type ConversationBrowserProps = {
  conversations: ConversationLog[];
  onConversationClick?: (conversation: ConversationLog) => void;
};

export function ConversationBrowser({ conversations, onConversationClick }: ConversationBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedOutcome, setSelectedOutcome] = useState<string>('all');

  const platforms = ['all', ...Array.from(new Set(conversations.map(c => c.platform)))];
  const outcomes = ['all', ...Array.from(new Set(conversations.map(c => c.outcome)))];

  const filteredConversations = conversations.filter(conv => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        conv.classification.toLowerCase().includes(query) ||
        conv.platform.toLowerCase().includes(query) ||
        conv.messages.some(m => m.text.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    if (selectedPlatform !== 'all' && conv.platform !== selectedPlatform) return false;
    if (selectedOutcome !== 'all' && conv.outcome !== selectedOutcome) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-slate-200 mb-2">Conversation Browser</h2>
        <p className="text-slate-400">Browse and analyze all conversation logs</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-cyan-400" />
          <h3 className="text-slate-200">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
          >
            {platforms.map(platform => (
              <option key={platform} value={platform} className="bg-slate-800">
                {platform === 'all' ? 'All Platforms' : platform}
              </option>
            ))}
          </select>

          <select
            value={selectedOutcome}
            onChange={(e) => setSelectedOutcome(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
          >
            {outcomes.map(outcome => (
              <option key={outcome} value={outcome} className="bg-slate-800">
                {outcome === 'all' ? 'All Outcomes' : outcome.charAt(0).toUpperCase() + outcome.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          Showing {filteredConversations.length} of {conversations.length} conversations
        </div>
      </div>

      {/* Conversation List */}
      <div className="space-y-4">
        {filteredConversations.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-12 text-center">
            <p className="text-slate-400">No conversations match your filters.</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onConversationClick?.(conv)}
              className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-500/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-slate-200">Conversation {conv.id}</h3>
                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30">
                      {conv.classification}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full border ${
                      conv.outcome === 'success' 
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : conv.outcome === 'failed'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {conv.outcome}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {conv.platform}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {conv.startTime ? new Date(conv.startTime).toLocaleDateString() : 'Unknown date'}
                    </div>
                    <div className="flex items-center gap-1">
                      <ShieldAlert className="w-4 h-4" />
                      Persona: {conv.scammerId}
                    </div>
                  </div>
                </div>
                {conv.amountLost && (
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Amount Lost</div>
                    <div className="text-red-400 font-semibold">${conv.amountLost.toLocaleString()}</div>
                  </div>
                )}
              </div>

              {/* Message Preview */}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {conv.messages.slice(0, 3).map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2 text-sm ${
                      msg.sender === 'scammer' ? 'text-red-300' : 'text-blue-300'
                    }`}
                  >
                    <span className="font-semibold">
                      {msg.sender === 'scammer' ? '🕵️' : '👤'}:
                    </span>
                    <span className="text-slate-300">{msg.text.substring(0, 100)}{msg.text.length > 100 ? '...' : ''}</span>
                  </div>
                ))}
                {conv.messages.length > 3 && (
                  <div className="text-xs text-slate-500">
                    +{conv.messages.length - 3} more messages
                  </div>
                )}
              </div>

              {/* Flags */}
              {conv.flags && conv.flags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {conv.flags.map((flag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full border border-orange-500/30"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

