import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isGuestUser } from "../services/authService";
import {
  Terminal,
  Menu,
  X,
  Award,
  LogOut,
  HandHeart,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import SupportButton from "./SupportButton";
import GitHubIcon from "./icons/GitHubIcon";
import CoffeeIcon from "./icons/CoffeeIcon";
import RevolutIcon from "./icons/RevolutIcon";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { toast } from "sonner";

const NAV_CLASS_NAME =
  "sticky top-0 z-50 relative bg-(--background)/90 backdrop-blur-sm border-b border-(--border)";

const BRAND_ICON_CLASS = "w-5 h-5 md:w-6 md:h-6 text-(--foreground-terminal)";

const BRAND_TEXT_CLASS =
  "font-typewriter text-lg md:text-xl tracking-wider text-(--primary)";

const MENU_BUTTON_CLASS =
  "p-2 transition-colors text-(--foreground) hover:text-(--primary)";

const MENU_WRAPPER_CLASS = "animate-fade-in absolute top-full inset-x-0 z-50";

const MENU_PANEL_CLASS =
  "w-full bg-(--background) border border-(--border) md:ml-auto md:max-w-sm";

const DROPDOWN_LINK_BASE_CLASS =
  "block py-3 px-4 hover:text-(--primary) hover:bg-(--background-paper) font-mono text-sm uppercase tracking-wider transition-colors";

const DROPDOWN_LINK_ACTIVE_CLASS = "text-(--primary) bg-(--background-paper)";

const DROPDOWN_LINK_INACTIVE_CLASS = "text-(--foreground-muted)";

const LANDING_GITHUB_LINK_CLASS =
  "flex items-center gap-3 py-3 px-4 text-(--foreground-muted) hover:text-(--foreground) hover:bg-(--background-paper) font-mono text-sm uppercase tracking-wider transition-colors";

const LANDING_DESKTOP_ICON_BUTTON_CLASS =
  "p-2 text-(--foreground-muted) hover:text-(--primary) transition-colors";

const BASE_NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", testId: "mobile-nav-dashboard" },
  {
    to: "/cheatsheet",
    label: "Cheat Sheet",
    testId: "mobile-nav-cheatsheet",
  },
];

interface HeaderProps {
  variant?: "default" | "landing";
  reputation?: number;
}

