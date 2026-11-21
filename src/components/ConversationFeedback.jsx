import { useState } from "react";
import { Star } from "lucide-react";
import "./ConversationFeedback.css";

export default function ConversationFeedback({
  initialRating = null,
  initialFeedback = "",
  onSubmit,
}) {
  const [rating, setRating] = useState(initialRating);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!rating) return;

    const saved = onSubmit(rating, feedback.trim());
    setSubmitted(saved === true);
  };

  return (
    <section className="conversation-feedback">
      <h3>Rate Your Conversation</h3>

      <p>How helpful were the product recommendations?</p>

      <form onSubmit={handleSubmit}>
        <div className="conversation-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              aria-label={`Overall rating ${star} stars`}
              onClick={() => {
                setRating(star);
                setSubmitted(false);
              }}
            >
              <Star
                size={26}
                fill={star <= rating ? "#facc15" : "none"}
                color="#eab308"
              />
            </button>
          ))}
        </div>

        <textarea
          placeholder="Tell us about your experience (optional)..."
          value={feedback}
          onChange={(event) => {
            setFeedback(event.target.value);
            setSubmitted(false);
          }}
          rows={3}
        />

        <button
          className="conversation-feedback-submit"
          type="submit"
          disabled={!rating}
        >
          Submit Feedback
        </button>
      </form>

      {submitted && (
        <p className="conversation-feedback-success" role="status">
          Feedback saved successfully!
        </p>
      )}
    </section>
  );
}
