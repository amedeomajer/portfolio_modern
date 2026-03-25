"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import useEmblaCarousel from "embla-carousel-react";
import projectsData from "@/data/projectsData";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "./Drawer";
import { Project } from "@/types/project";
import GlassSurface from "./ui/GlassSurface";

const ProjectCard = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => {
  return (
    <div
      className="glass-card glass-card--primary glass-card-hover effects-budget-soft cursor-pointer overflow-hidden group h-full"
      onClick={onClick}
    >
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src={`/images/${project.image}`}
          alt={project.imageAlt}
          fill
          className="object-cover grayscale-hover transition-all duration-[3000] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-black/80 to-transparent" />
      </div>

      <div className="p-space-5 md:p-space-6">
        <h3 className="text-xl md:text-2xl font-bold mb-space-3 group-hover:text-glow transition-all">
          {project.name}
        </h3>
        <p className="text-white/80 text-sm md:text-base line-clamp-3 mb-space-4">
          {project.placeholderDescription}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tech.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 rounded-md border border-glass-border bg-glass"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="text-xs px-2 py-1 text-text-muted">
              +{project.tech.length - 4}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Work = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    skipSnaps: false,
    dragFree: false,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section
      id="work"
      className="section flex flex-col items-center justify-center py-20 px-space-5"
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
                className="p-space-5 w-full container mx-auto lg:max-w-[50%]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="rounded-lg overflow-hidden border border-glass-border mb-space-6">
                  <Image
                    src={`/images/${selectedProject.image}`}
                    alt={selectedProject.name}
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>

                <div className="glass-card glass-card--secondary p-space-6 space-y-space-6">
                  <p className="text-white/80 leading-relaxed">
                    {selectedProject.longDescription.intro}
                  </p>

                  <div>
                    <h3 className="text-lg font-semibold mb-space-3">
                      My Contributions
                    </h3>
                    <ul className="space-y-3">
                      {selectedProject.longDescription.contributions.map(
                        (contribution) => (
                          <li
                            key={contribution.title}
                            className="text-white/80"
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
                    <h3 className="text-lg font-semibold mb-space-3">Impact</h3>
                    <p className="text-white/80 leading-relaxed">
                      {selectedProject.longDescription.impact}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-space-4 border-t border-glass-border">
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
        <div className="relative z-10 w-full max-w-6xl mx-auto px-space-5">
          <motion.h2
            className="type-section-title font-bold text-center mb-space-7"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            My Work
          </motion.h2>

          {/* Carousel Container */}
          <div className="relative">
            {/* Embla Viewport */}
            <div className="embla overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex">
                {projectsData.map((project: Project) => (
                  <div
                    key={project.name}
                    className="embla__slide flex-[0_0_100%] min-w-0 px-space-4 md:px-space-7"
                  >
                    <ProjectCard
                      project={project}
                      onClick={() => setSelectedProject(project)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow Buttons */}
            <button
              onClick={scrollPrev}
              className="absolute -left-6 md:-left-20 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg"
              aria-label="Previous project"
            >
              <GlassSurface
                width={60}
                height={60}
                borderRadius={50}
                borderWidth={0.07}
                brightness={50}
                opacity={0.93}
                blur={15}
                displace={0.5}
                distortionScale={-180}
                redOffset={0}
                greenOffset={20}
                blueOffset={30}
                backgroundOpacity={0.1}
                saturation={1}
                className="dock-glass-panel"
              >
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              </GlassSurface>
            </button>
            <button
              onClick={scrollNext}
              className="absolute -right-6 md:-right-20 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg"
              aria-label="Next project"
            >
              <GlassSurface
                width={60}
                height={60}
                borderRadius={50}
                borderWidth={0.07}
                brightness={50}
                opacity={0.93}
                blur={15}
                displace={0.5}
                distortionScale={-180}
                redOffset={0}
                greenOffset={20}
                blueOffset={30}
                backgroundOpacity={0.1}
                saturation={1}
                className="dock-glass-panel"
              >
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              </GlassSurface>
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-space-6">
            {projectsData.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "bg-white scale-125 shadow-[0_0_14px_rgba(255,255,255,0.35)]"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Drawer>
    </section>
  );
};

export default Work;
