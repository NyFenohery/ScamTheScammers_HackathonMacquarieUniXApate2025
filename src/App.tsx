import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ConversationAnalysis } from './components/ConversationAnalysis';
import { AnalystPanel } from './components/AnalystPanel';
import { ConversationBrowser } from './components/ConversationBrowser';
import { AboutPage } from './components/AboutPage';
import { loadClusters, loadPersonas, loadConversations } from './services/dataService';
import { transformPersonas, transformConversations, groupConversationsByPersona } from './services/dataTransform';

export type ScammerProfile = {
  id: string;
  name: string;
  type: string;
  riskScore: number;
  activeHours: string;
  platform: string[];
  tone: string;
  avgMessageLength: number;
  commonPhrases: string[];
  conversations: number;
  peakHour: number;
  keywords: string[];
  color: string;
  tactics: string[];
  crewId?: string;
  phoneNumbers?: string[];
  bankAccounts?: string[];
  firstSeen: string;
  lastSeen: string;
  successRate: number;
  averageScamDuration: string;
};

export type ConversationLog = {
  id: string;
  scammerId: string;
  victimId: string;
  platform: string;
  startTime: string;
  endTime: string;
  messages: Message[];
  classification: string;
  outcome: 'success' | 'failed' | 'ongoing';
  amountLost?: number;
  flags: string[];
  linguisticMarkers: {
    urgencyScore: number;
    emotionalManipulation: number;
    grammarErrors: number;
    scriptedResponses: number;
  };
};

export type Message = {
  sender: 'scammer' | 'victim' | 'bot';
  text: string;
  time: string;
  type?: 'text' | 'voice' | 'image';
  duration?: string;
  flags?: string[];
};

export const mockProfiles: ScammerProfile[] = [
  {
    id: 'R001',
    name: 'Recruiter Alpha',
    type: 'Job Scam',
    riskScore: 85,
    activeHours: '9am-3pm',
    platform: ['LinkedIn', 'WhatsApp'],
    tone: 'Professional, Urgent',
    avgMessageLength: 62,
    commonPhrases: ['job opportunity', 'high salary', 'work from home', 'registration fee'],
    conversations: 34,
    peakHour: 11,
    keywords: ['job', 'salary', 'opportunity', 'hire', 'urgent', 'apply', 'fee'],
    color: '#3b82f6',
    tactics: ['Authority impersonation', 'Time pressure', 'Upfront payment request'],
    crewId: 'CREW_A',
    phoneNumbers: ['+234-XXX-1234', '+234-XXX-5678'],
    firstSeen: '2024-11-15',
    lastSeen: '2024-12-08',
    successRate: 23,
    averageScamDuration: '3-5 days'
  },
  {
    id: 'L002',
    name: 'Romance Operator',
    type: 'Romance Scam',
    riskScore: 92,
    activeHours: '11pm-3am',
    platform: ['WhatsApp', 'Messenger', 'Dating Apps'],
    tone: 'Emotional, Intimate',
    avgMessageLength: 45,
    commonPhrases: ['I miss you', 'trust me', 'my love', 'emergency', 'Western Union'],
    conversations: 28,
    peakHour: 1,
    keywords: ['love', 'money', 'trust', 'meet', 'emergency', 'family'],
    color: '#ec4899',
    tactics: ['Emotional manipulation', 'Fake identity', 'Gradual money requests', 'Crisis scenarios'],
    crewId: 'CREW_B',
    phoneNumbers: ['+233-XXX-9012'],
    bankAccounts: ['ACC-GH-4521', 'ACC-NG-8832'],
    firstSeen: '2024-10-22',
    lastSeen: '2024-12-09',
    successRate: 41,
    averageScamDuration: '2-8 weeks'
  },
  {
    id: 'I005',
    name: 'Authority Impersonator',
    type: 'Phishing / Impersonation',
    riskScore: 88,
    activeHours: '12pm-8pm',
    platform: ['SMS', 'Email', 'WhatsApp'],
    tone: 'Formal, Threatening',
    avgMessageLength: 78,
    commonPhrases: ['verify account', 'suspended', 'click link', 'legal action', 'confirm identity'],
    conversations: 45,
    peakHour: 14,
    keywords: ['verify', 'account', 'suspended', 'urgent', 'security', 'legal'],
    color: '#8b5cf6',
    tactics: ['Fear tactics', 'Fake urgency', 'Link phishing', 'Official impersonation'],
    crewId: 'CREW_C',
    phoneNumbers: ['+44-XXX-3344'],
    firstSeen: '2024-11-01',
    lastSeen: '2024-12-07',
    successRate: 18,
    averageScamDuration: '1-2 days'
  },
  {
    id: 'C007',
    name: 'Crypto Influencer',
    type: 'Investment Scam',
    riskScore: 90,
    activeHours: '1pm-9pm',
    platform: ['Telegram', 'Discord', 'Instagram'],
    tone: 'Expert, Confident',
    avgMessageLength: 95,
    commonPhrases: ['guaranteed returns', 'exclusive signal', 'minimum investment', '100x gains'],
    conversations: 31,
    peakHour: 17,
    keywords: ['crypto', 'invest', 'profit', 'returns', 'trading', 'bitcoin', 'signal'],
    color: '#f59e0b',
    tactics: ['FOMO creation', 'Fake testimonials', 'Upfront investment', 'Ponzi structure'],
    crewId: 'CREW_A',
    phoneNumbers: ['+1-XXX-7890'],
    bankAccounts: ['CRYPTO-WALLET-A', 'CRYPTO-WALLET-B'],
    firstSeen: '2024-09-10',
    lastSeen: '2024-12-09',
    successRate: 35,
    averageScamDuration: '1-3 weeks'
  },
  {
    id: 'S003',
    name: 'Marketplace Seller',
    type: 'Product Scam',
    riskScore: 75,
    activeHours: '10am-6pm',
    platform: ['Facebook Marketplace', 'Instagram', 'WhatsApp'],
    tone: 'Friendly, Pushy',
    avgMessageLength: 38,
    commonPhrases: ['limited stock', 'pay upfront', 'no refunds', 'cash only'],
    conversations: 52,
    peakHour: 13,
    keywords: ['buy', 'price', 'stock', 'payment', 'deal', 'hurry'],
    color: '#10b981',
    tactics: ['Fake listings', 'Upfront payment', 'No escrow', 'Ghost after payment'],
    phoneNumbers: ['+254-XXX-4455', '+254-XXX-6677'],
    firstSeen: '2024-11-20',
    lastSeen: '2024-12-08',
    successRate: 28,
    averageScamDuration: '1-3 days'
  }
];

