import React, { useState } from 'react';
import { motion } from 'framer-motion';
import projectsData from '@/data/projectsData';
import { useIsOnPhone } from '@/hooks/useIsOnPhone';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProjectCard from './ProjectCard';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from './Drawer';

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
  url: string | null;
}

const Work: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { initialY, initialX } = useIsOnPhone('work');

  const projects = projectsData.map((project: Project, index: number) => (
    <ProjectCard
      key={index}
      project={project}
      onClick={() => setSelectedProject(project)}
    />
  ));
  if (initialY === null || initialX === null) {
    return null;
  }

  return (
    <Drawer
      open={!!selectedProject}
      onOpenChange={(open) => {
        if (!open) setSelectedProject(null);
      }}
    >
      {selectedProject && (
        <DrawerContent className="max-h-full bg-black bg-opacity-30 backdrop-blur-lg container mx-auto min-h-[90%]">
          <DrawerClose>
            <div className="w-full rounded-t-lg pt-4 bounce-once">
              <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
            </div>
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle>
              <h1 className="text-center md:text-2xl">
                {selectedProject.url ? (
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 cursor-pointer"
                  >
                    {selectedProject.name}
                    <FontAwesomeIcon icon={faLink} className="ml-2 w-4 h-4" />
                  </a>
                ) : (
                  selectedProject.name
                )}
              </h1>
            </DrawerTitle>
          </DrawerHeader>
          <div
            className="overflow-y-scroll"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="p-4 w-full rounded-sm container mx-auto lg:max-w-[40%]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`/images/${selectedProject.image}`}
                alt={selectedProject.name}
                className="w-full h-auto rounded-t-sm"
              />

              <div className="lg:text-xl mt-4">
                <p>{selectedProject.longDescription.intro}</p>
                <h3 className="mt-4 font-semibold">My Contributions:</h3>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  {selectedProject.longDescription.contributions.map(
                    (contribution, index) => (
                      <li key={index}>
                        <strong>{contribution.title}:</strong>{' '}
                        {contribution.description}
                      </li>
                    )
                  )}
                </ul>

                <h3 className="mt-4 font-semibold">Impact:</h3>
                <p>{selectedProject.longDescription.impact}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-2 md:mt-6">
                {selectedProject.tech.map((tech: string, index: number) => (
                  <div
                    key={index}
                    className="bg-emerald-950 py-2 px-3 rounded-sm md:text-xl"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DrawerContent>
      )}
      <motion.div
        className="container mx-auto flex-wrap flex gap-6 md:gap-10 justify-center md:mt-32"
        initial={{ x: initialX, y: initialY }}
        animate={{ x: 0, y: 0 }}
        exit={{ x: initialX, y: initialY, transition: { duration: 0.3 } }}
        transition={{ duration: 0.7 }}
      >
        {projects}
      </motion.div>
    </Drawer>
  );
};

export default Work;
