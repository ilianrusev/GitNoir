import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const faqItems = [
  {
    id: "faq-1",
    question: "WHAT IS GIT NOIR?",
    answer:
      "Git Noir is a free, gamified learning platform where you master Git commands by solving detective mysteries. Each case presents a story-driven scenario where you type real Git commands to progress through the investigation.",
  },
  {
    id: "faq-2",
    question: "DO I NEED TO INSTALL ANYTHING?",
    answer:
      "No! Git Noir runs entirely in your browser. You don't need to install Git or any other software. Our simulated terminal accepts Git commands and validates them against the expected solutions.",
  },
  {
    id: "faq-3",
    question: "IS IT FREE?",
    answer:
      "Yes, Git Noir is completely free and always will be. It's a community-driven project built by developers who want to make learning Git more accessible and fun. If you'd like to support the project, you can buy us a coffee!",
  },
  {
    id: "faq-4",
    question: "WHAT GIT COMMANDS WILL I LEARN?",
    answer:
      "We cover everything from basics (git log, status, add, commit) to intermediate (branching, merging, rebasing) to advanced (bisect, reflog, worktrees, submodules). Each case focuses on specific commands with increasing difficulty.",
  },
  {
    id: "faq-5",
    question: "HOW DOES THE POINTS SYSTEM WORK?",
    answer:
      "You earn reputation points by solving cases. Each step in a case awards points when completed correctly. Higher difficulty cases reward more points. Some cases require a minimum reputation to unlock, encouraging you to complete easier cases first.",
  },
  {
    id: "faq-6",
    question: "CAN I REPLAY COMPLETED CASES?",
    answer:
      "Yes! You can replay any completed case for practice. However, you won't earn additional points on replays - the reputation system only rewards first-time completions to keep the leaderboard fair.",
  },
  {
    id: "faq-7",
    question: "HOW CAN I CONTRIBUTE?",
    answer:
      "Git Noir is open to contributions! You can help by creating new cases, fixing bugs, improving the UI, or translating content. Check out our GitHub repository to get started or join our community discussions.",
  },
];

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
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="case-card border-none"
              data-testid={item.id}
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <span className="font-typewriter text-lg text-(--primary) text-left">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-(--foreground-muted) leading-relaxed">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
