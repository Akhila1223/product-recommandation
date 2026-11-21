
import { useState } from "react";
import "./FeedbackModal.css";

export default function FeedbackModal({
  onSubmit,
  onCancel,
}) {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!feedback.trim()) return;

    onSubmit(feedback.trim());
  };

  return (
    <div className="modal-overlay">
      <div
        className="feedback-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
      >
        <h2 id="feedback-title">
          Provide Additional Feedback
        </h2>

        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Tell us what could be improved..."
            value={feedback}
            onChange={(event) =>
              setFeedback(event.target.value)
            }
            rows={5}
            required
          />

          <div className="modal-actions">
            <button
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
