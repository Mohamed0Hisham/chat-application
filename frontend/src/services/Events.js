const joinConversation = (chatID, userID) => {
	socket.emit("joinConversation", { chatID, userID }, (response) => {
		if (response.success) {
			console.log("Joined conversation successfully");
		} else {
			console.error("Failed to join conversation:", response.error);
		}
	});
};

const sendMessage = (chatID, senderID, content) => {
	socket.emit("sendMessage", { chatID, senderID, content }, (response) => {
		if (response.success) {
			console.log("Message sent successfully");
		} else {
			console.error("Failed to send message:", response.error);
		}
	});
};
