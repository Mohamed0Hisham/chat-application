// ReceiverBubble.tsx
import React from "react";
import styles from "./ReceiverBubble.module.css";

interface ReceiverBubbleProps {
	message: string;
	timestamp: string;
}

export const ReceiverBubble: React.FC<ReceiverBubbleProps> = ({
	message,
	timestamp,
}) => {
	return (
		<div className={styles.receiverContainer}>
			<div className={styles.receiverBubble}>
				<span className={styles.message}>{message}</span>
				<span className={styles.timestamp}>{timestamp}</span>
			</div>
		</div>
	);
};
