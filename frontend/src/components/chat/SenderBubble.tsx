// SenderBubble.tsx
import React from "react";
import styles from "./SenderBubble.module.css";

interface SenderBubbleProps {
	message: string;
	timestamp: string;
}

export const SenderBubble: React.FC<SenderBubbleProps> = ({
	message,
	timestamp,
}) => {
	return (
		<div className={styles.senderContainer}>
			<div className={styles.senderBubble}>
				<span className={styles.message}>{message}</span>
				<span className={styles.timestamp}>{timestamp}</span>
			</div>
		</div>
	);
};
