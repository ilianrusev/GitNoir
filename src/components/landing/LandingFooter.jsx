import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Terminal, HandHeart } from "lucide-react";

export default function LandingFooter() {
  const [supportMenuOpen, setSupportMenuOpen] = useState(false);
  const footerSupportRef = useRef(null);

  useEffect(() => {
    if (!supportMenuOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      const target = event.target;

      if (footerSupportRef.current && !footerSupportRef.current.contains(target)) {
        setSupportMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick, true);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick, true);
    };
  }, [supportMenuOpen]);

  return (
    <footer className="py-12 px-6 border-t border-(--border) bg-(--background-terminal)">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-6 h-6 text-(--foreground-terminal)" />
              <span className="font-typewriter text-xl text-(--primary)">
                GIT NOIR
              </span>
            </div>
            <p className="text-sm text-(--foreground-muted) leading-relaxed mb-4">
              A community-driven project to make learning Git fun and engaging.
              New cases, features, and improvements are added by contributors
              like you.
            </p>
            <p className="text-xs text-[#666]">
              Open source • Free forever • Built with love
            </p>
          </div>

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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

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
  );
}