import { useState } from "react";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";
import "./ChatMessages.css";

export default function ChatMessage({
  sender,
  text,
  rating,
  feedback,
  onRate,
  onDislike,
}) {
  const [showRating, setShowRating] = useState(false);

  const isBot = sender === "bot";

  const renderMessageText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return String(text)
      .split(urlRegex)
      .map((part, index) => {
        if (/^https?:\/\//.test(part)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="recommendation-link"
            >
              {part}
            </a>
          );
        }

        return part;
      });
  };

  return (
    <div className={`chat-message ${isBot ? "bot-message" : "user-message"}`}>
      <h3>{isBot ? "Product Recommendation AI" : "You"}</h3>

      <p>{renderMessageText(text)}</p>

      {isBot && (
        <div className="feedback-section">
          <div className="feedback-actions">
            <button
              type="button"
              aria-label="Like response"
              onClick={() => setShowRating((previous) => !previous)}
            >
              <ThumbsUp size={18} />
            </button>

            <button
              type="button"
              aria-label="Dislike response"
              onClick={onDislike}
            >
              <ThumbsDown size={18} />
            </button>
          </div>

          {showRating && (
            <div className="star-rating">
              <span>Rate this response:</span>

              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} stars`}
                  onClick={() => onRate(star)}
                >
                  <Star
                    size={20}
                    fill={star <= (rating || 0) ? "#facc15" : "none"}
                    color="#eab308"
                  />
                </button>
              ))}
            </div>
          )}

          {rating !== null && rating !== undefined && (
            <p className="rating-result">Your rating: {rating}/5</p>
          )}

          {feedback && (
            <p className="feedback-result">Your feedback: {feedback}</p>
          )}
        </div>
      )}
    </div>
  );
}
