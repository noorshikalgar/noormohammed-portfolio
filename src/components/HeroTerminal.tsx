import { useEffect, useMemo, useRef, useState } from "react";

const terminalSteps = [
  {
    command: "whoami --profile",
    output: ["Noor Mohammed", "Senior Engineer in Web Development"],
  },
  {
    command: "cat focus.md",
    output: ["Frontend architecture", "Product systems", "AI-enabled workflows"],
  },
  {
    command: "git status --short",
    output: ["M  design-system/tokens.css", "A  portfolio/terminal-hero.tsx"],
  },
  {
    command: "npm run build:calm",
    output: ["build passed", "ready to ship resilient web experiences"],
  },
];

type TerminalEntry =
  | {
      type: "command";
      value: string;
    }
  | {
      type: "output";
      value: string[];
    };

export function HeroTerminal() {
  const audioContext = useRef<AudioContext | null>(null);
  const isMutedRef = useRef(true);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);
  const [history, setHistory] = useState<TerminalEntry[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const commandQueue = useMemo(() => terminalSteps, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [history, currentCommand]);

  const playKeySound = () => {
    if (isMutedRef.current) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    audioContext.current ??= new AudioContextClass();
    const context = audioContext.current;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "square";
    oscillator.frequency.value = 760 + Math.random() * 160;
    gain.gain.setValueAtTime(0.018, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.025);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.028);
  };

  const playClickSound = () => {
    if (isMutedRef.current) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    audioContext.current ??= new AudioContextClass();
    const context = audioContext.current;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = 340;
    gain.gain.setValueAtTime(0.03, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.08);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.08);
  };

  useEffect(() => {
    let cancelled = false;

    const sleep = (duration: number) =>
      new Promise<void>((resolve) => {
        const timer = window.setTimeout(resolve, duration);
        timers.current.push(timer);
      });

    const typeCommand = async (command: string) => {
      setCurrentCommand("");
      await sleep(360);

      for (let index = 0; index < command.length; index += 1) {
        if (cancelled) return;
        setCurrentCommand(command.slice(0, index + 1));
        playKeySound();
        await sleep(72 + Math.random() * 86);
      }
    };

    const run = async () => {
      await sleep(760);
      if (cancelled) return;
      setHasClicked(true);
      playClickSound();

      await sleep(260);
      if (cancelled) return;
      setIsOpen(true);

      await sleep(720);

      for (const step of commandQueue) {
        if (cancelled) return;
        await typeCommand(step.command);
        await sleep(320);
        setHistory((previous) => [
          ...previous,
          { type: "command", value: step.command },
          { type: "output", value: step.output },
        ]);
        setCurrentCommand("");
        await sleep(860);
      }
    };

    run();

    return () => {
      cancelled = true;
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
  }, [commandQueue]);

  const toggleSound = async () => {
    const nextMuted = !isMuted;
    isMutedRef.current = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioContext.current ??= new AudioContextClass();
        await audioContext.current.resume();
      }
    }
  };

  return (
    <div className="terminal-desktop" aria-label="Animated desktop terminal introduction">
      <button
        className={isOpen ? "terminal-desktop-icon terminal-desktop-icon-hidden" : "terminal-desktop-icon"}
        type="button"
        aria-label="Open terminal"
      >
        <span className="terminal-icon-screen">&gt;_</span>
        <span className="terminal-icon-label">Terminal</span>
      </button>
      <div className={hasClicked ? "desktop-cursor desktop-cursor-clicked" : "desktop-cursor"} />

      <div className={isOpen ? "hero-terminal hero-terminal-open" : "hero-terminal"} aria-hidden={!isOpen}>
        <div className="terminal-chrome">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
          <span className="terminal-title">noor@portfolio:~</span>
          <button className="terminal-sound-toggle" type="button" onClick={toggleSound}>
            {isMuted ? "sound off" : "sound on"}
          </button>
        </div>
        <div className="terminal-screen" ref={screenRef}>
          {history.map((entry, index) =>
            entry.type === "command" ? (
              <div className="terminal-line terminal-command" key={`${entry.type}-${entry.value}-${index}`}>
                <span className="zsh-path">~/portfolio</span>
                <span className="zsh-symbol">❯</span>
                <span>{entry.value}</span>
              </div>
            ) : (
              <div className="terminal-output" key={`${entry.type}-${index}`}>
                {entry.value.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            ),
          )}
          <div className="terminal-line terminal-command">
            <span className="zsh-path">~/portfolio</span>
            <span className="zsh-symbol">❯</span>
            <span>{currentCommand}</span>
            <span className="terminal-cursor" />
          </div>
          <div className="terminal-end" ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
}
