// import { SearchIcon } from "lucide-react";
import { Search } from "lucide-react";
import s from "./sidebar.module.css";
import useFriendStore from "../../store/friend";
import { useEffect } from "react";
import useMsgStore from "../../store/chat";

const Sidebar = () => {
	const { getFriends, friends, isLoading, setFriend } = useFriendStore();
	const { setChat } = useMsgStore();

	useEffect(() => {
		(async () => {
			await getFriends();
		})();
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
				/>
			</div>
			<ul className={s.userList}>
				{isLoading ? (
					<p>loading</p>
				) : (
					friends.map((user) => {
						return (
							<li
								className={s.user}
								onClick={() => {
									(async () => {
										await setChat(user._id);
										setFriend(user);
									})();
								}}>
								<div className={s.avatar}>
									<img src={user.avatar} alt="avatar" />
								</div>
								<div className={s.description}>
									<p>{user.fullname}</p>
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
