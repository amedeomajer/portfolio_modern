import React from 'react'

const CardDescription = ({children}) => {
  return (
    <div className='p-1 text-justify text-md'>
      <p>{children}</p>
    </div>
  )
}

export default CardDescription