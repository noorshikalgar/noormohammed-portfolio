export const portfolio = {
  intro: {
    headline: "Engineering calm, fast web systems.",
    summary:
      "I am Noor Mohammed, a senior web engineer focused on frontend architecture, product systems, developer tooling, and AI-enabled workflows. Full story coming soon; this is the working skeleton.",
    status: "available for high-signal product and platform work",
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
  projects: [
    {
      name: "AI Void SaaS",
      type: "platform",
      description:
        "Dummy description: multi-service learning platform with guide generation, payments, and operational workflows.",
      repo: "github.com/noor/ai-void-saas",
      tags: ["Django", "React", "Docker"],
    },
    {
      name: "PicoForge",
      type: "design system",
      description:
        "Portable CSS theme extracted from a Hugo style and rebuilt for React, Angular, Hugo, and static sites.",
      repo: "github.com/noor/picoforge-design-system",
      tags: ["CSS", "Tokens", "React-ready"],
    },
    {
      name: "Local Agents",
      type: "tooling",
      description:
        "Dummy description: local automation and agent experiments for research, content, and developer workflows.",
      repo: "github.com/noor/local-agents",
      tags: ["AI", "CLI", "Automation"],
    },
  ],
  now: {
    summary:
      "Currently shaping reusable systems: design foundations, AI-assisted publishing, and portfolio-grade product interfaces.",
    items: [
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
    ],
  },
  skills: [
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
  ],
  links: {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    email: "hello@example.com",
  },
};
