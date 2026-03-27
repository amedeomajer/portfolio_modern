"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  BG_FADE_MS,
  HERO_INTRO_COMPLETE_EVENT,
  INTRO_DARK_MS,
  NAME_FADE_MS,
} from "@/constants/introTimeline";
import GlitchText from "./ui/GlitchText";
import BlurText from "./ui/BlurText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

// Dynamic import for 3D viewer - prevents SSR hydration issues
const _Logo3DViewer = dynamic(
  () => import("./ui/three/Logo3DViewer").then((mod) => mod.Logo3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="three-canvas-container h-[200px] md:h-[280px] flex items-center justify-center">
        <div className="animate-pulse bg-white/5 rounded-full w-24 h-24" />
      </div>
    ),
  },
);

const Hero = () => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [showName, setShowName] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showScrollCta, setShowScrollCta] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show CTA only when Hero is the predominant section in view.
        setShowScrollIndicator(entry.intersectionRatio >= 0.6);
      },
      {
        threshold: [0, 0.25, 0.5, 0.6, 0.75, 1],
      },
    );

    observer.observe(heroRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nameTimer = window.setTimeout(() => {
      setShowName(true);
    }, INTRO_DARK_MS);

    const subtitleTimer = window.setTimeout(() => {
      setShowSubtitle(true);
    }, INTRO_DARK_MS + NAME_FADE_MS + BG_FADE_MS);

    return () => {
      window.clearTimeout(nameTimer);
      window.clearTimeout(subtitleTimer);
    };
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="section relative flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Content */}
      <div className="relative flex flex-col items-center justify-center text-center px-4">
        {/* <Logo3DViewer
          modelPath="/am_logo_2.glb"
          autoRotate={true}
          rotationSpeed={0.008}
          enableHover={true}
          enableFloat={true}
          enableDrag={false}
          scale={1.2}
          className="h-[200px] md:h-[280px] w-full max-w-[400px] mb-4"
        /> */}

        {showName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: NAME_FADE_MS / 1000, ease: "easeOut" }}
            className="flex mb-4 glitch-group cursor-default"
          >
            <GlitchText
              speed={1.2}
              enableShadows={true}
              enableOnHover={true}
              className="font-bricolage font-extrabold"
            >
              Amedeo
            </GlitchText>
            <GlitchText
              speed={1.1}
              enableShadows={true}
              enableOnHover={true}
              className="font-syne"
            >
              MAJER
            </GlitchText>
          </motion.div>
        )}

        <div className="mt-2 min-h-[2.5rem] md:min-h-[3rem] flex items-start justify-center">
          {showSubtitle && (
            <BlurText
              text="Full-Stack Web Developer"
              delay={100}
              animateBy="words"
              direction="top"
              className="type-section-subtitle text-text-muted font-light tracking-wider"
              onAnimationComplete={() => {
                setShowScrollCta(true);
                window.dispatchEvent(new Event(HERO_INTRO_COMPLETE_EVENT));
              }}
            />
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollCta && (
        <button
          onClick={scrollToAbout}
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-text-muted hover:text-white transition-all duration-300 cursor-pointer ${
            showScrollIndicator ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll to about section"
        >
          <BlurText
            text="Scroll"
            delay={100}
            animateBy="words"
            direction="top"
            className="text-xs uppercase tracking-widest"
          />
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: -50 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className="w-4 h-4 scroll-indicator"
            />
          </motion.div>
        </button>
      )}
    </section>
  );
};

export default Hero;
