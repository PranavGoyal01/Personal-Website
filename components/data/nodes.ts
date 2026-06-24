export type Category = "center" | "ai" | "quant" | "engineering" | "leadership" | "education";

export interface NodeDetail {
  role?: string;
  org?: string;
  dates?: string;
  bullets?: string[];
  tags?: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  sublabel?: string;
  category: Category;
  detail: NodeDetail;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  center: "#ebebeb",
  ai: "#a78bfa",
  quant: "#34d399",
  engineering: "#60a5fa",
  leadership: "#fb923c",
  education: "#f9a8d4",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  center: "Identity",
  ai: "AI & Research",
  quant: "Quant Finance",
  engineering: "Engineering",
  leadership: "Leadership",
  education: "Education",
};

export const nodes: GraphNode[] = [
  // ── Center ──────────────────────────────────────────────────────────────────
  {
    id: "center",
    label: "Pranav Goyal",
    sublabel: "CS @ Stevens · Quant · Builder",
    category: "center",
    detail: {
      role: "Computer Science Student",
      org: "Stevens Institute of Technology",
      dates: "Sep 2024 – May 2028",
      bullets: [
        "Pinnacle Scholar & Dean's List",
        "Minors in Quantitative Finance and Cybersecurity",
        "Building backend and AI-enabled products focused on reliability and measurable impact",
        "Actively seeking Software Engineering / Applied AI internships",
      ],
      tags: ["Python", "TypeScript", "Flask", "AWS", "LLMs", "System Design"],
    },
  },

  // ── AI & Research branch node ────────────────────────────────────────────
  {
    id: "ai-branch",
    label: "AI & Research",
    category: "ai",
    detail: {
      bullets: ["Reinforcement learning, NLP, market simulation, and AI community building"],
    },
  },
  {
    id: "hanlon",
    label: "Hanlon Financial Center",
    sublabel: "Undergraduate Researcher",
    category: "ai",
    detail: {
      role: "Undergraduate Student Researcher",
      org: "Hanlon Financial Center, Stevens Institute of Technology",
      dates: "May 2025 – Present",
      bullets: [
        "Creating a market simulation in Python populated only with reinforcement learning (RL) agents to mimic real stylized facts",
        "Engineered DQN strategies in Python in a high-frequency trading environment to maximize returns",
      ],
      tags: ["Python", "RL", "DQN", "Market Simulation", "HFT"],
    },
  },
  {
    id: "inspirit",
    label: "Inspirit AI",
    sublabel: "Researcher · AI Developer",
    category: "ai",
    detail: {
      role: "Researcher & AI Developer Trainee",
      org: "Inspirit AI",
      dates: "Apr 2023 – Oct 2024",
      bullets: [
        "Authored a 10-page research paper on how AI capacity to solve the Traveling Salesman Problem is affected by varying training graph sizes — reviewed 10+ papers",
        "Led team to win best presentation amongst 15 groups in NLP + Finance Sentiment Analysis project using logistic regression and LSTM models",
      ],
      tags: ["NLP", "LSTM", "Research", "Sentiment Analysis", "TSP"],
    },
  },
  {
    id: "ssai",
    label: "Stevens Society of AI",
    sublabel: "President & Co-Founder",
    category: "ai",
    detail: {
      role: "President (formerly VP & Co-Founder)",
      org: "Stevens Society of Artificial Intelligence",
      dates: "Nov 2024 – Present",
      bullets: [
        "Co-Founded the university's first student-run AI organization",
        "Expanded active membership by 300% as President",
        "Managing $1,500 annual budget and a core leadership team of 6",
        "Championing AI engagement through research initiatives, competitions, and workshops",
      ],
      tags: ["AI Community", "Leadership", "Research", "Workshops"],
    },
  },
  {
    id: "nebdhub",
    label: "NEBDHub NSDC",
    sublabel: "Chapter Co-Founder & Co-Chair",
    category: "ai",
    detail: {
      role: "NSDC Chapter Co-Founder & Co-Chair",
      org: "Northeast Big Data Innovation Hub",
      dates: "Mar 2025 – Present",
      bullets: [
        "Co-Founded and co-chaired the NEBDHub's National Student Data Corps Chapter at Stevens",
      ],
      tags: ["Data Science", "Community", "Big Data"],
    },
  },

  // ── Quant Finance branch node ────────────────────────────────────────────
  {
    id: "quant-branch",
    label: "Quant Finance",
    category: "quant",
    detail: {
      bullets: ["Quantitative strategies, financial markets, and FinTech"],
    },
  },
  {
    id: "ssmif",
    label: "SSMIF",
    sublabel: "Incoming Quant Analyst",
    category: "quant",
    detail: {
      role: "Incoming Quantitative Analyst",
      org: "Stevens Student Managed Investment Fund",
      dates: "Apr 2026 – Present",
      bullets: [
        "Quantitative Analyst on the Multi-Factor Security-Specific Strategies team",
      ],
      tags: ["Quant", "Multifactor Modeling", "Securities", "Python"],
    },
  },
  {
    id: "goldman",
    label: "Goldman Sachs",
    sublabel: "Engineering Possibilities Summit",
    category: "quant",
    detail: {
      role: "Engineering Possibilities Summit & Virtual Insight Series Participant",
      org: "Goldman Sachs",
      dates: "Jan 2025 – Dec 2025",
      bullets: [
        "Selected for competitive virtual programs providing insight into the financial industry",
        "Engaged in networking and mentorship with industry professionals",
      ],
      tags: ["Finance", "Investment Banking", "Networking"],
    },
  },
  {
    id: "qmul",
    label: "Queen Mary University",
    sublabel: "FinTech & Finance Law",
    category: "quant",
    detail: {
      role: "Summer Study Abroad — FinTech, AI & Finance Law; International Energy Law",
      org: "Queen Mary University of London",
      dates: "Jun 2026 – Aug 2026",
      bullets: [
        "Studying FinTech, AI & Finance Law, and International Energy Law",
      ],
      tags: ["FinTech", "Finance Law", "Study Abroad"],
    },
  },

  // ── Engineering branch node ──────────────────────────────────────────────
  {
    id: "eng-branch",
    label: "Engineering",
    category: "engineering",
    detail: {
      bullets: ["Backend systems, AI-native apps, APIs, and cloud architecture"],
    },
  },
  {
    id: "netwoven",
    label: "Netwoven",
    sublabel: "Full Stack Intern",
    category: "engineering",
    detail: {
      role: "Full Stack Developer — Intern",
      org: "Netwoven",
      dates: "Jun 2025 – Aug 2025",
      bullets: [
        "Designed and implemented an AI-native Identity and Access Management application using Flask and Azure DevOps",
        "Built automated certification workflows and risk scoring",
        "Reduced manual review time by 80%",
      ],
      tags: ["Flask", "Python", "Azure", "IAM", "AI", "DevOps"],
    },
  },
  {
    id: "blueprint",
    label: "Stevens Blueprint",
    sublabel: "VP of Engineering",
    category: "engineering",
    detail: {
      role: "VP of Engineering (formerly Software Developer)",
      org: "Stevens Blueprint",
      dates: "Oct 2025 – Present",
      bullets: [
        "Leading a team of 4 (growing to 9+) software engineers to build and deploy org-improvement projects",
        "Instituting Agile methodologies and weekly code reviews across 2 concurrent project streams",
        "Built and automated a RAG pipeline in Python to ingest internal docs, generate embeddings, and ground LLM responses for 70+ members",
      ],
      tags: ["Python", "RAG", "LLMs", "Agile", "System Design"],
    },
  },
  {
    id: "seo",
    label: "Software Eng. Org",
    sublabel: "Back End Developer",
    category: "engineering",
    detail: {
      role: "Back End Developer & Incoming Club Operations Coordinator",
      org: "Software Engineering Organization",
      dates: "Nov 2025 – Present",
      bullets: [
        "Developing a MongoDB-backed marketplace platform in JavaScript",
        "Architecting RESTful APIs and role-based authentication",
        "Scaling to support up to 300 businesses and 4,000+ students",
      ],
      tags: ["JavaScript", "MongoDB", "REST APIs", "Auth", "Node.js"],
    },
  },
  {
    id: "dueforge",
    label: "DueForge",
    sublabel: "Builder",
    category: "engineering",
    detail: {
      role: "Founder / Builder",
      org: "DueForge",
      dates: "2025 – Present",
      bullets: [
        "Building DueForge — a product focused on reliability and business impact",
        "Deepening production skills across APIs, cloud architecture, LLM application patterns, and secure system design",
      ],
      tags: ["Startup", "APIs", "Cloud", "LLMs", "Security"],
    },
  },

  // ── Leadership branch node ───────────────────────────────────────────────
  {
    id: "lead-branch",
    label: "Leadership",
    category: "leadership",
    detail: {
      bullets: ["Steering orgs, mentoring engineers, and driving community impact"],
    },
  },
  {
    id: "consulting",
    label: "Stevens Consulting Group",
    sublabel: "Project Manager",
    category: "leadership",
    detail: {
      role: "Project Manager — Stevens Analyst Consulting Program",
      org: "Stevens Consulting Group",
      dates: "Oct 2025 – Dec 2025",
      bullets: [
        "Selected to lead a team of consultants working with local businesses in Hoboken, NJ",
      ],
      tags: ["Consulting", "Project Management", "Strategy"],
    },
  },
  {
    id: "quackhacks",
    label: "QuackHacks",
    sublabel: "Tech Lead & Student Judge",
    category: "leadership",
    detail: {
      role: "Tech Lead / Student Judge & Event Experience Coordinator",
      org: "Stevens QuackHacks Organizing Team",
      dates: "Dec 2024 – Apr 2026",
      bullets: [
        "Coordinated weekend logistics and served as judge for hackathon hosting ~300 students (2026)",
        "Coordinated operations for 400+ students at Stevens Institute (2025)",
      ],
      tags: ["Hackathon", "Event Planning", "Judging"],
    },
  },
  {
    id: "launchpad",
    label: "Launchpad@Stevens",
    sublabel: "Project Developer",
    category: "leadership",
    detail: {
      role: "Project Developer",
      org: "Launchpad@Stevens",
      dates: "Sep 2025 – Present",
      bullets: [
        "Exploring entrepreneurship and building the foundation for a startup through hands-on learning and collaboration",
      ],
      tags: ["Entrepreneurship", "Startups", "Product Development"],
    },
  },

  // ── Education branch node ────────────────────────────────────────────────
  {
    id: "edu-branch",
    label: "Education",
    category: "education",
    detail: {
      bullets: ["Stevens, JHU, and Queen Mary — CS, FinTech, Finance Law"],
    },
  },
  {
    id: "stevens",
    label: "Stevens Institute",
    sublabel: "BS Computer Science",
    category: "education",
    detail: {
      role: "Bachelor of Science — Computer Science",
      org: "Stevens Institute of Technology",
      dates: "Sep 2024 – May 2028",
      bullets: [
        "Pinnacle Scholar (merit-based full recognition) & Dean's List",
        "Minors in Quantitative Finance and Cybersecurity",
        "AWS Certified Cloud Practitioner, AWS Certified AI Practitioner",
        "AWS SAA-C03 & DVA-C02 in progress",
      ],
      tags: ["CS", "Quant Finance", "Cybersecurity", "AWS"],
    },
  },
  {
    id: "jhu",
    label: "Johns Hopkins",
    sublabel: "CS Summer Program",
    category: "education",
    detail: {
      role: "Computer Science",
      org: "The Johns Hopkins University",
      dates: "May 2022 – Aug 2022",
      bullets: ["Summer CS program at Johns Hopkins University"],
      tags: ["Computer Science", "Summer Program"],
    },
  },
];

