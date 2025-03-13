import styles from "./404.module.css";
const NotFound = () => {
	return (
		<section className={styles.containerE}>
			<h1 className={styles.h1}>404</h1>
			<div>
				<h2 className={styles.h2}>Page not found!</h2>
				<p className={styles.p}>
					there is no page exist for the required path
				</p>
			</div>
		</section>
	);
};

export default NotFound;
