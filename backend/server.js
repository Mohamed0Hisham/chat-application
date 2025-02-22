import app from "./app.js";
import { connect } from "mongoose";
import { createServer } from "http";
import { initializeSocket } from "./src/sockets/init.js";

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
initializeSocket(httpServer);

connect(process.env.MONGO_URI, {
	dbName: "chat-application",
})
	.then(() => {
		console.log("Database connected..🌍");
		httpServer.listen(PORT, () => console.log("server is running..🚀"));
	})
	.catch((error) => console.log(error));
