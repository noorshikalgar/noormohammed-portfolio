import { useEffect, useRef, useState, type ReactNode } from "react";
import { toPng } from "html-to-image";
import {
  ArrowUpRight,
  Braces,
  Cpu,
  FileCode2,
  Files,
  Github,
  Layers3,
  Linkedin,
  Mail,
  ServerCog,
  Terminal,
} from "lucide-react";
import { HeroTerminal } from "./components/HeroTerminal";
import { portfolio } from "./data/portfolio";

const iconMap = {
  frontend: Braces,
  systems: ServerCog,
  tooling: Terminal,
  ai: Cpu,
  architecture: Layers3,
};

type ViewMode = "v1" | "v2" | "v3" | "wallpaper";

const rawMdSections = [
  { label: "README.md", id: "rawmd-readme" },
  { label: "projects.md", id: "rawmd-projects" },
  { label: "now.md", id: "rawmd-now" },
  { label: "notes.md", id: "rawmd-notes" },
  { label: "manifesto.md", id: "rawmd-manifesto" },
] as const;

function toHref(value: string) {
  if (value.startsWith("mailto:")) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.includes("@") && !value.includes(" ")) return `mailto:${value}`;
  return `https://${value}`;
}

function renderRawMarkdownLine(line: string, key: string, lineNumber: number) {
  const sectionAnchors = Object.fromEntries(rawMdSections.map((section) => [section.label, section.id]));

  const anchorId = sectionAnchors[line];
  const lineProps = anchorId
    ? { id: anchorId, className: "rawmd-line rawmd-anchor-line rawmd-file-header-line" }
    : { className: "rawmd-line" };
  const gutter = <span className="rawmd-line-number">{lineNumber}</span>;
  const wrapContent = (content: ReactNode) => <div className="rawmd-line-content">{content}</div>;

  if (anchorId) {
    return (
      <div {...lineProps} key={key}>
        {gutter}
        {wrapContent(<span className="rawmd-token-file">{line}</span>)}
      </div>
    );
  }

  if (line === "---") {
    return (
      <div {...lineProps} key={key}>
        {gutter}
        {wrapContent(<span className="rawmd-token-rule">---</span>)}
      </div>
    );
  }

  if (line.startsWith("#### ")) {
    return (
      <div {...lineProps} key={key}>
        {gutter}
        {wrapContent(<span className="rawmd-token-h4">#### {line.slice(5)}</span>)}
      </div>
    );
  }

  if (line.startsWith("### ")) {
    return (
      <div {...lineProps} key={key}>
        {gutter}
        {wrapContent(<span className="rawmd-token-h3">### {line.slice(4)}</span>)}
      </div>
    );
  }

  if (line.startsWith("## ")) {
    return (
      <div {...lineProps} key={key}>
        {gutter}
        {wrapContent(<span className="rawmd-token-h2">## {line.slice(3)}</span>)}
      </div>
    );
  }

  if (line.startsWith("# ")) {
    return (
      <div {...lineProps} key={key}>
        {gutter}
        {wrapContent(
          <span className="rawmd-token-h1">
            <span aria-hidden="true" className="rawmd-token-h1-mark">
              <span className="rawmd-token-h1-mark-hash">#</span>
              <span className="rawmd-token-h1-mark-dollar">$</span>
            </span>
            <span>{line.slice(2)}</span>
          </span>
        )}
      </div>
    );
  }

  if (line.startsWith("> ")) {
    return (
      <div {...lineProps} key={key}>
        {gutter}
        {wrapContent(
          <>
            <span className="rawmd-token-quote">{"> "}</span>
            <span>{line.slice(2)}</span>
          </>,
        )}
      </div>
    );
  }

  const checkboxMatch = line.match(/^(\s*-\s\[[ x]\]\s)(.*)$/);
  if (checkboxMatch) {
    return (
      <div {...lineProps} key={key}>
        {gutter}
        {wrapContent(
          <>
            <span className="rawmd-token-checkbox">{checkboxMatch[1]}</span>
            <span>{checkboxMatch[2]}</span>
          </>,
        )}
      </div>
    );
  }

  const bulletMatch = line.match(/^(\s*-\s)(.*)$/);
  if (bulletMatch) {
    return (
      <div {...lineProps} key={key}>
        {gutter}
        {wrapContent(
          <>
            <span className="rawmd-token-bullet">{bulletMatch[1]}</span>
            <span>{bulletMatch[2]}</span>
          </>,
        )}
      </div>
    );
  }

  const labelMatch = line.match(/^([A-Za-z][A-Za-z ]+:)\s?(.*)$/);
  if (labelMatch) {
    const value = labelMatch[2]?.trim() ?? "";
    const isLinkValue =
      Boolean(value) &&
      (value.includes(".") || value.includes("@")) &&
      !value.includes(" ");

    return (
      <div {...lineProps} key={key}>
        {gutter}
        {wrapContent(
          <>
            <span className="rawmd-token-label">{labelMatch[1]}</span>
            {value ? (
              isLinkValue ? (
                <>
                  <span>{` `}</span>
                  <a className="rawmd-token-link" href={toHref(value)} target="_blank" rel="noreferrer">
                    {value}
                  </a>
                </>
              ) : (
                <span>{` ${value}`}</span>
              )
            ) : null}
          </>,
        )}
      </div>
    );
  }

  const bareUrlMatch = line.match(/^([a-z0-9.-]+\.[a-z]{2,}(?:\/\S*)?)$/i);
  if (bareUrlMatch) {
    return (
      <div {...lineProps} key={key}>
        {gutter}
        {wrapContent(
          <a className="rawmd-token-link" href={toHref(bareUrlMatch[1])} target="_blank" rel="noreferrer">
            {bareUrlMatch[1]}
          </a>,
        )}
      </div>
    );
  }

  return (
    <div {...lineProps} key={key}>
      {gutter}
      {wrapContent(<span>{line || " "}</span>)}
    </div>
  );
}

function getInitialView(): ViewMode {
  if (typeof window === "undefined") return "v3";

  const params = new URLSearchParams(window.location.search);
  const requestedView = params.get("view");
  return requestedView === "v1" ||
    requestedView === "v2" ||
    requestedView === "v3" ||
    requestedView === "wallpaper"
    ? requestedView
    : "v3";
}

function ViewSwitcher({ currentView }: { currentView: ViewMode }) {
  return (
    <div className="view-switcher" aria-label="Landing page versions">
      <a
        className={currentView === "v1" ? "view-pill view-pill-active" : "view-pill"}
        href="/?view=v1"
      >
        v1 / terminal
      </a>
      <a
        className={currentView === "v2" ? "view-pill view-pill-active" : "view-pill"}
        href="/?view=v2"
      >
        v2 / markdown
      </a>
      <a
        className={currentView === "v3" ? "view-pill view-pill-active" : "view-pill"}
        href="/?view=v3"
      >
        v3 / raw-md
      </a>
    </div>
  );
}

function LandingPageV1() {
  return (
    <>
      <nav className="pf-nav portfolio-nav">
        <div className="pf-nav-inner">
          <a className="pf-brand terminal-brand" href="#top">
            ~/noor
          </a>
          <div className="pf-nav-links" aria-label="Primary navigation">
            <a className="pf-nav-link" href="#stack">
              Stack
            </a>
            <a className="pf-nav-link" href="#projects">
              Projects
            </a>
            <a className="pf-nav-link" href="#now">
              Now
            </a>
            <a className="pf-nav-link" href="#contact">
              Contact
            </a>
          </div>
          <ViewSwitcher currentView="v1" />
        </div>
      </nav>

      <main id="top">
        <section className="pf-shell-xl hero-stage">
          <div className="hero-copy pf-stack">
            <p className="pf-kicker">senior web engineer</p>
            <h1 className="pf-hero-title">{portfolio.intro.headline}</h1>
            <p className="pf-hero-copy">{portfolio.intro.summary}</p>
            <div className="pf-action-row">
              <a className="pf-button pf-button-primary" href="#projects">
                View projects <ArrowUpRight size={18} />
              </a>
              <a className="pf-button pf-button-ghost" href="#contact">
                Open channel
              </a>
            </div>
            <div className="status-line">
              <span className="pulse-dot" />
              <span>{portfolio.intro.status}</span>
            </div>
          </div>

          <div className="hero-terminal-panel">
            <HeroTerminal />
          </div>
        </section>

        <section className="pf-shell pf-section command-strip" aria-label="Portfolio commands">
          {portfolio.commands.map((command) => (
            <span className="command-chip" key={command}>
              <span>$</span> {command}
            </span>
          ))}
        </section>

        <section id="stack" className="pf-shell pf-section">
          <div className="section-heading">
            <p className="pf-kicker">career stack</p>
            <h2 className="pf-h2">The systems I like building</h2>
            <p className="pf-copy">
              Dummy content for now, shaped around senior web engineering: architecture,
              product surfaces, automation, quality, and developer experience.
            </p>
          </div>
          <div className="pf-grid pf-mt-8 stack-grid">
            {portfolio.stack.map((item) => {
              const Icon = iconMap[item.kind];
              return (
                <article className="pf-card pf-card-interactive stack-card" key={item.title}>
                  <div className="stack-icon">
                    <Icon size={22} />
                  </div>
                  <h3 className="pf-card-title">{item.title}</h3>
                  <p className="pf-card-text">{item.description}</p>
                  <div className="pf-card-footer">
                    {item.tools.map((tool) => (
                      <span className="pf-badge" key={tool}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="projects" className="pf-shell pf-section">
          <div className="section-heading section-heading-row">
            <div>
              <p className="pf-kicker">github projects</p>
              <h2 className="pf-h2">Selected public work</h2>
            </div>
            <a className="pf-button pf-button-ghost pf-button-sm" href={portfolio.links.github}>
              <Github size={16} /> GitHub
            </a>
          </div>
          <div className="project-grid pf-mt-8">
            {portfolio.projects.map((project) => (
              <article className="project-card pf-card pf-card-interactive" key={project.name}>
                <div className="pf-card-header">
                  <h3 className="pf-card-title">{project.name}</h3>
                  <span className="pf-badge pf-badge-accent">{project.type}</span>
                </div>
                <p className="pf-card-text">{project.description}</p>
                <div className="terminal-snippet">
                  <span className="pf-prompt">$</span> git clone {project.repo}
                </div>
                <div className="pf-card-footer">
                  {project.tags.map((tag) => (
                    <span className="pf-badge" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="now" className="pf-shell pf-section now-section">
          <div className="pf-split">
            <div>
              <p className="pf-kicker">right now</p>
              <h2 className="pf-h2">Current operating mode</h2>
              <p className="pf-copy">{portfolio.now.summary}</p>
            </div>
            <div className="pf-card">
              <ol className="pf-timeline">
                {portfolio.now.items.map((item) => (
                  <li className="pf-timeline-item" key={item.title}>
                    <span className="pf-timeline-date">{item.label}</span>
                    <h3 className="pf-timeline-title">{item.title}</h3>
                    <p className="pf-muted">{item.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="skills" className="pf-shell pf-section">
          <div className="section-heading">
            <p className="pf-kicker">skills</p>
            <h2 className="pf-h2">Senior engineering surface area</h2>
          </div>
          <div className="skill-cloud pf-mt-6">
            {portfolio.skills.map((skill) => (
              <span className="skill-token" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section id="contact" className="pf-shell pf-section">
          <div className="contact-panel">
            <div>
              <p className="pf-kicker">contact</p>
              <h2 className="pf-h2">Let’s build the next useful thing.</h2>
              <p className="pf-copy">
                Placeholder copy until your real bio, availability, and links are ready.
              </p>
            </div>
            <div className="pf-action-row">
              <a className="pf-button pf-button-primary" href={`mailto:${portfolio.links.email}`}>
                <Mail size={18} /> Email
              </a>
              <a className="pf-button pf-button-ghost" href={portfolio.links.github}>
                <Github size={18} /> GitHub
              </a>
              <a className="pf-button pf-button-ghost" href={portfolio.links.linkedin}>
                <Linkedin size={18} /> LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function LandingPageV2() {
  return (
    <div className="markdown-app">
      <header className="markdown-topbar">
        <div>
          <p className="markdown-app-label">portfolio v2</p>
          <h1 className="markdown-app-title">Markdown portfolio workspace</h1>
          <p className="markdown-app-subtitle">
            A document-driven portfolio with a technical editor shell.
          </p>
        </div>
        <ViewSwitcher currentView="v2" />
      </header>

      <main className="markdown-shell">
        <aside className="markdown-sidebar" aria-label="Portfolio file index">
          <div className="markdown-sidebar-card">
            <p className="markdown-sidebar-title">index</p>
            <a className="markdown-file-link" href="#readme">
              <Files size={16} /> README.md
            </a>
            {portfolio.docs.map((doc) => (
              <a className="markdown-file-link" href={`#${doc.slug}`} key={doc.slug}>
                <FileCode2 size={16} /> {doc.file}
              </a>
            ))}
          </div>

          <div className="markdown-sidebar-card">
            <p className="markdown-sidebar-title">key capabilities</p>
            <div className="markdown-side-list">
              <span>Frontend architecture</span>
              <span>Developer tooling</span>
              <span>AI workflow systems</span>
              <span>Design system thinking</span>
            </div>
          </div>
        </aside>

        <section className="markdown-content">
          <article id="readme" className="markdown-doc markdown-doc-featured">
            <div className="markdown-doc-toolbar">
              <span>README.md</span>
              <span>main</span>
            </div>
            <div className="markdown-doc-body">
              <p className="markdown-comment"># markdown portfolio mode</p>
              <h2>{portfolio.markdown.hero.title}</h2>
              <p>{portfolio.markdown.hero.lead}</p>

              <div className="frontmatter-card" aria-label="Portfolio frontmatter">
                <pre>{portfolio.markdown.hero.frontmatter}</pre>
              </div>

              <div className="markdown-actions">
                <a className="markdown-button markdown-button-primary" href="#projects-md">
                  Open projects <ArrowUpRight size={16} />
                </a>
                <a className="markdown-button" href="#contact-md">
                  Contact.md
                </a>
              </div>

              <div className="markdown-status">
                <span className="markdown-status-dot" />
                <span>{portfolio.intro.status}</span>
              </div>
            </div>
          </article>

          {portfolio.docs.map((doc) => (
            <article className="markdown-doc" id={doc.slug} key={doc.slug}>
              <div className="markdown-doc-toolbar">
                <span>{doc.file}</span>
                <span>{doc.updatedLabel}</span>
              </div>
              <div className="markdown-doc-body">
                <p className="markdown-comment">{doc.comment}</p>
                <h2>{doc.title}</h2>
                <p>{doc.summary}</p>

                {doc.listTitle ? <h3>{doc.listTitle}</h3> : null}
                {doc.bullets ? (
                  <ul>
                    {doc.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}

                {doc.codeBlock ? (
                  <pre className="markdown-code-block">
                    <code>{doc.codeBlock}</code>
                  </pre>
                ) : null}

                {doc.projects ? (
                  <div className="markdown-project-list">
                    {doc.projects.map((project) => (
                      <section className="markdown-project-card" key={project.name}>
                        <div className="markdown-project-header">
                          <h3>{project.name}</h3>
                          <span>{project.type}</span>
                        </div>
                        <p>{project.description}</p>
                        <p className="markdown-inline-code">git clone {project.repo}</p>
                        <ul>
                          {project.tags.map((tag) => (
                            <li key={tag}>{tag}</li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                ) : null}

                {doc.timeline ? (
                  <ol className="markdown-timeline">
                    {doc.timeline.map((item) => (
                      <li key={item.title}>
                        <span>{item.label}</span>
                        <strong>{item.title}</strong>
                        <p>{item.description}</p>
                      </li>
                    ))}
                  </ol>
                ) : null}

                {doc.skills ? (
                  <div className="markdown-tag-row">
                    {doc.skills.map((skill) => (
                      <span className="markdown-tag" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : null}

                {doc.links ? (
                  <div className="markdown-link-list">
                    {doc.links.map((link) => (
                      <a className="markdown-link-chip" href={link.href} key={link.label}>
                        {link.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

function LandingPageV3() {
  const [activeSection, setActiveSection] =
    useState<(typeof rawMdSections)[number]["id"]>("rawmd-readme");
  const [isSourceMapPinned, setIsSourceMapPinned] = useState(false);
  const [isSourceMapOpen, setIsSourceMapOpen] = useState(false);

  const rawMarkdown = `README.md

# Noormohammed Shikalgar

> Noormohammed Shikalgar is a Full-stack engineer building AI systems, developer tooling, and calm high-signal products.

## Identity

- Role: Full-Stack Engineer (~5–6 years)
- Focus: AI systems, frontend architecture, agent workflows, developer platforms
- Status: building Aivoid + exploring production AI infrastructure
- Location: India

## Principles

- Build systems that survive scale and complexity
- Prefer architecture over short-term hacks
- AI should amplify engineering judgment, not replace it
- Optimize for long-term maintainability
- Build small → learn → evolve

## Stack

- Frontend: Angular, React, TypeScript
- Backend: Node.js, Django, FastAPI
- Systems: Docker, Kubernetes, Linux
- AI: LangGraph, local LLMs, workflows, MCP exploration
- Infra: pfSense, homelab, Cloudflare

## Open

- [x] AI engineering systems
- [x] Architecture-heavy frontend work
- [x] Developer tooling
- [x] Agent workflow experimentation
- [ ] Enterprise SaaS chaos

## Links

GitHub: github.com/noorshikalgar  
Website: aivoid.dev  
Blog: blog.noorshomelab.dev  
Email: noor.shikalgar03@gmail.com

---

projects.md

## Selected Projects

### Aivoid

- Type: AI learning platform
- Stack: Hugo, AI agents, Cloudflare, Docker
- Focus:
  - large-scale AI-generated learning systems
  - guide generation pipelines
  - multi-agent orchestration
  - search-first content architecture

Repo:
github.com/noorshikalgar

---

### Mermaid Fixer TS

- Type: developer tooling
- Stack: TypeScript
- Focus:
  - auto-fix broken Mermaid diagrams
  - rule-based validation
  - syntax repair at scale

Repo:
github.com/noorshikalgar/mermaid-fixer-ts

---

### Code Memory

- Type: local AI tooling
- Stack: local LLM + memory pipeline
- Focus:
  - scan codebases
  - build persistent context memory
  - reduce context loss for coding agents

Status:
experimental

---

### Multi-Agent Workspace

- Type: orchestration system
- Stack: LangGraph + local agents + Docker

Focus:

- shared memory
- planner → worker → reviewer flow
- distributed coding workflows
- persistent project context

---

now.md

## Now

- Building Aivoid into a practical AI engineering platform
- Designing agent systems that generate structured learning content
- Learning Rust for systems tooling
- Experimenting with local-first AI workflows
- Researching memory systems for coding agents

### Current checklist

- [x] Portfolio V3 raw-md concept
- [x] Agent orchestration research
- [x] Local LLM experiments
- [ ] Build Rust Mermaid auto-fixer
- [ ] Finish code-memory prototype
- [ ] Replace placeholders with detailed case studies

---

notes.md

## Current interests

- agentic systems
- context engineering
- memory architectures
- AI coding workflows
- local inference
- distributed systems
- Rust
- developer productivity

---

manifesto.md

## Engineering Notes

Software is slowly becoming orchestration.

The hard part is no longer writing syntax.

The hard part becomes:

- defining system boundaries
- context management
- memory
- workflows
- observability
- keeping complexity visible

AI increases output.

Architecture determines survival.
---`;

  useEffect(() => {
    const updateActiveSection = () => {
      const offset = 96;
      const scrollPosition = window.scrollY + offset;
      const sectionElements = rawMdSections
        .map((section) => {
          const element = document.getElementById(section.id);
          return element ? { id: section.id, top: element.offsetTop } : null;
        })
        .filter((section): section is { id: (typeof rawMdSections)[number]["id"]; top: number } => Boolean(section));

      let nextActiveSection = sectionElements[0]?.id ?? "rawmd-readme";

      for (const section of sectionElements) {
        if (scrollPosition >= section.top) {
          nextActiveSection = section.id;
        }
      }

      setActiveSection(nextActiveSection);
    };

    const handleScroll = () => {
      setIsSourceMapPinned(window.scrollY > 8);
      updateActiveSection();
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 720) {
        setIsSourceMapOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div
        className={
          isSourceMapPinned
            ? "rawmd-toprow rawmd-toprow-sticky rawmd-toprow-sticky-active"
            : "rawmd-toprow rawmd-toprow-sticky"
        }
      >
        <div className="rawmd-toprow-inner">
          <div className="rawmd-topbar">
            <div className="rawmd-topbrand">
              <img alt="[N$_] portfolio logo" className="rawmd-logo" src="/logo.svg" />
              <button
                aria-controls="rawmd-source-map-links"
                aria-expanded={isSourceMapOpen}
                className="rawmd-toplabel rawmd-toplabel-button"
                onClick={() => setIsSourceMapOpen((value) => !value)}
                type="button"
              >
                <span>source map</span>
                <span className="rawmd-toplabel-icon" aria-hidden="true">
                  {isSourceMapOpen ? "[-]" : "[+]"}
                </span>
              </button>
            </div>
            <div
              className={
                isSourceMapOpen
                  ? "rawmd-toplinks rawmd-sourcemap-links rawmd-sourcemap-links-open"
                  : "rawmd-toplinks rawmd-sourcemap-links"
              }
              id="rawmd-source-map-links"
            >
              {rawMdSections.map((section) => (
                <a
                  className={
                    activeSection === section.id
                      ? "rawmd-toplink rawmd-toplink-active"
                      : "rawmd-toplink"
                  }
                  href={`#${section.id}`}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsSourceMapOpen(false);
                  }}
                  key={section.id}
                >
                  [{section.label}]
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <main className="rawmd-plain">
        {rawMarkdown
          .split("\n")
          .map((line, index) => renderRawMarkdownLine(line, `rawmd-${index}`, index + 1))}
      </main>
      <footer className="rawmd-footer">
        Inspired by the Syntax theme for Zed:
        <a className="rawmd-footer-link" href="https://github.com/syntaxfm/syntax-zed-theme" target="_blank" rel="noreferrer">
          syntaxfm/syntax-zed-theme
        </a>
      </footer>
    </>
  );
}

function LandingPageWallpaper() {
  const captureRef = useRef<HTMLDivElement | null>(null);
  const wallpaperLines = [
    { number: 1, type: "file", text: "README.md" },
    { number: 2, type: "blank", text: "" },
    { number: 3, type: "h1", text: "# Noormohammed Shikalgar" },
    {
      number: 4,
      type: "quote",
      text: "> Noormohammed Shikalgar is a Full-stack engineer building AI systems, developer tooling, and calm high-signal products.",
    },
    { number: 5, type: "blank", text: "" },
    { number: 6, type: "h2", text: "## Identity" },
    { number: 7, type: "blank", text: "" },
    { number: 8, type: "bullet", text: "- Role: Full-Stack Engineer (~5–6 years)" },
    {
      number: 9,
      type: "bullet",
      text: "- Focus: AI systems, frontend architecture, agent workflows, developer platforms",
    },
    {
      number: 10,
      type: "bullet",
      text: "- Status: building Aivoid + exploring production AI infrastructure",
    },
    { number: 11, type: "bullet", text: "- Location: India" },
  ] as const;

  const handleCapture = async () => {
    if (!captureRef.current) return;

    const dataUrl = await toPng(captureRef.current, {
      cacheBust: true,
      pixelRatio: 3,
      backgroundColor: "#000000",
    });

    const link = document.createElement("a");
    link.download = "noormohammed-wallpaper.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <main className="wallpaper-page">
      <div className="wallpaper-stage">
        <div className="wallpaper-toolbar">
          <button className="wallpaper-capture-button" onClick={handleCapture} type="button">
            Capture PNG
          </button>
        </div>
        <section className="wallpaper-frame" aria-label="Mobile wallpaper preview">
          <div className="wallpaper-canvas" ref={captureRef}>
            <div className="wallpaper-safe-top" />
            <div className="wallpaper-content">
              {wallpaperLines.map((line) => (
                <div className="wallpaper-line" key={line.number}>
                  <span className="wallpaper-line-number">{line.number}</span>
                  <div className="wallpaper-line-content">
                    {line.type === "file" ? <span className="wallpaper-file">{line.text}</span> : null}
                    {line.type === "blank" ? <span>&nbsp;</span> : null}
                    {line.type === "h1" ? (
                      <span className="wallpaper-h1">
                        <span className="wallpaper-h1-mark">#</span>
                        <span>{line.text.slice(2)}</span>
                      </span>
                    ) : null}
                    {line.type === "quote" ? (
                      <span className="wallpaper-quote">
                        <span className="wallpaper-quote-mark">&gt; </span>
                        <span>{line.text.slice(2)}</span>
                      </span>
                    ) : null}
                    {line.type === "h2" ? <span className="wallpaper-h2">{line.text}</span> : null}
                    {line.type === "bullet" ? (
                      <span className="wallpaper-bullet">
                        <span className="wallpaper-bullet-mark">- </span>
                        <span>{line.text.slice(2)}</span>
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function App() {
  const [view, setView] = useState<ViewMode>(() => getInitialView());

  useEffect(() => {
    const handleLocationChange = () => {
      setView(getInitialView());
    };

    handleLocationChange();
    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  useEffect(() => {
    document.body.dataset.view = view;

    return () => {
      delete document.body.dataset.view;
    };
  }, [view]);

  if (view === "v1") return <LandingPageV1 />;
  if (view === "v3") return <LandingPageV3 />;
  if (view === "wallpaper") return <LandingPageWallpaper />;
  return <LandingPageV2 />;
}

export default App;
