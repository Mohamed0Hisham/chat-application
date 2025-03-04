import { AtSign, Lock, SquareUserRound } from "lucide-react";
import "./index.css";
import { Link } from "react-router-dom";

const Register = () => {
	return (
		<section className="container">
			<form className="form" action="">
				<div className="form-field">
					<label htmlFor="fullname">Fullname</label>
					<div className="input-field">
						<SquareUserRound />
						<input
							type="text"
							id="fullname"
							placeholder="Your fullname"
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
						/>
					</div>
				</div>
				<div className="form-field">
					<label htmlFor="password">Password</label>
					<div className="input-field">
						<Lock />
						<input type="password" id="password" />
					</div>
				</div>
				<div className="options">
					<div>
						<input type="checkbox" id="remember" />
						<span>Remember me</span>
					</div>
					<button className="reset-password">Forgot Password?</button>
				</div>
				<input
					className="submit-button"
					type="submit"
					value="Sign Up"
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
