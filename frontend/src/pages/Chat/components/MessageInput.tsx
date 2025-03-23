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

	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
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
				rows={1}
			/>
		</div>
	);
};
