import React, { useState } from "react";
import styles from "./me.module.css";
import Avatar from "../../components/shared/Avatar";
import EditableField from "../../components/layouts/EditableField";
import PasswordChange from "../../components/layouts/PasswordChange";
import StatsDisplay from "../../components/layouts/StatsDisplay";
import MembershipDisplay from "../../components/layouts/Membership";
import useAuthStore from "../../store/Auth-Store";

// Sample user data (replace with real data from your backend or context)
// const user = {
// 	avatar: "https://randomuser.me/api/portraits/men/1.jpg",
// 	fullName: "John Doe",
// 	email: "john@example.com",
// 	joinDate: new Date("2020-01-01"),
// 	friendsCount: 150,
// 	groupsCount: 5,
// };

const Me: React.FC = () => {
	const { user } = useAuthStore();
	const [fullName, setFullName] = useState(user?.fullname);
	const [email, setEmail] = useState("");

	const handleSaveFullName = (newValue: string) => {
		setFullName(newValue);
		// Here, you would typically update the backend
		console.log("Updated full name:", newValue);
	};

	const handleSaveEmail = (newValue: string) => {
		setEmail(newValue);
		// Here, you would typically update the backend
		console.log("Updated email:", newValue);
	};

	const handlePasswordChange = (newPassword: string) => {
		// Here, you would typically send the new password to the backend
		console.log("Password changed to:", newPassword);
	};

	return (
		<section className={styles.container}>
			{user ? (
				<>
					<header className={styles.header}>
						<Avatar src={user.avatar} alt={user.fullname} />
						<h1>{user.fullname}</h1>
					</header>
					<div className={styles.content}>
						<section className={styles.personalInfo}>
							<h2>Personal Information</h2>
							<EditableField
								label="Full Name"
								value={fullName ? fullName : user.fullname}
								onSave={handleSaveFullName}
							/>
							<EditableField
								label="Email"
								value={email}
								onSave={handleSaveEmail}
							/>
							<PasswordChange onChange={handlePasswordChange} />
						</section>
						<section className={styles.socialStats}>
							<h2>Social Stats</h2>
							<StatsDisplay
								label="Friends"
								count={user.friendsCount}
							/>
							<StatsDisplay
								label="Groups"
								count={user.groupsCount}
							/>
						</section>
						<section className={styles.membership}>
							<MembershipDisplay joinDate={user.joinDate} />
						</section>
					</div>
				</>
			) : (
				<div>Loading..</div>
			)}
		</section>
	);
};

export default Me;
