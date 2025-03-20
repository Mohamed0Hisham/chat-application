import { AtSign, Lock, SquareUserRound } from "lucide-react";
import styles from "./Auth.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import useAuthStore from "../../store/Auth-Store";

const Register = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullname, setFullname] = useState("");
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const [isCompleted, setIsCompleted] = useState(false);
	const { register, isLoading } = useAuthStore();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!email || !password || !fullname) {
			setError("Please fill in all fields");
			return;
		}

		try {
			await register(fullname, email, password);
			setIsCompleted(true);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Sign up failed. Please try again."
			);
		}
	};

	useEffect(() => {
		if (isCompleted) {
			navigate("/");
		}
	}, [isCompleted, navigate]);

	return (
		<section className={styles.containerAuth}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<h1 className={styles.title}>Create Account</h1>
				<p className={styles.subtitle}>Join us to get started</p>

				<div className={styles.formField}>
					<div className={styles.inputContainer}>
						<div className={styles.icon}>
							<SquareUserRound size={20} />
						</div>
						<input
							type="text"
							id="fullname"
							placeholder="Enter your full name"
							onChange={(e) => setFullname(e.target.value)}
							disabled={isLoading}
							className={styles.input}
							autoComplete="name"
						/>
					</div>
				</div>

				<div className={styles.formField}>
					<div className={styles.inputContainer}>
						<div className={styles.icon}>
							<AtSign size={20} />
						</div>
						<input
							autoComplete="username"
							type="email"
							id="email"
							placeholder="Enter your email"
							onChange={(e) => setEmail(e.target.value)}
							disabled={isLoading}
							className={styles.input}
						/>
					</div>
				</div>

				<div className={styles.formField}>
					<div className={styles.inputContainer}>
						<div className={styles.icon}>
							<Lock size={20} />
						</div>
						<input
							type="password"
							id="password"
							placeholder="Create a password"
							onChange={(e) => setPassword(e.target.value)}
							disabled={isLoading}
							className={styles.input}
							autoComplete="new-password"
						/>
					</div>
				</div>

				{error && <div className={styles.errorMessage}>⚠️ {error}</div>}

				<button
					className={styles.submitButton}
					type="submit"
					disabled={isLoading}>
					{isLoading ? (
						<div className={styles.buttonLoader} />
					) : (
						"Sign Up"
					)}
				</button>

				<p className={styles.registerText}>
					Already have an account?{" "}
					<Link className={styles.registerLink} to="/">
						Sign In
					</Link>
				</p>
			</form>
		</section>
	);
};

export default Register;
