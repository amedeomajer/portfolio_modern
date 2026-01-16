"use client";
import React, { useState } from "react";
import Work from "./Work";
import SideNav from "./SideNav";
import SmallNav from "./SmallNav";
import Cv from "./Cv";
import About from "./About";
import { AnimatePresence } from "framer-motion";

export const SECTIONS = {
	ABOUT: "about",
	WORK: "work",
	CV: "cv",
} as const;

export type Section = (typeof SECTIONS)[keyof typeof SECTIONS];

const Content: React.FC = () => {
	const [section, setSection] = useState<Section>(SECTIONS.ABOUT);
	return (
		<div className='w-full flex md:flex-row md:justify-between lg:min-h-0 min-h-screen overflow-hidden'>
			<AnimatePresence mode='wait'>
				{section === SECTIONS.WORK && <Work key='work' />}
				{section === SECTIONS.ABOUT && <About key='about' />}
				{section === SECTIONS.CV && <Cv key='cv' />}
			</AnimatePresence>
			<SideNav
				setSection={setSection}
				section={section}
			/>
			<SmallNav
				setSection={setSection}
				section={section}
			/>
		</div>
	);
};

export default Content;
