// import { SearchIcon } from "lucide-react";
import { Search } from "lucide-react";
import s from "./sidebar.module.css";
import useFriendStore from "../../store/friend";
import { useEffect, useState } from "react";
import api from "../../services/api";

// interface User {
// 	id: string;
// 	fullname: string;
// 	isOnline: boolean;
// 	avatar: "string";
// }

const users = [
	{
		id: "1654156",
		fullname: "Vincent Porter",
		status: "left 7 mins ago",
		isOnline: false,
		avatarUrl:
			"https://img.icons8.com/?size=100&id=11730&format=png&color=000000",
	},
	{
		id: "1654156",
		fullname: "Aiden Chavez",
		status: "online",
		isOnline: true,
		avatarUrl:
			"https://img.icons8.com/?size=100&id=11730&format=png&color=000000",
	},
	{
		id: "1654156",
		fullname: "Mike Thomas",
		status: "online",
		isOnline: true,
		avatarUrl:
			"https://img.icons8.com/?size=100&id=11730&format=png&color=000000",
	},
	{
		id: "1654156",
		fullname: "Christian Kelly",
		status: "left 10 hours ago",
		isOnline: false,
		avatarUrl:
			"https://img.icons8.com/?size=100&id=11730&format=png&color=000000",
	},
	{
		id: "1654156",
		fullname: "Monica Ward",
		status: "online",
		isOnline: true,
		avatarUrl:
			"https://img.icons8.com/?size=100&id=11730&format=png&color=000000",
	},
	{
		id: "1654156",
		fullname: "Dean Henry",
		status: "offline since Oct 28",
		isOnline: false,
		avatarUrl:
			"https://img.icons8.com/?size=100&id=11730&format=png&color=000000",
	},
];

const Sidebar = () => {
	const { getFriends, friends, isLoading } = useFriendStore();

	useEffect(() => {
		(async () => {
			await getFriends();
		})();
	});
	const selectHandler = ()=>{
		
	}
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
							<li className={s.user} onClick={selectHandler}>
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
