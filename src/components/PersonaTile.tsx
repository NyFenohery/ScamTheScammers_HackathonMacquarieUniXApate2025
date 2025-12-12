import { Clock, AlertTriangle, MessageCircle } from 'lucide-react';
import type { ScammerProfile } from '../App';

type PersonaTileProps = {
  persona: ScammerProfile;
  onClick: () => void;
};

export function PersonaTile({ persona, onClick }: PersonaTileProps) {
  const riskLevel = persona.riskScore >= 90 ? 'CRITICAL' : persona.riskScore >= 80 ? 'HIGH' : 'MEDIUM';
  const riskColor = persona.riskScore >= 90 ? 'text-red-400' : persona.riskScore >= 80 ? 'text-orange-400' : 'text-yellow-400';

  return (
    <button
      onClick={onClick}
      className="group relative bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 text-left w-full"
    >
      {/* Risk Badge */}
      <div className="absolute top-4 right-4">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-slate-950/80 border ${riskColor} border-current`}>
          <AlertTriangle className="w-3 h-3" />
          <span className="text-xs">{riskLevel}</span>
        </div>
      </div>

      {/* ID Badge */}
      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-sm mb-4 border-2" style={{ background: `${persona.color}20`, borderColor: `${persona.color}60`, color: persona.color }}>
        {persona.id}
      </div>

      {/* Persona Info */}
      <h3 className="text-slate-100 mb-1">{persona.name}</h3>
      <p className="text-sm text-slate-400 mb-4">{persona.type}</p>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-slate-500" />
          <span className="text-slate-400">{persona.activeHours}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MessageCircle className="w-4 h-4 text-slate-500" />
          <span className="text-slate-400">{persona.conversations} conversations</span>
        </div>
      </div>

      {/* Risk Score Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Threat Score</span>
          <span className={riskColor}>{persona.riskScore}</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all group-hover:animate-pulse"
            style={{
              width: `${persona.riskScore}%`,
              background: `linear-gradient(90deg, ${persona.color}, ${persona.color}dd)`
            }}
          />
        </div>
      </div>

      {/* Platforms */}
      <div className="mt-4 flex flex-wrap gap-1">
        {persona.platform.map((p) => (
          <span key={p} className="text-xs px-2 py-0.5 bg-slate-800/50 text-slate-400 rounded-full border border-slate-700/50">
            {p}
          </span>
        ))}
      </div>
    </button>
  );
}