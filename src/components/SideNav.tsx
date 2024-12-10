'use client'
import React from 'react'
import NavItem from './NavItem'
import { motion } from 'framer-motion'

interface SideNavProps {
  setSection: (section: number) => void;
}

const SideNav:React.FC<SideNavProps> = ({setSection}) => {
  return (
    <motion.div 
      initial={{ x: 350, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="hidden md:block pt-20"
    >
<<<<<<< Updated upstream
      <ul className='font-black  text-7xl xl:text-8xl flex flex-col gap-4 lg:gap-6 items-end'>
=======
      <ul className="font-black  text-4xl xl:text-6xl flex flex-col gap-4 lg:gap-6 items-end">
        <NavItem onClick={() => setSection(3)}>about</NavItem>
        <NavItem onClick={() => setSection(2)}>cv</NavItem>
>>>>>>> Stashed changes
        <NavItem onClick={() => setSection(1)}>work</NavItem>
        <NavItem onClick={() => setSection(2)}>cv</NavItem>
        <NavItem onClick={() => setSection(3)}>about</NavItem>
      </ul>
    </motion.div>
  )
}

export default SideNav