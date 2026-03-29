"use client";

import { motion } from "framer-motion";
import { cvData } from "@/data/cvData";

const Experience = () => {
  return (
    <section
      id="experience"
      className="section flex items-center justify-center py-20 px-space-5"
    >
      <motion.div
        className="glass-card glass-card--primary glass-card-hover effects-budget-soft p-space-6 md:p-space-7 max-w-4xl w-full"
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
          <h2 className="text-2xl md:text-3xl font-bold mb-space-6">
            {cvData.work.title}
          </h2>

          <div className="space-y-space-6">
            {[...cvData.work.positions].reverse().map((position, index) => (
              <motion.div
                key={position.company}
                className="group relative pl-space-6 border-l-2 border-white/30 hover:border-white transition-colors"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                {/* Timeline dot */}
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-bg-dark border-2 border-white/30 group-hover:border-white transition-colors" />

                <div className="mb-space-4">
                  <h3 className="text-xl md:text-2xl font-semibold">
                    {position.company}
                  </h3>
                  <p className="text-white/70 text-sm">{position.period}</p>
                  <p className="text-white/80 mt-2">{position.description}</p>
                </div>

                <div className="mb-space-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-white/75 mb-2">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {position.mainTechnologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 rounded-md bg-glass"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-space-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-white/75 mb-2">
                    Impact
                  </h4>
                  <ul className="space-y-2">
                    {position.impact.map((item, i) => (
                      <li
                        key={i}
                        className="text-white/80 text-sm flex items-start gap-2"
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
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-white/75 mb-2">
                      Initiatives
                    </h4>
                    <ul className="space-y-2">
                      {position.initiatives.map((initiative, i) => (
                        <li
                          key={i}
                          className="text-white/80 text-sm flex items-start gap-2"
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
        <div className="my-space-7 border-t border-glass-border" />

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-space-6">
            {cvData.education.title}
          </h2>

          <div className="group relative pl-space-6 border-l-2 border-white/30 hover:border-white transition-colors">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-bg-dark border-2 border-white/30 group-hover:border-white transition-colors" />

            <p className="text-white/80 mb-4">{cvData.education.description}</p>
            <p className="text-white/80 mb-4">
              {cvData.education.additionalInfo}
            </p>

            <ul className="space-y-2">
              {cvData.education.projects.map((project, i) => (
                <li
                  key={i}
                  className="text-white/80 text-sm flex items-start gap-2"
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
