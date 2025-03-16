import React, { useEffect, useState } from "react";
import styles from "./me.module.css";
import Avatar from "../../components/shared/Avatar";
import EditableField from "../../components/layouts/EditableField";
import PasswordChange from "../../components/layouts/PasswordChange";
import StatsDisplay from "../../components/layouts/StatsDisplay";
import MembershipDisplay from "../../components/layouts/Membership";
import useAuthStore from "../../store/Auth-Store";

const Me: React.FC = () => {
	const { user, updateProfile, isLoading } = useAuthStore();

	const [fullName, setFullName] = useState(user?.fullname || "");
	const [email, setEmail] = useState(user?.email || "");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const handleSaveFullName = async (newValue: string) => {
		try {
			setError(null);
			setSuccess(null);
			await updateProfile({ fullname: newValue });
			setFullName(newValue); // Sync local state with update
			setSuccess("Full name updated successfully!");
		} catch (err) {
			setError("Failed to update full name. Please try again.");
			console.error("Full name update error:", err);
		}
	};

	// Handle email update
	const handleSaveEmail = async (newValue: string) => {
		try {
			setError(null);
			setSuccess(null);
			await updateProfile({ email: newValue });
			setEmail(newValue); // Sync local state with update
			setSuccess("Email updated successfully!");
		} catch (err) {
			setError("Failed to update email. Please try again.");
			console.error("Email update error:", err);
		}
	};

	// Handle password update
	const handlePasswordChange = async (newPassword: string) => {
		if (newPassword.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}
		try {
			setError(null);
			setSuccess(null);
			await updateProfile({ password: newPassword });
			setSuccess("Password changed successfully!");
		} catch (err) {
			setError("Failed to change password. Please try again.");
			console.error("Password update error:", err);
		}
	};
	// Todo Later
	// const handleAvatarUpdate = async (file: File) => {
	// 	const formData = new FormData();
	// 	formData.append("avatar", file);
	// 	await updateProfile(formData);
	// };

	useEffect(() => {
		setFullName(user?.fullname || "");
		setEmail(user?.email || "");
	}, [user]);
	return (
		<section className={styles.container}>
			{user ? (
				<>
					<header className={styles.header}>
						<Avatar src={user.avatar} alt={user.fullname} />
						<h1>{user.fullname}</h1>
					</header>
					<div className={styles.content}>
						{/* Display feedback messages */}
						{error && <p className={styles.error}>{error}</p>}
						{success && <p className={styles.success}>{success}</p>}

						<section className={styles.personalInfo}>
							<h2>Personal Information</h2>
							<EditableField
								isSaving={isLoading}
								label="Full Name"
								value={fullName}
								onSave={handleSaveFullName}
							/>
							<EditableField
								isSaving={isLoading}
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
								count={
									user.friendsCount ? user.friendsCount : 0
								}
							/>
							<StatsDisplay
								label="Groups"
								count={user.groupsCount ? user.groupsCount : 0}
							/>
						</section>
						<section className={styles.membership}>
							<MembershipDisplay joinDate={user.joinDate} />
						</section>
					</div>
				</>
			) : (
				<div>Loading...</div>
			)}
		</section>
	);
};

export default Me;
