import Hero from "@/components/Hero";
import About from "@/components/About";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import FixedBackground from "@/components/FixedBackground";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Amedeo Majer",
    jobTitle: "Full-Stack Web Developer",
    description:
      "Full-stack web developer specializing in clean, maintainable code and clear communication. Experienced with React, Next.js, Ruby on Rails, and modern web technologies.",
    url: "https://amedeomajer.it",
    image: "https://amedeomajer.it/images/amedeo.png",
    sameAs: [
      "https://linkedin.com/in/amedeo-majer-5b80b1159",
      "https://github.com/amedeomajer",
    ],
    email: "amedeo.majer@gmail.com",
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Ruby on Rails",
      "JavaScript",
      "Web Development",
      "Full-Stack Development",
      "Frontend Development",
      "Backend Development",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Wolt",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Fixed LiquidChrome background */}
      <FixedBackground />

      {/* Grain overlay for texture */}
      <div className="grain-overlay" aria-hidden="true" />

      <Navigation />

      <main id="main-content" className="relative z-10" tabIndex={-1}>
        <Hero />
        <About />
        <Work />
        <Experience />
        <Footer />
      </main>
    </>
  );
}
