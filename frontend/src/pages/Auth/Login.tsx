import styles from "./Auth.module.css";
import { AtSign, Lock } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import useAuthStore from "../../store/Auth-Store";
import Loader from "../../components/shared/Loader";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { isLoading, isAuthenticated, login, error, setError } =
		useAuthStore();

	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from?.pathname || "/dashboard";

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!email || !password) {
			setError("Please fill in all fields");
			return;
		}

		try {
			await login(email, password);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Login failed. Please try again."
			);
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			navigate(from, { replace: true });
		}
	}, [isAuthenticated, navigate, from]);

	if (isLoading) {
		return (
			<div className="overlay">
				<Loader />
			</div>
		);
	}

	return (
		<section className={styles.containerAuth}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<h1 className={styles.title}>Welcome Back</h1>
				<p className={styles.subtitle}>Please sign in to continue</p>

				<div className={styles.formField}>
					<div className={styles.inputContainer}>
						<div className={styles.icon}>
							<AtSign size={25} />
						</div>
						<input
							type="email"
							id="email"
							placeholder="Enter your email"
							onChange={(e) => setEmail(e.target.value)}
							disabled={isLoading}
							className={styles.input}
							autoComplete="username"
						/>
					</div>
				</div>

				<div className={styles.formField}>
					<div className={styles.inputContainer}>
						<div className={styles.icon}>
							<Lock size={25} />
						</div>
						<input
							type="password"
							id="password"
							placeholder="Enter your password"
							onChange={(e) => setPassword(e.target.value)}
							disabled={isLoading}
							className={styles.input}
							autoComplete="current-password"
						/>
					</div>
				</div>

				{error && <div className={styles.errorMessage}>⚠️ {error}</div>}

				<div className={styles.options}>
					<label className={styles.rememberMe}>
						<input
							type="checkbox"
							id="remember"
							disabled={isLoading}
							className={styles.checkbox}
						/>
						<span>Remember me</span>
					</label>
					<button
						className={styles.resetPassword}
						disabled={isLoading}
						type="button">
						Forgot Password?
					</button>
				</div>

				<button
					className={styles.submitButton}
					type="submit"
					disabled={isLoading}>
					{isLoading ? (
						<div className={styles.buttonLoader} />
					) : (
						"Sign In"
					)}
				</button>

				<p className={styles.registerText}>
					Don't have an account?{" "}
					<Link className={styles.registerLink} to={"/register"}>
						Sign Up
					</Link>
				</p>
			</form>
		</section>
	);
};

export default Login;
