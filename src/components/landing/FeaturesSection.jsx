import { Terminal, GitBranch, Award } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-(--background)">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs text-(--primary) tracking-[0.3em] mb-4">
          HOW IT WORKS
        </p>
        <h2 className="font-typewriter text-3xl md:text-4xl text-(--foreground) mb-16">
          CRACK THE CODE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="case-card p-8" data-testid="feature-card-1">
            <div className="w-12 h-12 flex items-center justify-center border border-(--foreground-terminal) mb-6">
              <Terminal className="w-6 h-6 text-(--foreground-terminal)" />
            </div>
            <h3 className="font-typewriter text-xl text-(--foreground) mb-4">
              INTERACTIVE TERMINAL
            </h3>
            <p className="text-(--foreground-muted) leading-relaxed">
              Type real Git commands in our simulated terminal. Learn by doing,
              not just reading.
            </p>
          </div>

          <div className="case-card p-8" data-testid="feature-card-2">
            <div className="w-12 h-12 flex items-center justify-center border border-(--primary) mb-6">
              <GitBranch className="w-6 h-6 text-(--primary)" />
            </div>
            <h3 className="font-typewriter text-xl text-(--foreground) mb-4">
              MYSTERY CASES
            </h3>
            <p className="text-(--foreground-muted) leading-relaxed">
              Each case is a story. Follow the narrative, solve puzzles, and
              uncover the truth with Git.
            </p>
          </div>

          <div className="case-card p-8" data-testid="feature-card-3">
            <div className="w-12 h-12 flex items-center justify-center border border-[#d00000] mb-6">
              <Award className="w-6 h-6 text-[#d00000]" />
            </div>
            <h3 className="font-typewriter text-xl text-(--foreground) mb-4">
              EARN REPUTATION
            </h3>
            <p className="text-(--foreground-muted) leading-relaxed">
              Solve cases to earn points. Build your reputation and unlock
              advanced mysteries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}