import React, { useState } from "react";
import styles from "./PasswordChange.module.css";

interface PasswordChangeProps {
	onChange: (newPassword: string) => void;
}

const PasswordChange: React.FC<PasswordChangeProps> = ({ onChange }) => {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		onChange(newPassword);
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		setError("");
	};

	return (
		<form className={styles.passwordForm} onSubmit={handleSubmit}>
			<h3>Change Password</h3>
			{error && <p className={styles.error}>{error}</p>}
			<div className={styles.field}>
				<label>Current Password</label>
				<input
					type="password"
					value={currentPassword}
					onChange={(e) => setCurrentPassword(e.target.value)}
				/>
			</div>
			<div className={styles.field}>
				<label>New Password</label>
				<input
					type="password"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
				/>
			</div>
			<div className={styles.field}>
				<label>Confirm New Password</label>
				<input
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
			</div>
			<button type="submit">Change Password</button>
		</form>
	);
};

export default PasswordChange;
