import Sidebar from "../../components/layouts/sidebar";
import "./dashboard.module.css"
const Dashboard = () => {
	return (
		<section className="container">
			<aside className="sidebar">
				<Sidebar />
			</aside>
			<main className="dashboard">
				<h1>Dashboard</h1>
			</main>
		</section>
	);
};

export default Dashboard;
