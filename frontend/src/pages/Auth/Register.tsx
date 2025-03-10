import { AtSign, Lock, SquareUserRound } from "lucide-react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const Register = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullname, setFullname] = useState("");
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const [isCompleted, setIsCompleted] = useState(false);
	const { register,isLoading } = useAuth();

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
			navigate("/login");
		}
	}, [isCompleted, navigate]);

	return (
		<section className="container-auth">
			<form className="form" onSubmit={handleSubmit}>
				<div className="form-field">
					<label htmlFor="fullname">Fullname</label>
					<div className="input-field">
						<SquareUserRound />
						<input
							type="text"
							id="fullname"
							placeholder="Your fullname"
							onChange={(e) => setFullname(e.target.value)}
							disabled={isLoading}
						/>
					</div>
				</div>
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
				<input
					className="submit-button"
					type="submit"
					value="Sign Up"
					disabled={isLoading}
				/>
				<p>
					Already have an account?{" "}
					<Link className="register" to="/login">
						Sign In
					</Link>
				</p>
			</form>
		</section>
	);
};

export default Register;
