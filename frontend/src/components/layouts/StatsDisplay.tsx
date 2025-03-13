import React from "react";
import styles from "./StatsDisplay.module.css";

interface StatsDisplayProps {
	label: string;
	count: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ label, count }) => {
	return (
		<div className={styles.stat}>
			<span className={styles.label}>{label}</span>
			<span className={styles.count}>{count}</span>
		</div>
	);
};

export default StatsDisplay;
