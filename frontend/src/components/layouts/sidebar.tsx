// import { SearchIcon } from "lucide-react";
import { Search } from "lucide-react";
import s from "./sidebar.module.css";
import useFriendStore from "../../store/friend";
import { useEffect, useState } from "react";
import useMsgStore from "../../store/chat";
import axios from "axios";
import { Link } from "react-router-dom";

const Sidebar = () => {
	const { isLoading, setFriend, friends } = useFriendStore();
	const getFriends = useFriendStore((state) => state.getFriends);
	const { setChat } = useMsgStore();
	const [searchQuery, setSearchQuery] = useState("");

	// Filter friends based on search
	const filteredFriends = friends.filter((friend) =>
		friend.fullname.toLowerCase().includes(searchQuery.toLowerCase())
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				await getFriends();
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log("Friends fetch canceled");
				}
			}
		};

		fetchData();
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
				{!isLoading &&
					filteredFriends.map((user) => {
						return (
							<Link
								to={"/chat"}
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
								<div>
									<p className={s.description}>
										{user.fullname}
									</p>
									{user.isOnline ? (
										<div className={s.green}></div>
									) : (
										<div className={s.red}></div>
									)}
								</div>
							</Link>
						);
					})}
			</ul>
		</div>
	);
};

export default Sidebar;
