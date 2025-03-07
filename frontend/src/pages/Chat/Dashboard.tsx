import Sidebar from "../../components/layouts/sidebar";
import "./dashboard.css";
import Conversation from "./Conversation";

const Dashboard = () => {
	return (
		<section className="container-ch">
			<aside className="sidebar-ch">
				<Sidebar />
			</aside>
			<main className="chat">
				<Conversation />
			</main>
		</section>
	);
};

export default Dashboard;
