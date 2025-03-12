import styles from "./Requests.module.css";
import useFriendStore from "../../store/friend";
import { FC, useEffect, useState } from "react";

type Request = {
	_id: string;
	fullname: string;
	email: string;
	avatar: string;
	createdAt: Date;
};

const Requests: FC = () => {
	const { fetchRequests, isLoading, acceptRequest, declineRequest } =
		useFriendStore();
	const [requests, setRequests] = useState<Request[]>([]);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		(async () => {
			try {
				const requests = await fetchRequests();
				setRequests(requests);
			} catch (err) {
				console.error("Failed to fetch requests:", err);
				setError("Failed to load requests");
				setRequests([]);
			}
		})();
	}, [fetchRequests]);

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h1>Friend Requests</h1>
				<p>Manage incoming friend requests</p>
			</header>
			<ul className={styles.requestList}>
				{error ? (
					<div className={styles.error}>{error}</div>
				) : isLoading ? (
					<li className={styles.loading}>Loading requests...</li>
				) : requests.length > 0 ? (
					requests.map((request) => (
						<li key={request._id} className={styles.request}>
							<div className={styles.requestContent}>
								<div className={styles.avatar}>
									<img
										src={request.avatar}
										alt={`${request.fullname}'s avatar`}
									/>
								</div>
								<div className={styles.description}>
									<p className={styles.fullname}>
										{request.fullname}
									</p>
									<p className={styles.timestamp}>
									{new Date(request.createdAt).toLocaleString()}
									</p>
								</div>
								<div className={styles.actions}>
									<button
										className={styles.acceptButton}
										onClick={() =>
											acceptRequest(request._id)
										}>
										Accept
									</button>
									<button
										className={styles.declineButton}
										onClick={() =>
											declineRequest(request._id)
										}>
										Decline
									</button>
								</div>
							</div>
						</li>
					))
				) : (
					<div className={styles.noRequests}>No pending requests</div>
				)}
			</ul>
		</div>
	);
};

export default Requests;
