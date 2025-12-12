// Actionable insights and alerts for judges/law enforcement
import { AlertTriangle, Shield, Users, Bell } from 'lucide-react';
import type { ScammerProfile, ConversationLog, Message } from '../App';
import { calculateScamTypeBreakdown } from '../utils/scamTypeClassification';

type ActionableInsightsProps = {
  persona: ScammerProfile;
  conversation?: ConversationLog;
  messages?: Message[];
};

export function ActionableInsights({ persona, conversation, messages = [] }: ActionableInsightsProps) {
  const scamTypeBreakdown = messages.length > 0 ? calculateScamTypeBreakdown(messages) : [];
  const primaryType = scamTypeBreakdown[0]?.type || persona.type;
  const primaryPercentage = scamTypeBreakdown[0]?.percentage || 100;
  
  // Generate actionable alerts
  const alerts: Array<{ severity: 'critical' | 'high' | 'medium'; title: string; description: string; action: string }> = [];
  
  // High risk alert
  if (persona.riskScore >= 85) {
    alerts.push({
      severity: 'critical',
      title: 'High-Risk Scammer Detected',
      description: `This persona has a risk score of ${persona.riskScore}/100, indicating a highly active and dangerous scammer.`,
      action: 'Immediate investigation recommended. Consider alerting platform operators and law enforcement.',
    });
  }
  
  // High success rate alert
  if (persona.successRate >= 30) {
    alerts.push({
      severity: 'high',
      title: 'High Success Rate',
      description: `This scammer has a ${persona.successRate}% success rate, meaning they are successfully scamming victims.`,
      action: 'Prioritize this case. Multiple victims may be at risk. Coordinate with victim support services.',
    });
  }
  
  // Multiple conversations alert
  if (persona.conversations >= 10) {
    alerts.push({
      severity: 'high',
      title: 'Active Scammer',
      description: `This persona has ${persona.conversations} tracked conversations, indicating ongoing criminal activity.`,
      action: 'Monitor closely. Consider platform-wide alerts or account suspension.',
    });
  }
  
  // Ongoing conversations alert
  if (conversation && conversation.outcome === 'ongoing') {
    alerts.push({
      severity: 'critical',
      title: 'Active Scam in Progress',
      description: 'This conversation is currently ongoing. A victim may be actively being scammed right now.',
      action: 'URGENT: Immediate intervention may be possible. Contact platform support to freeze accounts or alert the victim.',
    });
  }
  
  // High urgency in messages
  if (messages.length > 0) {
    const urgencyWords = ['urgent', 'immediately', 'asap', 'now', 'hurry', 'deadline'];
    const hasHighUrgency = messages.some(m => 
      m.sender === 'scammer' && 
      urgencyWords.some(word => m.text.toLowerCase().includes(word))
    );
    if (hasHighUrgency) {
      alerts.push({
        severity: 'high',
        title: 'Urgency Tactics Detected',
        description: 'Scammer is using high-pressure tactics to rush victims into making decisions.',
        action: 'Educate potential victims about urgency tactics. This is a red flag indicator.',
      });
    }
  }
  
  return (
    <div className="space-y-4">
      {/* Scam Type Classification with Percentages */}
      {scamTypeBreakdown.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h3 className="text-slate-200">Scam Type Classification</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Based on linguistic analysis, this conversation shows characteristics of multiple scam types:
          </p>
          <div className="space-y-3">
            {scamTypeBreakdown.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300 text-sm">{item.type}</span>
                  <span className="text-cyan-400 font-semibold">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.percentage}%`,
                      background: idx === 0 
                        ? 'linear-gradient(90deg, #06b6d4, #3b82f6)'
                        : 'linear-gradient(90deg, #8b5cf6, #ec4899)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 italic">
            Classification is based on keyword analysis and linguistic patterns. Model accuracy may vary.
          </p>
        </div>
      )}
      
      {/* Actionable Alerts */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-orange-400" />
          <h3 className="text-slate-200">Actionable Insights</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Recommended actions for law enforcement, platform operators, and victim support:
        </p>
        
        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  alert.severity === 'critical'
                    ? 'bg-red-500/10 border-red-500/30'
                    : alert.severity === 'high'
                    ? 'bg-orange-500/10 border-orange-500/30'
                    : 'bg-yellow-500/10 border-yellow-500/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      alert.severity === 'critical'
                        ? 'text-red-400'
                        : alert.severity === 'high'
                        ? 'text-orange-400'
                        : 'text-yellow-400'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-slate-200 font-semibold">{alert.title}</h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          alert.severity === 'critical'
                            ? 'bg-red-500/20 text-red-400'
                            : alert.severity === 'high'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{alert.description}</p>
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded p-2 mt-2">
                      <p className="text-xs text-slate-300">
                        <span className="font-semibold text-cyan-400">Recommended Action:</span> {alert.action}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-400 text-center py-4">
            No critical alerts at this time. Continue monitoring this persona for changes in activity.
          </div>
        )}
      </div>
      
      {/* For Judges Explanation */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className="text-slate-200">For Judges & Law Enforcement</h3>
        </div>
        <div className="text-sm text-slate-300 space-y-2">
          <p>
            <strong>How to Use This Information:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 ml-2">
            <li>Scam type percentages show the confidence level of classification - higher percentages indicate stronger linguistic evidence</li>
            <li>Risk scores combine multiple factors: activity level, success rate, and conversation patterns</li>
            <li>Actionable alerts highlight immediate concerns requiring attention</li>
            <li>All data is based on automated analysis - verify with human review before taking legal action</li>
            <li>Use this dashboard to identify patterns, coordinate responses, and prioritize high-risk cases</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

