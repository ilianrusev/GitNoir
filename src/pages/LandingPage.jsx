import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Terminal, GitBranch, Award, LogOut, HandHeart } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { toast } from "sonner";
import Header from "../components/Header";

export default function LandingPage() {
  const { user, logout } = useAuth();
  const [navSupportMenuOpen, setNavSupportMenuOpen] = useState(false);
  const [supportMenuOpen, setSupportMenuOpen] = useState(false);
  const navSupportRef = useRef(null);
  const footerSupportRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    if (!navSupportMenuOpen && !supportMenuOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      const target = event.target;

      if (
        navSupportMenuOpen &&
        navSupportRef.current &&
        !navSupportRef.current.contains(target)
      ) {
        setNavSupportMenuOpen(false);
      }

      if (
        supportMenuOpen &&
        footerSupportRef.current &&
        !footerSupportRef.current.contains(target)
      ) {
        setSupportMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [navSupportMenuOpen, supportMenuOpen]);

  return (
    <div className="min-h-screen bg-(--background)">
      <div className="md:hidden">
        <Header variant="landing" />
      </div>

      {/* Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-(--background)/90 backdrop-blur-sm border-b border-(--border)">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <Terminal className="w-5 h-5 md:w-6 md:h-6 text-(--foreground-terminal)" />
            <span className="font-typewriter text-lg md:text-xl text-(--primary) tracking-wider">
              GIT NOIR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="https://github.com/ilianrusev/GitNoir/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-(--foreground-muted) hover:text-(--foreground) transition-colors"
              title="View on GitHub"
              data-testid="nav-github-btn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <div className="relative" ref={navSupportRef}>
              <button
                type="button"
                onClick={() => setNavSupportMenuOpen((previous) => !previous)}
                className="flex items-center text-[#ffdd00] hover:text-(--primary) transition-colors"
                title="Support the project"
                data-testid="nav-support-btn"
              >
                <HandHeart className="w-6 h-6" />
              </button>

              {navSupportMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-[#111] border border-(--border) z-50"
                  data-testid="nav-support-options"
                >
                  <Link
                    to="https://buymeacoffee.com/ilianrusev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm font-mono text-[#ffdd00] hover:bg-(--background-paper)"
                    data-testid="nav-support-coffee"
                  >
                    Buy Me a Coffee
                  </Link>
                  <Link
                    to="https://revolut.me/iliyanecoe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm font-mono text-(--foreground) hover:bg-(--background-paper)"
                    data-testid="nav-support-revolut"
                  >
                    Revolut
                  </Link>
                </div>
              )}
            </div>
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button
                    className="btn-primary"
                    data-testid="nav-dashboard-btn"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="p-2 hover:bg-(--background-paper)"
                  data-testid="logout-btn"
                >
                  <LogOut className="w-4 h-4 text-(--foreground-muted)" />
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="nav-link" data-testid="nav-login">
                  Login
                </Link>
                <Link to="/register">
                  <Button
                    className="btn-primary"
                    data-testid="nav-register-btn"
                  >
                    Start Investigation
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section pt-20">
        <div
          className="hero-bg"
          style={{
            backgroundImage: `url('/night-town.jpeg')`,
          }}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="font-mono text-xs text-(--primary) tracking-[0.3em] mb-4 animate-fade-in">
            CASE FILE #001 - ACTIVE
          </p>
          <h1
            className="font-typewriter text-5xl md:text-7xl text-(--foreground) mb-6 leading-tight animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            LEARN GIT.
            <br />
            <span className="text-(--primary)">SOLVE MYSTERIES.</span>
          </h1>
          <p
            className="text-lg md:text-xl text-(--foreground-muted) max-w-xl mb-10 leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Every commit tells a story. Every branch holds a clue. Master Git
            commands by solving detective cases in this noir-themed learning
            adventure.
          </p>
          <div
            className="flex flex-wrap gap-4 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Link to="/register">
              <Button
                className="btn-primary text-base px-8 py-4"
                data-testid="hero-start-btn"
              >
                Begin Investigation
              </Button>
            </Link>
            {user && (
              <Link to="/leaderboard">
                <Button
                  className="btn-outline text-base px-8 py-4"
                  data-testid="hero-leaderboard-btn"
                >
                  View Detectives
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-(--background)">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs text-(--primary) tracking-[0.3em] mb-4">
            HOW IT WORKS
          </p>
          <h2 className="font-typewriter text-3xl md:text-4xl text-(--foreground) mb-16">
            CRACK THE CODE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="case-card p-8 animate-fade-in"
              data-testid="feature-card-1"
            >
              <div className="w-12 h-12 flex items-center justify-center border border-(--foreground-terminal) mb-6">
                <Terminal className="w-6 h-6 text-(--foreground-terminal)" />
              </div>
              <h3 className="font-typewriter text-xl text-(--foreground) mb-4">
                INTERACTIVE TERMINAL
              </h3>
              <p className="text-(--foreground-muted) leading-relaxed">
                Type real Git commands in our simulated terminal. Learn by
                doing, not just reading.
              </p>
            </div>

            <div
              className="case-card p-8 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
              data-testid="feature-card-2"
            >
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

            <div
              className="case-card p-8 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
              data-testid="feature-card-3"
            >
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

      {/* Cases Preview */}
      <section className="py-24 px-6 bg-(--background-terminal) border-y border-(--border)">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs text-(--primary) tracking-[0.3em] mb-4">
            ACTIVE CASES
          </p>
          <h2 className="font-typewriter text-3xl md:text-4xl text-(--foreground) mb-16">
            YOUR MISSION AWAITS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="case-file animate-slide-in"
              data-testid="case-preview-1"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="badge-difficulty badge-beginner">
                  Beginner
                </span>
                <span className="font-mono text-xs text-[#666]">100 PTS</span>
              </div>
              <h3 className="font-typewriter text-xl text-(--foreground) mb-2">
                THE MISSING COMMIT
              </h3>
              <p className="text-sm text-(--foreground-muted) mb-4">
                A critical commit has vanished from the repository. Track it
                down before it's too late.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#666]">
                <span className="font-mono">git log</span>
                <span>•</span>
                <span className="font-mono">git status</span>
                <span>•</span>
                <span className="font-mono">git commit</span>
              </div>
            </div>

            <div
              className="case-file animate-slide-in"
              style={{ animationDelay: "0.1s" }}
              data-testid="case-preview-2"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="badge-difficulty badge-beginner">
                  Beginner
                </span>
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

      {/* FAQ Section */}
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
                  Git Noir is a free, gamified learning platform where you
                  master Git commands by solving detective mysteries. Each case
                  presents a story-driven scenario where you type real Git
                  commands to progress through the investigation.
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
                  Git Noir is open to contributions! You can help by creating
                  new cases, fixing bugs, improving the UI, or translating
                  content. Check out our GitHub repository to get started or
                  join our community discussions.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-(--background-terminal) border-y border-(--border)">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-typewriter text-3xl md:text-5xl text-(--foreground) mb-6">
            THE CITY NEEDS YOU,
            <br />
            <span className="text-(--primary)">DETECTIVE.</span>
          </h2>
          <p className="text-lg text-(--foreground-muted) mb-10">
            Join thousands of developers mastering Git through mystery and
            intrigue.
          </p>
          <Link to="/register">
            <Button
              className="btn-primary text-base px-10 py-4"
              data-testid="cta-register-btn"
            >
              Create Your Badge
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-(--border) bg-(--background-terminal)">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* About */}
            <div ref={footerSupportRef}>
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="w-6 h-6 text-(--foreground-terminal)" />
                <span className="font-typewriter text-xl text-(--primary)">
                  GIT NOIR
                </span>
              </div>
              <p className="text-sm text-(--foreground-muted) leading-relaxed mb-4">
                A community-driven project to make learning Git fun and
                engaging. New cases, features, and improvements are added by
                contributors like you.
              </p>
              <p className="text-xs text-[#666]">
                Open source • Free forever • Built with love
              </p>
            </div>

            {/* Community */}
            <div>
              <h4 className="font-mono text-xs text-(--primary) tracking-wider mb-4">
                COMMUNITY DRIVEN
              </h4>
              <p className="text-sm text-(--foreground-muted) leading-relaxed mb-4">
                Git Noir is built by developers, for developers. We welcome
                contributions of all kinds - new cases, bug fixes, translations,
                and ideas!
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to="https://github.com/ilianrusev/GitNoir/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#666] hover:text-(--foreground) transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Support */}
            <div ref={footerSupportRef}>
              <h4 className="font-mono text-xs text-(--primary) tracking-wider mb-4">
                SUPPORT THE PROJECT
              </h4>
              <p className="text-sm text-(--foreground-muted) leading-relaxed mb-4">
                If Git Noir helped you learn, consider supporting the project.
                Your support helps keep the servers running and motivates new
                content.
              </p>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setSupportMenuOpen((previous) => !previous);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-(--border) text-(--foreground) font-mono text-sm hover:border-(--primary) hover:text-(--primary) transition-colors"
                data-testid="support-toggle-btn"
              >
                <HandHeart className="w-4 h-4" />
                Support
              </button>

              {supportMenuOpen && (
                <div
                  className="mt-3 space-y-2"
                  data-testid="support-options"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Link
                    to="https://buymeacoffee.com/ilianrusev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 bg-[#ffdd00] text-black font-mono text-sm hover:bg-(--primary) transition-colors"
                    data-testid="buy-coffee-btn"
                  >
                    Buy Me a Coffee
                  </Link>
                  <Link
                    to="https://revolut.me/iliyanecoe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 border border-(--border) text-(--foreground) font-mono text-sm hover:border-(--primary) hover:text-(--primary) transition-colors"
                    data-testid="revolut-btn"
                  >
                    Revolut
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#222] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-[#444]">
              © 2026 Git Noir. Made with caffeine and commit messages.
            </p>
            <div className="flex items-center gap-6">
              <span className="font-mono text-xs text-[#666]">
                Learn Git. Solve Crimes. Have Fun.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
