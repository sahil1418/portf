'use client';

import dynamic from 'next/dynamic';

// Dynamic imports for client components (avoid SSR for heavy components)
const StarfieldBackground = dynamic(
  () => import('@/components/layout/StarfieldBackground'),
  { ssr: false }
);
const Navbar = dynamic(() => import('@/components/layout/Navbar'), {
  ssr: false,
});
const HeroSection = dynamic(
  () => import('@/components/sections/HeroSection'),
  { ssr: false }
);
const ProjectsSection = dynamic(
  () => import('@/components/sections/ProjectsSection'),
  { ssr: false }
);
const SkillsSection = dynamic(
  () => import('@/components/sections/SkillsSection'),
  { ssr: false }
);
const AboutSection = dynamic(
  () => import('@/components/sections/AboutSection'),
  { ssr: false }
);
const ContactSection = dynamic(
  () => import('@/components/sections/ContactSection'),
  { ssr: false }
);
const FooterSection = dynamic(
  () => import('@/components/sections/FooterSection'),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      {/* Fixed background — always behind everything */}
      <StarfieldBackground />

      {/* Fixed navigation */}
      <Navbar />

      {/* Main content */}
      <main>
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <AboutSection />
        <ContactSection />
      </main>

      <FooterSection />
    </>
  );
}
