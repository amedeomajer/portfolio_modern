import React, { HTMLAttributes } from 'react';

interface NavItemProps extends HTMLAttributes<HTMLLIElement> {
  children: string;
}

const NavItem:React.FC<NavItemProps> = ({children, ...props}) => {
  return (
    <li {...props} className='hover:lg:-translate-x-5 hover:cursor-pointer hover:opacity-75 transition-all duration-300 ease-in-out'>
      {children}
    </li>
  )
}

export default NavItem
