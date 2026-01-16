"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import GlitchText from "./ui/GlitchText";
import BlurText from "./ui/BlurText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

// Dynamic import for 3D viewer - prevents SSR hydration issues
const Logo3DViewer = dynamic(
  () => import("./ui/three/Logo3DViewer").then((mod) => mod.Logo3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="three-canvas-container h-[200px] md:h-[280px] flex items-center justify-center">
        <div className="animate-pulse bg-white/5 rounded-full w-24 h-24" />
      </div>
    ),
  }
);

const Hero = () => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
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

        <div className="flex mb-4 glitch-group cursor-default">
          <GlitchText
            speed={0.8}
            enableShadows={true}
            enableOnHover={true}
            className="font-bricolage font-extrabold"
          >
            Amedeo
          </GlitchText>
          <GlitchText
            speed={0.8}
            enableShadows={true}
            enableOnHover={true}
            className="font-syne"
          >
            MAJER
          </GlitchText>
        </div>

        <BlurText
          text="Full-Stack Web Developer"
          delay={100}
          animateBy="words"
          direction="top"
          className="text-xl md:text-2xl text-text-muted font-light tracking-wider"
        />
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-text-muted hover:text-white transition-all duration-300 cursor-pointer ${
          showScrollIndicator ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll to about section"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="w-4 h-4 scroll-indicator"
        />
      </button>
    </section>
  );
};

export default Hero;