export const mockConversations: Record<string, Message[]> = {
  R001: [
    { sender: 'scammer', text: 'Hello! I came across your profile and I have an exciting job opportunity for you.', time: '10:23' },
    { sender: 'victim', text: 'What kind of job?', time: '10:25' },
    { sender: 'scammer', text: 'Remote customer service position with $5000/month salary. Very easy work from home!', time: '10:26' },
    { sender: 'victim', text: 'That sounds interesting...', time: '10:28' },
    { sender: 'scammer', text: 'Great! To proceed, we need a small registration fee of $200 for background check.', time: '10:29' },
  ],
  L002: [
    { sender: 'scammer', text: 'Hey love, I can\'t wait to meet you... ❤️', time: '01:15' },
    { sender: 'victim', text: 'Who are you?', time: '01:17' },
    { sender: 'scammer', text: 'I am your secret admirer ❤️ I\'ve been watching you for a while', time: '01:18' },
    { sender: 'victim', text: 'This is weird...', time: '01:20' },
    { sender: 'scammer', text: 'Trust me baby, I just need help with something. Can you send me $500? I promise to pay back', time: '01:22' },
  ],
  I005: [
    { sender: 'scammer', text: 'URGENT: Your bank account has been suspended due to suspicious activity.', time: '14:32' },
    { sender: 'victim', text: 'What? I didn\'t do anything!', time: '14:35' },
    { sender: 'scammer', text: 'Click this link immediately to verify your identity: http://fake-bank-verify.com', time: '14:36' },
    { sender: 'victim', text: 'Is this real?', time: '14:38' },
    { sender: 'scammer', text: 'Yes, you have 2 hours before permanent suspension. Act now!', time: '14:39' },
  ],
  S003: [
    { sender: 'scammer', text: 'Hey! Saw you were interested in the iPhone 15 Pro Max 💯', time: '13:12' },
    { sender: 'victim', text: 'Yeah, what\'s the price?', time: '13:15' },
    { sender: 'scammer', text: 'Only $400! Brand new sealed box. Limited stock!', time: '13:16' },
    { sender: 'victim', text: 'That\'s too cheap...', time: '13:18' },
    { sender: 'scammer', text: 'Trust me bro, need quick cash. Pay upfront and I\'ll ship today!', time: '13:19' },
  ],
  C007: [
    { sender: 'scammer', text: 'I\'ve been making $10k/day with my exclusive crypto trading signals.', time: '17:45' },
    { sender: 'victim', text: 'Really? How?', time: '17:48' },
    { sender: 'scammer', text: 'Join my VIP group. $500 entry fee but you\'ll make it back in one trade. Guaranteed returns.', time: '17:50' },
    { sender: 'victim', text: 'Sounds too good to be true', time: '17:52' },
    { sender: 'scammer', text: 'Look at these screenshots of my profits! This is your chance for financial freedom.', time: '17:54' },
  ]
};

