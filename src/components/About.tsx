import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

import { useIsOnPhone } from '@/hooks/useIsOnPhone';

const About: React.FC = () => {
  const { screenWidth } = useIsOnPhone('about');
  if (screenWidth === null) {
    return null;
  }
  return (
    <motion.div
      className="container mx-auto md:mt-36 mb-[100px] px-3 md:px-11"
      initial={{ x: -screenWidth }}
      animate={{ x: 0 }}
      exit={{
        x: -screenWidth,
        transition: { duration: 0.4 },
      }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex flex-col md:flex-row items-center  md:gap-12 pt-10 md:pt-18">
        <motion.div
          className="h-24 md:h-64 w-24 md:w-64"
          initial={{ x: -screenWidth }}
          animate={{ x: 0 }}
          exit={{
            x: -screenWidth,
            transition: { duration: 0.4 },
          }}
          transition={{
            type: 'spring',
            duration: 0.5,
            delay: 1,
            stiffness: 100,
          }}
        >
          <Image
            alt="picture of the author"
            loading="lazy"
            src="/images/ame.webp"
            width={900}
            height={900}
            className="h-24 md:h-64 w-24 md:w-64 rounded-full border-2 border-amber-100/60 max-w-none"
          />
        </motion.div>
        <div className="mt-6 md:mt-0">
          <h1 className="text-4xl md:text-6xl font-black">
            I&apos;m Amedeo a full-stack web developer who loves writing clean,
            easy-to-read and maintainable code.
          </h1>
        </div>
      </div>

      <div className="mt-8 md:mt-20">
        <p className="text-xl md:text-5xl leading-relaxed text-center md:text-justify">
          I focus on making my work maintainable, so that anyone jumping in can
          understand it quickly.
          <br />
          I also put a lot of effort into clear communication—whether it&apos;s
          sharing ideas, giving feedback, or just making sure we&apos;re all on
          the same page.
          <br />
          <br />
          For me, clear code and good communication go hand in hand to keep
          projects running smoothly.
        </p>
      </div>
      <div className="flex justify-center gap-6 mt-8 lg:mt-20 mb-8">
        <a
          href="mailto:amedeo.majer@gmail.com"
          className="flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6" />
        </a>
        <a
          href="https://linkedin.com/in/amedeo-majer-5b80b1159"
          className="flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
        </a>
        <a
          href="https://github.com/amedeomajer"
          className="flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faGithub} className="w-6 h-6" />
        </a>
      </div>
    </motion.div>
  );
};

export default About;
