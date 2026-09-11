export interface MarketTrend {
  skill: string;
  category: string;
  demandIndex: number; // 0-100
  growthRate: string;
  avgSalary: string;
  rolesDemanding: string[];
}

export interface MarketIntelligence {
  marketUrl: string;
  lastUpdated: string;
  overallDemandScore: number;
  topDemandedSkills: MarketTrend[];
  industryHighlights: string[];
  roleInsights: Array<{
    role: string;
    avgSalary: string;
    hiringVolume: string;
    topRequiredSkills: string[];
  }>;
}

export const CURRENT_MARKET_TRENDS: MarketIntelligence = {
  marketUrl: "/api/market-trends",
  lastUpdated: "2026-09-11",
  overallDemandScore: 88,
  industryHighlights: [
    "Generative AI & LLM Engineering demand up 142% year-over-year.",
    "RAG Architecture & Vector Database engineers in top 5 most sought roles.",
    "Autonomous Agentic Workflows (LangGraph, n8n) rapidly adopting in enterprise platforms.",
    "Voice AI & Speech Telephony (Vapi, FastAPI) emerging as key customer automation tech.",
    "SQL, Python, and Type-Safe Full-Stack (React/TypeScript) remain non-negotiable core foundations.",
  ],
  topDemandedSkills: [
    { skill: "Generative AI", category: "AI", demandIndex: 96, growthRate: "+142%", avgSalary: "₹16-24 LPA", rolesDemanding: ["AI Engineer", "LLM Architect"] },
    { skill: "Python", category: "Programming", demandIndex: 94, growthRate: "+35%", avgSalary: "₹12-20 LPA", rolesDemanding: ["AI Engineer", "Backend Engineer", "Data Scientist"] },
    { skill: "RAG & Vector DBs", category: "AI Infrastructure", demandIndex: 92, growthRate: "+110%", avgSalary: "₹15-22 LPA", rolesDemanding: ["RAG Engineer", "AI Developer"] },
    { skill: "SQL", category: "Data", demandIndex: 91, growthRate: "+28%", avgSalary: "₹10-16 LPA", rolesDemanding: ["Data Analyst", "Full Stack Engineer", "Backend Engineer"] },
    { skill: "React & TypeScript", category: "Frontend", demandIndex: 89, growthRate: "+40%", avgSalary: "₹11-18 LPA", rolesDemanding: ["Full Stack Engineer", "Frontend Engineer"] },
    { skill: "LangGraph & Agents", category: "AI Automation", demandIndex: 88, growthRate: "+125%", avgSalary: "₹14-22 LPA", rolesDemanding: ["Agentic AI Developer", "Automation Engineer"] },
    { skill: "AWS & Cloud", category: "Cloud", demandIndex: 84, growthRate: "+45%", avgSalary: "₹12-19 LPA", rolesDemanding: ["DevOps Engineer", "Backend Engineer"] },
    { skill: "FastAPI", category: "Backend", demandIndex: 82, growthRate: "+60%", avgSalary: "₹11-17 LPA", rolesDemanding: ["Backend Engineer", "Voice AI Developer"] },
  ],
  roleInsights: [
    { role: "Generative AI & LLM Engineer", avgSalary: "₹15–24 LPA", hiringVolume: "High", topRequiredSkills: ["Python", "Generative AI", "LLMs", "RAG"] },
    { role: "Full Stack Engineer", avgSalary: "₹12–18 LPA", hiringVolume: "Very High", topRequiredSkills: ["React", "TypeScript", "SQL", "Git"] },
    { role: "Data Analyst", avgSalary: "₹8–14 LPA", hiringVolume: "High", topRequiredSkills: ["SQL", "Python", "Communication"] },
    { role: "Voice AI & Telephony Developer", avgSalary: "₹14–22 LPA", hiringVolume: "Rapid Growth", topRequiredSkills: ["Voice AI", "Vapi", "FastAPI", "Python"] },
    { role: "Backend Engineer", avgSalary: "₹11–17 LPA", hiringVolume: "High", topRequiredSkills: ["Python", "FastAPI", "SQL", "Git"] },
  ],
};

export function getMarketIntelligence(): MarketIntelligence {
  return CURRENT_MARKET_TRENDS;
}
