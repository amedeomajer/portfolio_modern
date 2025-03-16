import React from 'react';
import Image from 'next/image';

interface CardImageProps {
  image: string;
  imageAlt: string;
}

const CardImage: React.FC<CardImageProps> = ({ image }) => {
  return (
    <div className="h-[80%] w-full relative rounded-t-sm grayscale group-hover:grayscale-0 transition duration-300 ease-in-out">
      <Image
        alt="project preview"
        src={image}
        fill={true}
        className="object-cover rounded-t-sm"
      />
    </div>
  );
};

export default CardImage;
