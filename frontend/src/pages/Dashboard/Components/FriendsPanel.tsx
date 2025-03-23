import { Search } from "lucide-react";
import s from "./panel.module.css";
import useFriendStore from "../../../store/friend";
import { useEffect, useState } from "react";
import useMsgStore from "../../../store/chat";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FriendsPanel = () => {
	const { isLoading, friends } = useFriendStore();
	const getFriends = useFriendStore((state) => state.getFriends);
	const { setChat } = useMsgStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [set, setSet] = useState(false);
	const navigate = useNavigate();

	const filteredFriends = friends.filter((friend) =>
		friend.fullname.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleClick = async (id: string) => {
		await setChat(id);
		setSet(true);
	};

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
	useEffect(() => {
		if (set) navigate("/chat");
	});
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
							<li
								key={user._id}
								className={s.user}
								onClick={() => handleClick(user._id)}>
								<div>
									<img
										className={s.avatar}
										src={user.avatar ? user.avatar : ""}
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
							</li>
						);
					})}
			</ul>
		</div>
	);
};

export default FriendsPanel;
