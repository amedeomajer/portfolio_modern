'use client'
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useIsOnPhone } from '@/hooks/useIsOnPhone';

const CvPicture: React.FC = () => {
  const { initialY, damping } = useIsOnPhone("cv-picture");

  console.log(initialY, damping);

  if (initialY === null || damping === null) {
    return null;
  }

  return (
    <div className='relative w-full h-24 md:h-48 flex justify-center items-center overflow-clip'>
      <motion.div
        className='absolute w-full h-full'
        initial={{ y: initialY }}
        animate={{ y: 15 }}
        transition={{ 
          type: 'spring',
          duration: 0.5,
          delay: 1,
          stiffness: 100,
          damping: damping 
        }}
      >
        <Image alt="something" loading="lazy" src={"/images/ame.png"} fill={true} className='object-contain' />
      </motion.div>
    </div>
  );
}

export default CvPicture;