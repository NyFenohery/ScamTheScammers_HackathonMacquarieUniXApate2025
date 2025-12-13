# Scam Persona Dashboard Design
**Strategic Foresight and Lead Enrichment: Scammer Persona Profiling**

## Problem Statement
Fraud detection systems struggle with personalized threat assessment because they lack comprehensive profiling of scammer behavioral patterns. Organizations need to understand scammer tactics, communication styles, and targeting strategies to effectively identify and mitigate fraud risks before they materialize.

## Our Approach
We developed an interactive dashboard that aggregates scammer conversation data and applies natural language processing to create detailed behavioral personas. The system identifies communication patterns, risk indicators, and tactical approaches to enable security teams to recognize and prevent fraud more effectively.

---

## Methodology & Approach

### 1. **Data Collection & Aggregation**
- Aggregated scammer conversations from multiple sources
- Structured data into three primary datasets: conversations, personas, and clustering information
- Created similarity graphs to identify scammer networks and collaboration patterns

### 2. **Persona Creation**
- Used clustering algorithms to group scammers by behavior patterns
- Extracted key behavioral features:
  - Communication tone and style (aggressive, friendly, professional)
  - Active hours and peak activity windows
  - Platform preferences (SMS, WhatsApp, email, etc.)
  - Success rates and average engagement metrics
  - Common phrases and linguistic patterns
  - Tactical approaches and targeting methods

### 3. **Linguistic Analysis**
- Analyzed message content for:
  - Grammar/spelling quality (sophisticated vs. low-effort)
  - Sentiment patterns and emotional manipulation tactics
  - Common scam frameworks (romance, financial, tech support)
  - Urgency/pressure language indicators
  - Authority impersonation language

### 4. **Risk Scoring**
- Developed multi-factor risk assessment:
  - Success rate tracking
  - Victim targeting patterns
  - Crew/network coordination indicators
  - Cross-platform activity correlation

### 5. **Interactive Visualization**
- Built a comprehensive dashboard allowing security teams to:
  - Browse and filter scammer profiles
  - View conversation transcripts with linguistic annotations
  - Analyze behavioral heatmaps by hour/day
  - Generate actionable insights for prevention strategies

---

## Tech Stack

### Frontend
- **React 18.3** - Component framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build and dev server
- **Tailwind CSS** - Styling framework
- **Recharts** - Data visualization (heatmaps, charts)
- **Radix UI** - Accessible component library
- **React Hook Form** - Form management

### Backend & Data
- **JSON data layer** - Structured conversation and persona data
- **Python (backend)** - Data processing and clustering (Jupyter notebooks)
- **Natural Language Processing** - Grammar and linguistic analysis utilities

### Data Processing
- Clustering algorithms for persona grouping
- Similarity graph generation for scammer network analysis
- Linguistic feature extraction and classification

---

## Setup & Run Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

### Project Structure
```
src/
├── components/        # React components for dashboard
├── services/         # Data loading and transformation
├── utils/            # Linguistic analysis and classification utilities
├── styles/           # Global styling
└── data/             # Sample data files
backend/
├── data/            # JSON datasets (clusters, conversations, personas)
└── test.ipynb       # Data processing and analysis notebooks
```

---

## Safety Considerations

### Data Privacy & Security
1. **Anonymization**: All persona data is derived from conversations with PII redacted
2. **Ethical Use**: Dashboard designed for fraud prevention by legitimate security teams only
3. **Access Control**: Implement authentication before deployment in production
4. **Data Retention**: Follow data protection regulations (GDPR, CCPA) for conversation storage

### Responsible AI & Ethical Guidelines
1. **Bias Awareness**: Scammer profiles may reflect data collection biases; use with contextual judgment
2. **False Positives**: Risk scoring is probabilistic; never make automated decisions without human review
3. **Legal Compliance**: Ensure jurisdiction permits scammer pattern analysis and monitoring
4. **Transparency**: Security teams should be trained on system limitations and proper interpretation

### Operational Security
1. **Input Validation**: All user inputs are validated and sanitized
2. **No Model Training**: System does not create new models on live data; analysis is deterministic
3. **Audit Logging**: Track all profile access and analysis activities in production
4. **Rate Limiting**: Implement throttling to prevent abuse in multi-user environments

---

## Features

### Dashboard Components
- **Persona Tiles** - Quick overview of scammer profiles with risk scores
- **Activity Heatmaps** - Temporal analysis of scammer activity patterns
- **Conversation Browser** - Search and filter scammer conversations
- **Linguistic Analysis** - Grammar quality, sentiment, and communication style assessment
- **Conversation Analysis** - Detailed breakdown of individual conversations
- **Actionable Insights** - Generated recommendations for fraud prevention teams
- **Full Transcript View** - Complete conversation transcripts with annotations

### Analytics
- Risk scoring across multiple dimensions
- Network analysis of scammer crews
- Platform usage patterns
- Communication style classification
- Tactical approach identification

---

## Usage Examples

1. **Identify High-Risk Scammers**: Filter by risk score to prioritize threats
2. **Pattern Recognition**: Compare linguistic patterns across personas to detect new scammers
3. **Temporal Analysis**: View activity heatmaps to identify peak fraud times
4. **Crew Detection**: Use similarity graphs to identify scammer networks
5. **Strategy Development**: Analyze common tactics to develop counter-messaging strategies

---

## Impact & Value

- **Fraud Prevention**: Enables security teams to recognize scammer behavioral patterns
- **Victim Protection**: Earlier threat identification saves potential victims
- **Law Enforcement**: Provides intelligence for scammer prosecution efforts
- **Scalability**: Extensible framework for continuous persona profile updates
- **Research**: Rich dataset for fraud behavior studies and machine learning applications

---

## Team

**Team 25**
Strategic Foresight and Lead Enrichment: Scammer Persona Profiling

Members: 
- https://github.com/NyFenohery
- https://github.com/mahalligator

---

## Design Reference

Original design (UI inspiration): https://www.figma.com/design/PH8IjR9kzLPPi8weS1sYuj/Scam-Persona-Dashboard-Design
