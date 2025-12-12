// Data service layer for loading data from Python backend JSON files
// Falls back to sample data if backend is not available

// Backend JSON format types (matching Python backend structure)
export type ClusterData = {
  persona_id: number | string;
  name: string;
  risk: number;
  keywords: string[];
  description: string;
  archetype?: string;
};

export type PersonaTraits = {
  tone: string;
  emoji_rate: string;
  script_score: number;
  avg_message_length?: number;
  common_phrases?: string[];
  tactics?: string[];
  platform?: string[];
};

export type PersonaData = {
  [key: string]: {
    name: string;
    traits: PersonaTraits;
    active_hours: number[];
    risk_score?: number;
    archetype?: string;
    color?: string;
    crew_id?: string;
    first_seen?: string;
    last_seen?: string;
    success_rate?: number;
    conversations?: number;
  };
};

export type ConversationMessage = {
  sender: 'scammer' | 'victim' | 'bot';
  text: string;
  time?: string;
  type?: 'text' | 'voice' | 'image';
  flags?: string[];
};

export type ConversationData = {
  persona_id: number | string;
  conversation_id?: string;
  platform?: string;
  start_time?: string;
  end_time?: string;
  messages: ConversationMessage[];
  classification?: string;
  outcome?: 'success' | 'failed' | 'ongoing';
  amount_lost?: number;
};

export type SimilarityGraphData = {
  nodes: Array<{
    id: string;
    label?: string;
    group?: string;
  }>;
  edges: Array<{
    source: string;
    target: string;
    weight?: number;
    type?: string;
  }>;
};

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const USE_SAMPLE_DATA = import.meta.env.VITE_USE_SAMPLE_DATA === 'true';
const USE_BACKEND_FILES = import.meta.env.VITE_USE_BACKEND_FILES !== 'false'; // Default to true

// Load clusters.json - tries backend folder first, then API, then sample
export async function loadClusters(): Promise<ClusterData[]> {
  // Try loading from backend/json_files folder first
  if (USE_BACKEND_FILES) {
    try {
      const response = await fetch('/backend/json_files/clusters.json');
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded clusters from backend/json_files');
        return data;
      }
    } catch (error) {
      console.warn('Failed to load from backend/json_files, trying API...', error);
    }
  }

  // Try API endpoint
  if (!USE_SAMPLE_DATA && API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clusters.json`);
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded clusters from API');
        return data;
      }
    } catch (error) {
      console.warn('Failed to load clusters from API, using sample data', error);
    }
  }
  
  // Fallback to sample data
  const sample = await import('../data/sample/clusters.json');
  console.log('Using sample clusters data');
  return sample.default;
}

// Load personas.json - tries backend folder first, then API, then sample
export async function loadPersonas(): Promise<PersonaData> {
  // Try loading from backend/json_files folder first
  if (USE_BACKEND_FILES) {
    try {
      const response = await fetch('/backend/json_files/personas.json');
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded personas from backend/json_files');
        return data;
      }
    } catch (error) {
      console.warn('Failed to load from backend/json_files, trying API...', error);
    }
  }

  // Try API endpoint
  if (!USE_SAMPLE_DATA && API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/personas.json`);
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded personas from API');
        return data;
      }
    } catch (error) {
      console.warn('Failed to load personas from API, using sample data', error);
    }
  }
  
  // Fallback to sample data
  const sample = await import('../data/sample/personas.json');
  console.log('Using sample personas data');
  return sample.default;
}

// Load conversations.json - tries backend folder first, then API, then sample
export async function loadConversations(): Promise<ConversationData[]> {
  // Try loading from backend/json_files folder first
  if (USE_BACKEND_FILES) {
    try {
      const response = await fetch('/backend/json_files/conversations.json');
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded conversations from backend/json_files');
        return data;
      }
    } catch (error) {
      console.warn('Failed to load from backend/json_files, trying API...', error);
    }
  }

  // Try API endpoint
  if (!USE_SAMPLE_DATA && API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/conversations.json`);
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded conversations from API');
        return data;
      }
    } catch (error) {
      console.warn('Failed to load conversations from API, using sample data', error);
    }
  }
  
  // Fallback to sample data
  const sample = await import('../data/sample/conversations.json');
  console.log('Using sample conversations data');
  return sample.default;
}

// Load similarity_graph.json - tries backend folder first, then API, then sample
export async function loadSimilarityGraph(): Promise<SimilarityGraphData> {
  // Try loading from backend/json_files folder first
  if (USE_BACKEND_FILES) {
    try {
      const response = await fetch('/backend/json_files/similarity_graph.json');
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded similarity graph from backend/json_files');
        return data;
      }
    } catch (error) {
      console.warn('Failed to load from backend/json_files, trying API...', error);
    }
  }

  // Try API endpoint
  if (!USE_SAMPLE_DATA && API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/similarity_graph.json`);
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded similarity graph from API');
        return data;
      }
    } catch (error) {
      console.warn('Failed to load similarity graph from API, using sample data', error);
    }
  }
  
  // Fallback to sample data
  const sample = await import('../data/sample/similarity_graph.json');
  console.log('Using sample similarity graph data');
  return sample.default;
}

// Call analyst bot API
export async function askAnalystBot(query: string, personaId?: string): Promise<string> {
  const apiUrl = `${API_BASE_URL}/api/ask_bot`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, persona_id: personaId }),
    });
    
    if (!response.ok) throw new Error('Failed to get bot response');
    const data = await response.json();
    return data.response || data.answer || 'No response from analyst bot';
  } catch (error) {
    console.warn('Analyst bot API unavailable, using mock response', error);
    // Return mock response if backend is not available
    return getMockBotResponse(query, personaId);
  }
}

// Mock bot response (fallback)
function getMockBotResponse(query: string, personaId?: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('summarize') && personaId) {
    return `**Persona ${personaId} Summary:**\n\nThis persona has been identified through pattern analysis. Key characteristics include specific behavioral markers and communication patterns that indicate scammer activity.\n\n**Recommendations:**\n- Monitor for similar patterns\n- Flag messages containing identified keywords\n- High-risk engagement detected`;
  } else if (lowerQuery.includes('red flag')) {
    return `**Common Red Flags Detected:**\n\n1. **Urgency tactics** - "Act now", "Limited time"\n2. **Emotional manipulation** - Building trust quickly\n3. **Money requests** - Asking for upfront payments\n4. **Too good to be true** - Unrealistic promises\n5. **Poor grammar** - Inconsistent language use\n6. **Verification avoidance** - Refusing video calls or meetings`;
  } else if (lowerQuery.includes('similar')) {
    return `Found similar personas with matching behavioral patterns:\n\n**Similarity Analysis:**\n- Pattern matching based on communication style\n- Shared tactics and keywords\n- Temporal activity overlap\n\nCheck the Actionable Insights tab for detailed analysis and recommendations.`;
  } else if (lowerQuery.includes('report')) {
    return `**THREAT INTELLIGENCE REPORT**\n\n📊 **Executive Summary:**\nMultiple active scammer personas identified through ML clustering.\n\n🚨 **High Priority Threats:**\n- Romance scammers\n- Investment schemes\n- Authority impersonators\n\n📈 **Trends:**\n- Cross-platform coordination detected\n- Pattern-based clustering reveals connections\n\n💡 **Recommendations:**\n1. Implement keyword filtering\n2. Monitor peak activity hours\n3. User education on common tactics`;
  }
  
  return 'I can help you analyze scammer personas, identify patterns, find similar cases, and generate reports. Try asking me to "summarize this persona" or "what are the red flags?".';
}

