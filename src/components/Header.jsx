import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Terminal, Menu, X, Award, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import SupportButton from "./SupportButton";
import GitHubIcon from "./icons/GitHubIcon";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { toast } from "sonner";

const NAV_CLASS_NAME =
  "sticky top-0 z-50 bg-(--background)/90 backdrop-blur-sm border-b border-(--border)";

const BRAND_ICON_CLASS = "w-5 h-5 md:w-6 md:h-6 text-(--foreground-terminal)";

const BRAND_TEXT_CLASS =
  "font-typewriter text-lg md:text-xl tracking-wider text-(--primary)";

const MENU_BUTTON_CLASS =
  "p-2 transition-colors text-(--foreground) hover:text-(--primary)";

const MENU_WRAPPER_CLASS =
  "animate-fade-in md:absolute md:top-full md:inset-x-0 md:bg-transparent md:border-t-0 bg-(--background) border-t border-(--border)";

const MENU_PANEL_CLASS =
  "md:ml-auto md:w-full md:max-w-sm md:bg-(--background) md:border md:border-(--border)";

const DROPDOWN_LINK_BASE_CLASS =
  "block py-3 px-4 hover:text-(--primary) hover:bg-(--background-paper) font-mono text-sm uppercase tracking-wider transition-colors";

const DROPDOWN_LINK_ACTIVE_CLASS = "text-(--primary) bg-(--background-paper)";

const DROPDOWN_LINK_INACTIVE_CLASS = "text-(--foreground-muted)";

const LANDING_GITHUB_LINK_CLASS =
  "flex items-center gap-3 py-3 px-4 text-(--foreground-muted) hover:text-(--foreground) hover:bg-(--background-paper) font-mono text-sm uppercase tracking-wider transition-colors";

const LANDING_LOGOUT_BUTTON_CLASS =
  "w-full flex justify-center items-center py-3 px-4 mt-2 text-center text-(--foreground-muted) hover:text-(--primary) hover:bg-(--background-paper) font-mono text-sm uppercase tracking-wider border border-(--border) transition-colors";

const LANDING_LOGIN_LINK_CLASS =
  "block py-3 px-4 text-center text-(--foreground-muted) hover:text-(--primary) hover:bg-(--background-paper) font-mono text-sm uppercase tracking-wider border border-(--border) transition-colors";

export default function Header({ variant = "default", reputation }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingVariant = variant === "landing";
  const showReputation =
    !isLandingVariant && reputation !== null && reputation !== undefined;

  const menuButtonRef = useRef(null);
  const menuPanelRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((previous) => !previous);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, location.search, location.hash]);

  useOnClickOutside({
    refs: [menuButtonRef, menuPanelRef],
    enabled: mobileMenuOpen,
    onOutsideClick: closeMobileMenu,
  });

  const getDropdownNavLinkClass = ({ isActive }) =>
    isActive
      ? `${DROPDOWN_LINK_BASE_CLASS} ${DROPDOWN_LINK_ACTIVE_CLASS}`
      : `${DROPDOWN_LINK_BASE_CLASS} ${DROPDOWN_LINK_INACTIVE_CLASS}`;

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

  const renderLandingMenu = () => (
    <>
      <Link
        to="https://github.com/ilianrusev/GitNoir/"
        target="_blank"
        rel="noopener noreferrer"
        className={LANDING_GITHUB_LINK_CLASS}
        onClick={closeMobileMenu}
        data-testid="mobile-nav-github"
      >
        <GitHubIcon className="w-5 h-5" />
        GitHub
      </Link>

      <SupportButton onCloseMenu={closeMobileMenu} variant="landing" />

      <div className="border-t border-(--border) pt-4 mt-4">
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
            <button
              type="button"
              className={LANDING_LOGOUT_BUTTON_CLASS}
              onClick={handleLogout}
              data-testid="logout-btn"
            >
              <LogOut className="w-4 h-4 text-(--foreground-muted)" /> Logout
            </button>
          </>
        ) : (
          <div className="space-y-3">
            <Link
              to="/login"
              className={LANDING_LOGIN_LINK_CLASS}
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
    </>
  );

  const renderDefaultMenu = () => (
    <>
      <NavLink
        to="/dashboard"
        end
        className={getDropdownNavLinkClass}
        onClick={closeMobileMenu}
        data-testid="mobile-nav-dashboard"
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/cases"
        end
        className={getDropdownNavLinkClass}
        onClick={closeMobileMenu}
        data-testid="mobile-nav-cases"
      >
        Cases
      </NavLink>
      <NavLink
        to="/cheatsheet"
        end
        className={getDropdownNavLinkClass}
        onClick={closeMobileMenu}
        data-testid="mobile-nav-cheatsheet"
      >
        Cheat Sheet
      </NavLink>
      <NavLink
        to="/leaderboard"
        end
        className={getDropdownNavLinkClass}
        onClick={closeMobileMenu}
        data-testid="mobile-nav-leaderboard"
      >
        Leaderboard
      </NavLink>

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
    </>
  );

  return (
    <nav className={NAV_CLASS_NAME}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <Terminal className={BRAND_ICON_CLASS} />
          <span className={BRAND_TEXT_CLASS}>GIT NOIR</span>
        </Link>

        <div className="flex items-center gap-3">
          {showReputation ? (
            <div
              className="flex items-center gap-2 py-1.5 px-3 bg-(--background-paper) border border-(--border)"
              data-testid="user-reputation"
            >
              <Award className="w-4 h-4 text-(--primary)" />
              <span className="font-mono text-xs md:text-sm text-(--primary)">
                {reputation} REP
              </span>
            </div>
          ) : null}

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            className={MENU_BUTTON_CLASS}
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
        <div className={MENU_WRAPPER_CLASS}>
          <div className="md:max-w-7xl md:mx-auto md:px-4 lg:px-6">
            <div ref={menuPanelRef} className={MENU_PANEL_CLASS}>
              <div className="px-4 py-6 space-y-4">
                {isLandingVariant ? renderLandingMenu() : renderDefaultMenu()}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
