// src/components/shared/Button.tsx
import React from "react";

// Define the props for the Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "danger"; // Button variants
	size?: "small" | "medium" | "large"; // Button sizes
	isLoading?: boolean; // Loading state
	children: React.ReactNode; // Button content
}

const Button: React.FC<ButtonProps> = ({
	variant = "primary",
	size = "medium",
	isLoading = false,
	children,
	...props
}) => {
	// Define styles based on variant and size
	const baseStyles =
		"font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
	const variantStyles = {
		primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
		secondary:
			"bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
		danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
	};
	const sizeStyles = {
		small: "px-3 py-1.5 text-sm",
		medium: "px-4 py-2 text-base",
		large: "px-6 py-3 text-lg",
	};

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
			disabled={isLoading}
			{...props}>
			{isLoading ? "Loading..." : children}
		</button>
	);
};

export default Button;
