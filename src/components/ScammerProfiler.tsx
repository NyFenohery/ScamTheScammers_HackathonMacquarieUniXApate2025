import { Shield, Users, Clock, MapPin, Phone, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';
import type { ScammerProfile } from '../App';

type ScammerProfilerProps = {
  persona: ScammerProfile;
};

export function ScammerProfiler({ persona }: ScammerProfilerProps) {
  return (
    <div className="space-y-6">
      {/* Scammer Classification */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h3 className="text-slate-200">Threat Classification</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-2">Primary Type</div>
            <div
              className="px-3 py-2 rounded-lg border"
              style={{
                background: `${persona.color}20`,
                borderColor: `${persona.color}60`,
              }}
            >
              <div className="text-slate-200">{persona.type}</div>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-2">Operation Style</div>
            <div className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="text-slate-200">
                {persona.crewId ? 'Organized Crew' : 'Solo Operator'}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-2">Sophistication</div>
            <div className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="text-slate-200">
                {persona.riskScore >= 90 ? 'Advanced' : persona.riskScore >= 80 ? 'Intermediate' : 'Basic'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tactics & Methods */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          <h3 className="text-slate-200">Known Tactics & Methods</h3>
        </div>

        <div className="space-y-3">
          {persona.tactics.map((tactic, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800/30 border border-slate-700/30 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-orange-400">{idx + 1}</span>
              </div>
              <div className="flex-1">
                <div className="text-slate-200 text-sm">{tactic}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {getTacticDescription(tactic)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Victimology */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-purple-400" />
          <h3 className="text-slate-200">Victimology Profile</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-slate-300 mb-3">Target Demographics</div>
            <div className="space-y-2">
              {getVictimProfile(persona.type).demographics.map((demo, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span className="text-slate-400">{demo}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-300 mb-3">Vulnerability Factors</div>
            <div className="space-y-2">
              {getVictimProfile(persona.type).vulnerabilities.map((vuln, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span className="text-slate-400">{vuln}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Only show if we have real data */}
        {persona.successRate > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="text-sm text-slate-300 mb-2">Success Rate</div>
            <div className="text-2xl text-red-400">
              {persona.successRate}%
            </div>
          </div>
        )}
      </div>

      {/* Operational Intelligence */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h3 className="text-slate-200">Operational Intelligence</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <div className="text-sm text-slate-300">Activity Patterns</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Active Hours:</span>
                <span className="text-slate-200">{persona.activeHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Peak Activity:</span>
                <span className="text-slate-200">{persona.peakHour}:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Scam Duration:</span>
                <span className="text-slate-200">{persona.averageScamDuration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Success Rate:</span>
                <span className="text-red-400">{persona.successRate}%</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-slate-400" />
              <div className="text-sm text-slate-300">Geographic Indicators</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Likely Region:</span>
                <span className="text-slate-200">{getRegion(persona.id)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time Zone:</span>
                <span className="text-slate-200">GMT+1 / WAT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Language:</span>
                <span className="text-slate-200">English (Non-native)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Payment Infrastructure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone Numbers */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-green-400" />
            <h3 className="text-slate-200">Phone Numbers</h3>
          </div>
          <div className="space-y-2">
            {persona.phoneNumbers && persona.phoneNumbers.length > 0 ? (
              persona.phoneNumbers.map((phone, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <span className="text-slate-300 font-mono text-sm">{phone}</span>
                  <span className="text-xs text-green-400">Active</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-400">No phone data available</div>
            )}
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-yellow-400" />
            <h3 className="text-slate-200">Payment Infrastructure</h3>
          </div>
          <div className="space-y-2">
            {persona.bankAccounts && persona.bankAccounts.length > 0 ? (
              persona.bankAccounts.map((account, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <span className="text-slate-300 font-mono text-sm">{account}</span>
                  <span className="text-xs text-red-400">Flagged</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-400">
                <div className="mb-2">Preferred Methods:</div>
                <div className="space-y-1 ml-3">
                  <div>• Western Union</div>
                  <div>• Cryptocurrency</div>
                  <div>• Gift Cards</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crew Association - Only show if we have real crew data */}
      {persona.crewId && persona.crewId !== 'Unknown' && (
        <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-red-400" />
            <h3 className="text-slate-200">Crew Association</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Crew Identifier:</span>
              <span className="text-red-400 font-mono">{persona.crewId}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getTacticDescription(tactic: string): string {
  const descriptions: Record<string, string> = {
    'Authority impersonation': 'Poses as legitimate business or government official to gain trust',
    'Time pressure': 'Creates artificial urgency to prevent victim verification',
    'Upfront payment request': 'Demands money before delivering promised service/product',
    'Emotional manipulation': 'Exploits emotions like loneliness, fear, or greed',
    'Fake identity': 'Uses stolen photos and fabricated personal information',
    'Gradual money requests': 'Starts small, escalates financial asks over time',
    'Crisis scenarios': 'Manufactures emergencies requiring immediate financial help',
    'Fear tactics': 'Threatens negative consequences to coerce compliance',
    'Fake urgency': 'Claims immediate action needed to avoid penalties',
    'Link phishing': 'Directs to malicious websites to steal credentials',
    'Official impersonation': 'Mimics legitimate organizations\' communication style',
    'FOMO creation': 'Uses fear of missing out on lucrative opportunity',
    'Fake testimonials': 'Presents fabricated success stories as social proof',
    'Upfront investment': 'Requires initial deposit before participation',
    'Ponzi structure': 'Uses new victims\' money to pay earlier participants',
    'Fake listings': 'Advertises products that don\'t exist',
    'No escrow': 'Refuses secure payment methods that protect buyers',
    'Ghost after payment': 'Disappears once money is received',
  };
  return descriptions[tactic] || 'Standard scam technique';
}

function getVictimProfile(scamType: string) {
  const profiles: Record<string, { demographics: string[]; vulnerabilities: string[] }> = {
    'Job Scam': {
      demographics: ['Ages 22-35', 'Unemployed or underemployed', 'Entry to mid-level professionals', 'International job seekers'],
      vulnerabilities: ['Financial pressure', 'Career desperation', 'Limited job market knowledge', 'Remote work appeal'],
    },
    'Romance Scam': {
      demographics: ['Ages 40-70', 'Single or divorced', 'Lonely individuals', 'Active on dating platforms'],
      vulnerabilities: ['Emotional isolation', 'Desire for companionship', 'Trust-building susceptibility', 'Limited digital literacy'],
    },
    'Phishing / Impersonation': {
      demographics: ['All age groups', 'Bank customers', 'Online service users', 'Mobile phone users'],
      vulnerabilities: ['Fear of account loss', 'Limited tech knowledge', 'Urgency response', 'Authority compliance'],
    },
    'Investment Scam': {
      demographics: ['Ages 25-55', 'Middle to high income', 'Investment-curious individuals', 'Cryptocurrency enthusiasts'],
      vulnerabilities: ['FOMO', 'Greed', 'Limited investment knowledge', 'Get-rich-quick mentality'],
    },
    'Product Scam': {
      demographics: ['All age groups', 'Bargain hunters', 'Online shoppers', 'Tech enthusiasts'],
      vulnerabilities: ['Deal-seeking behavior', 'Impulse buying', 'Limited seller verification', 'Trust in platforms'],
    },
  };
  return profiles[scamType] || { demographics: ['General population'], vulnerabilities: ['Various factors'] };
}

function getAverageLoss(scamType: string): string {
  const losses: Record<string, string> = {
    'Job Scam': '200-500',
    'Romance Scam': '2,500-50,000',
    'Phishing / Impersonation': '500-5,000',
    'Investment Scam': '5,000-100,000',
    'Product Scam': '100-1,000',
  };
  return losses[scamType] || '1,000';
}

function getRegion(id: string): string {
  const regions: Record<string, string> = {
    R001: 'West Africa (Nigeria)',
    L002: 'West Africa (Ghana)',
    I005: 'Eastern Europe',
    C007: 'Southeast Asia',
    S003: 'East Africa (Kenya)',
  };
  return regions[id] || 'Unknown';
}

function getCrewSize(crewId: string): number {
  return crewId === 'CREW_A' ? 7 : crewId === 'CREW_B' ? 4 : 3;
}

function getCrewOperations(crewId: string): number {
  return crewId === 'CREW_A' ? 142 : crewId === 'CREW_B' ? 89 : 56;
}