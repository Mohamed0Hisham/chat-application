// import { SearchIcon } from "lucide-react";
import { Search } from "lucide-react";
import s from "./sidebar.module.css";
import useFriendStore from "../../store/friend";
import { useEffect, useState } from "react";
import useMsgStore from "../../store/chat";

const Sidebar = () => {
	const { getFriends, isLoading, setFriend } = useFriendStore();
	const { setChat } = useMsgStore();
	const [searchQuery, setSearchQuery] = useState("");

	const friends = [
		{
			_id: "1",
			fullname: "John Doe",
			avatar: "https://randomuser.me/api/portraits/men/1.jpg",
			isOnline: true,
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
			isOnline: false,
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
	// Filter friends based on search
	const filteredFriends = friends.filter((friend) =>
		friend.fullname.toLowerCase().includes(searchQuery.toLowerCase())
	);

	useEffect(() => {
		(async () => {
			await getFriends();
		})();
	}, [getFriends]);
	return (
		<div className={s.sidebar}>
			<div className={s.searchField}>
				<div className={s.IconField}>
					<Search className={s.icon} />
				</div>
				<input
					className={s.searchIn}
					type="search"
					id="searchBar"
					placeholder="search"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>
			<ul className={s.userList}>
				{isLoading ? (
					<p>Loading...</p>
				) : filteredFriends.length === 0 ? (
					<div className={s.emptyState}>
						<p>No friends found</p>
						<small>Try searching by name</small>
					</div>
				) : (
					friends.map((user) => {
						return (
							<li
								key={user._id}
								className={s.user}
								onClick={() => {
									(async () => {
										console.log(user);
										await setChat(user._id);
										setFriend(user);
									})();
								}}>
								<div>
									<img
										className={s.avatar}
										src={user.avatar}
										alt="avatar"
									/>
								</div>
								<div >
									<p className={s.description}>{user.fullname}</p>
									{user.isOnline ? (
										<div className={s.green}></div>
									) : (
										<div className={s.red}></div>
									)}
								</div>
							</li>
						);
					})
				)}
			</ul>
		</div>
	);
};

export default Sidebar;
