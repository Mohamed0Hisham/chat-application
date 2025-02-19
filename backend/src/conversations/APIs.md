### **API Endpoints**:

-   **POST /api/conversations**
    -   Create a new conversation.
    -   Request Body: `{ participants: [userID1, userID2, ...] }`
    -   Response: `{ chatID, participants, createdAt }`
-   **GET /api/conversations/:chatID**
    -   Fetch details of a specific conversation.
    -   Response: `{ chatID, participants, messages, createdAt, updatedAt }`
-   **GET /api/conversations/user/:userID**
    -   Fetch all conversations for a specific user.
    -   Response: `[ { chatID, participants, lastMessage, updatedAt } ]`
-   **PUT /api/conversations/:chatID**
    -   Update conversation details (e.g., add/remove participants).
    -   Request Body: `{ participants: [userID1, userID2, ...] }`
    -   Response: `{ chatID, participants }`
-   **DELETE /api/conversations/:chatID**
    -   Delete a conversation.
    -   Response: `{ message: "Conversation deleted" }`