export default function App() {
  const [view, setView] = useState<'dashboard' | 'persona' | 'conversations' | 'about'>('dashboard');
  const [selectedPersona, setSelectedPersona] = useState<ScammerProfile | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<ConversationLog | null>(null);
  const [showAnalyst, setShowAnalyst] = useState(false);
  const [personas, setPersonas] = useState<ScammerProfile[]>([]);
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [conversationLogs, setConversationLogs] = useState<ConversationLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from backend
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        console.log('Loading data from backend...');
        const [clustersData, personasData, conversationsData] = await Promise.all([
          loadClusters(),
          loadPersonas(),
          loadConversations(),
        ]);

        console.log('Data loaded:', {
          clusters: clustersData.length,
          personas: Object.keys(personasData).length,
          conversations: conversationsData.length
        });

        // Transform backend data to frontend format
        const transformedPersonas = transformPersonas(clustersData, personasData);
        const transformedConversations = transformConversations(conversationsData);
        const groupedConversations = groupConversationsByPersona(transformedConversations);

        console.log('Data transformed:', {
          personas: transformedPersonas.length,
          conversations: transformedConversations.length
        });

        setPersonas(transformedPersonas);
        setConversations(groupedConversations);
        setConversationLogs(transformedConversations);
        console.log(`✅ Loaded ${transformedPersonas.length} personas and ${transformedConversations.length} conversations from backend`);
      } catch (error) {
        console.error('❌ Error loading data:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
        console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
        // Keep using mock data on error
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handlePersonaClick = (persona: ScammerProfile) => {
    setSelectedPersona(persona);
    setSelectedConversation(null); // Clear conversation selection when clicking persona directly
    setView('persona');
  };

  const handleConversationClick = (conversation: ConversationLog) => {
    // Find the persona for this conversation
    const persona = personas.find(p => p.id === conversation.scammerId);
    if (persona) {
      setSelectedPersona(persona);
      setSelectedConversation(conversation); // Store the specific conversation
      setView('persona');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">SP</span>
              </div>
              <div>
                <h1 className="text-cyan-400">Scammer Persona Profiling Dashboard</h1>
                <p className="text-xs text-slate-400">Threat Intelligence Platform</p>
              </div>
            </div>
            
            <nav className="flex gap-2">
              <button
                onClick={() => setView('dashboard')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  view === 'dashboard'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setView('conversations')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  view === 'conversations'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50'
                }`}
              >
                Conversations
              </button>
              <button
                onClick={() => setView('about')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  view === 'about'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50'
                }`}
              >
                About
              </button>
              <button
                onClick={() => setShowAnalyst(!showAnalyst)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  showAnalyst
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                    : 'text-slate-400 hover:text-purple-400 hover:bg-slate-800/50'
                }`}
              >
                Analyst AI
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading data from backend...</p>
            </div>
          </div>
        ) : (
          <>
            {view === 'dashboard' && <Dashboard personas={personas} onPersonaClick={handlePersonaClick} />}
            {view === 'persona' && selectedPersona && (
              <ConversationAnalysis 
                persona={selectedPersona} 
                conversations={
                  selectedConversation 
                    ? [...selectedConversation.messages].sort((a, b) => {
                        // Sort by time if available, otherwise by index
                        if (a.time && b.time) {
                          try {
                            const timeA = a.time.split(':').map(Number);
                            const timeB = b.time.split(':').map(Number);
                            return (timeA[0] * 60 + (timeA[1] || 0)) - (timeB[0] * 60 + (timeB[1] || 0));
                          } catch {
                            return 0;
                          }
                        }
                        return 0;
                      })
                    : conversations[selectedPersona.id] || []
                }
                selectedConversation={selectedConversation}
              />
            )}
            {view === 'conversations' && (
              <ConversationBrowser 
                conversations={conversationLogs}
                onConversationClick={handleConversationClick}
              />
            )}
            {view === 'about' && <AboutPage />}
          </>
        )}
      </main>

      {/* Analyst Panel Overlay */}
      {showAnalyst && (
        <AnalystPanel 
          onClose={() => setShowAnalyst(false)} 
          selectedPersona={selectedPersona}
          allPersonas={personas}
          allConversations={conversationLogs}
        />
      )}
    </div>
  );
}