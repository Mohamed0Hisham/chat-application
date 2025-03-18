import { useEffect, useState } from "react";
import useFriendStore from "../../store/friend";
import styles from "./Find.module.css";
import DOMPurify from "dompurify";
import type { Person } from "../../types/User";

const Find = () => {
	const { sendFriendRequest, isLoading, findUsers, error } = useFriendStore();
	const [result, setResult] = useState<Person[]>([]);
	const [query, setQuery] = useState<string>("");
	const [debouncedQuery, setDebouncedQuery] = useState<string>("");
	const [pendingRequests, setPendingRequests] = useState<Set<string>>(
		new Set()
	);

	// Debounce effect
	useEffect(() => {
		const handler = setTimeout(() => setDebouncedQuery(query), 500);
		return () => clearTimeout(handler);
	}, [query]);

	// Search effect
	useEffect(() => {
		const controller = new AbortController();
		if (!debouncedQuery) {
			setResult([]);
			return;
		}

		const fetchUsers = async () => {
			try {
				const isEmail = debouncedQuery.includes("@");
				const params = isEmail
					? { email: debouncedQuery }
					: { fullname: debouncedQuery };
				const result = await findUsers(params, controller.signal);
				setResult(result);
			} catch (error) {
				if (!controller.signal.aborted)
					console.error("Failed to fetch users:", error);
			}
		};

		fetchUsers();
		return () => controller.abort();
	}, [debouncedQuery, findUsers]);

	const handleAddFriend = async (id: string) => {
		setPendingRequests((prev) => new Set(prev.add(id)));
		try {
			await sendFriendRequest(id);
			// Update local state to show permanent "Sent" status
			setResult((prev) =>
				prev.map((user) =>
					user._id === id ? { ...user, requestSent: true } : user
				)
			);
		} finally {
			setPendingRequests((prev) => {
				const next = new Set(prev);
				next.delete(id);
				return next;
			});
		}
	};

	return (
		<>
			<header className={styles.header}>
				<h1>Find Your Friends</h1>
				<p>Type a name or email to search</p>
			</header>
			<div className={styles.container}>
				<form
					className={styles.searchForm}
					onSubmit={(e) => e.preventDefault()}>
					<div className={styles.inputWrapper}>
						<input
							type="search"
							id="search"
							placeholder="e.g. John Doe or john@example.com"
							className={styles.searchInput}
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
						{isLoading && <span className={styles.spinner}></span>}
					</div>
				</form>
				{error && <p className={styles.error}>{error}</p>}
				<ul className={styles.userList}>
					{isLoading ? (
						<li className={styles.loading}>Loading friends...</li>
					) : result.length > 0 ? (
						result.map((user) => (
							<li key={user._id} className={styles.user}>
								<div className={styles.userContent}>
									<div className={styles.avatar}>
										<img
											src={user.avatar}
											alt={`${user.fullname}'s avatar`}
										/>
									</div>
									<div className={styles.description}>
										<p className={styles.fullname}>
											{DOMPurify.sanitize(user.fullname)}
										</p>
									</div>
									<button
										disabled={
											pendingRequests.has(user._id) ||
											user.requestSent
										}
										onClick={() =>
											handleAddFriend(user._id)
										}
										className={styles.actionButton}>
										{user.requestSent
											? "Sent"
											: pendingRequests.has(user._id)
											? "Sending..."
											: "Add Friend"}
									</button>
								</div>
							</li>
						))
					) : (
						<li className={styles.noResults}>No friends found</li>
					)}
				</ul>
			</div>
		</>
	);
};

export default Find;
