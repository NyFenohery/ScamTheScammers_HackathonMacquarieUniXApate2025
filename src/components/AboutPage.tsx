import { Shield, Brain, MessageSquare, BarChart3, Users, Bell } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-3">Scammer Persona Profiling Dashboard</h1>
        <p className="text-lg text-slate-400">Threat Intelligence Platform</p>
      </div>

      {/* Overview */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold text-slate-200 mb-4">What is This Platform?</h2>
        <div className="space-y-3">
          <p className="text-slate-300 leading-relaxed">
            The Scammer Persona Profiling Dashboard is an advanced threat intelligence platform that uses machine learning to identify, 
            classify, and analyze scammer personas from conversation data. It helps security analysts, law enforcement, 
            and platform operators understand scammer behavior patterns and coordinate responses.
          </p>
          <p className="text-slate-300 leading-relaxed">
            By analyzing linguistic patterns, timing, platforms, and tactics, the system clusters similar scammers 
            into personas and provides actionable insights for law enforcement and platform operators.
          </p>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-200 mb-5">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm hover:border-cyan-500/30 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">Persona Identification</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              ML clustering groups scammers by behavioral patterns, creating distinct personas with risk scores, 
              tactics, and characteristics.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">Actionable Insights</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get actionable alerts and recommendations for law enforcement, platform operators, and victim support. 
              Includes percentage-based scam type classification.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm hover:border-orange-500/30 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">AI Analyst</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ask questions about scammer patterns, get insights on trends, and generate executive reports 
              powered by AI analysis.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm hover:border-green-500/30 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">Conversation Analysis</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Full transcript analysis with linguistic markers, red flags, and conversation flow to understand 
              scammer tactics.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold text-slate-200 mb-5">How It Works</h2>
        <div className="space-y-5">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-cyan-500/50">
              <span className="text-cyan-400 font-bold">1</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Data Collection</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Conversation logs are collected from various platforms (WhatsApp, SMS, dating apps, etc.) 
                and preprocessed for analysis.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-purple-500/50">
              <span className="text-purple-400 font-bold">2</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Feature Extraction</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                ML models extract features: linguistic patterns, timing, keywords, tactics, platform usage, 
                and behavioral markers.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-orange-500/50">
              <span className="text-orange-400 font-bold">3</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Clustering</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Similar scammers are grouped into personas using clustering algorithms. Each persona gets 
                a risk score and detailed profile.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-green-500/50">
              <span className="text-green-400 font-bold">4</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Actionable Insights & Alerts</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The system generates actionable alerts for high-risk cases, ongoing scams, and provides 
                percentage-based classification showing confidence levels (e.g., 80% job scam, 20% crypto scam).
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-pink-500/50">
              <span className="text-pink-400 font-bold">5</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-200 mb-2">Visualization & Analysis</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Analysts use the dashboard to explore personas, view conversations, get linguistic analysis, 
                and receive AI-powered insights with actionable recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold text-slate-200 mb-5">Who Uses This?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <Users className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Security Analysts</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Investigate scammer patterns, identify threats, and generate intelligence reports.
            </p>
          </div>
          <div>
            <Shield className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Law Enforcement</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Coordinate responses, prioritize high-risk cases, and gather evidence for prosecution.
            </p>
          </div>
          <div>
            <BarChart3 className="w-8 h-8 text-orange-400 mb-3" />
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Platform Operators</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Detect coordinated attacks, implement preventive measures, and protect users.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold text-slate-200 mb-5">Technology</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-cyan-400 font-semibold mb-1">Frontend</div>
            <div className="text-slate-400">React + TypeScript</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-semibold mb-1">Backend</div>
            <div className="text-slate-400">Python ML Pipeline</div>
          </div>
          <div className="text-center">
            <div className="text-orange-400 font-semibold mb-1">ML</div>
            <div className="text-slate-400">Clustering & NLP</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-semibold mb-1">Visualization</div>
            <div className="text-slate-400">Actionable Alerts</div>
          </div>
        </div>
      </div>
    </div>
  );
}

