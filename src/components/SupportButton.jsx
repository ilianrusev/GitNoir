import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, HandHeart } from "lucide-react";
import CoffeeIcon from "./icons/CoffeeIcon";
import RevolutIcon from "./icons/RevolutIcon";

const SUPPORT_BUTTON_CLASS =
  "w-full flex items-center gap-3 py-3 px-4 text-[#ffdd00] hover:text-(--primary) hover:bg-(--background-paper) font-mono text-sm uppercase tracking-wider transition-colors";

const SUPPORT_COFFEE_LINK_CLASS =
  "flex items-center gap-2 py-2 px-10 text-[#ffdd00] hover:text-(--primary) hover:bg-(--background-paper) font-mono text-xs uppercase tracking-wider transition-colors";

const SUPPORT_REVOLUT_LINK_CLASS =
  "flex items-center gap-2 py-2 px-10 text-(--foreground-muted) hover:text-(--primary) hover:bg-(--background-paper) font-mono text-xs uppercase tracking-wider transition-colors";

export default function SupportButton({ onCloseMenu }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={SUPPORT_BUTTON_CLASS}
        onClick={() => setIsOpen((previous) => !previous)}
        data-testid="mobile-nav-support-btn"
      >
        <HandHeart className="w-5 h-5" />
        <span>Support</span>
        <ChevronDown
          className={`w-4 h-4 ml-auto transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>
      {isOpen && (
        <div className="space-y-2" data-testid="mobile-support-options">
          <Link
            to="https://buymeacoffee.com/ilianrusev"
            target="_blank"
            rel="noopener noreferrer"
            className={SUPPORT_COFFEE_LINK_CLASS}
            onClick={onCloseMenu}
            data-testid="mobile-support-coffee"
          >
            <CoffeeIcon className="w-4 h-4" />
            Buy Me a Coffee
          </Link>
          <Link
            to="https://revolut.me/iliyanecoe"
            target="_blank"
            rel="noopener noreferrer"
            className={SUPPORT_REVOLUT_LINK_CLASS}
            onClick={onCloseMenu}
            data-testid="mobile-support-revolut"
          >
            <RevolutIcon className="w-4 h-4" />
            Revolut
          </Link>
        </div>
      )}
    </>
  );
}
