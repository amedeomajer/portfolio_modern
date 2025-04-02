'use client';
import React, { useState } from 'react';
import Work from './Work';
import SideNav from './SideNav';
import SmallNav from './SmallNav';
import Cv from './Cv';
import About from './About';
import { AnimatePresence } from 'framer-motion';

const Content: React.FC = () => {
  const [section, setSection] = useState(1);
  return (
    <div className="content">
      <AnimatePresence mode="wait">
        {section === 1 && <Work key="work" />}
        {section === 3 && <About key="about" />}
        {section === 2 && <Cv key="cv" />}
      </AnimatePresence>
      <SideNav setSection={setSection} section={section} />
      <SmallNav setSection={setSection} section={section} />
    </div>
  );
};

export default Content;
