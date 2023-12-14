import React from 'react'
import Card from './Card'
import CardImage from './CardImage'
import CardDescription from './CardDescription'
import { motion } from 'framer-motion'

const Work = () => {
  return (
    <motion.div 
      className="flex-wrap-anim w-full h-full p-6 flex flex-wrap gap-6 justify-around"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Card>
        <CardImage imageWidth={3508} imageHeight={3508} image={'/images/card-placeholder.jpg'}/>
        <CardDescription>
          <strong>Placeholder</strong> is a placeholder developed in
          placeholder++ for the purpose of holding a place
          for a placeholder.
        </CardDescription>
      </Card>
      <Card>
        <CardImage imageWidth={3508} imageHeight={3508} image={'/images/card-placeholder.jpg'}/>
        <CardDescription>
          <strong>Placeholder</strong> is a placeholder developed in
          placeholder++ for the purpose of holding a place
          for a placeholder.
        </CardDescription>
      </Card>
      <Card>
        <CardImage imageWidth={3508} imageHeight={3508} image={'/images/card-placeholder.jpg'}/>
        <CardDescription>
          <strong>Placeholder</strong> is a placeholder developed in
          placeholder++ for the purpose of holding a place
          for a placeholder.
        </CardDescription>
      </Card>
      <Card>
        <CardImage imageWidth={3508} imageHeight={3508} image={'/images/card-placeholder.jpg'}/>
        <CardDescription>
          <strong>Placeholder</strong> is a placeholder developed in
          placeholder++ for the purpose of holding a place
          for a placeholder.
        </CardDescription>
      </Card>
    </motion.div>
  )
}

export default Work