export default function Header({ variant = "default", reputation }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = Boolean(user) && !isGuestUser(user);
  const isLandingVariant = variant === "landing";
  const showLandingDesktopIcons = isLandingVariant;
  const showLandingProfileIcon = isLandingVariant && !isAuthenticated;
  const showReputation =
    !isLandingVariant && reputation !== null && reputation !== undefined;

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const desktopSupportRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSupportOpen, setDesktopSupportOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((previous) => !previous);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    closeMobileMenu();
    setDesktopSupportOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useOnClickOutside({
    refs: [menuButtonRef, menuPanelRef],
    enabled: mobileMenuOpen,
    onOutsideClick: closeMobileMenu,
  });

  useOnClickOutside({
    refs: [desktopSupportRef],
    enabled: desktopSupportOpen,
    onOutsideClick: () => setDesktopSupportOpen(false),
  });

  const getDropdownNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? `${DROPDOWN_LINK_BASE_CLASS} ${DROPDOWN_LINK_ACTIVE_CLASS}`
      : `${DROPDOWN_LINK_BASE_CLASS} ${DROPDOWN_LINK_INACTIVE_CLASS}`;

  const renderNavLinks = () => (
    <>
      {BASE_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={getDropdownNavLinkClass}
          onClick={closeMobileMenu}
          data-testid={item.testId}
        >
          {item.label}
        </NavLink>
      ))}

      {isAuthenticated && (
        <NavLink
          to="/leaderboard"
          end
          className={getDropdownNavLinkClass}
          onClick={closeMobileMenu}
          data-testid="mobile-nav-leaderboard"
        >
          Leaderboard
        </NavLink>
      )}
    </>
  );

  const renderCreateBadgeButton = (testId = "mobile-create-badge-btn") => (
    <Link to="/register" onClick={closeMobileMenu}>
      <Button className="btn-outline w-full mt-3" data-testid={testId}>
        Create Your Badge
      </Button>
    </Link>
  );

  const renderLogoutButton = (testId: string, extraClass = "") => (
    <Button
      onClick={handleLogout}
      className={`btn-outline w-full flex items-center justify-center gap-2 ${extraClass}`}
      data-testid={testId}
    >
      <LogOut className="w-4 h-4" />
      Logout
    </Button>
  );

  const renderSupportSection = (isLanding: boolean) => {
    if (isLanding) {
      return (
        <div className="md:hidden">
          <Link
            to="https://github.com/ilianrusev/GitNoir/"
            target="_blank"
            rel="noopener noreferrer"
            className={LANDING_GITHUB_LINK_CLASS}
            data-testid="mobile-nav-github"
          >
            <GitHubIcon className="w-5 h-5" />
            GitHub
          </Link>

          <SupportButton onCloseMenu={closeMobileMenu} />
        </div>
      );
    }

    return <SupportButton onCloseMenu={closeMobileMenu} />;
  };

  const renderMenuFooter = (isLanding: boolean) => {
    if (isLanding) {
      return (
        <div className="border-t border-(--border) pt-4 mt-4 space-y-3">
          <Link to="/dashboard" onClick={closeMobileMenu}>
            <Button
              className="btn-primary w-full"
              data-testid="mobile-nav-dashboard-btn"
            >
              Start Investigation
            </Button>
          </Link>

          {!isAuthenticated && renderCreateBadgeButton()}
          {isAuthenticated &&
            renderLogoutButton("mobile-landing-logout-btn", "mt-3")}
        </div>
      );
    }

    return (
      <div className="border-t border-(--border) pt-4 mt-4">
        {isAuthenticated
          ? renderLogoutButton("mobile-logout-btn")
          : renderCreateBadgeButton()}
      </div>
    );
  };

  const renderMenu = (isLanding: boolean) => (
    <>
      {renderNavLinks()}
      {renderSupportSection(isLanding)}
      {renderMenuFooter(isLanding)}
    </>
  );

  const handleLogout = async () => {
    try {
      navigate("/", { replace: true });
      await logout();
      toast.success("Logged out successfully");
      closeMobileMenu();
    } catch (error) {
      toast.error(
        (error as Error).message || "Logout failed. Please try again.",
      );
    }
  };

  return (
    <nav className={NAV_CLASS_NAME}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <Terminal className={BRAND_ICON_CLASS} />
          <span className={BRAND_TEXT_CLASS}>GIT NOIR</span>
        </Link>

        <div className="flex items-center gap-3">
          {showLandingDesktopIcons && (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="https://github.com/ilianrusev/GitNoir/"
                target="_blank"
                rel="noopener noreferrer"
                className={LANDING_DESKTOP_ICON_BUTTON_CLASS}
                title="View on GitHub"
                data-testid="landing-desktop-github"
              >
                <GitHubIcon className="w-5 h-5" />
              </Link>

              <div className="relative" ref={desktopSupportRef}>
                <button
                  type="button"
                  className={LANDING_DESKTOP_ICON_BUTTON_CLASS}
                  title="Support the project"
                  data-testid="landing-desktop-support"
                  onClick={() => setDesktopSupportOpen((previous) => !previous)}
                >
                  <HandHeart className="w-5 h-5 text-[#ffdd00]" />
                </button>

                {desktopSupportOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-(--background) border border-(--border) z-50">
                    <Link
                      to="https://buymeacoffee.com/ilianrusev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 text-sm font-mono text-[#ffdd00] hover:bg-(--background-paper)"
                    >
                      <CoffeeIcon className="w-4 h-4" />
                      Buy Me a Coffee
                    </Link>
                    <Link
                      to="https://revolut.me/iliyanecoe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 text-sm font-mono text-(--foreground-muted) hover:bg-(--background-paper)"
                    >
                      <RevolutIcon className="w-4 h-4" />
                      Revolut
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {showLandingProfileIcon && (
            <Link
              to="/login"
              className={LANDING_DESKTOP_ICON_BUTTON_CLASS}
              title="Login"
              aria-label="Login"
              data-testid="landing-profile"
            >
              <User className="w-5 h-5" />
            </Link>
          )}

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
                {renderMenu(isLandingVariant)}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
