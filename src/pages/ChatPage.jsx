import { useState, useEffect, useRef } from "react";
import SuggestionCard from "../components/SuggestionCard";
import ChatMessage from "../components/ChatMessage";
import FeedbackModal from "../components/FeedbackModal";
import suggestions from "../data/responses.json";
import recommendations from "../data/recommendations.json";
import { saveConversation } from "../utils/conversationStorage";
import ConversationFeedback from "../components/ConversationFeedback";
import "./ChatPage.css";

export default function ChatPage({ onConversationChange }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [conversationStage, setConversationStage] = useState("product");
  const [feedbackMessageId, setFeedbackMessageId] = useState(null);
  const [conversationId] = useState(() => crypto.randomUUID());
  const [createdAt] = useState(() => new Date().toISOString());
  const [saveStatus, setSaveStatus] = useState("");
  const [overallRating, setOverallRating] = useState(null);
  const [overallFeedback, setOverallFeedback] = useState("");

  const chatScrollRef = useRef(null);

  const currentConversation = {
    id: conversationId,
    createdAt,
    title:
      messages.find((item) => item.sender === "user")?.text ||
      "Product recommendations",
    messages,
    overallRating,
    overallFeedback,
  };

  useEffect(() => {
    onConversationChange?.(currentConversation);
  }, [
    messages,
    conversationId,
    // currentConversation,
    createdAt,
    overallRating,
    overallFeedback,
    onConversationChange,
  ]);

  useEffect(() => {
    if (chatScrollRef.current && messages.length > 0) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const normalize = (value) =>
    value
      .trim()
      .toLowerCase()
      .replace(/\s*-\s*/g, "-")
      .replace(/\s+/g, " ");

  const getBudgetsForProduct = (product) =>
    recommendations
      .filter((item) =>
        normalize(item.question).startsWith(`${normalize(product)} `),
      )
      .map((item) => item.question.slice(product.length).trim());

  const appendExchange = (userText, botText) => {
    const exchange = [
      {
        id: crypto.randomUUID(),
        text: userText,
        sender: "user",
      },
      {
        id: crypto.randomUUID(),
        text: botText,
        sender: "bot",
        rating: null,
        feedback: null,
      },
    ];

    setMessages((previous) => [...previous, ...exchange]);
    setSaveStatus("");
  };

  const submitMessage = (input) => {
    const userInput = input.trim();
    if (!userInput) return;

    const newProduct = suggestions.find(
      (item) => normalize(item.question) === normalize(userInput),
    );

    if (newProduct) {
      setSelectedProduct(newProduct.question);
      setConversationStage("budget");
      appendExchange(userInput, newProduct.response);
      setMessage("");
      return;
    }

    if (conversationStage === "budget" && selectedProduct) {
      const query = `${selectedProduct} ${userInput}`;

      const recommendation = recommendations.find(
        (item) => normalize(item.question) === normalize(query),
      );

      if (recommendation) {
        appendExchange(userInput, recommendation.response.join("\n"));

        setSelectedProduct(null);
        setConversationStage("product");
      } else {
        const budgets = getBudgetsForProduct(selectedProduct);

        appendExchange(
          userInput,
          `Please choose one of these budgets for ${selectedProduct}: ${budgets.join(", ")}.`,
        );
      }
    } else {
      appendExchange(userInput, "Sorry, I did not understand your query!");
    }

    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitMessage(message);
  };

  const handleRate = (messageId, rating) => {
    setMessages((previous) =>
      previous.map((item) =>
        item.id === messageId && item.sender === "bot"
          ? { ...item, rating }
          : item,
      ),
    );
    setSaveStatus("");
  };

  const handleDislike = (messageId) => {
    setFeedbackMessageId(messageId);
  };

  const handleFeedbackSubmit = (feedbackText) => {
    if (!feedbackMessageId) return;

    setMessages((previous) =>
      previous.map((item) =>
        item.id === feedbackMessageId && item.sender === "bot"
          ? { ...item, feedback: feedbackText }
          : item,
      ),
    );

    setFeedbackMessageId(null);
    setSaveStatus("");
  };

  const handleOverallFeedback = (rating, feedback) => {
    const updatedConversation = {
      ...currentConversation,
      overallRating: rating,
      overallFeedback: feedback,
    };

    try {
      saveConversation(updatedConversation);

      setOverallRating(rating);
      setOverallFeedback(feedback);
      setSaveStatus("");
      return true;
    } catch (error) {
      setSaveStatus("Could not save feedback. Please try again.");
      return false;
    }
  };

  const handleSave = () => {
    if (messages.length === 0) {
      setSaveStatus("Send a message before saving this conversation.");
      return;
    }

    try {
      saveConversation(currentConversation);
      setSaveStatus("Conversation saved successfully!");
    } catch (error) {
      setSaveStatus("Could not save conversation. Please try again.");
    }
  };

  const budgets = selectedProduct ? getBudgetsForProduct(selectedProduct) : [];

  return (
    <main className="chat-page">
      <div className="chat-scroll-area" ref={chatScrollRef}>
        <div className="chat-messages">
          {messages.map((chatMessage) => (
            <ChatMessage
              key={chatMessage.id}
              sender={chatMessage.sender}
              text={chatMessage.text}
              rating={chatMessage.rating}
              feedback={chatMessage.feedback}
              onRate={(rating) => handleRate(chatMessage.id, rating)}
              onDislike={() => handleDislike(chatMessage.id)}
            />
          ))}
        </div>

        {messages.length === 0 && (
          <div className="chat-welcome">
            <h2>Hi, Please tell me what you want?</h2>
            <span className="bot-icon">🤖</span>
          </div>
        )}

        <section className="suggestions-section">
          <h3 className="suggestions-title">
            {conversationStage === "budget"
              ? `Choose a budget for ${selectedProduct}`
              : "Choose a product"}
          </h3>

          <div className="suggestions-container">
            {conversationStage === "budget"
              ? budgets.map((budget) => (
                  <SuggestionCard
                    key={budget}
                    title={budget}
                    description="Show recommendations in this budget"
                    onClick={() => submitMessage(budget)}
                  />
                ))
              : suggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    title={suggestion.question}
                    description="Get recommendations for this product"
                    onClick={() => submitMessage(suggestion.question)}
                  />
                ))}
          </div>
        </section>
        {messages.length > 0 && (
          <ConversationFeedback
            initialRating={overallRating}
            initialFeedback={overallFeedback}
            onSubmit={handleOverallFeedback}
          />
        )}
      </div>

      <form className="user-input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Please tell me about your query!"
          className="input-field"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />

        <button className="ask-button" type="submit">
          Ask
        </button>

        <button className="save-button" type="button" onClick={handleSave}>
          Save
        </button>
      </form>

      {saveStatus && (
        <p className="save-status" role="status">
          {saveStatus}
        </p>
      )}

      {feedbackMessageId !== null && (
        <FeedbackModal
          onSubmit={handleFeedbackSubmit}
          onCancel={() => setFeedbackMessageId(null)}
        />
      )}
    </main>
  );
}
