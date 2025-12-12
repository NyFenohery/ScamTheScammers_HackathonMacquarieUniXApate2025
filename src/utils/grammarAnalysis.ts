// Grammar and syntax analysis utilities
import type { Message } from '../App';

export interface GrammarAnalysis {
  errors: Array<{ type: string; example: string }>;
  regionalIndicators: string[];
  behavioralLinguistics: string[];
}

// Analyze grammar errors from actual messages
export function analyzeGrammar(messages: Message[]): GrammarAnalysis {
  const scammerMessages = messages.filter(m => m.sender === 'scammer');
  const allText = scammerMessages.map(m => m.text).join(' ');
  const lowerText = allText.toLowerCase();
  
  const errors: Array<{ type: string; example: string }> = [];
  const regionalIndicators: string[] = [];
  const behavioralLinguistics: string[] = [];
  
  // Check for ALL CAPS (common in scams)
  const allCapsMatches = allText.match(/[A-Z]{4,}/g);
  if (allCapsMatches && allCapsMatches.length > 0) {
    errors.push({
      type: 'Excessive Capitalization',
      example: `"${allCapsMatches[0].substring(0, 50)}..."`
    });
  }
  
  // Check for missing articles
  const missingArticlePatterns = [
    /\b(?:send|transfer|pay|give)\s+(?:money|fund|amount|fee|payment)\b/gi,
    /\b(?:work|operate)\s+through\s+(?:third|second)\s/gi,
  ];
  for (const pattern of missingArticlePatterns) {
    const matches = allText.match(pattern);
    if (matches && matches.length > 0) {
      errors.push({
        type: 'Missing Articles',
        example: `"${matches[0]}..."`
      });
      break; // Only add once
    }
  }
  
  // Check for verb tense inconsistency
  const tenseIssues = allText.match(/\b(?:i|we|you|they)\s+(?:is|are|was|were)\s+(?:and|but)\s+\w+ing/gi);
  if (tenseIssues && tenseIssues.length > 0) {
    errors.push({
      type: 'Verb Tense Inconsistency',
      example: `"${tenseIssues[0].substring(0, 50)}..."`
    });
  }
  
  // Check for unusual phrasing
  const unusualPhrases = [
    /\b(?:only|just)\s+\d+\s+(?:spot|position|chance|opportunity)\s+(?:left|available)\b/gi,
    /\b(?:act|move)\s+now\b/gi,
    /\b(?:limited|exclusive)\s+time\b/gi,
  ];
  for (const pattern of unusualPhrases) {
    const matches = allText.match(pattern);
    if (matches && matches.length > 0) {
      errors.push({
        type: 'Unusual Phrasing',
        example: `"${matches[0]}..."`
      });
      break;
    }
  }
  
  // Regional indicators based on actual patterns
  const westAfricanPatterns = [
    /\b(?:kindly|please|dear|sir|madam)\b/gi,
    /\b(?:i am|i'm)\s+(?:mr|mrs|dr|prof|barrister|attorney)\s+/gi,
    /\b(?:from|in)\s+(?:nigeria|ghana|sierra leone|cameroon)\b/gi,
  ];
  const westAfricanMatches = westAfricanPatterns.reduce((count, pattern) => {
    return count + (allText.match(pattern) || []).length;
  }, 0);
  
  if (westAfricanMatches > 2) {
    regionalIndicators.push('Non-native English speaker (likely West African origin)');
  } else if (westAfricanMatches > 0) {
    regionalIndicators.push('Possible non-native English speaker');
  }
  
  // Check for formal register mixed with colloquialisms
  const formalWords = (allText.match(/\b(?:kindly|please|dear|sir|madam|respectfully|yours)\b/gi) || []).length;
  const colloquialWords = (allText.match(/\b(?:hey|hi|yo|yeah|nah|gonna|wanna)\b/gi) || []).length;
  if (formalWords > 2 && colloquialWords > 1) {
    regionalIndicators.push('Formal register mixed with colloquialisms');
  }
  
  // Translation artifacts
  const translationPatterns = [
    /\b(?:i am writing|i write to you|i contact you)\s+(?:regarding|concerning|about)\b/gi,
    /\b(?:in respect of|with respect to)\b/gi,
  ];
  if (translationPatterns.some(pattern => allText.match(pattern))) {
    regionalIndicators.push('Possible translation artifacts detected');
  }
  
  // Behavioral linguistics
  const moneyRequestIndex = scammerMessages.findIndex(m => 
    m.text.toLowerCase().match(/\b(?:send|transfer|pay|give|deposit|wire)\s+(?:money|fund|amount|fee|payment|capital)\b/i)
  );
  if (moneyRequestIndex >= 0 && moneyRequestIndex < 5) {
    behavioralLinguistics.push(`Rapid escalation to financial request (${moneyRequestIndex + 1} messages)`);
  }
  
  // Authority switching
  const authorityWords = (allText.match(/\b(?:supervisor|manager|director|boss|authority|official)\b/gi) || []).length;
  if (authorityWords > 2) {
    behavioralLinguistics.push('Authority switching when faced with resistance');
  }
  
  // Scripted responses
  const uniquePhrases = new Set(scammerMessages.map(m => m.text.toLowerCase().substring(0, 30)));
  if (scammerMessages.length > uniquePhrases.size * 1.5) {
    behavioralLinguistics.push('Scripted responses with personalization gaps');
  }
  
  return {
    errors: errors.slice(0, 3), // Max 3 errors
    regionalIndicators: regionalIndicators.length > 0 ? regionalIndicators : ['Standard English patterns detected'],
    behavioralLinguistics: behavioralLinguistics.length > 0 ? behavioralLinguistics : ['No specific behavioral patterns detected'],
  };
}

