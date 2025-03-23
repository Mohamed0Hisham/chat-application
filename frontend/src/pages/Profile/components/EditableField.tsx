import React, { useState } from "react";
import styles from "./EditableField.module.css";

interface EditableFieldProps {
	label: string;
	value: string;
	onSave: (newValue: string) => void;
	isSaving: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
	label,
	value,
	onSave,
	isSaving = false,
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
						disabled={isSaving}
						type="text"
						value={editedValue}
						onChange={(e) => setEditedValue(e.target.value)}
					/>
					<button className={styles.button} disabled={isSaving} onClick={handleSave}>
						Save
					</button>
					<button className={styles.button} disabled={isSaving} onClick={handleCancel}>
						Cancel
					</button>
				</div>
			) : (
				<div className={styles.viewMode}>
					<span>{value}</span>
					<button className={styles.button} onClick={handleEdit}>Edit</button>
				</div>
			)}
		</div>
	);
};

export default EditableField;
