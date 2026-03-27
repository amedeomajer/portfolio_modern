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
import { cn } from "@/lib/utils";

const carouselDotVisual = (active: boolean, size: "default" | "overlay") =>
  cn(
    "block rounded-full transition-[transform,background-color,box-shadow,ring-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
    size === "overlay"
      ? active
        ? "h-1 w-1 scale-[1.65] bg-white shadow-[0_0_6px_rgba(255,255,255,0.55)]"
        : "h-1 w-1 bg-white/22 ring-1 ring-inset ring-white/40 group-hover:bg-white/40 group-hover:ring-white/55"
      : "h-2.5 w-2.5 sm:h-3 sm:w-3",
    size === "default" &&
      (active
        ? "scale-125 bg-white shadow-[0_0_14px_rgba(255,255,255,0.35)] ring-2 ring-white/25"
        : "bg-white/[0.14] ring-1 ring-inset ring-white/55 group-hover:bg-white/25 group-hover:ring-white/70"),
  );

const CarouselDot = ({
  active,
  slideIndex,
  onSelect,
  size = "default",
}: {
  active: boolean;
  slideIndex: number;
  onSelect: () => void;
  size?: "default" | "overlay";
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      "group inline-flex shrink-0 items-center justify-center rounded-full touch-manipulation",
      size === "overlay" ? "p-1.5 min-h-9 min-w-9" : "p-2.5 md:p-2",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)]",
    )}
    aria-label={`Go to project ${slideIndex + 1}`}
    aria-current={active ? "true" : undefined}
  >
    <span className={carouselDotVisual(active, size)} aria-hidden />
  </button>
);

const CarouselArrow = ({
  direction,
  onClick,
  label,
  className,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
  className?: string;
}) => {
  const icon = direction === "prev" ? faChevronLeft : faChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "rounded-full flex items-center justify-center touch-manipulation",
        "transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "hover:scale-105 active:scale-[0.97]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)]",
        className,
      )}
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
        <FontAwesomeIcon icon={icon} className="w-5 h-5 md:w-6 md:h-6" />
      </GlassSurface>
    </button>
  );
};

const ProjectCard = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => {
  const projectContext = project.tech.slice(0, 2).join(" • ");

  return (
    <div
      className="cursor-pointer overflow-hidden group h-full rounded-2xl bg-zinc-950/90 ring-1 ring-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:ring-white/[0.12] md:hover:scale-[1.008]"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-auto md:h-72 lg:h-80 overflow-hidden rounded-t-2xl">
        <Image
          src={`/images/${project.image}`}
          alt={project.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 72rem"
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/35 to-black/10" />
      </div>

      <div className="border-t border-white/[0.06] bg-black/55 px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-6 rounded-b-2xl">
        <p className="mb-2.5 text-[10px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.16em] text-white/55">
          {projectContext}
        </p>
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight mb-2.5 sm:mb-3 text-white group-hover:text-glow transition-[color,text-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
          {project.name}
        </h3>
        <p className="text-white/78 text-sm md:text-[0.9375rem] leading-relaxed line-clamp-3 sm:line-clamp-4 mb-4 sm:mb-5">
          {project.placeholderDescription}
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
          {project.tech.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[11px] sm:text-xs px-2 py-1 rounded-md bg-white/[0.08] text-white/75 ring-1 ring-white/[0.06]"
            >
              {tech}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="text-[11px] sm:text-xs px-2 py-1 text-text-muted">
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        <div className="inline-flex items-center gap-2 text-sm font-medium text-white/88 pb-0.5">
          <span>Open case study</span>
          <FontAwesomeIcon
            icon={faChevronRight}
            className="w-3 h-3 opacity-80 group-hover:translate-x-0.5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          />
        </div>
      </div>
    </div>
  );
};

const Work = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
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
    [emblaApi],
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
      className="section flex flex-col items-center justify-center px-space-5 pt-20 pb-20 max-[569px]:pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] min-[570px]:max-md:justify-start min-[570px]:max-md:pb-[calc(9.5rem+env(safe-area-inset-bottom,0px))] min-[570px]:max-md:pt-16"
    >
      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onAnimationEnd={(open) => {
          if (!open) setSelectedProject(null);
        }}
      >
        <DrawerContent className="max-h-full bg-bg-black/95 backdrop-blur-xl border-t border-glass-border container mx-auto min-h-[90%] md:bottom-0 md:max-h-[calc(100vh-90px)]">
          {selectedProject ? (
            <>
              <DrawerClose>
                <div className="w-full rounded-t-lg pt-4 bounce-once">
                  <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
                </div>
              </DrawerClose>
              <DrawerHeader>
                <DrawerTitle className="text-center text-xl md:text-2xl">
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
                </DrawerTitle>
              </DrawerHeader>
              <div
                className="overflow-y-auto flex-1 pb-20"
                onClick={() => setDrawerOpen(false)}
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
                      className="w-full h-auto grayscale"
                    />
                  </div>

                  <div className="rounded-2xl bg-black/70 p-space-6 space-y-space-6 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
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
                          ),
                        )}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-space-3">
                        Impact
                      </h3>
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
            </>
          ) : null}
        </DrawerContent>

        {/* Section Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <motion.h2
            className="type-section-title font-bold text-center mb-6 sm:mb-8 md:mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          >
            My Work
          </motion.h2>

          {/* Carousel: md+ side arrows + dots below; ≤767px compact dots above track, right-aligned */}
          <div className="relative md:px-12 lg:px-14 xl:px-16">
            <div className="mb-2 flex justify-end px-2.5 sm:px-4 md:hidden">
              {projectsData.map((_, index) => (
                <CarouselDot
                  key={index}
                  slideIndex={index}
                  active={index === selectedIndex}
                  onSelect={() => scrollTo(index)}
                  size="overlay"
                />
              ))}
            </div>

            <div className="embla overflow-hidden rounded-2xl" ref={emblaRef}>
              <div className="embla__container flex">
                {projectsData.map((project: Project) => (
                  <div
                    key={project.name}
                    className="embla__slide flex-[0_0_100%] px-2.5 sm:px-4 md:px-5"
                  >
                    <ProjectCard
                      project={project}
                      onClick={() => {
                        setSelectedProject(project);
                        setDrawerOpen(true);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <CarouselArrow
              direction="prev"
              onClick={scrollPrev}
              label="Previous project"
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10"
            />
            <CarouselArrow
              direction="next"
              onClick={scrollNext}
              label="Next project"
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10"
            />
          </div>

          <div className="hidden md:flex justify-center gap-1 flex-wrap mt-8">
            {projectsData.map((_, index) => (
              <CarouselDot
                key={index}
                slideIndex={index}
                active={index === selectedIndex}
                onSelect={() => scrollTo(index)}
              />
            ))}
          </div>
        </div>
      </Drawer>
    </section>
  );
};

export default Work;
