import { useEffect, useMemo, useState } from "react";

const commands = [
  "whoami",
  "cat senior-web-engineer.md",
  "git status --short",
  "npm run ship",
];

const output = [
  "Noor Mohammed",
  "Senior Engineer in Web Development",
  "Frontend architecture / product systems / AI workflows",
  "status: building useful, resilient web experiences",
];

export function HeroTerminal() {
  const script = useMemo(() => commands.map((command, index) => `$ ${command}\n${output[index]}`).join("\n\n"), []);
  const [text, setText] = useState("");

  useEffect(() => {
    let frame = 0;
    const interval = window.setInterval(() => {
      frame += 1;
      setText(script.slice(0, frame));
      if (frame >= script.length) {
        window.clearInterval(interval);
      }
    }, 24);

    return () => window.clearInterval(interval);
  }, [script]);

  return (
    <div className="hero-terminal" aria-label="Animated terminal introduction">
      <div className="terminal-chrome">
        <span className="terminal-dot terminal-dot-red" />
        <span className="terminal-dot terminal-dot-yellow" />
        <span className="terminal-dot terminal-dot-green" />
        <span className="terminal-title">noor@portfolio:~</span>
      </div>
      <pre className="terminal-screen">
        <code>
          {text}
          <span className="terminal-cursor" />
        </code>
      </pre>
    </div>
  );
}
