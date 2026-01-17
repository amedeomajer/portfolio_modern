"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faLink } from "@fortawesome/free-solid-svg-icons";
import Aurora from "./ui/Aurora";
import projectsData from "@/data/projectsData";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "./Drawer";
import { Project } from "@/types/project";

const ProjectCard = ({
  project,
  onClick,
  index,
}: {
  project: Project;
  onClick: () => void;
  index: number;
}) => {
  return (
    <motion.div
      className="glass-card glass-card-hover cursor-pointer overflow-hidden group w-full sm:w-[280px] md:w-[320px]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-40 md:h-48 overflow-hidden">
        <Image
          src={`/images/${project.image}`}
          alt={project.imageAlt}
          fill
          className="object-cover grayscale-hover transition-all duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-black/80 to-transparent" />
      </div>

      <div className="p-4 md:p-5">
        <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-glow transition-all">
          {project.name}
        </h3>
        <p className="text-text-muted text-sm line-clamp-2">
          {project.placeholderDescription}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {project.tech.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 rounded-md border border-glass-border bg-glass"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 3 && (
            <span className="text-xs px-2 py-1 text-text-muted">
              +{project.tech.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Work = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section
      id="work"
      className="section flex items-center justify-center py-20 px-4"
    >
      <Drawer
        open={!!selectedProject}
        onOpenChange={(open) => {
          if (!open) setSelectedProject(null);
        }}
      >
        {selectedProject && (
          <DrawerContent className="max-h-full bg-bg-black/95 backdrop-blur-xl border-t border-glass-border container mx-auto min-h-[90%]">
            <DrawerClose>
              <div className="w-full rounded-t-lg pt-4 bounce-once">
                <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
              </div>
            </DrawerClose>
            <DrawerHeader>
              <DrawerTitle>
                <h2 className="text-center text-xl md:text-2xl">
                  {selectedProject.url ? (
                    <a
                      href={selectedProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-glow transition-all"
                    >
                      {selectedProject.name}
                      <FontAwesomeIcon icon={faLink} className="ml-2 w-4 h-4" />
                    </a>
                  ) : (
                    selectedProject.name
                  )}
                </h2>
              </DrawerTitle>
            </DrawerHeader>
            <div
              className="overflow-y-auto flex-1 pb-20"
              onClick={() => setSelectedProject(null)}
            >
              <div
                className="p-4 w-full container mx-auto lg:max-w-[50%]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="rounded-lg overflow-hidden border border-glass-border mb-6">
                  <Image
                    src={`/images/${selectedProject.image}`}
                    alt={selectedProject.name}
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>

                <div className="glass-card p-6 space-y-6">
                  <p className="text-text-muted leading-relaxed">
                    {selectedProject.longDescription.intro}
                  </p>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      My Contributions
                    </h3>
                    <ul className="space-y-3">
                      {selectedProject.longDescription.contributions.map(
                        (contribution) => (
                          <li
                            key={contribution.title}
                            className="text-text-muted"
                          >
                            <strong className="text-white">
                              {contribution.title}:
                            </strong>{" "}
                            {contribution.description}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Impact</h3>
                    <p className="text-text-muted leading-relaxed">
                      {selectedProject.longDescription.impact}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-glass-border">
                    {selectedProject.tech.map((tech) => (
                      <span
                        key={tech}
                        className="text-sm px-3 py-1.5 rounded-md border border-glass-border bg-glass"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DrawerContent>
        )}

        {/* Section Content */}
        <div className="relative z-10 container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            My Work
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {projectsData.map((project: Project, index: number) => (
              <ProjectCard
                key={project.name}
                project={project}
                onClick={() => setSelectedProject(project)}
                index={index}
              />
            ))}
          </div>
        </div>
      </Drawer>
    </section>
  );
};

export default Work;
