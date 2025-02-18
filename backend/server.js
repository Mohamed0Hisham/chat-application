import app from "./app";
import { connect } from "mongoose";

const PORT = process.env.PORT || 3000;

connect(process.env.MONGO_URI, {
	dbName: "chat-application",
})
	.then((resolve) => {
		console.log("Database connected..🌍");
		app.listen(PORT, () => console.log("server is running..🚀"));
	})
	.catch((error) => console.log(error));
