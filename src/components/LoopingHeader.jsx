'use client'
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";

const LoopingHeader = () => {

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      id="marquee-container"
    >
      <Marquee className="py-0 overflow-y-hidden">
        <p className={"font-black text-5xl md:text-6xl lg:text-9xl -mt-3 md:-mt-5 lg:-mt-9"}>AMEDEO MAJER FULL-STACK DEVELOPER&nbsp;</p>
      </Marquee>
    </motion.div>
  );
};

export default LoopingHeader;
