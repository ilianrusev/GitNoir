export default function LandingCasesPreview() {
  return (
    <section className="py-24 px-6 bg-(--background-terminal) border-y border-(--border)">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs text-(--primary) tracking-[0.3em] mb-4">
          ACTIVE CASES
        </p>
        <h2 className="font-typewriter text-3xl md:text-4xl text-(--foreground) mb-16">
          YOUR MISSION AWAITS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="case-file" data-testid="case-preview-1">
            <div className="flex items-start justify-between mb-4">
              <span className="badge-difficulty badge-beginner">Beginner</span>
              <span className="font-mono text-xs text-[#666]">100 PTS</span>
            </div>
            <h3 className="font-typewriter text-xl text-(--foreground) mb-2">
              THE MISSING COMMIT
            </h3>
            <p className="text-sm text-(--foreground-muted) mb-4">
              A critical commit has vanished from the repository. Track it down
              before it's too late.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#666]">
              <span className="font-mono">git log</span>
              <span>•</span>
              <span className="font-mono">git status</span>
              <span>•</span>
              <span className="font-mono">git commit</span>
            </div>
          </div>

          <div className="case-file" data-testid="case-preview-2">
            <div className="flex items-start justify-between mb-4">
              <span className="badge-difficulty badge-beginner">Beginner</span>
              <span className="font-mono text-xs text-[#666]">120 PTS</span>
            </div>
            <h3 className="font-typewriter text-xl text-(--foreground) mb-2">
              THE BRANCHING CONSPIRACY
            </h3>
            <p className="text-sm text-(--foreground-muted) mb-4">
              Multiple branches lead to different suspects. Navigate through
              them to find the truth.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#666]">
              <span className="font-mono">git branch</span>
              <span>•</span>
              <span className="font-mono">git checkout</span>
              <span>•</span>
              <span className="font-mono">git switch</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}