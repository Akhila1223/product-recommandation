import "./SuggestionCard.css";

export default function SuggestionCard({ title, description, onClick }) {
  return (
    <button
      type="button"
      className="suggestion-card"
      onClick={onClick}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </button>
  );
}