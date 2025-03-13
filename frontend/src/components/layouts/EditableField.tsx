import React, { useState } from "react";
import styles from "./EditableField.module.css";

interface EditableFieldProps {
	label: string;
	value: string;
	onSave: (newValue: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
	label,
	value,
	onSave,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedValue, setEditedValue] = useState(value);

	const handleEdit = () => setIsEditing(true);
	const handleSave = () => {
		onSave(editedValue);
		setIsEditing(false);
	};
	const handleCancel = () => {
		setEditedValue(value);
		setIsEditing(false);
	};

	return (
		<div className={styles.field}>
			<label>{label}</label>
			{isEditing ? (
				<div className={styles.editMode}>
					<input
						type="text"
						value={editedValue}
						onChange={(e) => setEditedValue(e.target.value)}
					/>
					<button onClick={handleSave}>Save</button>
					<button onClick={handleCancel}>Cancel</button>
				</div>
			) : (
				<div className={styles.viewMode}>
					<span>{value}</span>
					<button onClick={handleEdit}>Edit</button>
				</div>
			)}
		</div>
	);
};

export default EditableField;
