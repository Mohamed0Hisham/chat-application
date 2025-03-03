import { AtSign, Eye, Lock } from "lucide-react";
import "./Login.css";
import { Link } from "react-router-dom";
const Login = () => {
	return (
		<section className="container">
			<form className="form" action="">
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
						<span className="show-password">
							<Eye />
						</span>
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
					value="Sign In"
				/>
				<p>Don't have an account? <Link className="register" to={"register"}>Sign Up</Link></p>
			</form>
		</section>
	);
};

export default Login;
