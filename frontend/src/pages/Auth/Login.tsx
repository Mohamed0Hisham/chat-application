import { AtSign, Lock } from "lucide-react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null); // Local error state
	const { login, isLoading } = useAuth();
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!email || !password) {
			setError("Please fill in all fields");
			return;
		}

		try {
			await login(email, password);
			setIsLoggedIn(true);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Login failed. Please try again."
			);
		}
	};

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/dashboard");
		}
	}, [isLoggedIn, navigate]);

	return (
		<section className="container-auth">
			<form className="form" onSubmit={handleSubmit}>
				<div className="form-field">
					<label htmlFor="email">E-mail</label>
					<div className="input-field">
						<AtSign />
						<input
							type="email"
							id="email"
							placeholder="example@gmail.com"
							onChange={(e) => setEmail(e.target.value)}
							disabled={isLoading}
						/>
					</div>
				</div>
				<div className="form-field">
					<label htmlFor="password">Password</label>
					<div className="input-field">
						<Lock />
						<input
							type="password"
							id="password"
							onChange={(e) => setPassword(e.target.value)}
							disabled={isLoading}
						/>
					</div>
				</div>
				{error && <p className="error-message">{error}</p>}
				<div className="options">
					<div>
						<input
							type="checkbox"
							id="remember"
							disabled={isLoading}
						/>
						<span>Remember me</span>
					</div>
					<button className="reset-password" disabled={isLoading}>
						Forgot Password?
					</button>
				</div>
				<input
					className="submit-button"
					type="submit"
					value={isLoading ? "Signing In..." : "Sign In"}
				/>
				<p>
					Don't have an account?{" "}
					<Link className="register" to={"/register"}>
						Sign Up
					</Link>
				</p>
			</form>
		</section>
	);
};

export default Login;
