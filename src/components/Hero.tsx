"use client";

import { useState, useEffect } from "react";
import GlitchText from "./ui/GlitchText";
import BlurText from "./ui/BlurText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

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
