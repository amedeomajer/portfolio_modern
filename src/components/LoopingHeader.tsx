'use client';
import Marquee from 'react-fast-marquee';
import { motion } from 'framer-motion';

const LoopingHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Marquee>
        <p className="marquee-text">
          AMEDEO MAJER FULL-STACK DEVELOPER&nbsp; AMEDEO MAJER FULL-STACK
          DEVELOPER&nbsp;
        </p>
      </Marquee>
    </motion.div>
  );
};

export default LoopingHeader;
