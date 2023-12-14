'use client'
import React, { useState } from 'react'
import Work from './Work'
import SideNav from './SideNav'

const Content = () => {
  const [section, setSection] = useState(1)
  return (
    <div className=' mt-10 w-full flex flex-col lg:flex-row-reverse'>
      <SideNav setSection={setSection} className=""/>
      {section === 1 && <Work />}
    </div>
  )
}

export default Content