import React from 'react'

const NavItem = ({children, ...props}) => {
  return (
    <li {...props} className='hover:lg:-translate-x-5 hover:cursor-pointer hover:opacity-75 transition-all duration-300 ease-in-out'>
      {children}
    </li>
  )
}

export default NavItem
