import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Terminal, Menu, X, Award, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import SupportButton from "./SupportButton";
import { toast } from "sonner";

// GitHub icon SVG component
const GitHubIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

// Coffee icon SVG component
export default function Header({ variant = "default", reputation }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, location.search, location.hash]);

  const getDropdownLinkClass = (path) => {
    const baseClass =
      "block py-3 px-4 hover:text-(--primary) hover:bg-(--background-paper) font-mono text-sm uppercase tracking-wider transition-colors";

    return location.pathname === path
      ? `${baseClass} text-(--primary) bg-(--background-paper)`
      : `${baseClass} text-(--foreground-muted)`;
  };

  const handleLogout = async () => {
    try {
      navigate("/", { replace: true });
      await logout();
      toast.success("Logged out successfully");
      closeMobileMenu();
    } catch (error) {
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-(--background)/90 backdrop-blur-sm border-b border-(--border)">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <Terminal className="w-5 h-5 md:w-6 md:h-6 text-(--foreground-terminal)" />
          <span className="font-typewriter text-lg md:text-xl text-(--primary) tracking-wider">
            GIT NOIR
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {reputation === null || reputation === undefined ? null : (
            <div
              className="flex items-center gap-2 py-1.5 px-3 bg-(--background-paper) border border-(--border)"
              data-testid="user-reputation"
            >
              <Award className="w-4 h-4 text-(--primary)" />
              <span className="font-mono text-xs md:text-sm text-(--primary)">
                {reputation} REP
              </span>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="p-2 text-(--foreground) hover:text-(--primary) transition-colors"
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
      </div>

      {/* Menu */}
      {mobileMenuOpen && (
        <div className="bg-(--background) border-t border-(--border) animate-fade-in md:absolute md:top-full md:inset-x-0 md:bg-transparent md:border-t-0">
          <div className="md:max-w-7xl md:mx-auto md:px-4 lg:px-6">
            <div className="md:ml-auto md:w-full md:max-w-sm md:bg-(--background) md:border md:border-(--border)">
              <div className="px-4 py-6 space-y-4">
            <Link
              to="/dashboard"
              className={getDropdownLinkClass("/dashboard")}
              onClick={closeMobileMenu}
              data-testid="mobile-nav-dashboard"
              aria-current={location.pathname === "/dashboard" ? "page" : undefined}
            >
              Dashboard
            </Link>
            <Link
              to="/cases"
              className={getDropdownLinkClass("/cases")}
              onClick={closeMobileMenu}
              data-testid="mobile-nav-cases"
              aria-current={location.pathname === "/cases" ? "page" : undefined}
            >
              Cases
            </Link>
            <Link
              to="/cheatsheet"
              className={getDropdownLinkClass("/cheatsheet")}
              onClick={closeMobileMenu}
              data-testid="mobile-nav-cheatsheet"
              aria-current={location.pathname === "/cheatsheet" ? "page" : undefined}
            >
              Cheat Sheet
            </Link>
            <Link
              to="/leaderboard"
              className={getDropdownLinkClass("/leaderboard")}
              onClick={closeMobileMenu}
              data-testid="mobile-nav-leaderboard"
              aria-current={location.pathname === "/leaderboard" ? "page" : undefined}
            >
              Leaderboard
            </Link>

            <SupportButton onCloseMenu={closeMobileMenu} />

            <div className="border-t border-(--border) pt-4 mt-4">
              <Button
                onClick={handleLogout}
                className="btn-outline w-full flex items-center justify-center gap-2"
                data-testid="mobile-logout-btn"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
