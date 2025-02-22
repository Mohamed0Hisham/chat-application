### **Socket Events**:

-   **Event: `joinConversation`**
    -   A user joins a conversation.
    -   Data: `{ chatID, userID }`
-   **Event: `sendMessage`**
    -   A user sends a message in real-time.
    -   Data: `{ chatID, senderID, content }`
    -   Broadcast to all participants in the conversation.
-   **Event: `typing`**
    -   Notify other participants that a user is typing.
    -   Data: `{ chatID, userID }`
-   **Event: `leaveConversation`**
    -   A user leaves a conversation.
    -   Data: `{ chatID, userID }`
