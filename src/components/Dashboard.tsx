import { useState, useMemo } from 'react';
import { Shield, TrendingUp, MessageSquare, Activity, Search, Filter, X } from 'lucide-react';
import { PersonaTile } from './PersonaTile';
import { ActivityHeatmap } from './ActivityHeatmap';
import type { ScammerProfile } from '../App';

type DashboardProps = {
  personas: ScammerProfile[];
  onPersonaClick: (persona: ScammerProfile) => void;
};

export function Dashboard({ personas, onPersonaClick }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [riskRange, setRiskRange] = useState<[number, number]>([0, 100]);

  const totalConversations = personas.reduce((sum, p) => sum + p.conversations, 0);
  const avgRiskScore = personas.reduce((sum, p) => sum + p.riskScore, 0) / personas.length;
  const highRiskPersonas = personas.filter(p => p.riskScore >= 85).length;

  // Get unique types and platforms
  const types = useMemo(() => ['all', ...Array.from(new Set(personas.map(p => p.type)))], [personas]);
  const platforms = useMemo(() => ['all', ...Array.from(new Set(personas.flatMap(p => p.platform)))], [personas]);

  // Filter personas
  const filteredPersonas = useMemo(() => {
    return personas.filter(persona => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          persona.name.toLowerCase().includes(query) ||
          persona.type.toLowerCase().includes(query) ||
          persona.keywords.some(k => k.toLowerCase().includes(query)) ||
          persona.commonPhrases.some(p => p.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Type filter
      if (selectedType !== 'all' && persona.type !== selectedType) return false;

      // Platform filter
      if (selectedPlatform !== 'all' && !persona.platform.includes(selectedPlatform)) return false;

      // Risk score filter
      if (persona.riskScore < riskRange[0] || persona.riskScore > riskRange[1]) return false;

      return true;
    });
  }, [personas, searchQuery, selectedType, selectedPlatform, riskRange]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedPlatform('all');
    setRiskRange([0, 100]);
  };

  const hasActiveFilters = searchQuery || selectedType !== 'all' || selectedPlatform !== 'all' || riskRange[0] > 0 || riskRange[1] < 100;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-cyan-400" />
          <h2 className="text-slate-200">Filters & Search</h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 px-3 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/50 rounded-lg transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search keywords, names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
          >
            {types.map(type => (
              <option key={type} value={type} className="bg-slate-800">
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>

          {/* Platform Filter */}
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

          {/* Risk Score Range */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={riskRange[1]}
              onChange={(e) => setRiskRange([riskRange[0], parseInt(e.target.value)])}
              className="flex-1"
            />
            <div className="text-xs text-slate-400 min-w-[80px] text-right">
              Risk: {riskRange[0]}-{riskRange[1]}
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 text-sm text-slate-400">
            Showing {filteredPersonas.length} of {personas.length} personas
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl text-cyan-400">{personas.length}</span>
          </div>
          <p className="text-slate-400 text-sm">Identified Operators</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-8 h-8 text-purple-400" />
            <span className="text-2xl text-purple-400">{totalConversations}</span>
          </div>
          <p className="text-slate-400 text-sm">Conversation Logs</p>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-red-400" />
            <span className="text-2xl text-red-400">{avgRiskScore.toFixed(0)}</span>
          </div>
          <p className="text-slate-400 text-sm">Avg Threat Score</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-orange-400" />
            <span className="text-2xl text-orange-400">{highRiskPersonas}</span>
          </div>
          <p className="text-slate-400 text-sm">High-Risk Threats</p>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-slate-200 mb-4">Activity Timeline</h2>
        <ActivityHeatmap personas={personas} />
      </div>

      {/* Persona Grid */}
      <div>
        <h2 className="text-slate-200 mb-4">Threat Operators {hasActiveFilters && `(${filteredPersonas.length})`}</h2>
        {filteredPersonas.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-12 text-center">
            <p className="text-slate-400">No personas match your filters. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPersonas.map((persona) => (
              <PersonaTile key={persona.id} persona={persona} onClick={() => onPersonaClick(persona)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}