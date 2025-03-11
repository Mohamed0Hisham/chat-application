import styles from "./Requests.module.css";
import useFriendStore from "../../store/friend";
import { FC } from "react";

// Sample data for demonstration (replace with real data from your backend)
const requests = [
	{
		_id: "1",
		sender: {
			fullname: "John Doe",
			avatar: "https://randomuser.me/api/portraits/men/1.jpg",
		},
		timestamp: "2 hours ago",
	},
	{
		_id: "2",
		sender: {
			fullname: "Jane Smith",
			avatar: "https://randomuser.me/api/portraits/women/2.jpg",
		},
		timestamp: "1 day ago",
	},
];

const isLoading = false; // Toggle to true to see the loading state

const Requests: FC = () => {
const {} = useFriendStore();
    return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h1>Friend Requests</h1>
				<p>Manage incoming friend requests</p>
			</header>
			<ul className={styles.requestList}>
				{isLoading ? (
					<li className={styles.loading}>Loading requests...</li>
				) : requests.length > 0 ? (
					requests.map((request) => (
						<li key={request._id} className={styles.request}>
							<div className={styles.requestContent}>
								<div className={styles.avatar}>
									<img
										src={request.sender.avatar}
										alt={`${request.sender.fullname}'s avatar`}
									/>
								</div>
								<div className={styles.description}>
									<p className={styles.fullname}>
										{request.sender.fullname}
									</p>
									<p className={styles.timestamp}>
										{request.timestamp}
									</p>
								</div>
								<div className={styles.actions}>
									<button className={styles.acceptButton}>
										Accept
									</button>
									<button className={styles.declineButton}>
										Decline
									</button>
								</div>
							</div>
						</li>
					))
				) : (
					<li className={styles.noRequests}>No pending requests</li>
				)}
			</ul>
		</div>
	);
};

export default Requests;
