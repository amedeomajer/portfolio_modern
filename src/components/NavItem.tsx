import React, { HTMLAttributes } from "react";

interface NavItemProps extends HTMLAttributes<HTMLAnchorElement> {
	children: string;
	isActive: boolean;
	onClick?: () => void;
	onKeyDown?: (event: React.KeyboardEvent) => void;
}

const NavItem: React.FC<NavItemProps> = ({ children, isActive, onClick, onKeyDown, ...props }) => {
	return (
		<a
			{...props}
			href='#'
			className={`${
				isActive ? "text-red-500 -translate-x-5" : "text-white"
			} hover:lg:-translate-x-5 hover:cursor-pointer hover:opacity-75 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black font-black text-4xl xl:text-6xl no-underline`}
			onClick={(e) => {
				e.preventDefault();
				onClick?.();
			}}
			onKeyDown={onKeyDown}
			aria-current={isActive ? "page" : undefined}
		>
			{children}
		</a>
	);
};

export default NavItem;
