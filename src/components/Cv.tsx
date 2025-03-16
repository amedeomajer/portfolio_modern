import React from 'react';
import { motion } from 'framer-motion';
import CvPicture from './CvPicture';

const Cv: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full md:pt-20">
      <CvPicture />
      <div className="flex flex-col justify-center items-center">
        <motion.div
          className="w-full md:w-1/2 bg-gray-800 rounded-sm p-4 mb-10 pb-8 opacity-80 backdrop-blur-md md:text-xl"
          initial={{ y: 1300 }}
          animate={{ y: 0 }}
          exit={{ y: 1300, transition: { delay: 0.3 } }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-xl md:text-3xl md:pb-5">
            <strong>Education</strong>
          </h2>
          <p>
            I started my journey in programming at Hive Helsinki, from where I
            graduated in February 2023. Here I delved into programming head
            first by learning C. <br />
            After completing the common part of the sudies in C I took the web
            development branch where I completed three projects:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              Instagram clone to share pictures and apply stickers to them.
            </li>
            <li>
              Tinder clone with real time chat through web sockets and an
              algorithm to match people based on location and interests.
            </li>
            <li>Youtube clone to stream movies through YTF torrent API.</li>
          </ul>

          <hr className="my-5" />

          <h2 className="text-xl md:text-3xl md:pb-5">
            <strong>Work</strong>
          </h2>
          <p className="md:text-2xl">
            <strong>Hive Helsinki</strong> April 2023 - ongoing
          </p>
          <p>
            At Hive I&apos;m working as a software developer, creating,
            maintaining and improving various websites and software. On top of
            that I am improving the school pedagogy and ensuring a good
            experience for the students and the rest of the staff.
          </p>
          <h3 className="text-lg text-justify text-white mt-4 md:text-2xl">
            <strong>Main technologies:</strong>
          </h3>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Ruby on Rails</li>
            <li>Next.js</li>
            <li>Docker</li>
            <li>Python</li>
          </ul>
          <p className="text-lg text-justify text-white mt-4 md:text-2xl">
            <strong>Impact:</strong>
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              Enhanced platform functionality, usability, and reliability for
              Hire a Hiver. <br />
              <em>See the work section for more information.</em>
            </li>
            <li>
              Improved issue tracking and communication with Tech Report,
              keeping the ask-staff channel on Discord cleaner and more
              organized. <br />
              <em>See the work section for more information.</em>
            </li>
            <li>
              Increased student engagement in their coalitions with the Sorting
              Hat app, motivating them to excel in their studies. <br />
              <em>See the work section for more information.</em>
            </li>
          </ul>
          <p className="text-lg text-justify text-white mt-4 md:text-2xl">
            <strong>Initiatives:</strong>
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              Ideated and organized the WebDevExpress event, a one-month
              initiative focused on web development. The event included four
              workshops, a coding challenge, and a demo day where professionals
              provided feedback to participating groups.
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Cv;
