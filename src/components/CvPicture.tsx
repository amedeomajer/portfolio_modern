import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const CvPicture: React.FC = () => {
  return (
    <div className='relative w-full h-24 flex justify-center items-center overflow-clip'>
      <motion.div
        className='absolute w-full h-full'
        initial={{ y: 100 }}
        animate={{ y: 15 }}
        transition={{ 
          type: 'spring', 
          duration: 0.5, 
          delay: 1, 
          stiffness: 100, 
          damping: 10 
        }}
        >
        <Image alt="something" loading="lazy" src={"/images/ame.png"} fill={true} className='object-contain' />
      </motion.div>
    </div>
  );
}

export default CvPicture;