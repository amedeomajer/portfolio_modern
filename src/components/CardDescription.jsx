import React from 'react'

const CardDescription = ({children}) => {
  return (
    <div className='py-2 px-4 text-justify text-xl rounded-sm'>
      <p>{children}</p>
    </div>
  )
}

export default CardDescription