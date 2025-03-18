import styles from "./Requests.module.css";
import useFriendStore from "../../store/friend";
import { FC, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

const Requests: FC = () => {
	const {
		fetchRequests,
		isLoading,
		acceptRequest,
		declineRequest,
		requests,
		error,
	} = useFriendStore();
	const [processingId, setProcessingId] = useState<string | null>(null);

	useEffect(() => {
		fetchRequests();
	}, [fetchRequests]);

	const handleAccept = async (id: string) => {
		setProcessingId(id);
		try {
			await acceptRequest(id);
			// Optimistically remove from UI
			useFriendStore.setState((state) => ({
				requests: state.requests.filter((req) => req._id !== id),
			}));
		} finally {
			setProcessingId(null);
		}
	};

	const handleDecline = async (id: string) => {
		setProcessingId(id);
		try {
			await declineRequest(id);
			// Optimistically remove from UI
			useFriendStore.setState((state) => ({
				requests: state.requests.filter((req) => req._id !== id),
			}));
		} finally {
			setProcessingId(null);
		}
	};

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
										{formatDistanceToNow(
											new Date(request.createdAt),
											{ addSuffix: false }
										)}
									</p>
								</div>
								<div className={styles.actions}>
									<button
										className={styles.acceptButton}
										disabled={processingId === request._id}
										onClick={() =>
											handleAccept(request._id)
										}>
										{processingId === request._id
											? "Accepting..."
											: "Accept"}
									</button>
									<button
										className={styles.declineButton}
										disabled={processingId === request._id}
										onClick={() =>
											handleDecline(request._id)
										}>
										{processingId === request._id
											? "Declining..."
											: "Decline"}
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
