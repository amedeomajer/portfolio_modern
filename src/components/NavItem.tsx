import React, { HTMLAttributes } from 'react';

interface NavItemProps extends HTMLAttributes<HTMLLIElement> {
  children: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ children, isActive, ...props }) => {
  return (
    <li {...props} tabIndex={1} data-active={isActive}>
      {children}
    </li>
  );
};

export default NavItem;
