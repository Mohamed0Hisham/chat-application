import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import "./button.css";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size: ButtonSize;
	icon?: ReactNode;
	children: ReactNode;
	ariaLabel?: string;
}

const Button = ({
	variant = "primary",
	size = "medium",
	icon,
	children,
	ariaLabel,
	...props
}: ButtonProps) => {
	return (
		<button
			aria-label={ariaLabel}
			className={clsx("base", variant, size)}
			{...props}>
			{icon && (
				<span className="icon-style" aria-hidden="true">
					{icon}
				</span>
			)}
			<span>{children}</span>
		</button>
	);
};

export default Button;
