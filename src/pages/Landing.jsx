import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureStrip from '../components/FeatureStrip';
import FeaturedCars from '../components/FeaturedCars';
import ComparisonBanner from '../components/ComparisonBanner';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main>
        <Hero />
        <FeatureStrip />
        <FeaturedCars />
        <ComparisonBanner />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
