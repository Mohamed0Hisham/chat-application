import styles from "./Find.module.css";

const Find = () => {
	// Using the fake data you provided earlier
	const friends = [
		{
			_id: "1",
			fullname: "John Doe",
			avatar: "https://randomuser.me/api/portraits/men/1.jpg",
		},
		{
			_id: "2",
			fullname: "Jane Smith",
			avatar: "https://randomuser.me/api/portraits/women/2.jpg",
		},
		{
			_id: "3",
			fullname: "Alex Carter",
			avatar: "https://randomuser.me/api/portraits/men/3.jpg",
		},
		{
			_id: "4",
			fullname: "Emily Brown",
			avatar: "https://randomuser.me/api/portraits/women/4.jpg",
		},
		{
			_id: "5",
			fullname: "Michael Lee",
			avatar: "https://randomuser.me/api/portraits/men/5.jpg",
		},
		{
			_id: "5",
			fullname: "Michael Lee",
			avatar: "https://randomuser.me/api/portraits/men/5.jpg",
		},
		{
			_id: "5",
			fullname: "Michael Lee",
			avatar: "https://randomuser.me/api/portraits/men/5.jpg",
		},
		{
			_id: "5",
			fullname: "Michael Lee",
			avatar: "https://randomuser.me/api/portraits/men/5.jpg",
		},
		{
			_id: "5",
			fullname: "Michael Lee",
			avatar: "https://randomuser.me/api/portraits/men/5.jpg",
		},
		{
			_id: "5",
			fullname: "Michael Lee",
			avatar: "https://randomuser.me/api/portraits/men/5.jpg",
		},
		{
			_id: "5",
			fullname: "Michael Lee",
			avatar: "https://randomuser.me/api/portraits/men/5.jpg",
		},
		{
			_id: "5",
			fullname: "Michael Lee",
			avatar: "https://randomuser.me/api/portraits/men/5.jpg",
		},
		{
			_id: "5",
			fullname: "Michael Lee",
			avatar: "https://randomuser.me/api/portraits/men/5.jpg",
		},
		{
			_id: "5",
			fullname: "Michael Lee",
			avatar: "https://randomuser.me/api/portraits/men/5.jpg",
		},
	];
	const isLoading = false;

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
					<input
						type="search"
						id="search"
						placeholder="e.g. John Doe or john@example.com"
						className={styles.searchInput}
						aria-label="Search for friends by name or email"
					/>
					<button type="submit" className={styles.searchButton}>
						Search
					</button>
				</form>
				<ul className={styles.userList}>
					{isLoading ? (
						<li className={styles.loading}>Loading friends...</li>
					) : friends.length > 0 ? (
						friends.map((user) => (
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
											{user.fullname}
										</p>
									</div>
									<button className={styles.actionButton}>
										Add Friend
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
