import React, {ReactNode} from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode;
  layoutId: string;
  onClick: () => void;
  className: string;
}

const Card: React.FC<CardProps> = ({ children, layoutId, onClick, className }) => {
  const cardShadow = {
    'boxShadow': 'rgb(0 0 0) 0px 0px 20px 0px'
  }

  return (
    <motion.div layoutId={layoutId} onClick={onClick} className={`group mt-5 md:mt-0 aspect-[4/3] w-[90%] md:w-[80%] max-w-[700px] rounded-sm relative shadow-indigo-500/40 cursor-pointer ${className}`} style={cardShadow}>
      <div className="absolute inset-0 bg-black opacity-25"></div>
      {children}
    </motion.div>
  )
}

export default Card