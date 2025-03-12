function ChatApp() {
  const { isConnected, sendMessage, lastMessage } = useWebSocket('ws://localhost:4000/chat', {
    reconnect: true,
    reconnectInterval: 3000,
    onOpen: () => console.log('Connected to WebSocket'),
    onMessage: (event) => console.log('New message received:', event.data),
    onClose: () => console.log('Disconnected from WebSocket'),
  });

  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div>
      <h3>WebSocket Chat</h3>
      <div>
        <p>{isConnected ? 'Connected' : 'Disconnected'}</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} disabled={!isConnected}>
          Send
        </button>
      </div>
      <div>
        <h4>Last Message:</h4>
        <p>{lastMessage}</p>
      </div>
    </div>
  );
}
How It Works
Connection Management: The hook automatically manages the WebSocket connection and allows reconnecting after disconnection.
Sending Messages: You can send messages through the sendMessage function, which only sends when the WebSocket is open.
Event Handlers: Custom event handlers (like onMessage) let you react to WebSocket events without polluting your component code.
Last Message: You can access the last received message directly, simplifying data access in the UI.