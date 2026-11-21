
import { Moon, Sun } from "lucide-react";
import "./Header.css";

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <h1 className="header-title">
        Product Recommendation AI
      </h1>

      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label={
          theme === "light"
            ? "Switch to dark mode"
            : "Switch to light mode"
        }
      >
        {theme === "light" ? (
          <>
            <Moon size={18} />
            Dark
          </>
        ) : (
          <>
            <Sun size={18} />
            Light
          </>
        )}
      </button>
    </header>
  );
}
