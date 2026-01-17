"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const About = () => {
  return (
    <section
      id="about"
      className="section flex items-center justify-center py-20 px-4"
    >
      <motion.div
        className="glass-card glass-card-hover glass-glow p-8 md:p-12 max-w-4xl w-full"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Profile Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-glass-border">
              <Image
                alt="picture of the author"
                src="/images/ame.webp"
                width={200}
                height={200}
                className="w-full h-full object-cover grayscale-hover"
              />
            </div>
            {/* Glow effect behind image */}
            <div className="absolute inset-0 -z-10 rounded-full bg-white/5 blur-xl" />
          </motion.div>

          {/* Bio */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              About Me
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-text-muted leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              I&apos;m a full-stack web developer who loves writing clean,
              easy-to-read and maintainable code. I focus on making my work
              accessible, so that anyone jumping in can understand it quickly.
            </motion.p>
          </div>
        </div>

        {/* Extended bio */}
        <motion.div
          className="mt-8 pt-8 border-t border-glass-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-text-muted leading-relaxed text-center lg:text-left">
            I put a lot of effort into clear communication—whether it&apos;s
            sharing ideas, giving feedback, or just making sure we&apos;re all
            on the same page. For me, clear code and good communication go hand
            in hand to keep projects running smoothly.
          </p>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex justify-center lg:justify-start gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a
            href="mailto:amedeo.majer@gmail.com"
            className="p-3 rounded-lg border border-glass-border hover:border-white/20 hover:bg-glass transition-all"
            aria-label="Send email to Amedeo"
          >
            <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/amedeo-majer-5b80b1159"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg border border-glass-border hover:border-white/20 hover:bg-glass transition-all"
            aria-label="Visit LinkedIn profile"
          >
            <FontAwesomeIcon icon={faLinkedin} className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/amedeomajer"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg border border-glass-border hover:border-white/20 hover:bg-glass transition-all"
            aria-label="Visit GitHub profile"
          >
            <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
