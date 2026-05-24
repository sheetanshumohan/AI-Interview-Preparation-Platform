import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import DashboardPreview from '../components/DashboardPreview';
import Features from '../components/Features';
import AIInterviewFlow from '../components/AIInterviewFlow';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';


const LandingPage = () => {
  return (
    <div className="bg-[var(--background)] min-h-screen selection:bg-primary/30 selection:text-primary transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <DashboardPreview />
        <div className="bg-gradient-to-b from-transparent via-primary/5 to-transparent">
          <Features />
          <AIInterviewFlow />
        </div>
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
