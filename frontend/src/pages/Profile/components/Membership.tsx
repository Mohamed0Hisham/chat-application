import React from "react";
import { formatDistanceToNow } from "date-fns";
import styles from "./Membership.module.css";

interface MembershipDisplayProps {
	joinDate: Date;
}

const MembershipDisplay: React.FC<MembershipDisplayProps> = ({ joinDate }) => {
	const duration = formatDistanceToNow(joinDate, { addSuffix: true });
	return (
		<div className={styles.membership}>
			<p>Member {duration}</p>
		</div>
	);
};

export default MembershipDisplay;
