import React from 'react'

const Card = ({children}) => {
  return (
    <div className='h-80 w-[50%%] max-w-[800px] relative'>
      <div className="absolute inset-0 bg-black opacity-25 rounded-md"></div>
      {children}
    </div>
  )
}

export default Card