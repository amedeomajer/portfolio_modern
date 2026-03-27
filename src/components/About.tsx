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
      className="section flex items-center justify-center py-20 px-space-5"
    >
      <motion.div
        className="glass-card glass-card--primary effects-budget-soft p-space-6 md:p-space-7 max-w-3xl w-full shadow-[0_14px_40px_rgba(0,0,0,0.35)]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-space-6">
          {/* Profile Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border border-glass-border">
              <Image
                alt="picture of the author"
                src="/images/ame.webp"
                width={200}
                height={200}
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </motion.div>

          {/* Bio */}
          <div className="flex-1 text-center sm:text-left">
            <motion.h2
              className="type-section-title font-bold text-white mb-space-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              About Me
            </motion.h2>
            <motion.p
              className="text-body-md text-white/92"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              I&apos;m a full-stack web developer who loves writing clean,
              easy-to-read and maintainable code, so that anyone jumping in can
              understand it quickly.
            </motion.p>
          </div>
        </div>

        {/* Extended bio */}
        <motion.div
          className="mt-space-6 pt-space-6 border-t border-glass-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-body-md text-white/82 text-center sm:text-left">
            I put effort into clear communication—whether it&apos;s sharing
            ideas, giving feedback, or just making sure we&apos;re all on the
            same page. For me, clear code and good communication go hand in hand
            to keep projects running smoothly.
          </p>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex flex-wrap justify-center sm:justify-start gap-space-3 mt-space-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a
            href="mailto:amedeo.majer@gmail.com"
            className="inline-flex items-center gap-2 px-space-4 py-space-3 rounded-lg border border-glass-border text-white/90 hover:border-white/25 hover:bg-white/5 transition-all text-sm"
            aria-label="Send email to Amedeo"
          >
            <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
            <span>Email</span>
          </a>
          <a
            href="https://linkedin.com/in/amedeo-majer-5b80b1159"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-space-4 py-space-3 rounded-lg border border-glass-border text-white/90 hover:border-white/25 hover:bg-white/5 transition-all text-sm"
            aria-label="Visit LinkedIn profile"
          >
            <FontAwesomeIcon icon={faLinkedin} className="w-5 h-5" />
            <span>LinkedIn</span>
          </a>
          <a
            href="https://github.com/amedeomajer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-space-4 py-space-3 rounded-lg border border-glass-border text-white/90 hover:border-white/25 hover:bg-white/5 transition-all text-sm"
            aria-label="Visit GitHub profile"
          >
            <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
            <span>GitHub</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
