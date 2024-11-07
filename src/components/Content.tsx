'use client'
import React, { useState } from 'react'
import Work from './Work'
import SideNav from './SideNav'
import SmallNav from './SmallNav'
import Cv from './Cv'

const Content:React.FC = () => {
  const [section, setSection] = useState(2);
  return (
    <div className='flex flex-row justify-between'>
      {section === 1 && <Work />}
      {section === 2 && <Cv />}
      <SideNav setSection={setSection} />
      <SmallNav setSection={setSection} section={section} />
    </div>
  );
};


export default Content