import React from 'react'
import Image from 'next/image'

const CardImage = ({image, imageWidth, imageHeight}) => {
  return (
    <div className='h-2/3 w-full relative'>
      <Image src={image} fill={true} className='object-cover rounded-t-md'/>
    </div>
  )
}

export default CardImage

