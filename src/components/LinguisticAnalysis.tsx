import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { Brain, MessageCircle, AlertCircle } from 'lucide-react';
import type { Message, ScammerProfile } from '../App';
import { 
  analyzeWordFrequency, 
  calculatePersuasionTactics, 
  calculatePressureEscalation,
  calculateLinguisticScores,
  extractLanguagePatterns
} from '../utils/linguisticAnalysis';
import { analyzeGrammar } from '../utils/grammarAnalysis';

type LinguisticAnalysisProps = {
  messages: Message[];
  persona: ScammerProfile;
};

export function LinguisticAnalysis({ messages, persona }: LinguisticAnalysisProps) {
  // Analyze actual messages
  const wordFrequencyData = analyzeWordFrequency(messages);
  const persuasionTactics = calculatePersuasionTactics(messages);
  const pressureEscalation = calculatePressureEscalation(messages);
  const scores = calculateLinguisticScores(messages);
  const languagePatterns = extractLanguagePatterns(messages);
  const grammarAnalysis = analyzeGrammar(messages);
  
  // Convert persuasion tactics to chart format
  const languagePatternsChart = [
    { trait: 'Urgency', value: persuasionTactics.Urgency },
    { trait: 'Authority', value: persuasionTactics.Authority },
    { trait: 'Social Proof', value: persuasionTactics['Social Proof'] },
    { trait: 'Scarcity', value: persuasionTactics.Scarcity },
    { trait: 'Reciprocity', value: persuasionTactics.Reciprocity },
  ];
  
  // If no messages, show empty state
  if (messages.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-12 text-center">
        <p className="text-slate-400">No conversation data available for linguistic analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Linguistic Markers Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Urgency Score</div>
          <div className="text-2xl text-red-400">{scores.urgencyScore}/100</div>
          <div className="text-xs text-slate-500 mt-1">
            {scores.urgencyScore >= 70 ? 'Critical' : scores.urgencyScore >= 40 ? 'High' : 'Moderate'}
          </div>
          <div className="text-xs text-slate-500 mt-2 italic" title="Calculated by counting urgency words (urgent, immediately, now, hurry, deadline, etc.) in scammer messages">
            Based on urgency words found in messages
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Emotional Manipulation</div>
          <div className="text-2xl text-orange-400">{scores.manipulationScore}/100</div>
          <div className="text-xs text-slate-500 mt-1">
            {scores.manipulationScore >= 70 ? 'High' : scores.manipulationScore >= 40 ? 'Moderate' : 'Low'}
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Grammar Errors</div>
          <div className="text-2xl text-yellow-400">{scores.grammarErrors}</div>
          <div className="text-xs text-slate-500 mt-1">
            {scores.grammarErrors >= 20 ? 'High' : scores.grammarErrors >= 10 ? 'Moderate' : 'Low'}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-4">
          <div className="text-xs text-slate-400 mb-1">Script Match</div>
          <div className="text-2xl text-purple-400">{Math.round(scores.scriptScore)}%</div>
          <div className="text-xs text-slate-500 mt-1">
            {scores.scriptScore >= 70 ? 'High Confidence' : scores.scriptScore >= 40 ? 'Moderate' : 'Low'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Word Frequency */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="text-slate-200">Key Word Frequency</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wordFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="word" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Manipulation Tactics */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-purple-400" />
            <h3 className="text-slate-200">Persuasion Tactics</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={languagePatternsChart}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                <Radar
                  name="Tactics"
                  dataKey="value"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Progression */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-400" />
            <h3 className="text-slate-200">Conversation Pressure Escalation</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pressureEscalation.length > 0 ? pressureEscalation : [{ message: 1, urgency: 0, manipulation: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="message"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                  label={{ value: 'Message #', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                  label={{ value: 'Intensity', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="urgency" stroke="#ef4444" strokeWidth={2} name="Urgency" />
                <Line type="monotone" dataKey="manipulation" stroke="#f59e0b" strokeWidth={2} name="Manipulation" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            Shows how urgency and manipulation tactics intensify throughout the conversation. 
            Calculated by analyzing urgency words and manipulation tactics in each message over time.
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Patterns */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-slate-200 mb-4">Detected Language Patterns</h3>
          <div className="space-y-3">
            {languagePatterns.length > 0 ? languagePatterns.map((item, idx) => (
              <div key={idx} className="border border-slate-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-200 text-sm">{item.pattern}</span>
                  <span className="text-xs text-cyan-400">{item.count}x</span>
                </div>
                <div className="text-xs text-slate-400 italic">{item.examples.join(', ')}</div>
              </div>
            )) : (
              <div className="text-slate-400 text-sm">No specific language patterns detected</div>
            )}
          </div>
        </div>

        {/* Grammar & Syntax Analysis */}
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-slate-200 mb-4">Grammar & Syntax Anomalies</h3>
          <div className="space-y-4">
            {grammarAnalysis.errors.length > 0 ? (
              <div>
                <div className="text-sm text-slate-300 mb-2">Common Errors</div>
                <div className="space-y-2">
                  {grammarAnalysis.errors.map((error, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="text-orange-400">{error.type}:</span>{' '}
                      <span className="text-slate-400">{error.example}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400">No significant grammar errors detected</div>
            )}

            <div className="pt-3 border-t border-slate-700/50">
              <div className="text-sm text-slate-300 mb-2">Regional Indicators</div>
              <div className="space-y-1 text-xs text-slate-400">
                {grammarAnalysis.regionalIndicators.map((indicator, idx) => (
                  <div key={idx}>• {indicator}</div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700/50">
              <div className="text-sm text-slate-300 mb-2">Behavioral Linguistics</div>
              <div className="space-y-1 text-xs text-slate-400">
                {grammarAnalysis.behavioralLinguistics.map((behavior, idx) => (
                  <div key={idx}>• {behavior}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Generated Insights */}
      <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-slate-200 mb-3">Linguistic Summary</h3>
        <div className="text-sm text-slate-300 space-y-2">
          <p>
            This conversation shows <span className="text-purple-400">{persona.type.toLowerCase()}</span> characteristics with 
            {scores.urgencyScore >= 70 ? ' <span className="text-red-400">critical urgency markers</span>' : ' moderate urgency'}. 
            The scammer employs <span className="text-purple-400">persuasion tactics</span> including 
            {persuasionTactics.Authority > 50 ? ' authority claims' : ''}
            {persuasionTactics.Scarcity > 50 ? ', scarcity tactics' : ''}
            {persuasionTactics['Social Proof'] > 50 ? ', and social proof' : ''}.
          </p>
          <p>
            Analysis reveals <span className="text-orange-400">{Math.round(scores.scriptScore)}% script adherence</span>, suggesting 
            {scores.scriptScore > 70 ? ' a well-established playbook' : ' some scripted elements'}. 
            {scores.grammarErrors > 10 ? (
              <>Grammar patterns indicate <span className="text-orange-400">non-native English speaker</span>, with {scores.grammarErrors} detected errors.</>
            ) : (
              <>Grammar appears relatively clean with {scores.grammarErrors} detected errors.</>
            )}
          </p>
          {pressureEscalation.length > 1 && (
            <p>
              The pressure escalation shows {pressureEscalation[pressureEscalation.length - 1].urgency > pressureEscalation[0].urgency 
                ? '<span className="text-red-400">increasing intensity</span>' : 'consistent pressure'} throughout the conversation, 
              typical of {persona.type.toLowerCase()} tactics.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
