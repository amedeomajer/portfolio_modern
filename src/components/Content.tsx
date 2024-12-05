"use client";
import React, { useState } from "react";
import Work from "./Work";
import SideNav from "./SideNav";
import SmallNav from "./SmallNav";
import Cv from "./Cv";
import About from "./About";
import { AnimatePresence } from "framer-motion";

const Content: React.FC = () => {
  const [section, setSection] = useState(3);
  return (
    <div className="w-full flex md:flex-row md:justify-between">
      <AnimatePresence mode="wait">
        {section === 1 && <Work key="work" />}
        {section === 3 && <About key="about" />}
        {section === 2 && <Cv key="cv" />}
      </AnimatePresence>
      <SideNav setSection={setSection} />
      <SmallNav setSection={setSection} section={section} />
    </div>
  );
};

export default Content;
