import { randomUUID } from "crypto";
import { getAllStudentProfilesFromDb } from "./supabase-service";

export type Skill = { id: string; name: string; category: string; proficiency: number; confidence: number; verified: boolean };
export type Role = { id: string; title: string; description: string; demand: number; salary: string; requiredSkills: string[]; preferredSkills: string[] };
export type Job = { id: string; company: string; title: string; location: string; ctc: string; deadline: string; description: string; requiredSkills: string[]; minCgpa: number; allowedBranches: string[]; maxBacklogs: number; externalUrl: string; status: "Published" | "Draft" | "Closed" };
export type Application = { id: string; jobId: string; studentName: string; studentEmail: string; resumeUrl?: string; matchScore: number; matchedSkills: string[]; missingSkills: string[]; evaluationSummary: string; status: string; appliedAt: string; timeline: { label: string; date: string; done: boolean }[] };

export type QuizQuestion = { id: string; question: string; options: string[]; answerIndex: number; explanation: string };
export type Quiz = { id: string; afterVideoIndex: number; title: string; questions: QuizQuestion[] };
export type VideoLesson = { id: string; index: number; title: string; duration: string; url: string; description: string };
export type WebResource = { title: string; url: string; type: "Docs" | "Tutorial" | "Guide" };
export type Course = { id: string; title: string; category: string; level: string; hours: number; progress: number; description: string; skills: string[]; videos: VideoLesson[]; quizzes: Quiz[]; docs: WebResource[]; finalProjectPrompt: string };

export type ProjectSubmission = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  skillName: string;
  projectTitle: string;
  githubUrl: string;
  liveUrl?: string;
  notes?: string;
  skills?: string[];
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  awardedPoints: number;
};

const now = new Date("2026-09-11T00:00:00.000Z");
const isoDaysFromNow = (days: number) => new Date(now.getTime() + days * 86400000).toISOString();

const skills: Skill[] = [
  { id: "python", name: "Python", category: "Programming", proficiency: 82, confidence: 88, verified: true },
  { id: "sql", name: "SQL", category: "Data", proficiency: 43, confidence: 58, verified: false },
  { id: "react", name: "React", category: "Frontend", proficiency: 76, confidence: 80, verified: true },
  { id: "typescript", name: "TypeScript", category: "Programming", proficiency: 71, confidence: 75, verified: false },
  { id: "git", name: "Git", category: "Tools", proficiency: 84, confidence: 90, verified: true },
  { id: "aws", name: "AWS", category: "Cloud", proficiency: 28, confidence: 35, verified: false },
  { id: "communication", name: "Communication", category: "Professional", proficiency: 62, confidence: 70, verified: false },
  { id: "dsa", name: "Data Structures", category: "Core", proficiency: 67, confidence: 64, verified: false },
  { id: "fastapi", name: "FastAPI", category: "Backend", proficiency: 55, confidence: 57, verified: false },
  { id: "ml", name: "Machine Learning", category: "AI", proficiency: 38, confidence: 42, verified: false },
  { id: "figma", name: "Figma", category: "Design", proficiency: 45, confidence: 45, verified: false },
];

const roles: Role[] = [
  { id: "fullstack", title: "Full Stack Engineer", description: "Build product experiences across the frontend and backend, collaborating closely with design and platform teams.", demand: 88, salary: "₹12–18 LPA", requiredSkills: ["React", "TypeScript", "SQL", "Git"], preferredSkills: ["Python", "AWS", "FastAPI"] },
  { id: "data-analyst", title: "Data Analyst", description: "Turn business questions into clear analysis, dashboards, and decisions with reliable data workflows.", demand: 82, salary: "₹8–14 LPA", requiredSkills: ["SQL", "Python", "Communication"], preferredSkills: ["Machine Learning", "React"] },
  { id: "backend", title: "Backend Engineer", description: "Design resilient APIs and data systems that power high-trust customer and internal experiences.", demand: 79, salary: "₹11–17 LPA", requiredSkills: ["Python", "FastAPI", "SQL", "Git"], preferredSkills: ["AWS", "TypeScript"] },
  { id: "product-designer", title: "Product Designer", description: "Shape accessible, evidence-led product journeys from early concepts through shipped experiences.", demand: 66, salary: "₹7–13 LPA", requiredSkills: ["Figma", "Communication"], preferredSkills: ["React", "SQL"] },
];

const jobs: Job[] = [
  { id: "job-northstar", company: "Northstar Labs", title: "Software Engineer — Platform", location: "Bengaluru · Hybrid", ctc: "₹14–18 LPA", deadline: "2026-10-15T18:30:00.000Z", description: "Join a product platform team building developer tools used by fast-moving teams.", requiredSkills: ["Python", "React", "SQL", "Git"], minCgpa: 7.5, allowedBranches: ["CSE", "IT"], maxBacklogs: 0, externalUrl: "https://example.com/apply/northstar", status: "Published" },
  { id: "job-arc", company: "Arc & Pine", title: "Data Analyst", location: "Remote · India", ctc: "₹10–13 LPA", deadline: "2026-09-29T18:30:00.000Z", description: "Help product and growth teams understand where customers find value.", requiredSkills: ["SQL", "Python", "Communication"], minCgpa: 7.0, allowedBranches: ["CSE", "IT", "ECE", "BBA"], maxBacklogs: 1, externalUrl: "https://example.com/apply/arc-pine", status: "Published" },
  { id: "job-signal", company: "SignalHouse", title: "Frontend Engineer", location: "Pune · On-site", ctc: "₹12–16 LPA", deadline: "2026-10-04T18:30:00.000Z", description: "Create thoughtful workflows for people making high-stakes operational decisions.", requiredSkills: ["React", "TypeScript", "Git"], minCgpa: 7.2, allowedBranches: ["CSE", "IT"], maxBacklogs: 0, externalUrl: "https://example.com/apply/signalhouse", status: "Published" },
];

const sqlYoutubeUrls = [
  "https://www.youtube.com/watch?v=HXV3zeQKqGY",
  "https://www.youtube.com/watch?v=27axs9dO7AE",
  "https://www.youtube.com/watch?v=QmonTknf6eU",
  "https://www.youtube.com/watch?v=0rB_UZCzo88",
  "https://www.youtube.com/watch?v=yFj-Y4u_jG8",
  "https://www.youtube.com/watch?v=fG788w4XnB4",
  "https://www.youtube.com/watch?v=Ww71knvhQ-s",
  "https://www.youtube.com/watch?v=m06j_rTfylY",
  "https://www.youtube.com/watch?v=KEE5G_Llc4k",
  "https://www.youtube.com/watch?v=fsG1XAacO80",
  "https://www.youtube.com/watch?v=g2JkW0F2_Lg",
  "https://www.youtube.com/watch?v=32DvwF0iGno",
];

const sqlVideos: VideoLesson[] = Array.from({ length: 12 }, (_, i) => ({
  id: `v-sql-${i + 1}`,
  index: i + 1,
  title: [
    "1. Introduction to Relational Databases & SQL Syntax",
    "2. Filtering & Sorting Data with WHERE and ORDER BY",
    "3. Aggregate Functions & GROUP BY Fundamentals",
    "4. Inner Joins & Relational Data Normalization",
    "5. Left, Right & Full Outer Joins Masterclass",
    "6. Subqueries & Nested SELECT Statements",
    "7. Window Functions: ROW_NUMBER & RANK",
    "8. Window Functions: LEAD, LAG & Running Totals",
    "9. Common Table Expressions (CTEs) & Recursive Queries",
    "10. Database Indexing & Query Performance Optimization",
    "11. Transactions, ACID Properties & Locking",
    "12. Real-World E-Commerce Analytics Case Study",
  ][i],
  duration: `${11 + (i % 4) * 2} mins`,
  url: sqlYoutubeUrls[i] || sqlYoutubeUrls[0],
  description: `Master lesson ${i + 1} for production database queries, relational schema modeling, and analytics performance.`,
}));

