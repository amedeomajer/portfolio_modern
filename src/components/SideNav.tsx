"use client";
import React from "react";
import NavItem from "./NavItem";
import { motion } from "framer-motion";

interface SideNavProps {
	setSection: (section: number) => void;
	section: number;
}

const SideNav: React.FC<SideNavProps> = ({ setSection, section }) => {
	const navItems = [
		{ id: 3, label: "about", section: "About" },
		{ id: 1, label: "work", section: "Work" },
		{ id: 2, label: "cv", section: "CV" },
	];

	const handleSectionSelect = (sectionId: number) => {
		setSection(sectionId);
	};

	return (
		<motion.nav
			initial={{ x: 350, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ duration: 0.8 }}
			className='hidden md:block pt-20'
			role='navigation'
			aria-label='Main navigation'
		>
			<ul
				className='font-black text-4xl xl:text-6xl flex flex-col gap-4 lg:gap-6 items-end'
				role='menubar'
				aria-orientation='vertical'
			>
				{navItems.map((item) => (
					<li
						key={item.id}
						role='none'
					>
						<NavItem
							onClick={() => handleSectionSelect(item.id)}
							isActive={section === item.id}
							aria-label={`Navigate to ${item.section} section`}
						>
							{item.label}
						</NavItem>
					</li>
				))}
			</ul>
		</motion.nav>
	);
};

export default SideNav;
