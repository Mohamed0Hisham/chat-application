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
	const { fetchRequests, isLoading } = useFriendStore();
	const [requests, setRequests] = useState<Request[] | null>([]);

	useEffect(() => {
		(async () => {
			const requests = await fetchRequests();
			setRequests(requests);
		})();
	}, [fetchRequests]);

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h1>Friend Requests</h1>
				<p>Manage incoming friend requests</p>
			</header>
			<ul className={styles.requestList}>
				{isLoading ? (
					<li className={styles.loading}>Loading requests...</li>
				) : Array.isArray(requests) ? (
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
										{request.createdAt.toTimeString()}
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
