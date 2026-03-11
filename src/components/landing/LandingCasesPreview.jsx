const previewCases = [
  {
    id: "case-preview-1",
    points: "100 PTS",
    title: "THE MISSING COMMIT",
    description:
      "A critical commit has vanished from the repository. Track it down before it's too late.",
    commands: ["git log", "git status", "git commit"],
  },
  {
    id: "case-preview-2",
    points: "120 PTS",
    title: "THE BRANCHING CONSPIRACY",
    description:
      "Multiple branches lead to different suspects. Navigate through them to find the truth.",
    commands: ["git branch", "git checkout", "git switch"],
  },
];

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
          {previewCases.map((previewCase) => (
            <div
              key={previewCase.id}
              className="case-file"
              data-testid={previewCase.id}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="badge-difficulty badge-beginner">
                  Beginner
                </span>
                <span className="font-mono text-xs text-[#666]">
                  {previewCase.points}
                </span>
              </div>
              <h3 className="font-typewriter text-xl text-(--foreground) mb-2">
                {previewCase.title}
              </h3>
              <p className="text-sm text-(--foreground-muted) mb-4">
                {previewCase.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#666]">
                {previewCase.commands.map((command, index) => (
                  <span key={`${previewCase.id}-${command}`}>
                    {index > 0 ? <span className="mr-2">•</span> : null}
                    <span className="font-mono">{command}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
