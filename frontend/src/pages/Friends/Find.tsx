import { useEffect, useState } from "react";
import useFriendStore from "../../store/friend";
import styles from "./Find.module.css";
import DOMPurify from "dompurify";

type Friend = {
	_id: string;
	fullname: string;
	isOnline?: boolean;
	avatar: string;
};

const Find = () => {
	const { sendFriendRequest, isLoading, findUsers } = useFriendStore();
	const [result, setResult] = useState<Friend[]>([]);
	const [query, setQuery] = useState<string>("");
	const [debouncedQuery, setDebouncedQuery] = useState<string>("");
	const [pendingRequests, setPendingRequests] = useState<Set<string>>(
		new Set()
	);

	// Debounce effect: updates debouncedQuery after user stops typing for 500ms
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
		}, 500);

		return () => clearTimeout(handler);
	}, [query]);

	useEffect(() => {
		const controller = new AbortController();
		if (!debouncedQuery) {
			setResult([]); // Clear results when input is empty
			return;
		}

		const fetchUsers = async () => {
			try {
				// Detect if the input is an email or a name
				const isEmail = debouncedQuery.includes("@");
				const params = isEmail
					? { email: debouncedQuery }
					: { fullname: debouncedQuery };

				const result = await findUsers(params, controller.signal); // Pass the correct query param
				setResult(result);
			} catch (error) {
				if (!controller.signal.aborted) {
					console.error("Failed to fetch users:", error);
				}
			}
		};
		if (debouncedQuery) fetchUsers();

		return () => controller.abort();
	}, [debouncedQuery, findUsers]);

	const handleAddFriend = async (id: string) => {
		setPendingRequests((prev) => new Set(prev.add(id)));
		try {
			await sendFriendRequest(id);
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
							aria-label="Search for friends by name or email"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
						{isLoading && <span className={styles.spinner}></span>}
					</div>
				</form>
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
										disabled={pendingRequests.has(user._id)}
										onClick={() =>
											handleAddFriend(user._id)
										}
										className={styles.actionButton}>
										{pendingRequests.has(user._id)
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
