'use client'
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";

const LoopingHeader = () => {

  
  return (
    <motion.div animate={{ y: [-100, 10], opacity: [0, 1] }} transition={{ duration: 0.8 }}>
      <Marquee>
        <p className={"font-black text-5xl md:text-6xl lg:text-9xl"}>AMEDEO MAJER FULL-STACK DEVELOPER&nbsp;</p>
      </Marquee>
    </motion.div>
  );
};

export default LoopingHeader;
