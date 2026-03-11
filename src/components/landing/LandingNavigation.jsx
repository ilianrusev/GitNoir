import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Terminal, LogOut, HandHeart, User } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function LandingNavigation({
  user,
  logout,
}) {
  const [navSupportMenuOpen, setNavSupportMenuOpen] = useState(false);
  const navSupportRef = useRef(null);

  useEffect(() => {
    if (!navSupportMenuOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      const target = event.target;

      if (navSupportRef.current && !navSupportRef.current.contains(target)) {
        setNavSupportMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [navSupportMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  return (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-(--background)/90 backdrop-blur-sm border-b border-(--border)">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <Terminal className="w-5 h-5 md:w-6 md:h-6 text-(--foreground-terminal)" />
          <span className="font-typewriter text-lg md:text-xl text-(--primary) tracking-wider">
            GIT NOIR
          </span>
        </Link>

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
                <Button className="btn-primary" data-testid="nav-dashboard-btn">
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
              <Link
                to="/login"
                className="flex items-center text-(--foreground-muted) hover:text-(--primary) transition-colors"
                title="Login"
                aria-label="Login"
                data-testid="nav-login"
              >
                <User className="w-5 h-5" />
              </Link>
              <Link to="/dashboard">
                <Button className="btn-primary" data-testid="nav-register-btn">
                  Start Investigation
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}