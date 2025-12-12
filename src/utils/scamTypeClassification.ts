// Calculate percentage breakdown of scam types based on linguistic analysis
import type { Message } from '../App';

export interface ScamTypeBreakdown {
  type: string;
  percentage: number;
}

// Keywords for each scam type
const scamTypeKeywords: Record<string, string[]> = {
  'Job Scam': ['job', 'salary', 'opportunity', 'hire', 'recruitment', 'position', 'employment', 'work from home', 'remote work', 'apply', 'cv', 'resume'],
  'Romance Scam': ['love', 'romance', 'relationship', 'soulmate', 'trust', 'heart', 'feelings', 'together', 'forever', 'marriage'],
  'Investment Scam': ['investment', 'portfolio', 'returns', 'profit', 'trading', 'stocks', 'shares', 'dividend', 'yield'],
  'Cryptocurrency Scam': ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'wallet', 'mining', 'trading bot', 'defi', 'nft', 'token'],
  'Phishing / Impersonation': ['verify', 'account', 'suspended', 'security', 'bank', 'official', 'government', 'irs', 'tax', 'verify your account'],
  'Product Scam': ['buy', 'product', 'marketplace', 'deal', 'discount', 'sale', 'limited stock', 'hurry', 'order now'],
  'Advance Fee Scam': ['inheritance', 'lottery', 'prize', 'win', 'unclaimed', 'fund', 'transfer', 'release', 'processing fee'],
  'Nigerian Prince / Advance Fee Scam': ['nigerian', 'nigeria', 'royal', 'prince', 'king', 'abacha', 'lagos', 'sierra leone', 'congolese', 'minister', 'government', 'trapped fund', 'late', 'million'],
  'Charity Scam': ['charity', 'donation', 'help', 'children', 'orphan', 'disaster', 'relief', 'fundraising', 'cause'],
};

// Calculate percentage breakdown
export function calculateScamTypeBreakdown(messages: Message[]): ScamTypeBreakdown[] {
  const scammerMessages = messages.filter(m => m.sender === 'scammer');
  const allText = scammerMessages.map(m => m.text).join(' ').toLowerCase();
  
  const scores: Record<string, number> = {};
  
  // Calculate score for each scam type
  Object.entries(scamTypeKeywords).forEach(([type, keywords]) => {
    let score = 0;
    keywords.forEach(keyword => {
      const matches = (allText.match(new RegExp(keyword, 'gi')) || []).length;
      score += matches;
    });
    scores[type] = score;
  });
  
  // Calculate total score
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  
  // Convert to percentages
  const breakdown: ScamTypeBreakdown[] = Object.entries(scores)
    .map(([type, score]) => ({
      type,
      percentage: totalScore > 0 ? Math.round((score / totalScore) * 100) : 0,
    }))
    .filter(item => item.percentage > 0) // Only include types with > 0%
    .sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending
  
  // If no matches, return generic
  if (breakdown.length === 0) {
    return [{ type: 'Generic Scam', percentage: 100 }];
  }
  
  return breakdown;
}

