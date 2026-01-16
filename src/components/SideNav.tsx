"use client";
import React from "react";
import NavItem from "./NavItem";
import { motion } from "framer-motion";
import { SECTIONS, Section } from "./Content";

interface SideNavProps {
	setSection: (section: Section) => void;
	section: Section;
}

const SideNav: React.FC<SideNavProps> = ({ setSection, section }) => {
	const navItems = [
		{ id: SECTIONS.ABOUT, label: "about", sectionName: "About" },
		{ id: SECTIONS.WORK, label: "work", sectionName: "Work" },
		{ id: SECTIONS.CV, label: "cv", sectionName: "CV" },
	];

	const handleSectionSelect = (sectionId: Section) => {
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
					<NavItem
						key={item.id}
						onClick={() => handleSectionSelect(item.id)}
						isActive={section === item.id}
						aria-label={`Navigate to ${item.sectionName} section`}
					>
						{item.label}
					</NavItem>
				))}
			</ul>
		</motion.nav>
	);
};

export default SideNav;
