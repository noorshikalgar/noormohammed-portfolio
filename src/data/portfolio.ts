export type PortfolioProject = {
  name: string;
  type: string;
  description: string;
  repo: string;
  tags: string[];
};

export type PortfolioTimelineItem = {
  label: string;
  title: string;
  description: string;
};

export type PortfolioLink = {
  label: string;
  href: string;
};

export type PortfolioDoc = {
  slug: string;
  file: string;
  updatedLabel: string;
  comment: string;
  title: string;
  summary: string;
  listTitle?: string;
  bullets?: string[];
  codeBlock?: string;
  projects?: PortfolioProject[];
  timeline?: PortfolioTimelineItem[];
  skills?: string[];
  links?: PortfolioLink[];
};

export type RawMarkdownDoc = {
  slug: string;
  file: string;
  label: string;
  preview: string;
  content: string;
};

const projects: PortfolioProject[] = [
  {
    name: "AI Void SaaS",
    type: "platform",
    description:
      "Multi-service learning platform with guide generation, payments, and operational workflows.",
    repo: "github.com/noor/ai-void-saas",
    tags: ["Django", "React", "Docker"],
  },
  {
    name: "PicoForge",
    type: "design system",
    description:
      "Portable CSS system extracted from a Hugo design language and rebuilt for modern frontend stacks.",
    repo: "github.com/noor/picoforge-design-system",
    tags: ["CSS", "Tokens", "React-ready"],
  },
  {
    name: "Local Agents",
    type: "tooling",
    description:
      "Local automation and agent experiments for research, content pipelines, and developer workflows.",
    repo: "github.com/noor/local-agents",
    tags: ["AI", "CLI", "Automation"],
  },
] as const;

const nowItems: PortfolioTimelineItem[] = [
  {
    label: "focus",
    title: "Reusable frontend systems",
    description: "Portable styling, React starters, and component surfaces that can move across projects.",
  },
  {
    label: "learning",
    title: "3D and richer interaction",
    description: "Three.js scenes, motion, and useful visual interfaces that still load fast.",
  },
  {
    label: "building",
    title: "AI workflow products",
    description: "Tools where models assist work without hiding the engineering behind the curtain.",
  },
] as const;

const skills: string[] = [
  "React",
  "TypeScript",
  "JavaScript",
  "CSS Architecture",
  "Design Systems",
  "Vite",
  "Django",
  "Node.js",
  "REST APIs",
  "Docker",
  "Git",
  "CI/CD",
  "Performance",
  "Accessibility",
  "Three.js",
  "AI Workflows",
  "Technical Writing",
] as const;

const rawDocs: RawMarkdownDoc[] = [
  {
    slug: "readme-raw",
    file: "README.md",
    label: "main",
    preview: "# Noormohammed",
    content: `# Noormohammed

> Senior web engineer building calm, fast web systems.

## Identity
- Role: Senior Web Engineer
- Focus: Frontend architecture, product systems, AI workflows
- Status: available for high-signal product and platform work
- Location: India

## Principles
- Build interfaces that stay readable under product complexity
- Make boundaries visible early
- Use AI as leverage, not as a replacement for engineering judgment

## Open
- [x] Architecture-heavy frontend work
- [x] Product system design
- [ ] Long-term placeholder copy

[GitHub](https://github.com/)
[LinkedIn](https://linkedin.com/)
[Email](mailto:hello@example.com)`,
  },
  {
    slug: "projects-raw",
    file: "projects.md",
    label: "repos",
    preview: "## Selected Projects",
    content: `## Selected Projects

### AI Void SaaS
- Type: platform
- Stack: Django, React, Docker
- Repo: github.com/noor/ai-void-saas

### PicoForge
- Type: design system
- Stack: CSS, Tokens, React-ready
- Repo: github.com/noor/picoforge-design-system

### Local Agents
- Type: tooling
- Stack: AI, CLI, Automation
- Repo: github.com/noor/local-agents`,
  },
  {
    slug: "now-raw",
    file: "now.md",
    label: "active",
    preview: "## Now",
    content: `## Now

- Building reusable frontend systems
- Learning richer 3D interaction patterns
- Exploring AI workflow products with visible engineering underneath

### Current checklist
- [x] Portfolio v2
- [x] Portfolio v3 raw markdown concept
- [ ] Replace all placeholder data with real case studies`,
  },
];

