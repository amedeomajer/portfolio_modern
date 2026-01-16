"use client";
import React from "react";
import { motion } from "framer-motion";
import { SECTIONS, Section } from "./Content";

interface SmallNavItemProps {
	children: string;
	onClick: () => void;
	isActive: boolean;
}

const SmallNavItem: React.FC<SmallNavItemProps> = ({ children, onClick, isActive }) => {
	return (
		<li
			className={`cursor-pointer ${isActive ? "text-red-500" : "text-white"} px-4 py-1`}
			onClick={onClick}
		>
			{children}
		</li>
	);
};

interface SmallNavProps {
	setSection: (section: Section) => void;
	section: Section;
}

const SmallNav: React.FC<SmallNavProps> = ({ setSection, section }) => {
	return (
		<motion.div
			initial={{ y: 50, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.8 }}
			className='fixed bottom-0 md:hidden w-full pb-3 pt-2 bg-black bg-opacity-20 backdrop-blur-md z-[100]'
		>
			<ul className='font-black flex items-center justify-evenly text-lg'>
				<SmallNavItem
					onClick={() => setSection(SECTIONS.ABOUT)}
					isActive={section === SECTIONS.ABOUT}
				>
					about
				</SmallNavItem>
				<SmallNavItem
					onClick={() => setSection(SECTIONS.CV)}
					isActive={section === SECTIONS.CV}
				>
					cv
				</SmallNavItem>
				<SmallNavItem
					onClick={() => setSection(SECTIONS.WORK)}
					isActive={section === SECTIONS.WORK}
				>
					work
				</SmallNavItem>
			</ul>
		</motion.div>
	);
};

export default SmallNav;
