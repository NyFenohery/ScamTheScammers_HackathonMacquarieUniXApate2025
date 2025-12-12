import { useState } from 'react';
import { ArrowLeft, Phone, MessageSquare, AlertTriangle, Clock, TrendingUp, Users, DollarSign } from 'lucide-react';
import { FullTranscript } from './FullTranscript';
import { LinguisticAnalysis } from './LinguisticAnalysis';
import { ScammerProfiler } from './ScammerProfiler';
import { ActionableInsights } from './ActionableInsights';
import type { ScammerProfile, Message } from '../App';

type ConversationAnalysisProps = {
  persona: ScammerProfile;
  conversations: Message[];
  selectedConversation?: any;
};

export function ConversationAnalysis({ persona, conversations, selectedConversation }: ConversationAnalysisProps) {
  const [selectedTab, setSelectedTab] = useState<'transcript' | 'linguistic' | 'profiler' | 'insights'>('transcript');
  
  // Use real conversations, or show message if none available
  const displayMessages = conversations && conversations.length > 0 ? conversations : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl text-slate-100">{persona.name}</h1>
              <span
                className="px-3 py-1 rounded-full text-xs border"
                style={{
                  background: `${persona.color}20`,
                  borderColor: `${persona.color}60`,
                  color: persona.color
                }}
              >
                {persona.type}
              </span>
            </div>
            <p className="text-slate-400">Investigation ID: {persona.id} | Crew: {persona.crewId || 'Unknown'}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-1" style={{ color: persona.color }}>
              {persona.riskScore}
            </div>
            <div className="text-xs text-slate-400">RISK SCORE</div>
            <div className="text-xs text-slate-500 mt-1">(Threat Level)</div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className={`grid gap-4 ${persona.phoneNumbers && persona.phoneNumbers.length > 0 ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-4'}`}>
          <div className="bg-slate-950/50 border border-slate-700/30 rounded-lg p-3">
            <MessageSquare className="w-4 h-4 text-cyan-400 mb-1" />
            <div className="text-xs text-slate-400">Conversations</div>
            <div className="text-slate-200">{persona.conversations}</div>
          </div>
          <div className="bg-slate-950/50 border border-slate-700/30 rounded-lg p-3">
            <TrendingUp className="w-4 h-4 text-red-400 mb-1" />
            <div className="text-xs text-slate-400">Success Rate</div>
            <div className="text-slate-200">{persona.successRate}%</div>
          </div>
          <div className="bg-slate-950/50 border border-slate-700/30 rounded-lg p-3">
            <Clock className="w-4 h-4 text-purple-400 mb-1" />
            <div className="text-xs text-slate-400">Avg Duration</div>
            <div className="text-slate-200">{persona.averageScamDuration !== 'Unknown' ? persona.averageScamDuration : 'N/A'}</div>
          </div>
          <div className="bg-slate-950/50 border border-slate-700/30 rounded-lg p-3">
            <Phone className="w-4 h-4 text-orange-400 mb-1" />
            <div className="text-xs text-slate-400">Phone Numbers</div>
            <div className="text-slate-200">{persona.phoneNumbers?.length || 0}</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
          <span>First Seen: {persona.firstSeen}</span>
          <span className="text-slate-600">|</span>
          <span>Last Active: {persona.lastSeen}</span>
          <span className="text-slate-600">|</span>
          <span className="text-orange-400">Active Now</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700/50">
        <button
          onClick={() => setSelectedTab('transcript')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            selectedTab === 'transcript'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Full Transcript
        </button>
        <button
          onClick={() => setSelectedTab('linguistic')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            selectedTab === 'linguistic'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Linguistic Analysis
        </button>
        <button
          onClick={() => setSelectedTab('profiler')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            selectedTab === 'profiler'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Scammer Profiler
        </button>
        <button
          onClick={() => setSelectedTab('insights')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            selectedTab === 'insights'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-300'
          }`}
        >
          Actionable Insights
        </button>
      </div>

      {/* Tab Content */}
      {selectedTab === 'transcript' && (
        displayMessages.length > 0 ? (
          <FullTranscript messages={displayMessages} personaColor={persona.color} />
        ) : (
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-12 text-center">
            <MessageSquare className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">No conversations found for this persona</p>
            <p className="text-slate-500 text-sm">Check the Conversations browser to see all available conversations</p>
          </div>
        )
      )}
      {selectedTab === 'linguistic' && (
        displayMessages.length > 0 ? (
          <LinguisticAnalysis messages={displayMessages} persona={persona} />
        ) : (
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-12 text-center">
            <p className="text-slate-400">No conversation data available for linguistic analysis</p>
          </div>
        )
      )}
      {selectedTab === 'profiler' && <ScammerProfiler persona={persona} />}
      {selectedTab === 'insights' && (
        <ActionableInsights 
          persona={persona} 
          conversation={selectedConversation}
          messages={conversations}
        />
      )}
    </div>
  );
}
