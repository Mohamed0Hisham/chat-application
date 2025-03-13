import React from "react";
import styles from "./Avatar.module.css";

interface AvatarProps {
	src: string | null;
	alt: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt }) => {
	const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			console.log("Selected file:", file);
			// Upload logic here
		}
	};

	return (
		<div className={styles.avatarContainer}>
			<img
				src={src || "/default-avatar.png"}
				alt={alt}
				className={styles.avatar}
			/>
			<label className={styles.uploadButton}>
				Change
				<input
					type="file"
					accept="image/*"
					onChange={handleUpload}
					style={{ display: "none" }}
				/>
			</label>
		</div>
	);
};

export default Avatar;
