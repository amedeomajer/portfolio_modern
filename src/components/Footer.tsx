'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer id="contact" className="section flex flex-col items-center justify-center py-20 px-4">
      <div className="glass-card glass-card-hover p-8 md:p-12 max-w-2xl w-full text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
        <p className="text-text-muted mb-8">
          Interested in working together? Let&apos;s connect.
        </p>

        <a
          href="mailto:amedeo.majer@gmail.com"
          className="inline-block px-8 py-3 border border-glass-border rounded-lg text-white hover:bg-glass hover:border-white/20 transition-all mb-8"
        >
          amedeo.majer@gmail.com
        </a>

        <div className="flex justify-center gap-6">
          <a
            href="mailto:amedeo.majer@gmail.com"
            className="text-text-muted hover:text-white transition-colors p-2"
            aria-label="Send email to Amedeo"
          >
            <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6" />
          </a>
          <a
            href="https://linkedin.com/in/amedeo-majer-5b80b1159"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-white transition-colors p-2"
            aria-label="Visit LinkedIn profile"
          >
            <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
          </a>
          <a
            href="https://github.com/amedeomajer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-white transition-colors p-2"
            aria-label="Visit GitHub profile"
          >
            <FontAwesomeIcon icon={faGithub} className="w-6 h-6" />
          </a>
        </div>
      </div>

      <p className="text-text-muted text-sm mt-12 mb-24 md:mb-8">
        &copy; {new Date().getFullYear()} Amedeo Majer. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
