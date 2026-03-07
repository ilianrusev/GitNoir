import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import { Terminal, GitBranch, Award, Menu, X, LogOut } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { toast } from "sonner";

export default function LandingPage() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    closeMobileMenu();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <Terminal className="w-5 h-5 md:w-6 md:h-6 text-[#00ff41]" />
            <span className="font-typewriter text-lg md:text-xl text-[#ffb703] tracking-wider">
              GIT QUEST
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/leaderboard"
              className="nav-link"
              data-testid="nav-leaderboard"
            >
              Leaderboard
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors"
              title="View on GitHub"
              data-testid="nav-github-btn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#ffdd00] hover:text-[#ffb703] transition-colors"
              title="Support the project"
              data-testid="nav-coffee-btn"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364z" />
              </svg>
            </a>
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
                  className="p-2 hover:bg-[#1a1a1a]"
                  data-testid="logout-btn"
                >
                  <LogOut className="w-4 h-4 text-[#a3a3a3]" />
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#e5e5e5] hover:text-[#ffb703] transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a] border-t border-[#333] animate-fade-in">
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/leaderboard"
                className="block py-3 px-4 text-[#a3a3a3] hover:text-[#ffb703] hover:bg-[#1a1a1a] font-mono text-sm uppercase tracking-wider transition-colors"
                onClick={closeMobileMenu}
                data-testid="mobile-nav-leaderboard"
              >
                Leaderboard
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-3 px-4 text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#1a1a1a] font-mono text-sm uppercase tracking-wider transition-colors"
                onClick={closeMobileMenu}
                data-testid="mobile-nav-github"
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
                GitHub
              </a>
              <a
                href="https://buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-3 px-4 text-[#ffdd00] hover:text-[#ffb703] hover:bg-[#1a1a1a] font-mono text-sm uppercase tracking-wider transition-colors"
                onClick={closeMobileMenu}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364z" />
                </svg>
                Buy Me a Coffee
              </a>

              <div className="border-t border-[#333] pt-4 mt-4">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={closeMobileMenu}>
                      <Button
                        className="btn-primary w-full"
                        data-testid="mobile-nav-dashboard-btn"
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Link
                      className=" flex justify-center items-center py-3 px-4 mt-2 text-center text-[#a3a3a3] hover:text-[#ffb703] hover:bg-[#1a1a1a] font-mono text-sm uppercase tracking-wider border border-[#333] transition-colors"
                      onClick={handleLogout}
                      data-testid="logout-btn"
                    >
                      <LogOut className="w-4 h-4 text-[#a3a3a3]" /> Logout
                    </Link>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block py-3 px-4 text-center text-[#a3a3a3] hover:text-[#ffb703] hover:bg-[#1a1a1a] font-mono text-sm uppercase tracking-wider border border-[#333] transition-colors"
                      onClick={closeMobileMenu}
                      data-testid="mobile-nav-login"
                    >
                      Login
                    </Link>
                    <Link to="/register" onClick={closeMobileMenu}>
                      <Button
                        className="btn-primary w-full"
                        data-testid="mobile-nav-register-btn"
                      >
                        Start Investigation
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero-section pt-20">
        <div
          className="hero-bg"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1635931225069-4968458f04f8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwxfHxkZXRlY3RpdmUlMjBub2lyJTIwY2l0eSUyMG5pZ2h0fGVufDB8fHx8MTc3MjgzMzY2OXww&ixlib=rb-4.1.0&q=85')`,
          }}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="font-mono text-xs text-[#ffb703] tracking-[0.3em] mb-4 animate-fade-in">
            CASE FILE #001 - ACTIVE
          </p>
          <h1
            className="font-typewriter text-5xl md:text-7xl text-[#e5e5e5] mb-6 leading-tight animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            LEARN GIT.
            <br />
            <span className="text-[#ffb703]">SOLVE MYSTERIES.</span>
          </h1>
          <p
            className="text-lg md:text-xl text-[#a3a3a3] max-w-xl mb-10 leading-relaxed animate-fade-in"
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
            <Link to="/leaderboard">
              <Button
                className="btn-outline text-base px-8 py-4"
                data-testid="hero-leaderboard-btn"
              >
                View Detectives
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs text-[#ffb703] tracking-[0.3em] mb-4">
            HOW IT WORKS
          </p>
          <h2 className="font-typewriter text-3xl md:text-4xl text-[#e5e5e5] mb-16">
            CRACK THE CODE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="case-card p-8 animate-fade-in"
              data-testid="feature-card-1"
            >
              <div className="w-12 h-12 flex items-center justify-center border border-[#00ff41] mb-6">
                <Terminal className="w-6 h-6 text-[#00ff41]" />
              </div>
              <h3 className="font-typewriter text-xl text-[#e5e5e5] mb-4">
                INTERACTIVE TERMINAL
              </h3>
              <p className="text-[#a3a3a3] leading-relaxed">
                Type real Git commands in our simulated terminal. Learn by
                doing, not just reading.
              </p>
            </div>

            <div
              className="case-card p-8 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
              data-testid="feature-card-2"
            >
              <div className="w-12 h-12 flex items-center justify-center border border-[#ffb703] mb-6">
                <GitBranch className="w-6 h-6 text-[#ffb703]" />
              </div>
              <h3 className="font-typewriter text-xl text-[#e5e5e5] mb-4">
                MYSTERY CASES
              </h3>
              <p className="text-[#a3a3a3] leading-relaxed">
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
              <h3 className="font-typewriter text-xl text-[#e5e5e5] mb-4">
                EARN REPUTATION
              </h3>
              <p className="text-[#a3a3a3] leading-relaxed">
                Solve cases to earn points. Build your reputation and unlock
                advanced mysteries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cases Preview */}
      <section className="py-24 px-6 bg-[#0c0c0c] border-y border-[#333]">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs text-[#ffb703] tracking-[0.3em] mb-4">
            ACTIVE CASES
          </p>
          <h2 className="font-typewriter text-3xl md:text-4xl text-[#e5e5e5] mb-16">
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
              <h3 className="font-typewriter text-xl text-[#e5e5e5] mb-2">
                THE MISSING COMMIT
              </h3>
              <p className="text-sm text-[#a3a3a3] mb-4">
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
              <h3 className="font-typewriter text-xl text-[#e5e5e5] mb-2">
                THE BRANCHING CONSPIRACY
              </h3>
              <p className="text-sm text-[#a3a3a3] mb-4">
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
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-xs text-[#ffb703] tracking-[0.3em] mb-4">
            FAQ
          </p>
          <h2 className="font-typewriter text-3xl md:text-4xl text-[#e5e5e5] mb-12">
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="faq-1"
              className="case-card border-none"
              data-testid="faq-1"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <span className="font-typewriter text-lg text-[#ffb703] text-left">
                  WHAT IS GIT QUEST?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-[#a3a3a3] leading-relaxed">
                  Git Quest is a free, gamified learning platform where you
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
                <span className="font-typewriter text-lg text-[#ffb703] text-left">
                  DO I NEED TO INSTALL ANYTHING?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-[#a3a3a3] leading-relaxed">
                  No! Git Quest runs entirely in your browser. You don't need to
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
                <span className="font-typewriter text-lg text-[#ffb703] text-left">
                  IS IT FREE?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-[#a3a3a3] leading-relaxed">
                  Yes, Git Quest is completely free and always will be. It's a
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
                <span className="font-typewriter text-lg text-[#ffb703] text-left">
                  WHAT GIT COMMANDS WILL I LEARN?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-[#a3a3a3] leading-relaxed">
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
                <span className="font-typewriter text-lg text-[#ffb703] text-left">
                  HOW DOES THE POINTS SYSTEM WORK?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-[#a3a3a3] leading-relaxed">
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
                <span className="font-typewriter text-lg text-[#ffb703] text-left">
                  CAN I REPLAY COMPLETED CASES?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-[#a3a3a3] leading-relaxed">
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
                <span className="font-typewriter text-lg text-[#ffb703] text-left">
                  HOW CAN I CONTRIBUTE?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <p className="text-[#a3a3a3] leading-relaxed">
                  Git Quest is open to contributions! You can help by creating
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
      <section className="py-24 px-6 bg-[#0c0c0c] border-y border-[#333]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-typewriter text-3xl md:text-5xl text-[#e5e5e5] mb-6">
            THE CITY NEEDS YOU,
            <br />
            <span className="text-[#ffb703]">DETECTIVE.</span>
          </h2>
          <p className="text-lg text-[#a3a3a3] mb-10">
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
      <footer className="py-12 px-6 border-t border-[#333] bg-[#0c0c0c]">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="w-6 h-6 text-[#00ff41]" />
                <span className="font-typewriter text-xl text-[#ffb703]">
                  GIT QUEST
                </span>
              </div>
              <p className="text-sm text-[#a3a3a3] leading-relaxed mb-4">
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
              <h4 className="font-mono text-xs text-[#ffb703] tracking-wider mb-4">
                COMMUNITY DRIVEN
              </h4>
              <p className="text-sm text-[#a3a3a3] leading-relaxed mb-4">
                Git Quest is built by developers, for developers. We welcome
                contributions of all kinds - new cases, bug fixes, translations,
                and ideas!
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#666] hover:text-[#e5e5e5] transition-colors"
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
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#666] hover:text-[#e5e5e5] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-mono text-xs text-[#ffb703] tracking-wider mb-4">
                SUPPORT THE PROJECT
              </h4>
              <p className="text-sm text-[#a3a3a3] leading-relaxed mb-4">
                If Git Quest helped you learn, consider buying me a coffee! Your
                support helps keep the servers running and motivates new
                content.
              </p>
              <a
                href="https://buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffdd00] text-[#000] font-mono text-sm hover:bg-[#ffb703] transition-colors"
                data-testid="buy-coffee-btn"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364z" />
                </svg>
                Buy Me a Coffee
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#222] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-[#444]">
              © 2024 Git Quest. Made with caffeine and commit messages.
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
