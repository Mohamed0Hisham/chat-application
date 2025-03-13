import styles from "./Auth.module.css";
import { AtSign, Lock } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import useAuthStore from "../../store/Auth-Store";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	const { isLoading, isAuthenticated, login, getProfile } = useAuthStore();
	const navigate = useNavigate();
	const location = useLocation();

	// Determine the route the user originally wanted to visit
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
			await getProfile();
			navigate(from, { replace: true });
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

	return (
		<section className={styles.containerAuth}>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.formField}>
					<label className={styles.label} htmlFor="email">
						E-mail
					</label>
					<div className={styles.inputField}>
						<AtSign />
						<input
							type="email"
							id="email"
							placeholder="example@gmail.com"
							onChange={(e) => setEmail(e.target.value)}
							disabled={isLoading}
							className={styles.input}
						/>
					</div>
				</div>
				<div className={styles.formField}>
					<label className={styles.label} htmlFor="password">
						Password
					</label>
					<div className={styles.inputField}>
						<Lock />
						<input
							type="password"
							id="password"
							onChange={(e) => setPassword(e.target.value)}
							disabled={isLoading}
							className={styles.input}
						/>
					</div>
				</div>
				{error && <p className={styles.errorMessage}>{error}</p>}
				<div className={styles.options}>
					<div>
						<input
							type="checkbox"
							id="remember"
							disabled={isLoading}
							className={styles.input}
						/>
						<span>Remember me</span>
					</div>
					<button
						className={styles.resetPassword}
						disabled={isLoading}>
						Forgot Password?
					</button>
				</div>
				<input
					className={styles.submitButton}
					type="submit"
					value={isLoading ? "Signing In..." : "Sign In"}
				/>
				<p>
					Don't have an account?{" "}
					<Link className={styles.register} to={"/register"}>
						Sign Up
					</Link>
				</p>
			</form>
		</section>
	);
};

export default Login;
