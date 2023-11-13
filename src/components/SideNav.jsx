'use client'
import React from 'react'
import { motion } from 'framer-motion'

const SideNav = () => {
  return (
    <motion.div 
    initial={{ x: 350, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className='w-full flex justify-end items-center h-full'
    >
      <ul className='font-black text-6xl md:text-7xl lg:text-9xl flex flex-col gap-4 items-end'>
        <li className='hover:-translate-x-5 hover:cursor-pointer hover:opacity-75 transition-all duration-300 ease-in-out '>work</li>
        <li className='hover:-translate-x-5 hover:cursor-pointer hover:opacity-75 transition-all duration-300 ease-in-out '>cv</li>
        <li className='hover:-translate-x-5 hover:cursor-pointer hover:opacity-75 transition-all duration-300 ease-in-out '>about</li>
      </ul>
    </motion.div>
  )
}

export default SideNav