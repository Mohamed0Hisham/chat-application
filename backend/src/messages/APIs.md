### **API Endpoints**:

-   **POST /api/messages**
    -   Send a new message in a conversation.
    -   Request Body: `{ chatID, senderID, content }`
    -   Response: `{ msgID, chatID, senderID, content, createdAt }`
-   **GET /api/messages/:chatID**
    -   Fetch all messages for a specific conversation (with pagination or limits).
    -   Query Params: `?limit=10&page=1` (optional for pagination)
    -   Response: `[ { msgID, chatID, senderID, content, createdAt } ]`
-   **PUT /api/messages/:msgID**
    -   Edit a message (e.g., update content).
    -   Request Body: `{ content }`
    -   Response: `{ msgID, chatID, senderID, content, updatedAt }`
-   **DELETE /api/messages/:msgID**
    -   Delete a message.
    -   Response: `{ message: "Message deleted" }`
