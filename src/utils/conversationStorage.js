
const STORAGE_KEY = "productRecommendationConversations";

export const getSavedConversations = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return [];

    const conversations = JSON.parse(data);

    return Array.isArray(conversations) ? conversations : [];
  } catch (error) {
    console.error("Unable to read conversations:", error);
    return [];
  }
};

export const saveConversation = (conversation) => {
  if (
    !conversation ||
    typeof conversation.id !== "string" ||
    !conversation.id
  ) {
    throw new Error("A conversation ID is required.");
  }

  const conversations = getSavedConversations();
  const now = new Date().toISOString();

  const existingIndex = conversations.findIndex(
    (item) => item.id === conversation.id
  );

  const savedConversation = {
    ...(existingIndex >= 0 ? conversations[existingIndex] : {}),
    ...conversation,
    createdAt:
      existingIndex >= 0
        ? conversations[existingIndex].createdAt
        : conversation.createdAt || now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    conversations[existingIndex] = savedConversation;
  } else {
    conversations.push(savedConversation);
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(conversations)
  );

  return savedConversation;
};
