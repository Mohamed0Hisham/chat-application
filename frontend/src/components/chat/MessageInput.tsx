// MessageInput.tsx
import React, { useRef, useEffect } from "react";
import styles from "./MessageInput.module.css";

interface MessageInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
	value,
	onChange,
	placeholder = "Type a message...",
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Adjust height based on content
	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			// Reset height to auto to get the correct scrollHeight
			textarea.style.height = "auto";
			// Set height to match content
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange(e.target.value);
	};

	return (
		<div className={styles.inputContainer}>
			<textarea
				ref={textareaRef}
				className={styles.textarea}
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				rows={1} // Start with single row
			/>
		</div>
	);
};
