import {
  ArrowUpRight,
  Braces,
  Cpu,
  Github,
  Layers3,
  Linkedin,
  Mail,
  ServerCog,
  Terminal,
} from "lucide-react";
import { lazy, Suspense } from "react";
import { portfolio } from "./data/portfolio";

const KeyboardLab = lazy(() =>
  import("./components/KeyboardLab").then((module) => ({ default: module.KeyboardLab })),
);

const iconMap = {
  frontend: Braces,
  systems: ServerCog,
  tooling: Terminal,
  ai: Cpu,
  architecture: Layers3,
};

function App() {
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

          <div className="keyboard-panel">
            <Suspense fallback={<div className="keyboard-loading">loading keyboard lab...</div>}>
              <KeyboardLab />
            </Suspense>
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

export default App;
