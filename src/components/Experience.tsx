"use client";

import { motion } from "framer-motion";
import { cvData } from "@/data/cvData";

const Experience = () => {
  return (
    <section
      id="experience"
      className="section flex items-center justify-center py-20 px-4 bg-purple-500"
    >
      <motion.div
        className="glass-card glass-card-hover glass-glow p-6 md:p-10 max-w-4xl w-full"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        {/* Work Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            {cvData.work.title}
          </h2>

          <div className="space-y-8">
            {[...cvData.work.positions].reverse().map((position, index) => (
              <motion.div
                key={position.company}
                className="relative pl-6 border-l-2 border-glass-border hover:border-white/30 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                {/* Timeline dot */}
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-bg-dark border-2 border-glass-border" />

                <div className="mb-4">
                  <h3 className="text-xl md:text-2xl font-semibold">
                    {position.company}
                  </h3>
                  <p className="text-text-muted text-sm">{position.period}</p>
                  <p className="text-text-muted mt-2">{position.description}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {position.mainTechnologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 rounded-md border border-glass-border bg-glass"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Impact
                  </h4>
                  <ul className="space-y-2">
                    {position.impact.map((item, i) => (
                      <li
                        key={i}
                        className="text-text-muted text-sm flex items-start gap-2"
                      >
                        <span className="text-white/40 mt-1.5">-</span>
                        <span>
                          {item.description}
                          {item.note && (
                            <em className="block text-white/40 text-xs mt-1">
                              {item.note}
                            </em>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {position.initiatives && (
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-2">
                      Initiatives
                    </h4>
                    <ul className="space-y-2">
                      {position.initiatives.map((initiative, i) => (
                        <li
                          key={i}
                          className="text-text-muted text-sm flex items-start gap-2"
                        >
                          <span className="text-white/40 mt-1.5">-</span>
                          <span>{initiative}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="my-10 border-t border-glass-border" />

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {cvData.education.title}
          </h2>

          <div className="relative pl-6 border-l-2 border-glass-border">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-bg-dark border-2 border-glass-border" />

            <p className="text-text-muted mb-4">
              {cvData.education.description}
            </p>
            <p className="text-text-muted mb-4">
              {cvData.education.additionalInfo}
            </p>

            <ul className="space-y-2">
              {cvData.education.projects.map((project, i) => (
                <li
                  key={i}
                  className="text-text-muted text-sm flex items-start gap-2"
                >
                  <span className="text-white/40 mt-1.5">-</span>
                  <span>{project}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Experience;
