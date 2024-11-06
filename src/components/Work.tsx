import React, { useState } from 'react';
import Card from './Card';
import CardImage from './CardImage';
import CardDescription from './CardDescription';
import { motion, AnimatePresence } from 'framer-motion';
import projectsData from '@/data/projectsData';

interface Project {
  name: string;
  image: string;
  imageAlt: string;
  placeholderDescription: string;
  longDescription: {
    intro: string;
    contributions: { title: string; description: string }[];
    impact: string;
  };
  tech: string[];
}

const Work: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects = projectsData.map((project: Project, index: number) => (
    <Card key={index} layoutId={project.name} onClick={() => setSelectedProject(project)} className="cursor-pointer">
      <CardImage image={`/images/${project.image}`} imageAlt={project.imageAlt} />
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
              
              <motion.div className="lg:text-lg mt-4">
                <strong>{selectedProject.name}</strong>
                <p>{selectedProject.longDescription.intro}</p>

                <h3 className="mt-4 font-semibold">My Contributions:</h3>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  {selectedProject.longDescription.contributions.map((contribution, index) => (
                    <li key={index}>
                      <strong>{contribution.title}:</strong> {contribution.description}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-4 font-semibold">Impact:</h3>
                <p>{selectedProject.longDescription.impact}</p>
              </motion.div>

              <motion.div className="flex flex-wrap gap-2 mt-2">
                {selectedProject.tech.map((tech: string, index: number) => (
                  <motion.div key={index} className="bg-emerald-950 py-2 px-3 rounded-sm">{tech}</motion.div>
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
