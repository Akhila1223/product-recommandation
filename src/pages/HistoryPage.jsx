
import { useState } from "react";
import { getSavedConversations } from "../utils/conversationStorage";
import "./HistoryPage.css";

export default function HistoryPage() {
  const [conversations] = useState(
    () => getSavedConversations()
  );
  const [ratingFilter, setRatingFilter] = useState("all");

  const filteredConversations = conversations
    .filter((conversation) => {
      if (ratingFilter === "all") return true;

      return (
        conversation.overallRating === Number(ratingFilter)
      );
    })
    .sort((a, b) => {
      const firstDate = Date.parse(a.updatedAt || "") || 0;
      const secondDate = Date.parse(b.updatedAt || "") || 0;

      return secondDate - firstDate;
    });

  return (
    <main className="history-page">
      <div className="history-header">
        <h1>Previous Suggestions</h1>

        <div className="history-filter">
          <label htmlFor="rating-filter">
            Filter by rating:
          </label>

          <select
            id="rating-filter"
            value={ratingFilter}
            onChange={(event) =>
              setRatingFilter(event.target.value)
            }
          >
            <option value="all">All Ratings</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Star{rating > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {conversations.length === 0 ? (
        <p>No previous conversations yet.</p>
      ) : filteredConversations.length === 0 ? (
        <p>No conversations match this rating.</p>
      ) : (
        <div className="history-list">
          {filteredConversations.map((conversation) => (
            <article
              key={conversation.id}
              className="history-card"
            >
              <div className="history-card-header">
                <h2>
                  {conversation.title ||
                    "Untitled Conversation"}
                </h2>

                {conversation.updatedAt && (
                  <time dateTime={conversation.updatedAt}>
                    {new Date(
                      conversation.updatedAt
                    ).toLocaleString()}
                  </time>
                )}
              </div>

              <div className="history-messages">
                {(conversation.messages || []).map(
                  (message, index) => (
                    <div
                      key={
                        message.id ||
                        `${conversation.id}-${index}`
                      }
                      className={`history-message ${
                        message.sender === "user"
                          ? "history-user"
                          : "history-bot"
                      }`}
                    >
                      <strong>
                        {message.sender === "user"
                          ? "You"
                          : "Product Recommendation AI"}
                        :
                      </strong>

                      <p>{message.text}</p>

                      {message.sender === "bot" &&
                        message.rating != null && (
                          <p className="history-rating">
                            ⭐ Rating: {message.rating}/5
                          </p>
                        )}

                      {message.sender === "bot" &&
                        message.feedback && (
                          <p className="history-feedback">
                            Feedback: {message.feedback}
                          </p>
                        )}
                    </div>
                  )
                )}
              </div>

              {conversation.overallRating != null && (
                <p>
                  Overall Rating:{" "}
                  {conversation.overallRating}/5
                </p>
              )}

              {conversation.overallFeedback && (
                <p>
                  Overall Feedback:{" "}
                  {conversation.overallFeedback}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
