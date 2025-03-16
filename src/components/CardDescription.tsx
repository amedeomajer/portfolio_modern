import React, { ReactNode } from 'react';

interface CardDescriptionProps {
  children: ReactNode;
}

const CardDescription: React.FC<CardDescriptionProps> = ({ children }) => {
  return (
    <div className="py-2 px-4 text-justify text-xl rounded-sm">
      <p>{children}</p>
    </div>
  );
};

export default CardDescription;