export const portfolio = {
  intro: {
    headline: "Engineering calm, fast web systems.",
    summary:
      "I am Noormohammed, a senior web engineer focused on frontend architecture, product systems, developer tooling, and AI-enabled workflows. Full story coming soon; this is the working skeleton.",
    status: "available for high-signal product and platform work",
  },
  markdown: {
    hero: {
      title: "Noormohammed",
      lead:
        "This version treats the portfolio like an open repository: one readable markdown document per topic, structured for fast scanning by founders, hiring teams, and collaborators.",
      frontmatter: `---\nname: Noormohammed\nrole: Senior Web Engineer\nlocation: India\nfocus:\n  - frontend architecture\n  - product systems\n  - AI workflows\nstatus: available for high-signal product and platform work\n---`,
    },
  },
  commands: ["whoami", "cat stack.md", "git log --impact", "ssh future@web"],
  stack: [
    {
      kind: "frontend",
      title: "Frontend Architecture",
      description:
        "Design systems, React applications, state boundaries, routing, accessibility, and performance budgets.",
      tools: ["React", "TypeScript", "Vite", "CSS"],
    },
    {
      kind: "systems",
      title: "Web Platforms",
      description:
        "APIs, auth flows, deployment paths, observability hooks, and backend-aware UI decisions.",
      tools: ["Node", "Django", "REST", "Docker"],
    },
    {
      kind: "tooling",
      title: "Developer Experience",
      description:
        "CLI workflows, project generators, linting, release hygiene, and automation that keeps teams fast.",
      tools: ["Git", "CI", "ESLint", "Playwright"],
    },
    {
      kind: "ai",
      title: "AI Product Workflows",
      description:
        "Interfaces around agents, content pipelines, knowledge systems, and human-in-the-loop review.",
      tools: ["LLMs", "RAG", "Agents", "Automation"],
    },
    {
      kind: "architecture",
      title: "Product Systems",
      description:
        "Turning messy product needs into maintainable modules, reusable primitives, and clear UX flows.",
      tools: ["UX", "Design Systems", "Docs", "Strategy"],
    },
  ] as const,
  projects,
  now: {
    summary:
      "Currently shaping reusable systems: design foundations, AI-assisted publishing, and portfolio-grade product interfaces.",
    items: nowItems,
  },
  skills,
  docs: [
    {
      slug: "about-md",
      file: "about.md",
      updatedLabel: "bio",
      comment: "<!-- short version -->",
      title: "## About",
      summary:
        "Senior web engineer building product-facing interfaces, scalable frontend systems, and tooling that reduces operational drag for teams.",
      listTitle: "### Operating principles",
      bullets: [
        "Build interfaces that stay readable under real product complexity.",
        "Keep systems maintainable by making boundaries visible early.",
        "Use AI as leverage, not a substitute for engineering rigor.",
      ],
      codeBlock:
        "const engineer = {\n  name: 'Noormohammed',\n  mode: 'product-minded systems builder',\n  shippingStyle: 'fast, calm, maintainable',\n};",
    },
    {
      slug: "projects-md",
      file: "projects.md",
      updatedLabel: "public work",
      comment: "<!-- selected repositories -->",
      title: "## Projects",
      summary: "A few representative builds across platforms, systems, and tooling.",
      projects,
    },
    {
      slug: "now-md",
      file: "now.md",
      updatedLabel: "current",
      comment: "<!-- what is active right now -->",
      title: "## Now",
      summary:
        "Current work is centered on reusable frontend systems, AI workflow surfaces, and richer interactions that still behave like disciplined software.",
      timeline: nowItems,
    },
    {
      slug: "stack-md",
      file: "stack.md",
      updatedLabel: "toolchain",
      comment: "<!-- primary skill graph -->",
      title: "## Stack",
      summary: "Senior-level surface area across the product stack, with frontend depth at the center.",
      skills,
      bullets: [
        "Frontend architecture, routing, state, and component systems.",
        "Backend-aware UI decisions across APIs, auth, and deploy flows.",
        "Developer tooling, documentation, and automation for team velocity.",
      ],
      listTitle: "### Coverage",
    },
    {
      slug: "contact-md",
      file: "contact.md",
      updatedLabel: "open",
      comment: "<!-- collaboration paths -->",
      title: "## Contact",
      summary:
        "Best fit: product teams that want a senior engineer who can shape UX, system structure, and implementation details together.",
      links: [
        { label: "Email", href: "mailto:hello@example.com" },
        { label: "GitHub", href: "https://github.com/" },
        { label: "LinkedIn", href: "https://linkedin.com/" },
      ],
      codeBlock:
        "pnpm contact --channel email\npnpm contact --channel github\npnpm contact --channel linkedin",
    },
  ] satisfies PortfolioDoc[],
  rawDocs,
  links: {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    email: "hello@example.com",
  },
};
