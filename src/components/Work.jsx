import React, { useState } from 'react';
import Card from './Card.tsx';
import CardImage from './CardImage';
import CardDescription from './CardDescription';
import { motion, AnimatePresence } from 'framer-motion';
import projectsData from '@/data/projectsData';

const Work = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = projectsData.map((project, index) => (
    <Card key={index} layoutId={project.name} onClick={() => setSelectedProject(project)} className="cursor-pointer">
      <CardImage image={`/images/${project.image}`} alt={project.imageAlt} />
      <CardDescription>
        <strong>{project.name}</strong>{project.placeholderDescription}
      </CardDescription>
    </Card>
  ));

  return (
    <motion.div
      className="container mx-auto flex-wrap md:px-6 flex gap-6 justify-around pb-[100px] lg:pb-[200px]"
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      >
      <AnimatePresence>
      {projects}
        {selectedProject && (
          <motion.div layoutId={selectedProject.name} className="fixed min-h-screen inset-0 z-50 bg-black bg-opacity-75 backdrop-blur-md flex flex-col" onTap={() => setSelectedProject(null)} onClick={() => setSelectedProject(null)}>
            <motion.div className="p-4 w-full rounded-sm container mx-auto lg:max-w-[40%]" onClick={(e) => e.stopPropagation()}>
              <motion.img src={`/images/${selectedProject.image}`} alt={selectedProject.name} className="w-full max-w-[700px] h-auto rounded-t-sm"/>
              <motion.div className='lg:text-lg mt-4'>
                <strong>{selectedProject.name}</strong>{selectedProject.longDescription}
              </motion.div>
              <motion.div className="flex flex-wrap gap-2 mt-2">
                {selectedProject.tech.map((tech, index) => (
                  <motion.div key={index} className=" bg-teal-950 py-2 px-3 rounded-sm">{tech}</motion.div>
                ))}
              </motion.div>
              <motion.div className="flex flex-wrap gap-2 mt-2">
                {selectedProject.tech.map((tech, index) => (
                  <motion.div key={index} className=" bg-emerald-950 py-2 px-3 rounded-sm">{tech}</motion.div>
                ))}
              </motion.div>
              <motion.div className="flex flex-wrap gap-2 mt-2">
                {selectedProject.tech.map((tech, index) => (
                  <motion.div key={index} className=" bg-indigo-950 py-2 px-3 rounded-sm">{tech}</motion.div>
                ))}
              </motion.div>
              <motion.button className="absolute bottom-14 right-10 mt-4 font-black bg-red-500 w-10 h-10 rounded-full "> X </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Work;


// Project Overview:
// Hire a Hiver stands as an innovative platform crafted to bridge the gap between businesses and the highly skilled students from Hive Helsinki. Born from the necessity for a trusted, Hive-branded platform within the Finnish technology sector, Hire a Hiver facilitates seamless connections, fostering opportunities for both emerging talent and forward-thinking companies.

// My Contributions:

// System Enhancements and Automation: Led the integration of SendGrid to automate email communications, streamlining the process of connecting students with potential employers and ensuring timely updates and notifications.

// User Experience and Interface Design: Undertook a comprehensive overhaul of the user interface and experience, focusing on intuitive navigation and aesthetic appeal. This included a complete revamp of the landing page, making it more engaging and informative for both students and recruiters.

// Advanced Feature Implementation: Developed and implemented a range of features to enhance user interaction and functionality. This included:

// Custom error pages to improve user experience during unforeseen errors.
// Avatar and CV file upload capabilities, allowing users to personalise their profiles and share their qualifications with potential employers.
// Dockerisation of the application, ensuring consistency across development, testing, and production environments.
// A comprehensive FAQ page, addressing common queries and enhancing the platform's usability.
// Recruiter Experience Optimisation: Focused on enhancing the recruiter experience through significant UI and UX improvements, making it easier for companies to find and connect with top talent.

// Real-Time Notifications: Established a Discord integration to send real-time notifications to a dedicated student server about new job postings, ensuring immediate visibility of opportunities.

// Infrastructure and Deployment: Configured Rails settings for a robust deployed production environment, ensuring high availability and reliability of the Hire a Hiver platform.

// Continuous Improvement: Demonstrated a commitment to excellence and continuous improvement by resolving a wide range of bugs and implementing UI fixes across the platform, culminating in the successful closure of 80 pull requests.

// Impact:
// My contributions to Hire a Hiver have significantly enhanced the platform's functionality, usability, and reliability, establishing it as a cornerstone for technology industry recruitment in Finland. By improving the connection between businesses and the talented students of Hive Helsinki, Hire a Hiver has become a trusted resource for fostering meaningful career opportunities.
