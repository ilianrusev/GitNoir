import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function FAQSection() {
  return (
    <section className="py-24 px-6 bg-(--background)">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-xs text-(--primary) tracking-[0.3em] mb-4">
          FAQ
        </p>
        <h2 className="font-typewriter text-3xl md:text-4xl text-(--foreground) mb-12">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem
            value="faq-1"
            className="case-card border-none"
            data-testid="faq-1"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-typewriter text-lg text-(--primary) text-left">
                WHAT IS GIT NOIR?
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-(--foreground-muted) leading-relaxed">
                Git Noir is a free, gamified learning platform where you master
                Git commands by solving detective mysteries. Each case presents
                a story-driven scenario where you type real Git commands to
                progress through the investigation.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="faq-2"
            className="case-card border-none"
            data-testid="faq-2"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-typewriter text-lg text-(--primary) text-left">
                DO I NEED TO INSTALL ANYTHING?
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-(--foreground-muted) leading-relaxed">
                No! Git Noir runs entirely in your browser. You don't need to
                install Git or any other software. Our simulated terminal
                accepts Git commands and validates them against the expected
                solutions.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="faq-3"
            className="case-card border-none"
            data-testid="faq-3"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-typewriter text-lg text-(--primary) text-left">
                IS IT FREE?
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-(--foreground-muted) leading-relaxed">
                Yes, Git Noir is completely free and always will be. It's a
                community-driven project built by developers who want to make
                learning Git more accessible and fun. If you'd like to support
                the project, you can buy us a coffee!
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="faq-4"
            className="case-card border-none"
            data-testid="faq-4"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-typewriter text-lg text-(--primary) text-left">
                WHAT GIT COMMANDS WILL I LEARN?
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-(--foreground-muted) leading-relaxed">
                We cover everything from basics (git log, status, add, commit)
                to intermediate (branching, merging, rebasing) to advanced
                (bisect, reflog, worktrees, submodules). Each case focuses on
                specific commands with increasing difficulty.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="faq-5"
            className="case-card border-none"
            data-testid="faq-5"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-typewriter text-lg text-(--primary) text-left">
                HOW DOES THE POINTS SYSTEM WORK?
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-(--foreground-muted) leading-relaxed">
                You earn reputation points by solving cases. Each step in a
                case awards points when completed correctly. Higher difficulty
                cases reward more points. Some cases require a minimum
                reputation to unlock, encouraging you to complete easier cases
                first.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="faq-6"
            className="case-card border-none"
            data-testid="faq-6"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-typewriter text-lg text-(--primary) text-left">
                CAN I REPLAY COMPLETED CASES?
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-(--foreground-muted) leading-relaxed">
                Yes! You can replay any completed case for practice. However,
                you won't earn additional points on replays - the reputation
                system only rewards first-time completions to keep the
                leaderboard fair.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="faq-7"
            className="case-card border-none"
            data-testid="faq-7"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-typewriter text-lg text-(--primary) text-left">
                HOW CAN I CONTRIBUTE?
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-(--foreground-muted) leading-relaxed">
                Git Noir is open to contributions! You can help by creating new
                cases, fixing bugs, improving the UI, or translating content.
                Check out our GitHub repository to get started or join our
                community discussions.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}