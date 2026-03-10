import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Terminal,
  Menu,
  X,
  Award,
  LogOut,
  HandHeart,
  ChevronDown,
} from "lucide-react";
import { Button } from "./ui/button";
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
const CoffeeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364z" />
  </svg>
);

const RevolutIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fontSize="11"
      fontWeight="700"
      fill="black"
    >
      R
    </text>
  </svg>
);

export default function Header({ variant = "default", reputation }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSupportMenuOpen, setMobileSupportMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileSupportMenuOpen(false);
  };

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

  // Landing page variant (for non-authenticated pages)
  if (variant === "landing") {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-(--background)/90 backdrop-blur-sm border-b border-(--border)">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <Terminal className="w-5 h-5 md:w-6 md:h-6 text-(--foreground-terminal)" />
            <span className="font-typewriter text-lg md:text-xl text-(--primary) tracking-wider">
              GIT NOIR
            </span>
          </Link>

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

        {/* Menu */}
        {mobileMenuOpen && (
          <div className="bg-(--background) border-t border-(--border) animate-fade-in md:absolute md:top-full md:inset-x-0 md:bg-transparent md:border-t-0">
            <div className="md:max-w-7xl md:mx-auto md:px-4 lg:px-6">
              <div className="md:ml-auto md:w-full md:max-w-sm md:bg-(--background) md:border md:border-(--border)">
                <div className="px-4 py-6 space-y-4">
              <Link
                to="https://github.com/ilianrusev/GitNoir/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-3 px-4 text-(--foreground-muted) hover:text-(--foreground) hover:bg-(--background-paper) font-mono text-sm uppercase tracking-wider transition-colors"
                onClick={closeMobileMenu}
                data-testid="mobile-nav-github"
              >
                <GitHubIcon className="w-5 h-5" />
                GitHub
              </Link>
              <Link
                to="https://buymeacoffee.com/ilianrusev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-3 px-4 text-[#ffdd00] hover:text-(--primary) hover:bg-(--background-paper) font-mono text-sm uppercase tracking-wider transition-colors"
                onClick={closeMobileMenu}
              >
                <CoffeeIcon className="w-5 h-5" />
                Buy Me a Coffee
              </Link>
              <div className="border-t border-(--border) pt-4 mt-4">
                {user ? (
                  <Link to="/dashboard" onClick={closeMobileMenu}>
                    <Button
                      className="btn-primary w-full"
                      data-testid="mobile-nav-dashboard-btn"
                    >
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className={`${getDropdownLinkClass("/login")} text-center border border-(--border)`}
                      onClick={closeMobileMenu}
                      data-testid="mobile-nav-login"
                      aria-current={location.pathname === "/login" ? "page" : undefined}
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
            </div>
          </div>
        )}
      </nav>
    );
  }

  // Default variant (for authenticated pages - Dashboard, Cases, etc.)
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

            <button
              type="button"
              className="w-full flex items-center gap-3 py-3 px-4 text-[#ffdd00] hover:text-(--primary) hover:bg-(--background-paper) font-mono text-sm uppercase tracking-wider transition-colors"
              onClick={() => setMobileSupportMenuOpen((previous) => !previous)}
              data-testid="mobile-nav-support-btn"
            >
              <HandHeart className="w-5 h-5" />
              <span>Support</span>
              <ChevronDown
                className={`w-4 h-4 ml-auto transition-transform ${mobileSupportMenuOpen ? "rotate-180" : "rotate-0"}`}
              />
            </button>
            {mobileSupportMenuOpen && (
              <div className="space-y-2" data-testid="mobile-support-options">
                <Link
                  to="https://buymeacoffee.com/ilianrusev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-2 px-10 text-[#ffdd00] hover:text-(--primary) hover:bg-(--background-paper) font-mono text-xs uppercase tracking-wider transition-colors"
                  onClick={closeMobileMenu}
                  data-testid="mobile-support-coffee"
                >
                  <CoffeeIcon className="w-4 h-4" />
                  Buy Me a Coffee
                </Link>
                <Link
                  to="https://revolut.me/iliyanecoe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-2 px-10 text-(--foreground-muted) hover:text-(--primary) hover:bg-(--background-paper) font-mono text-xs uppercase tracking-wider transition-colors"
                  onClick={closeMobileMenu}
                  data-testid="mobile-support-revolut"
                >
                  <RevolutIcon className="w-4 h-4" />
                  Revolut
                </Link>
              </div>
            )}

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
