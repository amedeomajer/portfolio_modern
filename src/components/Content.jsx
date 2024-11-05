'use client'
import React, { useState } from 'react'
import Work from './Work'
import SideNav from './SideNav'
import SmallNav from './SmallNav'

const Content = () => {
  const [section, setSection] = useState(1);
  return (
    <div className='flex flex-row justify-between'>
      {section === 1 && <Work />}
      <SideNav setSection={setSection} />
      <SmallNav setSection={setSection} section={section} />
    </div>
  );
};


export default Content