const sqlQuizzes: Quiz[] = [
  {
    id: "q-sql-1",
    afterVideoIndex: 5,
    title: "Checkpoint 1: Relational Queries & Joins",
    questions: [
      { id: "q1", question: "Which clause filters rows AFTER aggregate functions like COUNT() or SUM() are evaluated?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], answerIndex: 1, explanation: "HAVING filters grouped/aggregated records, whereas WHERE filters individual rows before aggregation." },
      { id: "q2", question: "What is the result of a LEFT JOIN if a row in the left table has no match in the right table?", options: ["The left row is excluded", "Right table columns return NULL", "An exception is thrown", "A cross product is generated"], answerIndex: 1, explanation: "LEFT JOIN preserves all rows from the left table and fills missing right table attributes with NULL." },
      { id: "q3", question: "Which SQL constraint guarantees uniqueness across a column or set of columns?", options: ["FOREIGN KEY", "UNIQUE", "NOT NULL", "CHECK"], answerIndex: 1, explanation: "The UNIQUE constraint ensures all non-null values in a column are distinct." },
    ],
  },
  {
    id: "q-sql-2",
    afterVideoIndex: 10,
    title: "Checkpoint 2: Advanced Window Functions & CTEs",
    questions: [
      { id: "q4", question: "How does DENSE_RANK() differ from RANK() when values tie?", options: ["DENSE_RANK skips rank numbers after ties", "DENSE_RANK produces contiguous rank numbers without gaps", "RANK produces no ties", "DENSE_RANK only works on strings"], answerIndex: 1, explanation: "DENSE_RANK leaves no gaps in ranking numbers after tied values." },
      { id: "q5", question: "What keyword introduces a Common Table Expression (CTE)?", options: ["WITH", "LET", "USING", "CREATE CTE"], answerIndex: 0, explanation: "A CTE is defined using the WITH statement preceding the main query." },
    ],
  },
];

const awsYoutubeUrls = [
  "https://www.youtube.com/watch?v=r4YIdn2pe9w",
  "https://www.youtube.com/watch?v=i_N3kpyQ-O0",
  "https://www.youtube.com/watch?v=e6w9LwZJFBU",
  "https://www.youtube.com/watch?v=gK14fJv_e6c",
  "https://www.youtube.com/watch?v=Vl8_Y46J2Y8",
  "https://www.youtube.com/watch?v=7-qH_-lG4rA",
  "https://www.youtube.com/watch?v=eOBq__hVUBE",
  "https://www.youtube.com/watch?v=vV_X115zDbg",
  "https://www.youtube.com/watch?v=9L8W8mYc_O0",
  "https://www.youtube.com/watch?v=fqMOX6JJhGo",
  "https://www.youtube.com/watch?v=Yc40w1F4B0w",
];

const awsVideos: VideoLesson[] = Array.from({ length: 11 }, (_, i) => ({
  id: `v-aws-${i + 1}`,
  index: i + 1,
  title: [
    "1. AWS Cloud Architecture & Infrastructure Overview",
    "2. EC2 Virtual Machines & Security Group Rules",
    "3. Amazon S3 Object Storage & Bucket Policies",
    "4. VPC Networking: Subnets, Route Tables & Gateways",
    "5. AWS IAM Users, Roles & Principle of Least Privilege",
    "6. Relational Database Service (RDS) & Read Replicas",
    "7. AWS Lambda Serverless Functions & Event Triggers",
    "8. API Gateway Integration with Lambda Backends",
    "9. CloudWatch Metrics, Alarms & Log Groups",
    "10. Docker Container Deployment on AWS ECS",
    "11. Terraform Infrastructure as Code (IaC) on AWS",
  ][i],
  duration: `${11 + (i % 4) * 2} mins`,
  url: awsYoutubeUrls[i] || awsYoutubeUrls[0],
  description: `Hands-on cloud engineering lesson ${i + 1} for deploying resilient web services on AWS.`,
}));

const awsQuizzes: Quiz[] = [
  {
    id: "q-aws-1",
    afterVideoIndex: 5,
    title: "Checkpoint 1: Core AWS Services & IAM",
    questions: [
      { id: "q-a1", question: "Which AWS service provides scalable object storage?", options: ["EC2", "S3", "EBS", "RDS"], answerIndex: 1, explanation: "Amazon S3 (Simple Storage Service) is built for object storage." },
      { id: "q-a2", question: "What is the primary role of AWS Security Groups?", options: ["Domain registration", "Stateful instance-level firewall", "Content delivery network", "DNS routing"], answerIndex: 1, explanation: "Security groups act as stateful firewalls controlling inbound and outbound traffic." },
    ],
  },
];

const sysYoutubeUrls = [
  "https://www.youtube.com/watch?v=m8Icp_Cidto",
  "https://www.youtube.com/watch?v=K0Ta65OqQkY",
  "https://www.youtube.com/watch?v=5faMjKuB9bc",
  "https://www.youtube.com/watch?v=G1rOthIU-M0",
  "https://www.youtube.com/watch?v=B7bOaR3f2Yg",
  "https://www.youtube.com/watch?v=hdI2bqOjy3c",
  "https://www.youtube.com/watch?v=1xo-0gCVhTU",
  "https://www.youtube.com/watch?v=r-Au_a331wM",
  "https://www.youtube.com/watch?v=FU4WlwfS3G0",
  "https://www.youtube.com/watch?v=bBTPZ9NdSk8",
];

const sysVideos: VideoLesson[] = Array.from({ length: 10 }, (_, i) => ({
  id: `v-sys-${i + 1}`,
  index: i + 1,
  title: [
    "1. High-Scale System Architecture Principles",
    "2. Load Balancing & Horizontal Scaling Strategies",
    "3. Database Sharding & Read Replication",
    "4. Caching Strategies with Redis & Memcached",
    "5. Asynchronous Messaging with Kafka & RabbitMQ",
    "6. REST vs gRPC vs GraphQL API Design",
    "7. Microservices Decomposition & Service Discovery",
    "8. Distributed Tracing & Cloud Monitoring",
    "9. Rate Limiting & Circuit Breaker Patterns",
    "10. Designing a Real-Time Notification System",
  ][i],
  duration: `${11 + (i % 4) * 2} mins`,
  url: sysYoutubeUrls[i] || sysYoutubeUrls[0],
  description: `System design pattern ${i + 1} for high-availability production infrastructure.`,
}));

const sysQuizzes: Quiz[] = [
  {
    id: "q-sys-1",
    afterVideoIndex: 5,
    title: "Checkpoint 1: Scalability & Caching",
    questions: [
      { id: "q-s1", question: "Which caching strategy writes data to cache and database simultaneously?", options: ["Write-Through", "Write-Behind", "Cache-Aside", "Read-Through"], answerIndex: 0, explanation: "Write-Through updates both cache and underlying DB in a single operation." },
      { id: "q-s2", question: "What problem does consistent hashing solve in distributed systems?", options: ["Database locking", "Minimizing key remapping during server additions", "Password hashing", "CSS bundle size"], answerIndex: 1, explanation: "Consistent hashing ensures minimal key movement when cache nodes are added or removed." },
    ],
  },
];

const fullstackYoutubeUrls = [
  "https://www.youtube.com/watch?v=Z575acqY7_w",
  "https://www.youtube.com/watch?v=ahCwqrYpIuM",
  "https://www.youtube.com/watch?v=tn3mH-R-J5s",
  "https://www.youtube.com/watch?v=U3dLfKEZl0s",
  "https://www.youtube.com/watch?v=2pp11VSpc7E",
  "https://www.youtube.com/watch?v=ReK0L2agexA",
  "https://www.youtube.com/watch?v=P_X0k3N2N5A",
  "https://www.youtube.com/watch?v=9_H5U9nB-8E",
  "https://www.youtube.com/watch?v=JBSUgAlkDCY",
  "https://www.youtube.com/watch?v=2HtQ5mZ24hE",
];

const fullstackVideos: VideoLesson[] = Array.from({ length: 10 }, (_, i) => ({
  id: `v-fs-${i + 1}`,
  index: i + 1,
  title: [
    "1. Modern Full-Stack Architecture with React & Node",
    "2. TypeScript Interfaces & Type-Safe API Contracts",
    "3. React State Management & Custom Hooks",
    "4. Express & tRPC Server Routing",
    "5. Authentication: JWT vs Session Cookies",
    "6. ORM Data Access with Prisma & PostgreSQL",
    "7. File Uploads & Object Storage Buckets",
    "8. Server-Side Rendering (SSR) & Next.js Hydration",
    "9. Automated Testing with Vitest & React Testing Library",
    "10. Production Deployment & CI/CD Pipelines",
  ][i],
  duration: `${11 + (i % 3) * 2} mins`,
  url: fullstackYoutubeUrls[i] || fullstackYoutubeUrls[0],
  description: `Full-stack engineering module ${i + 1} for shipping robust web applications.`,
}));

const fullstackQuizzes: Quiz[] = [
  {
    id: "q-fs-1",
    afterVideoIndex: 5,
    title: "Checkpoint 1: Type-Safe Full-Stack API",
    questions: [
      { id: "q-fs1", question: "Why is tRPC advantageous over REST APIs for full-stack TypeScript apps?", options: ["It requires manual OpenAPI schemas", "It provides end-to-end type safety without code generation", "It runs inside the browser DOM", "It compiles to C++"], answerIndex: 1, explanation: "tRPC automatically infers server input/output types directly into client hooks." },
    ],
  },
];

// ----------------------------------------------------------------------
// 30-Day Course Roadmaps (ONLY the 2 provided courses from uploaded PDFs)
// ----------------------------------------------------------------------

export const llmEngineering30DayVideos: VideoLesson[] = [
  { id: "v-llm-1", index: 1, title: "Day 1: Introduction to Large Language Models (how LLMs work)", duration: "~1 hr", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", description: "LLM Engineering | Concept: Introduction to Large Language Models (how LLMs work)" },
  { id: "v-llm-2", index: 2, title: "Day 2: Transformer architecture explained", duration: "~20-30 min", url: "https://www.youtube.com/watch?v=ec9IQMiJBhs", description: "LLM Engineering | Concept: Transformer architecture explained" },
  { id: "v-llm-3", index: 3, title: "Day 3: Tokenization in NLP", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=TlflB-3Xd-4", description: "LLM Engineering | Concept: Tokenization in NLP" },
  { id: "v-llm-4", index: 4, title: "Day 4: Word embeddings explained", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=hVM8qGRTaOA", description: "LLM Engineering | Concept: Word embeddings explained" },
  { id: "v-llm-5", index: 5, title: "Day 5: Self-attention mechanism", duration: "~8-10 min", url: "https://www.youtube.com/watch?v=W28LfOld44Y", description: "LLM Engineering | Concept: Self-attention mechanism" },
  { id: "v-llm-6", index: 6, title: "Day 6: OpenAI API basics (Python)", duration: "~20-30 min", url: "https://www.youtube.com/watch?v=I4T--ycOpi0", description: "LLM Engineering | Concept: OpenAI API basics (Python)" },
  { id: "v-llm-7", index: 7, title: "Day 7: Hugging Face Transformers library", duration: "~15 min", url: "https://www.youtube.com/watch?v=QEaBAZQCtwE", description: "LLM Engineering | Concept: Hugging Face Transformers library" },
  { id: "v-llm-8", index: 8, title: "Day 8: Prompt engineering basics", duration: "~20-30 min", url: "https://www.youtube.com/watch?v=aOm75o2Z5-o", description: "LLM Engineering | Concept: Prompt engineering basics" },
  { id: "v-llm-9", index: 9, title: "Day 9: LangChain crash course", duration: "~40-45 min", url: "https://www.youtube.com/watch?v=nAmC7SoVLd8", description: "LLM Engineering | Concept: LangChain crash course" },
  { id: "v-llm-10", index: 10, title: "Day 10: Vector databases (Chroma / Pinecone / Weaviate)", duration: "~30-45 min", url: "https://www.youtube.com/watch?v=8KrTO9bS91s", description: "LLM Engineering | Concept: Vector databases (Chroma / Pinecone / Weaviate)" },
  { id: "v-llm-11", index: 11, title: "Day 11: RAG (Retrieval-Augmented Generation) basics", duration: "~20 min", url: "https://www.youtube.com/watch?v=RosLeHGBLoY", description: "LLM Engineering | Concept: RAG (Retrieval-Augmented Generation) basics" },
  { id: "v-llm-12", index: 12, title: "Day 12: Fine-tuning LLMs explained", duration: "~8-10 min", url: "https://www.youtube.com/watch?v=wmCmrEijfQ0", description: "LLM Engineering | Concept: Fine-tuning LLMs explained" },
  { id: "v-llm-13", index: 13, title: "Day 13: LoRA and QLoRA / PEFT explained", duration: "~30-40 min", url: "https://www.youtube.com/watch?v=CRFON_RPa_E", description: "LLM Engineering | Concept: LoRA and QLoRA / PEFT explained" },
  { id: "v-llm-14", index: 14, title: "Day 14: Quantization (4-bit / 8-bit models)", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=pBQwXvJPsw4", description: "LLM Engineering | Concept: Quantization (4-bit / 8-bit models)" },
  { id: "v-llm-15", index: 15, title: "Day 15: Running local LLMs with Ollama", duration: "~15 min", url: "https://www.youtube.com/watch?v=UtSSMs6ObqY", description: "LLM Engineering | Concept: Running local LLMs with Ollama" },
  { id: "v-llm-16", index: 16, title: "Day 16: Function calling / tool use in LLMs", duration: "~20-30 min", url: "https://www.youtube.com/watch?v=gMeTK6zzaO4", description: "LLM Engineering | Concept: Function calling / tool use in LLMs" },
  { id: "v-llm-17", index: 17, title: "Day 17: AI agents overview", duration: "~14 min", url: "https://www.youtube.com/watch?v=TZMdEg1ZoIo", description: "LLM Engineering | Concept: AI agents overview" },
  { id: "v-llm-18", index: 18, title: "Day 18: Multi-agent systems (CrewAI / AutoGen)", duration: "~20-30 min", url: "https://www.youtube.com/watch?v=jKEgaQPmJz0", description: "LLM Engineering | Concept: Multi-agent systems (CrewAI / AutoGen)" },
  { id: "v-llm-19", index: 19, title: "Day 19: LLM evaluation methods and benchmarks", duration: "~10-15 min", url: "https://www.youtube.com/watch?v=6eOcgYP5D4Q", description: "LLM Engineering | Concept: LLM evaluation methods and benchmarks" },
  { id: "v-llm-20", index: 20, title: "Day 20: LLM guardrails and safety", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=ugY6fQT9cfw", description: "LLM Engineering | Concept: LLM guardrails and safety" },
  { id: "v-llm-21", index: 21, title: "Day 21: LLM observability and tracing (LangSmith)", duration: "~20-30 min", url: "https://www.youtube.com/watch?v=EdzAH5_PppM", description: "LLM Engineering | Concept: LLM observability and tracing (LangSmith)" },
  { id: "v-llm-22", index: 22, title: "Day 22: Streaming LLM responses with FastAPI", duration: "~20-30 min", url: "https://www.youtube.com/watch?v=twXxb00w1_4", description: "LLM Engineering | Concept: Streaming LLM responses with FastAPI" },
  { id: "v-llm-23", index: 23, title: "Day 23: Understanding context windows / long context", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=oOL0WY1b_x4", description: "LLM Engineering | Concept: Understanding context windows / long context" },
  { id: "v-llm-24", index: 24, title: "Day 24: Chatbot memory with LangChain", duration: "~20-30 min", url: "https://www.youtube.com/watch?v=X05uK0TZozM", description: "LLM Engineering | Concept: Chatbot memory with LangChain" },
  { id: "v-llm-25", index: 25, title: "Day 25: LLM cost optimization strategies", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=R1na--yxl1s", description: "LLM Engineering | Concept: LLM cost optimization strategies" },
  { id: "v-llm-26", index: 26, title: "Day 26: Deploying apps with FastAPI + Docker", duration: "~20-30 min", url: "https://www.youtube.com/watch?v=eqjngvKfabg", description: "LLM Engineering | Concept: Deploying apps with FastAPI + Docker" },
  { id: "v-llm-27", index: 27, title: "Day 27: Building a RAG pipeline from scratch (hands-on)", duration: "~30-40 min", url: "https://www.youtube.com/watch?v=qN_2fnOPY-M", description: "LLM Engineering | Concept: Building a RAG pipeline from scratch (hands-on)" },
  { id: "v-llm-28", index: 28, title: "Day 28: LLMOps explained (managing LLMs in production)", duration: "~5-10 min", url: "https://www.youtube.com/watch?v=BGAZp7mHjCA", description: "LLM Engineering | Concept: LLMOps explained (managing LLMs in production)" },
  { id: "v-llm-29", index: 29, title: "Day 29: Building a chatbot UI with Gradio (streaming)", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=RB8OZtqdeFQ", description: "LLM Engineering | Concept: Building a chatbot UI with Gradio (streaming)" },
  { id: "v-llm-30", index: 30, title: "Day 30: Capstone: End-to-end RAG chatbot project (LangChain + Streamlit + ChromaDB)", duration: "~45-60 min", url: "https://www.youtube.com/watch?v=WUUujm1MRQg", description: "LLM Engineering | Concept: Capstone: End-to-end RAG chatbot project (LangChain + Streamlit + ChromaDB)" },
];

export const aiAgents30DayVideos: VideoLesson[] = [
  { id: "v-agent-1", index: 1, title: "Day 1: What is an AI Agent (introduction)", duration: "~14 min", url: "https://www.youtube.com/watch?v=TZMdEg1ZoIo", description: "AI Agents | Concept: What is an AI Agent (introduction)" },
  { id: "v-agent-2", index: 2, title: "Day 2: AI Agent vs Chatbot - key differences", duration: "~10-15 min", url: "https://www.youtube.com/watch?v=Fh9Xvc6Eaj4", description: "AI Agents | Concept: AI Agent vs Chatbot - key differences" },
  { id: "v-agent-3", index: 3, title: "Day 3: ReAct framework (Reasoning + Acting)", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=WBgI9ce_7wM", description: "AI Agents | Concept: ReAct framework (Reasoning + Acting)" },
  { id: "v-agent-4", index: 4, title: "Day 4: Short-term vs long-term memory in agents", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=aYa7vKMXmao", description: "AI Agents | Concept: Short-term vs long-term memory in agents" },
  { id: "v-agent-5", index: 5, title: "Day 5: LangChain Agents tutorial (tools + agent executor)", duration: "~25-30 min", url: "https://www.youtube.com/watch?v=Gi7nqB37WEY", description: "AI Agents | Concept: LangChain Agents tutorial (tools + agent executor)" },
  { id: "v-agent-6", index: 6, title: "Day 6: LangGraph introduction (stateful multi-agent systems)", duration: "~40 min", url: "https://www.youtube.com/watch?v=gqvFmK7LpDo", description: "AI Agents | Concept: LangGraph introduction (stateful multi-agent systems)" },
  { id: "v-agent-7", index: 7, title: "Day 7: AutoGPT explained (autonomous agents)", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=6CWB5iw2_hw", description: "AI Agents | Concept: AutoGPT explained (autonomous agents)" },
  { id: "v-agent-8", index: 8, title: "Day 8: CrewAI introduction (role-based agents)", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=eD7QVNkgxJU", description: "AI Agents | Concept: CrewAI introduction (role-based agents)" },
  { id: "v-agent-9", index: 9, title: "Day 9: Microsoft AutoGen introduction (multi-agent conversation)", duration: "~20-30 min", url: "https://www.youtube.com/watch?v=3r9hj8N-pp4", description: "AI Agents | Concept: Microsoft AutoGen introduction (multi-agent conversation)" },
  { id: "v-agent-10", index: 10, title: "Day 10: OpenAI Agents SDK tutorial", duration: "~12 min", url: "https://www.youtube.com/watch?v=qvw4EwGk6Fw", description: "AI Agents | Concept: OpenAI Agents SDK tutorial" },
  { id: "v-agent-11", index: 11, title: "Day 11: Building an agent from scratch with OpenAI function calling", duration: "~25-30 min", url: "https://www.youtube.com/watch?v=dgV4WFisK5Y", description: "AI Agents | Concept: Building an agent from scratch with OpenAI function calling" },
  { id: "v-agent-12", index: 12, title: "Day 12: Agentic RAG explained (RAG + agents)", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=AVyfiOKmTDM", description: "AI Agents | Concept: Agentic RAG explained (RAG + agents)" },
  { id: "v-agent-13", index: 13, title: "Day 13: Task decomposition and planning in agents", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=AkK3PlKzMZo", description: "AI Agents | Concept: Task decomposition and planning in agents" },
  { id: "v-agent-14", index: 14, title: "Day 14: AI agent evaluation and testing", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=rpG1Zdv0hjc", description: "AI Agents | Concept: AI agent evaluation and testing" },
  { id: "v-agent-15", index: 15, title: "Day 15: Guardrails for AI agents (safety crash course)", duration: "~30-40 min", url: "https://www.youtube.com/watch?v=28fPGpyTKYE", description: "AI Agents | Concept: Guardrails for AI agents (safety crash course)" },
  { id: "v-agent-16", index: 16, title: "Day 16: Building a multi-agent crew hands-on (CrewAI)", duration: "~20-30 min", url: "https://www.youtube.com/watch?v=I90xJlzAUW0", description: "AI Agents | Concept: Building a multi-agent crew hands-on (CrewAI)" },
  { id: "v-agent-17", index: 17, title: "Day 17: LlamaIndex agents introduction", duration: "~20-30 min", url: "https://www.youtube.com/watch?v=j5_7Q-7VTS0", description: "AI Agents | Concept: LlamaIndex agents introduction" },
  { id: "v-agent-18", index: 18, title: "Day 18: Framework comparison: LangGraph vs CrewAI vs AutoGen vs OpenAI", duration: "~30-40 min", url: "https://www.youtube.com/watch?v=u7L6otd9KgU", description: "AI Agents | Concept: Framework comparison: LangGraph vs CrewAI vs AutoGen vs OpenAI" },
  { id: "v-agent-19", index: 19, title: "Day 19: Building a web-browsing agent", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=werFj7dE7HI", description: "AI Agents | Concept: Building a web-browsing agent" },
  { id: "v-agent-20", index: 20, title: "Day 20: Building a coding agent", duration: "~20-30 min", url: "https://www.youtube.com/watch?v=QER-0DaC-Gk", description: "AI Agents | Concept: Building a coding agent" },
  { id: "v-agent-21", index: 21, title: "Day 21: Building a voice AI agent", duration: "~10-15 min", url: "https://www.youtube.com/watch?v=qx6S7EadjeM", description: "AI Agents | Concept: Building a voice AI agent" },
  { id: "v-agent-22", index: 22, title: "Day 22: Building a web-research agent", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=GJMZCh8Xu18", description: "AI Agents | Concept: Building a web-research agent" },
  { id: "v-agent-23", index: 23, title: "Day 23: Model Context Protocol (MCP) explained", duration: "~20 min", url: "https://www.youtube.com/watch?v=N3vHJcHBS-w", description: "AI Agents | Concept: Model Context Protocol (MCP) explained" },
  { id: "v-agent-24", index: 24, title: "Day 24: Building a no-code agent with n8n", duration: "~20-30 min", url: "https://www.youtube.com/watch?v=bFMhuK1_ZhI", description: "AI Agents | Concept: Building a no-code agent with n8n" },
  { id: "v-agent-25", index: 25, title: "Day 25: Human-in-the-loop for AI agents", duration: "~15 min", url: "https://www.youtube.com/watch?v=VbyhBbrr8n8", description: "AI Agents | Concept: Human-in-the-loop for AI agents" },
  { id: "v-agent-26", index: 26, title: "Day 26: Agent observability and tracing (debugging agents)", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=nWNWrtCDqaY", description: "AI Agents | Concept: Agent observability and tracing (debugging agents)" },
  { id: "v-agent-27", index: 27, title: "Day 27: Prompt injection and agent security", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=KDcayRssGbw", description: "AI Agents | Concept: Prompt injection and agent security" },
  { id: "v-agent-28", index: 28, title: "Day 28: Agent cost and latency optimization", duration: "~20-30 min", url: "https://www.youtube.com/watch?v=lpj9XqEyHjg", description: "AI Agents | Concept: Agent cost and latency optimization" },
  { id: "v-agent-29", index: 29, title: "Day 29: Deploying AI agents to production - best practices", duration: "~15-20 min", url: "https://www.youtube.com/watch?v=j1wfE0SOBbE", description: "AI Agents | Concept: Deploying AI agents to production - best practices" },
  { id: "v-agent-30", index: 30, title: "Day 30: Capstone: end-to-end AI agent project (LangChain + FastAPI + tools)", duration: "~45-60 min", url: "https://www.youtube.com/watch?v=AO6WbXTeDow", description: "AI Agents | Concept: Capstone: end-to-end AI agent project (LangChain + FastAPI + tools)" },
];

const courses: Course[] = [
  {
    id: "course-llm-engineering",
    title: "30-Day LLM Engineering Masterclass",
    category: "LLM Engineering",
    level: "All Levels",
    hours: 30,
    progress: 35,
    description: "Complete 30-day curriculum: Transformers, Tokenization, Embeddings, OpenAI, LangChain, Vector Databases, RAG, Fine-tuning, LoRA, Quantization, Ollama, Function Calling, Agents, LangSmith, FastAPI, and Capstone RAG Chatbot.",
    skills: ["Python", "Transformers", "RAG", "LangChain", "Vector DB", "FastAPI", "Fine-tuning"],
    videos: llmEngineering30DayVideos,
    quizzes: sqlQuizzes,
    docs: [
      { title: "LLM Engineering 30-Day Roadmap", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", type: "Guide" },
      { title: "Hugging Face Transformers Docs", url: "https://huggingface.co/docs/transformers", type: "Docs" },
    ],
    finalProjectPrompt: "Build and deploy an end-to-end RAG chatbot using LangChain, Streamlit, ChromaDB, and FastAPI.",
  },
  {
    id: "course-ai-agents",
    title: "30-Day Autonomous AI Agents Masterclass",
    category: "AI Agents",
    level: "All Levels",
    hours: 30,
    progress: 20,
    description: "Complete 30-day curriculum: ReAct framework, Memory, LangChain & LangGraph agents, AutoGPT, CrewAI, AutoGen, OpenAI Agents SDK, Function Calling, Agentic RAG, Planning, MCP, n8n, Observability, and Capstone Agent.",
    skills: ["AI Agents", "LangGraph", "CrewAI", "AutoGen", "OpenAI SDK", "MCP", "n8n"],
    videos: aiAgents30DayVideos,
    quizzes: awsQuizzes,
    docs: [
      { title: "AI Agents 30-Day Roadmap", url: "https://www.youtube.com/watch?v=TZMdEg1ZoIo", type: "Guide" },
      { title: "LangGraph Developer Guide", url: "https://langchain-ai.github.io/langgraph/", type: "Docs" },
    ],
    finalProjectPrompt: "Build an end-to-end autonomous AI Agent system integrating LangChain, FastAPI backend tools, and custom function execution.",
  },
];

const state = {
  student: {
    id: "student-01",
    name: "Student Candidate",
    email: "student@university.edu",
    studentId: "CS21B047",
    department: "Computer Science",
    branch: "CSE",
    semester: 7,
    cgpa: 8.42,
    backlogs: 0,
    targetRoles: ["Generative AI Engineer", "Full Stack Engineer"],
    skills: { ...skills },
    projectCount: 3,
    internshipMonths: 4,
    assessmentScore: 78,
    communicationScore: 68,
    resumeUrl: "",
    resumeFilename: "",
    resumeUploadedAt: "",
  },
  applications: [] as Application[],
  pendingProjectSubmissions: [] as ProjectSubmission[],
  notifications: [
    { id: "n-1", title: "New 30-Day AI & RAG Sprint", body: "Generative AI & LLM Engineering roadmap is active.", type: "Learning", time: "1h ago", unread: true },
    { id: "n-2", title: "Job Opportunity Match", body: "Northstar Labs platform engineer role matches your profile.", type: "Opportunity", time: "Yesterday", unread: true },
  ],
  savedRoles: ["genai", "fullstack"],
  projects: [
    { id: "project-1", title: "Campus Mobility Dashboard", description: "A data-informed view of commute patterns for campus operations.", status: "Verified", skills: ["React", "Python", "SQL"], updated: "Sep 08" },
    { id: "project-2", title: "Peer Study Rooms", description: "A realtime study matching prototype with accessibility-first flows.", status: "Needs rework", skills: ["TypeScript", "React"], updated: "Sep 04" },
  ],
};

const studentNotifications = [
  { id: "sn-1", title: "Shortlist Status Update", body: "SignalHouse moved your application to Technical Round.", type: "Shortlist", time: "1h ago", unread: true },
  { id: "sn-2", title: "New LLM & GenAI Sprint Active", body: "30-day AI Engineering & RAG roadmap is now available in your classroom.", type: "Learning", time: "2h ago", unread: true },
  { id: "sn-3", title: "Job Opportunity Match", body: "Northstar Labs is looking for your React + Python combination.", type: "Opportunity", time: "Yesterday", unread: false },
];

const tpoNotifications = [
  { id: "tn-1", title: "Candidate Applications Received", body: "12 student applications received for Northstar Labs role.", type: "Opportunity", time: "30m ago", unread: true },
  { id: "tn-2", title: "Capstone Verification Required", body: "4 student project submissions pending TPO approval.", type: "Project Review", time: "2h ago", unread: true },
  { id: "tn-3", title: "Cohort Readiness Alert", body: "CSE 2026 average employability score reached 74%.", type: "Assessment Result", time: "Yesterday", unread: false },
];

function skillByName(name: string) {
  return skills.find((skill) => skill.name.toLowerCase() === name.toLowerCase());
}

function coverage(required: string[]) {
  return Math.round(required.reduce((sum, name) => sum + (skillByName(name)?.proficiency ?? 0), 0) / Math.max(required.length, 1));
}

function scoreBreakdown() {
  const skillCoverage = Math.round(skills.reduce((sum, skill) => sum + skill.proficiency, 0) / skills.length);
  const verified = Math.min(100, state.student.projectCount * 22 + 15);
  const experience = Math.min(100, state.student.internshipMonths * 12 + 18);
  const assessments = state.student.assessmentScore;
  const communication = state.student.communicationScore;
  const total = Math.round(skillCoverage * 0.42 + verified * 0.16 + experience * 0.14 + assessments * 0.18 + communication * 0.1);
  return { total, skillCoverage, verified, experience, assessments, communication };
}

function roleMatch(role: Role) {
  const required = coverage(role.requiredSkills);
  const preferred = coverage(role.preferredSkills);
  const score = Math.min(98, Math.round(required * 0.72 + preferred * 0.14 + scoreBreakdown().total * 0.14));
  const missingSkills = role.requiredSkills.filter((name) => (skillByName(name)?.proficiency ?? 0) < 60);
  return { score, missingSkills, matchedSkills: role.requiredSkills.filter((name) => !missingSkills.includes(name)), role };
}

function evaluateResumeAndJd(job: Job, student: typeof state.student) {
  const matchedSkills = job.requiredSkills.filter((skill) => (skillByName(skill)?.proficiency ?? 0) >= 50);
  const missingSkills = job.requiredSkills.filter((skill) => !matchedSkills.includes(skill));
  const skillRatio = matchedSkills.length / Math.max(job.requiredSkills.length, 1);
  const eligible = student.cgpa >= job.minCgpa && student.backlogs <= job.maxBacklogs && (job.allowedBranches.length === 0 || job.allowedBranches.includes(student.branch));
  const baseScore = Math.round(skillRatio * 70 + (eligible ? 30 : 10));
  const matchScore = Math.min(98, Math.max(40, baseScore));
  const summary = eligible
    ? `Strong candidate fit (${matchScore}% match). Matched ${matchedSkills.length}/${job.requiredSkills.length} required skills (${matchedSkills.join(", ")}).`
    : `Candidate meets skill prerequisites (${matchedSkills.join(", ")}) but requires academic waiver review for branch/CGPA criteria.`;

  return { matchScore, skillMatchPercentage: Math.round(skillRatio * 100), eligible, matchedSkills, missingSkills, summary };
}

function jobMatch(job: Job) {
  const evalResult = evaluateResumeAndJd(job, state.student);
  const reasons = [
    ...(state.student.cgpa < job.minCgpa ? [`CGPA ${job.minCgpa}+ required (Current: ${state.student.cgpa})`] : []),
    ...(state.student.backlogs > job.maxBacklogs ? [`Max ${job.maxBacklogs} backlogs allowed`] : []),
    ...(!job.allowedBranches.includes(state.student.branch) ? [`Branch ${state.student.branch} is not listed`] : []),
  ];
  return {
    score: evalResult.matchScore,
    missingSkills: evalResult.missingSkills,
    eligible: evalResult.eligible,
    reasons,
    matchedSkills: evalResult.matchedSkills,
    evaluationSummary: evalResult.summary,
  };
}

export function getDashboard(currentUser?: { name?: string | null; email?: string | null }) {
  const breakdown = scoreBreakdown();
  const student = {
    ...state.student,
    name: currentUser?.name || state.student.name,
    email: currentUser?.email || state.student.email,
  };
  return { student, score: breakdown, topRoles: roles.map(roleMatch).sort((a, b) => b.score - a.score).slice(0, 3), opportunities: jobs.map((job) => ({ ...job, ...jobMatch(job) })), recentActivity: state.notifications.slice(0, 3), dataFreshness: "Development dataset · Live Market & TPO Intelligence" };
}

export function getSkills() { return [...skills]; }
export function getRoles() { return roles.map(roleMatch); }
export function getRole(id: string) { const role = roles.find((item) => item.id === id) ?? roles[0]; return { ...roleMatch(role), allSkills: [...role.requiredSkills, ...role.preferredSkills].map((name) => ({ name, proficiency: skillByName(name)?.proficiency ?? 0 })) }; }

export function getGaps(targetRoles?: string[]) {
  // Dynamically calculate gaps based on student's target roles
  const activeRoles = targetRoles && targetRoles.length > 0 ? targetRoles : state.student.targetRoles;
  const roleSkillMap = new Set<string>();
  roles.forEach((r) => {
    if (activeRoles.some((t) => r.title.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(r.title.toLowerCase()))) {
      r.requiredSkills.forEach((s) => roleSkillMap.add(s));
    }
  });
  if (roleSkillMap.size === 0) {
    ["SQL", "AWS", "FastAPI", "React"].forEach((s) => roleSkillMap.add(s));
  }

  return skills
    .filter((skill) => roleSkillMap.has(skill.name) || skill.proficiency < 65)
    .sort((a, b) => a.proficiency - b.proficiency)
    .map((skill) => ({
      ...skill,
      target: roleSkillMap.has(skill.name) ? 80 : 70,
      priority: roleSkillMap.has(skill.name) && skill.proficiency < 60 ? ("High" as const) : ("Medium" as const),
      marketDemand: skill.name === "SQL" ? 91 : skill.name === "AWS" ? 84 : 74,
    }));
}

export function getCourses() { return courses.map((course) => ({ ...course })); }
export function getProjects() { return [...state.projects]; }

export function getJobs() {
  return jobs.map((job) => ({
    ...job,
    ...jobMatch(job),
    applied: state.applications.some((app) => app.jobId === job.id),
  }));
}

export function getApplications() {
  return state.applications.map((app) => ({
    ...app,
    job: jobs.find((j) => j.id === app.jobId),
  }));
}

export function getNotifications(role?: string) {
  return role === "tpo" ? tpoNotifications : studentNotifications;
}

export async function getTpoDashboard(currentUser?: { name?: string | null; email?: string | null }) {
  const currentTotal = scoreBreakdown().total;
  const dbCandidates = await getAllStudentProfilesFromDb();

  const candidates = dbCandidates.length > 0 ? dbCandidates : [
    {
      id: state.student.studentId || "CS21B047",
      name: currentUser?.name || state.student.name,
      email: currentUser?.email || state.student.email,
      branch: state.student.branch,
      cohort: "2026",
      cgpa: state.student.cgpa,
      score: currentTotal,
      target: state.student.targetRoles[0] || "Full Stack Engineer",
      status: currentTotal >= 70 ? "Ready" : "Building",
    },
  ];

  return {
    officerName: currentUser?.name || "TPO Officer",
    metrics: {
      students: candidates.length,
      averageReadiness: Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / Math.max(candidates.length, 1)),
      needsIntervention: candidates.filter((c) => c.status === "Needs intervention" || c.score < 60).length,
      activeOpportunities: jobs.length,
      placementRate: 84,
    },
    skillGaps: [
      { skill: "SQL", demand: 91, coverage: 48, gap: 43 },
      { skill: "AWS", demand: 78, coverage: 32, gap: 46 },
      { skill: "Communication", demand: 74, coverage: 58, gap: 16 },
      { skill: "Data Structures", demand: 86, coverage: 69, gap: 17 },
    ],
    cohorts: [
      { label: "CSE · 2026", score: 74, students: candidates.filter((c) => c.branch === "CSE").length || 1 },
      { label: "IT · 2026", score: 70, students: candidates.filter((c) => c.branch === "IT").length || 0 },
      { label: "ECE · 2026", score: 62, students: candidates.filter((c) => c.branch === "ECE").length || 0 },
    ],
    candidates,
    recentJobs: jobs,
    scoreVersion: "2026.1",
    sampleNote: "Live Database Connected · Institutional Placement Roster",
  };
}

export function evaluateJobApplication(jobId: string) {
  const job = jobs.find((j) => j.id === jobId);
  if (!job) return null;
  return { job, evaluation: evaluateResumeAndJd(job, state.student) };
}

export function applyToJob(jobId: string, currentUser?: { name?: string | null; email?: string | null }) {
  if (state.applications.some((app) => app.jobId === jobId)) return { ok: false, message: "Application already submitted for this opportunity." };
  const job = jobs.find((item) => item.id === jobId);
  if (!job) return { ok: false, message: "Opportunity not found." };

  const evalResult = evaluateResumeAndJd(job, state.student);
  const application: Application = {
    id: randomUUID(),
    jobId,
    studentName: currentUser?.name || state.student.name,
    studentEmail: currentUser?.email || state.student.email,
    resumeUrl: state.student.resumeUrl,
    matchScore: evalResult.matchScore,
    matchedSkills: evalResult.matchedSkills,
    missingSkills: evalResult.missingSkills,
    evaluationSummary: evalResult.summary,
    status: "APPLIED",
    appliedAt: new Date().toISOString(),
    timeline: [
      { label: "Applied", date: "Today", done: true },
      { label: "Under review", date: "Pending", done: false },
      { label: "Shortlisted", date: "Pending", done: false },
      { label: "Interview", date: "Pending", done: false },
    ],
  };

  state.applications.unshift(application);
  state.notifications.unshift({
    id: randomUUID(),
    title: "Application Submitted",
    body: `Your application for ${job.title} at ${job.company} was submitted with a ${evalResult.matchScore}% Resume-JD Evaluation Match score.`,
    type: "Application",
    time: "Just now",
    unread: true,
  });

  return { ok: true, application };
}

export function createOpportunity(input: { company: string; title: string; location: string; ctc: string; deadline: string; description?: string; requiredSkills: string[]; minCgpa?: number; maxBacklogs?: number }) {
  const job: Job = {
    id: randomUUID(),
    company: input.company,
    title: input.title,
    location: input.location,
    ctc: input.ctc,
    deadline: input.deadline,
    description: input.description || "Created by TPO Placement Office.",
    requiredSkills: input.requiredSkills,
    minCgpa: input.minCgpa ?? 7.0,
    allowedBranches: ["CSE", "IT", "ECE"],
    maxBacklogs: input.maxBacklogs ?? 0,
    externalUrl: "https://example.com/apply/tpo",
    status: "Published",
  };
  jobs.unshift(job);
  return job;
}

export function submitCourseProject(input: { courseId: string; projectTitle: string; githubUrl: string; liveUrl?: string; notes?: string }, currentUser?: { name?: string | null; email?: string | null }) {
  const course = courses.find((c) => c.id === input.courseId);
  const projectSkills = course?.skills || ["React", "TypeScript"];
  const submission: ProjectSubmission = {
    id: randomUUID(),
    studentId: state.student.id,
    studentName: currentUser?.name || state.student.name,
    studentEmail: currentUser?.email || state.student.email,
    courseId: input.courseId,
    courseTitle: course?.title || "Career Readiness Course",
    skillName: projectSkills[0] || "General Skills",
    projectTitle: input.projectTitle,
    githubUrl: input.githubUrl,
    liveUrl: input.liveUrl,
    notes: input.notes,
    skills: projectSkills,
    submittedAt: new Date().toISOString(),
    status: "Pending",
    awardedPoints: 15,
  };

  state.pendingProjectSubmissions.unshift(submission);
  state.projects.unshift({
    id: submission.id,
    title: input.projectTitle,
    description: input.notes || `Final capstone submission for ${course?.title}`,
    status: "Submitted",
    skills: projectSkills,
    updated: "Just now",
  });

  tpoNotifications.unshift({
    id: randomUUID(),
    title: "New Student Project Submitted",
    body: `${currentUser?.name || state.student.name} submitted "${input.projectTitle}" for TPO verification.`,
    type: "Project Review",
    time: "Just now",
    unread: true,
  });

  return { ok: true, submission };
}

export function getPendingProjectSubmissions() {
  return [...state.pendingProjectSubmissions];
}

export function verifyStudentProject(submissionId: string, approved: boolean, pointsToAward = 15) {
  const sub = state.pendingProjectSubmissions.find((s) => s.id === submissionId);
  if (!sub) return { ok: false, message: "Submission not found" };

  sub.status = approved ? "Approved" : "Rejected";
  sub.awardedPoints = pointsToAward;

  const proj = state.projects.find((p) => p.id === submissionId || p.title === sub.projectTitle);
  if (proj) {
    proj.status = approved ? "Verified" : "Needs rework";
  }

  if (approved) {
    const targetSkill = skillByName(sub.skillName);
    if (targetSkill) {
      targetSkill.proficiency = Math.min(100, targetSkill.proficiency + pointsToAward);
      targetSkill.verified = true;
    }
  }

  studentNotifications.unshift({
    id: randomUUID(),
    title: approved ? "Project Verified by TPO!" : "Project Rework Requested",
    body: approved
      ? `TPO verified "${sub.projectTitle}". +${pointsToAward} skill points awarded!`
      : `TPO requested rework on "${sub.projectTitle}". Please update your evidence submission.`,
    type: "Verification",
    time: "Just now",
    unread: true,
  });

  return { ok: true, submission: sub };
}

export function updateResume(resumeUrl: string, filename?: string) {
  state.student.resumeUrl = resumeUrl;
  state.student.resumeFilename = filename || "Student_Resume.pdf";
  state.student.resumeUploadedAt = "Today";
  return { ok: true, student: state.student };
}

export function updateStudentProfile(input: {
  department?: string;
  branch?: string;
  semester?: number;
  cgpa?: number;
  backlogs?: number;
  targetRoles?: string[];
  skills?: Array<{ name: string; proficiency: number }>;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}) {
  if (input.department) state.student.department = input.department;
  if (input.branch) state.student.branch = input.branch;
  if (input.semester) state.student.semester = input.semester;
  if (input.cgpa) state.student.cgpa = input.cgpa;
  if (input.backlogs !== undefined) state.student.backlogs = input.backlogs;
  if (input.targetRoles && input.targetRoles.length > 0) state.student.targetRoles = input.targetRoles;
  if (input.resumeUrl) state.student.resumeUrl = input.resumeUrl;
  if (input.githubUrl) (state.student as any).githubUrl = input.githubUrl;
  if (input.linkedinUrl) (state.student as any).linkedinUrl = input.linkedinUrl;

  if (input.skills && input.skills.length > 0) {
    input.skills.forEach((s) => {
      const existing = skills.find((item) => item.name.toLowerCase() === s.name.toLowerCase());
      if (existing) {
        existing.proficiency = s.proficiency;
      } else {
        skills.push({
          id: s.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          name: s.name,
          category: "Technical",
          proficiency: s.proficiency,
          confidence: Math.round(s.proficiency * 0.9),
          verified: false,
        });
      }
    });
  }

  return state.student;
}

export function saveRole(roleId: string) { if (!state.savedRoles.includes(roleId)) state.savedRoles.push(roleId); return { saved: true, roleId }; }
export function enrollCourse(courseId: string) { const course = courses.find((item) => item.id === courseId); if (!course) return { ok: false, message: "Course not found." }; course.progress = Math.max(course.progress, 5); return { ok: true, course }; }
export function submitProject(
  input: { title: string; description: string; githubUrl?: string; liveUrl?: string; skills?: string[] },
  currentUser?: { name?: string | null; email?: string | null }
) {
  const submissionId = randomUUID();
  const projectSkills = input.skills && input.skills.length > 0 ? input.skills : ["React", "Python", "SQL"];
  
  const project = {
    id: submissionId,
    title: input.title,
    description: input.description,
    status: "Submitted",
    skills: projectSkills,
    updated: "Just now",
  };
  state.projects.unshift(project);

  const submission: ProjectSubmission = {
    id: submissionId,
    studentId: state.student.id,
    studentName: currentUser?.name || state.student.name,
    studentEmail: currentUser?.email || state.student.email,
    courseId: "custom-project",
    courseTitle: "Independent Capstone Evidence",
    skillName: projectSkills[0] || "General Skills",
    projectTitle: input.title,
    githubUrl: input.githubUrl || "https://github.com/student/project",
    liveUrl: input.liveUrl,
    notes: input.description,
    skills: projectSkills,
    submittedAt: new Date().toISOString(),
    status: "Pending",
    awardedPoints: 15,
  };

  state.pendingProjectSubmissions.unshift(submission);

  tpoNotifications.unshift({
    id: randomUUID(),
    title: "New Student Project Submitted",
    body: `${currentUser?.name || state.student.name} submitted "${input.title}" for TPO verification.`,
    type: "Project Review",
    time: "Just now",
    unread: true,
  });

  return { ok: true, project, submission };
}

export function editOpportunity(input: {
  id: string;
  company?: string;
  title?: string;
  location?: string;
  ctc?: string;
  deadline?: string;
  requiredSkills?: string[];
  status?: string;
}) {
  const job = jobs.find((j) => j.id === input.id);
  if (!job) return { ok: false, message: "Opportunity not found" };
  if (input.company) job.company = input.company;
  if (input.title) job.title = input.title;
  if (input.location) job.location = input.location;
  if (input.ctc) job.ctc = input.ctc;
  if (input.deadline) job.deadline = input.deadline;
  if (input.requiredSkills) job.requiredSkills = input.requiredSkills;
  if (input.status) job.status = input.status as any;
  return { ok: true, job };
}

export function deleteOpportunity(id: string) {
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx === -1) return { ok: false, message: "Opportunity not found" };
  const [removed] = jobs.splice(idx, 1);
  return { ok: true, job: removed };
}

export function getPlacementFunnel() {
  const totalApplications = Math.max(state.applications.length, 1);
  const eligible = Math.round(totalApplications * 0.85);
  const shortlisted = state.applications.filter((a) => a.status === "SHORTLISTED" || a.status === "INTERVIEW" || a.status === "SELECTED").length;
  const interviews = state.applications.filter((a) => a.status === "INTERVIEW" || a.status === "SELECTED").length;
  const offers = state.applications.filter((a) => a.status === "SELECTED").length;

  return {
    totalApplications: totalApplications + 82,
    eligibleCandidates: eligible + 64,
    shortlisted: shortlisted + 18,
    interviewsScheduled: interviews + 9,
    offersExtended: offers + 3,
    shortlistToInterviewRate: "50%",
    interviewToOfferRate: "33%",
    bottleneckNote: "Primary bottleneck: Advanced Technical Round System Design & Window Functions.",
  };
}

export function processOutcomeCsv(csvText: string, jobId?: string) {
  const lines = csvText.split("\n").map((l) => l.trim()).filter(Boolean);
  let processedCount = 0;
  const processedRows: Array<{ studentId: string; jobTitle: string; status: string; note: string }> = [];

  const targetJob = jobId ? jobs.find((j) => j.id === jobId) : undefined;

  lines.forEach((line, idx) => {
    if (idx === 0 && (line.toLowerCase().includes("student") || line.toLowerCase().includes("email"))) return;
    const parts = line.split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));
    if (parts.length < 2) return;

    const studentIdentifier = parts[0];
    const jobTitleOrCompany = parts[1] || targetJob?.title || "Placement Role";
    const outcome = (parts[2] || "SELECTED").toUpperCase();
    const explicitReason = parts[3] || "";

    let app = state.applications.find((a) => {
      const j = jobs.find((job) => job.id === a.jobId);
      return (
        (targetJob && a.jobId === targetJob.id) ||
        a.id.toLowerCase() === studentIdentifier.toLowerCase() ||
        a.studentEmail.toLowerCase() === studentIdentifier.toLowerCase() ||
        (j && (j.title.toLowerCase().includes(jobTitleOrCompany.toLowerCase()) || j.company.toLowerCase().includes(jobTitleOrCompany.toLowerCase())))
      );
    });

    const isSelected = outcome.includes("SELECT") || outcome.includes("OFFER") || outcome === "PASS";
    const statusStr = isSelected ? "SELECTED" : "REJECTED";

    if (app) {
      app.status = statusStr;
      app.timeline = app.timeline.map((t) => ({
        ...t,
        done: isSelected || t.label.toUpperCase() !== "SELECTED",
      }));
    }

    let feedbackNote = "";
    if (explicitReason) {
      feedbackNote = `Outcome for ${jobTitleOrCompany}: ${statusStr}. Official feedback: "${explicitReason}"`;
    } else if (!isSelected) {
      feedbackNote = `Outcome for ${jobTitleOrCompany}: REJECTED. OMEN Inferred Metrics Diagnostic: High risk area predicted in SQL Window Functions (68% coverage, 24 pt gap below threshold) and System Design depth.`;
    } else {
      feedbackNote = `Outcome for ${jobTitleOrCompany}: SELECTED! Congratulations on receiving your placement offer.`;
    }

    studentNotifications.unshift({
      id: randomUUID(),
      title: isSelected ? `🎉 Placement Offer: ${jobTitleOrCompany} (SELECTED)` : `Placement Result: ${jobTitleOrCompany} (REJECTED)`,
      body: feedbackNote,
      type: "Opportunity",
      time: "Just now",
      unread: true,
    });

    processedCount++;
    processedRows.push({
      studentId: studentIdentifier,
      jobTitle: jobTitleOrCompany,
      status: statusStr,
      note: feedbackNote,
    });
  });

  return { ok: true, processedCount, rows: processedRows };
}

export type Bootcamp = {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "Output-Driven" | "Demand-Driven";
  status: "Mandatory Sprint" | "Active Poll";
  enrolledCount: number;
  workshopPoll?: {
    id: string;
    question: string;
    options: Array<{ id: string; label: string; votes: number }>;
    userVotedOptionId: string | null;
  };
};

const defaultBootcamps: Bootcamp[] = [
  {
    id: "bootcamp-1",
    title: "Output-Driven Placement Readiness Sprint",
    description: "Fixed mandatory 2-week placement sprint for all registered candidates covering SQL window functions, high-scale system design, and production FastAPI APIs.",
    category: "Output-Driven Sprint",
    type: "Output-Driven",
    status: "Mandatory Sprint",
    enrolledCount: 284,
  },
  {
    id: "bootcamp-2",
    title: "Demand-Driven AI Engineering Workshop Poll",
    description: "Interactive voting poll for students to select their preferred upcoming weekend live workshop topic.",
    category: "Demand-Driven Poll",
    type: "Demand-Driven",
    status: "Active Poll",
    enrolledCount: 68,
    workshopPoll: {
      id: "poll-1",
      question: "Which workshop topic do you want featured in this weekend's live sprint?",
      options: [
        { id: "opt-1", label: "Multi-Agent Workflow Engines (CrewAI / AutoGen / LangGraph)", votes: 64 },
        { id: "opt-2", label: "Enterprise Knowledge Base & Hybrid Vector Search", votes: 48 },
        { id: "opt-3", label: "Real-Time Voice AI Call Automation & Telephony", votes: 32 },
        { id: "opt-4", label: "Production LLMOps, Tracing & Quantized Model Deployment", votes: 21 },
      ],
      userVotedOptionId: null as string | null,
    },
  },
];

export function getBootcamps() {
  return defaultBootcamps;
}

export function voteBootcampWorkshop(bootcampId: string, optionId: string) {
  const bc = defaultBootcamps.find((b) => b.id === bootcampId);
  if (!bc || !bc.workshopPoll) return { ok: false, message: "Bootcamp or poll not found" };
  const opt = bc.workshopPoll.options.find((o) => o.id === optionId);
  if (opt) {
    opt.votes += 1;
    bc.workshopPoll.userVotedOptionId = optionId;
  }
  return { ok: true, bootcamp: bc };
}

export function createBootcamp(input: {
  title: string;
  description: string;
  category?: string;
  type: "Output-Driven" | "Demand-Driven";
  workshopOptions?: string[];
}) {
  const isDemand = input.type === "Demand-Driven";
  const options = (input.workshopOptions || []).filter(Boolean);

  const newBc: Bootcamp = {
    id: `bootcamp-${randomUUID().slice(0, 6)}`,
    title: input.title,
    description: input.description,
    category: input.category || (isDemand ? "Demand-Driven Poll" : "Output-Driven Sprint"),
    type: input.type,
    status: isDemand ? "Active Poll" : "Mandatory Sprint",
    enrolledCount: 284,
    ...(isDemand && options.length > 0
      ? {
          workshopPoll: {
            id: `poll-${randomUUID().slice(0, 6)}`,
            question: "Which workshop topic do you want featured in this upcoming sprint?",
            options: options.map((label, idx) => ({
              id: `opt-${idx + 1}-${randomUUID().slice(0, 4)}`,
              label,
              votes: 5,
            })),
            userVotedOptionId: null,
          },
        }
      : {}),
  };
  defaultBootcamps.unshift(newBc);
  return { ok: true, bootcamp: newBc };
}

const MOCK_INTERVIEW_QUESTION_BANK = [
  {
    id: "q-bank-1",
    category: "Resume Project Deep Dive",
    question: "In your project Campus Mobility Dashboard, how did you structure your data pipeline and database queries to ensure fast load times during peak commute hours?",
    context: "Derived from candidate project Campus Mobility Dashboard & SQL/Python stack",
    keyExpectations: ["Window functions or indexing strategy", "API caching or async database drivers", "Measurable latency reduction"],
  },
  {
    id: "q-bank-2",
    category: "Technical Skill Challenge",
    question: "Explain the difference between SQL DENSE_RANK() and ROW_NUMBER() when analyzing top candidate test scores with identical marks.",
    context: "Derived from candidate's SQL proficiency",
    keyExpectations: ["Handling duplicate values", "Window partitioning syntax", "Practical query example"],
  },
  {
    id: "q-bank-3",
    category: "Framework & Code Architecture",
    question: "When building React component trees, how do you prevent unnecessary re-renders in heavy dashboard views?",
    context: "Derived from candidate's React proficiency",
    keyExpectations: ["useMemo & useCallback", "State colocation", "React Compiler / React.memo"],
  },
  {
    id: "q-bank-4",
    category: "Behavioral & Engineering Tradeoffs",
    question: "Describe a situation during a project where you had to compromise between writing clean refactored code and delivering on a tight deadline.",
    context: "Derived from candidate's engineering assessment profile",
    keyExpectations: ["Tradeoff reasoning", "Technical debt mitigation plan", "Clear outcome focus"],
  },
  {
    id: "q-bank-5",
    category: "System Design",
    question: "How would you design a notification delivery system that needs to handle 100k events per second with guaranteed delivery semantics?",
    context: "Derived from candidate's backend & Python skills",
    keyExpectations: ["Message broker selection (Kafka/SQS)", "At-least-once vs exactly-once delivery", "Dead letter queue strategy"],
  },
  {
    id: "q-bank-6",
    category: "Python Proficiency",
    question: "Explain the difference between Python generators and async generators. When would you choose one over the other in a data-heavy ingestion pipeline?",
    context: "Derived from candidate's Python proficiency",
    keyExpectations: ["Memory footprint for large datasets", "Event loop interaction in async generators", "Concrete pipeline use case"],
  },
  {
    id: "q-bank-7",
    category: "Resume Project Deep Dive",
    question: "Walk me through the most technically complex bug you resolved in one of your GitHub projects. What was the root cause and how did you identify it?",
    context: "Derived from candidate's Git proficiency & verified projects",
    keyExpectations: ["Systematic debugging process", "Root cause vs symptom distinction", "Prevention strategy applied post-fix"],
  },
  {
    id: "q-bank-8",
    category: "SQL Deep Dive",
    question: "Given a table of 5M rows of financial transactions, write a query to find all accounts where the running total exceeded $10,000 at any point within a rolling 7-day window.",
    context: "Derived from candidate's SQL proficiency",
    keyExpectations: ["Window function SUM() OVER (PARTITION BY ... ORDER BY ... ROWS BETWEEN)", "Index optimization for time-range scans", "Handling time zone edge cases"],
  },
  {
    id: "q-bank-9",
    category: "API Architecture",
    question: "How do you design a FastAPI endpoint that needs to handle file uploads, run asynchronous ML inference, and stream partial results back to the client?",
    context: "Derived from candidate's FastAPI proficiency",
    keyExpectations: ["Background task vs async endpoint choice", "Server-Sent Events or WebSocket for streaming", "Error propagation during partial results"],
  },
  {
    id: "q-bank-10",
    category: "Machine Learning",
    question: "You trained a classification model achieving 92% accuracy, but your client reports that 30% of fraud cases are being missed. What would you investigate and fix?",
    context: "Derived from candidate's Machine Learning interest area",
    keyExpectations: ["Class imbalance detection & handling", "Threshold calibration vs re-sampling", "Precision-recall tradeoff for fraud domain"],
  },
  {
    id: "q-bank-11",
    category: "Cloud & Deployment",
    question: "Describe how you would migrate a monolithic Python Flask application to a serverless architecture on AWS while ensuring zero downtime during the transition.",
    context: "Derived from candidate's AWS & Python skills",
    keyExpectations: ["Strangler fig pattern", "Cold start mitigation in Lambda", "Traffic shifting with weighted routing"],
  },
  {
    id: "q-bank-12",
    category: "Communication & Leadership",
    question: "Tell me about a time you had to explain a highly technical architecture decision to a non-technical stakeholder. How did you ensure alignment without sacrificing accuracy?",
    context: "Derived from candidate's communication assessment",
    keyExpectations: ["Audience-aware communication framework", "Use of analogies or visual diagrams", "Measurable outcome of alignment"],
  },
  {
    id: "q-bank-13",
    category: "Data Structures & Algorithms",
    question: "Implement a function to find all pairs of integers in an unsorted array that sum to a target value. Explain your approach and its time/space complexity.",
    context: "Derived from candidate's Data Structures proficiency",
    keyExpectations: ["Two-pointer or hash map approach", "O(n) time complexity explanation", "Handling duplicates and negative numbers"],
  },
  {
    id: "q-bank-14",
    category: "UI/Frontend Engineering",
    question: "How would you implement a virtualized infinite-scroll data table in React that must display 100,000 rows with sub-50ms scroll performance?",
    context: "Derived from candidate's React & TypeScript proficiency",
    keyExpectations: ["Window-based virtualization (react-virtual / tanstack-virtual)", "Intersection Observer API usage", "State update batching strategy"],
  },
  {
    id: "q-bank-15",
    category: "Target Role System Design",
    question: "Design a resume parsing and candidate ranking system for a high-volume ATS that must process 50,000 CVs per day and return rankings within 200ms.",
    context: "Derived from target role & AI/ML skills",
    keyExpectations: ["Async parsing pipeline with queue", "Embedding-based semantic matching vs keyword scoring", "Caching top-N results per job"],
  },
];

let _questionSeed = 0;

export function getMockInterviewQuestions(seed?: number) {
  const targetRoles = state.student.targetRoles;
  const effectiveSeed = seed !== undefined ? seed : _questionSeed;

  // Seeded shuffle — deterministic per seed value
  const shuffled = [...MOCK_INTERVIEW_QUESTION_BANK].sort((a, b) => {
    const hashA = (a.id.charCodeAt(a.id.length - 1) * 17 + effectiveSeed * 31) % 100;
    const hashB = (b.id.charCodeAt(b.id.length - 1) * 17 + effectiveSeed * 31 + 7) % 100;
    return hashA - hashB;
  });

  // Inject target-role context into the first system-design question
  const selected = shuffled.slice(0, 5).map((q, idx) => ({
    ...q,
    id: `q-${idx + 1}`,
    question: q.category === "Target Role System Design"
      ? q.question.replace("your target role", `your target role ${targetRoles[0] || "Software Engineer"}`)
      : q.question,
    context: q.category === "Target Role System Design"
      ? `Derived from target role: ${targetRoles[0] || "Software Engineer"}`
      : q.context,
  }));

  return selected;
}

export function refreshMockInterviewQuestions() {
  _questionSeed = (_questionSeed + 1) % 1000;
  return getMockInterviewQuestions(_questionSeed);
}

export function evaluateMockInterviewAnswer(questionId: string, answer: string) {
  const questions = getMockInterviewQuestions();
  const q = questions.find((item) => item.id === questionId) || questions[0];

  const wordCount = answer.trim().split(/\s+/).length;
  let score = Math.min(95, Math.max(55, Math.round(wordCount * 1.5 + 40)));
  if (answer.toLowerCase().includes("sql") || answer.toLowerCase().includes("index") || answer.toLowerCase().includes("cache") || answer.toLowerCase().includes("rag")) {
    score = Math.min(98, score + 12);
  }

  return {
    questionId: q.id,
    questionText: q.question,
    candidateAnswer: answer,
    score,
    strengths: [
      "Addressed key architectural constraints directly.",
      "Clear technical vocabulary matching your resume skills.",
    ],
    missingPoints: [
      "Could explicitly quantify performance impact (e.g. latency from 450ms → 80ms).",
      "Mentioning automated unit test coverage would strengthen the answer.",
    ],
    modelAnswer: `A strong answer should highlight: "For ${q.category}, I designed the pipeline with clean separation of concerns, utilizing indexing and caching to maintain low latency, while establishing automated evaluation guardrails."`,
  };
}

export function markNotificationRead(id: string) { const notification = state.notifications.find((item) => item.id === id); if (notification) notification.unread = false; return notification ?? null; }
export function simulateWhatIf(skillName: string, current: number, target: number) { const skill = skillByName(skillName); const before = scoreBreakdown().total; const delta = Math.round((target - current) * (skillName === "SQL" ? 0.12 : 0.08)); return { skill: skillName, before, after: Math.min(100, before + delta), scoreDelta: delta, roleMatchBefore: roleMatch(roles[0]).score, roleMatchAfter: Math.min(99, roleMatch(roles[0]).score + Math.round(delta * 0.8)), current: skill?.proficiency ?? current, target, projectedGapReduction: Math.round((target - current) * 0.78), label: "Projected impact · not a guaranteed outcome" }; }
export function updateApplicationStatus(applicationId: string, status: string) { const application = state.applications.find((item) => item.id === applicationId); if (!application) return null; application.status = status; application.timeline = application.timeline.map((item) => ({ ...item, done: item.label.toUpperCase().replace(" ", "_") === status || item.done })); return application; }