export const edges: GraphEdge[] = [
  // Center → branches
  { source: "center", target: "ai-branch" },
  { source: "center", target: "quant-branch" },
  { source: "center", target: "eng-branch" },
  { source: "center", target: "lead-branch" },
  { source: "center", target: "edu-branch" },

  // AI branch → leaves
  { source: "ai-branch", target: "hanlon" },
  { source: "ai-branch", target: "inspirit" },
  { source: "ai-branch", target: "ssai" },
  { source: "ai-branch", target: "nebdhub" },

  // Quant branch → leaves
  { source: "quant-branch", target: "ssmif" },
  { source: "quant-branch", target: "goldman" },
  { source: "quant-branch", target: "qmul" },

  // Engineering branch → leaves
  { source: "eng-branch", target: "netwoven" },
  { source: "eng-branch", target: "blueprint" },
  { source: "eng-branch", target: "seo" },
  { source: "eng-branch", target: "dueforge" },

  // Leadership branch → leaves
  { source: "lead-branch", target: "consulting" },
  { source: "lead-branch", target: "quackhacks" },
  { source: "lead-branch", target: "launchpad" },

  // Education branch → leaves
  { source: "edu-branch", target: "stevens" },
  { source: "edu-branch", target: "jhu" },
  { source: "edu-branch", target: "qmul" },

  // Cross-links (reflect overlapping roles)
  { source: "ssai", target: "lead-branch" },
  { source: "blueprint", target: "lead-branch" },
  { source: "qmul", target: "quant-branch" },
];
