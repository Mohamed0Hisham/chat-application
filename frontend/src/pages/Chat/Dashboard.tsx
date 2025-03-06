import Sidebar from "../../components/layouts/sidebar";
import "./dashboard.css";

const Dashboard = () => {
	return (
		<section className="container-ch">
			<aside className="sidebar-ch">
				<Sidebar />
			</aside>
			<main className="dashboard-ch">
				<h1>Dashboard</h1>
			</main>
		</section>
	);
};

export default Dashboard;
