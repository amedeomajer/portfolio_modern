import React, { useState } from 'react';
import Card from './Card';
import CardImage from './CardImage';
import CardDescription from './CardDescription';
import { motion } from 'framer-motion';
import projectsData from '@/data/projectsData';
import { useIsOnPhone } from '@/hooks/useIsOnPhone';

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

interface ProjectCardProps {
  project: {
    name: string;
    image: string;
    imageAlt: string;
    placeholderDescription: string;
  };
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <Card layoutId={project.name} onClick={onClick} className="cursor-pointer">
      <CardImage image={`/images/${project.image}`} imageAlt={project.imageAlt} />
      <CardDescription>
        <strong>{project.name}</strong>{project.placeholderDescription}
      </CardDescription>
    </Card>
  );
};

const Work: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const {initialY, initialX} = useIsOnPhone("work");

  const projects = projectsData.map((project: Project, index: number) => (
    <ProjectCard key={index} project={project} onClick={() => setSelectedProject(project)} />
  ));
  if (initialY === null || initialX === null) {
    return null;
  }
  return (
    <>
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
      <motion.div
        className="container mx-auto flex-wrap flex gap-6 md:gap-10 justify-center pb-[100px] lg:pb-[200px] md:mt-32"
        initial={{ x: initialX, y: initialY }}
        animate={{ x: 0, y: 0 }}
        exit={{ x: initialX, y: initialY, transition: {duration: 0.3} }}
        transition={{ duration: 0.7 }}
        >
        {projects}
      </motion.div>
    </>
  );
};

export default Work;
