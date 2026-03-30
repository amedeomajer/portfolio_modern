"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const springSoft = {
  type: "spring" as const,
  stiffness: 100,
  damping: 24,
  mass: 0.9,
};
const easeFluid = [0.32, 0.72, 0, 1] as const;

const linkClass =
  "inline-flex items-center justify-center gap-2 px-space-4 py-space-3 rounded-xl text-white/90 font-medium hover:border-white/25 hover:bg-white/5 active:scale-[0.98] active:translate-y-px transition-all duration-300 ease-in-out text-sm leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-muted)] group";

const linkIconClass =
  "h-[1em] w-[1em] shrink-0 block transition-transform duration-300 ease-in-out group-hover:-translate-y-px";

const About = () => {
  return (
    <section
      id="about"
      className="section flex w-full items-center justify-center py-20 px-space-5 md:py-24"
    >
      <div className="w-full max-w-3xl mx-auto">
        {/* Double-bezel shell (outer) + glass core (inner) */}
        <motion.div
          className="glass-card glass-card--primary effects-budget-soft glass-card-hover rounded-[22px] p-space-6 md:p-space-8 w-full"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: easeFluid }}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-space-6 md:gap-space-8">
            <motion.div
              className="flex justify-center shrink-0"
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ...springSoft, delay: 0.05 }}
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[0.85rem] overflow-hidden">
                <Image
                  alt="Portrait of Amedeo Majer"
                  src="/images/ame.webp"
                  width={288}
                  height={288}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
            </motion.div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <motion.span
                className="inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-white/45 border border-white/10 mb-space-4"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springSoft, delay: 0.08 }}
              >
                Profile
              </motion.span>
              <motion.h2
                className="type-section-title font-semibold tracking-tight text-white text-balance mb-space-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springSoft, delay: 0.12 }}
              >
                About me
              </motion.h2>
              <motion.p
                className="type-body-md text-white/92 text-pretty max-w-[65ch] sm:max-w-none mx-auto sm:mx-0 leading-relaxed"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...springSoft, delay: 0.16 }}
              >
                I&apos;m a full-stack web developer who loves writing clean,
                easy-to-read and maintainable code, so that anyone jumping in
                can understand it quickly.
              </motion.p>
            </div>
          </div>

          <motion.div
            className="mt-space-7 pt-space-7 border-t border-glass-border"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springSoft, delay: 0.2 }}
          >
            <p className="type-body-md text-white/82 text-center sm:text-left text-pretty max-w-[65ch] mx-auto sm:mx-0 leading-relaxed">
              I put effort into clear communication—whether it&apos;s sharing
              ideas, giving feedback, or just making sure we&apos;re all on the
              same page. For me, clear code and good communication go hand in
              hand to keep projects running smoothly.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center sm:justify-start gap-space-3 mt-space-7"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springSoft, delay: 0.26 }}
          >
            <a
              href="mailto:amedeo.majer@gmail.com"
              className={linkClass}
              aria-label="Send email to Amedeo"
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                className={linkIconClass}
                aria-hidden
              />
              <span>Email</span>
            </a>
            <a
              href="https://linkedin.com/in/amedeo-majer-5b80b1159"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
              aria-label="Visit LinkedIn profile"
            >
              <FontAwesomeIcon
                icon={faLinkedin}
                className={linkIconClass}
                aria-hidden
              />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/amedeomajer"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
              aria-label="Visit GitHub profile"
            >
              <FontAwesomeIcon
                icon={faGithub}
                className={linkIconClass}
                aria-hidden
              />
              <span>GitHub</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
