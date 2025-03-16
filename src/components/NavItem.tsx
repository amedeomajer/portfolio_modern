import React, { HTMLAttributes } from 'react';

interface NavItemProps extends HTMLAttributes<HTMLLIElement> {
  children: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ children, isActive, ...props }) => {
  return (
    <li
      {...props}
      className={`${
        isActive ? 'text-red-500 -translate-x-5' : 'text-white'
      } hover:lg:-translate-x-5 hover:cursor-pointer hover:opacity-75 transition-all duration-300 ease-in-out`}
    >
      {children}
    </li>
  );
};

export default NavItem;
