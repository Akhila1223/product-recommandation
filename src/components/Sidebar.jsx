
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ onNewSuggestion }) {
  const location = useLocation();

  const handleNewSuggestion = (event) => {
    if (location.pathname === "/") {
      event.preventDefault();
    }

    onNewSuggestion();
  };

  return (
    <aside className="sidebar">
      <Link to="/" onClick={handleNewSuggestion}>
        Want new suggestion?
      </Link>

      <Link to="/history">
        Previous Suggestions
      </Link>
    </aside>
  );
}
