import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Disciplines from './components/Disciplines';
import Tournaments from './components/Tournaments';
import Affiliation from './components/Affiliation';
import Academies from './components/Academies';
import News from './components/News';
import Documents from './components/Documents';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [currentTab, setCurrentTab] = useState('inicio');

  // Scroll spy logic to update active header nav item automatically
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = ['inicio', 'modalidades', 'campeonatos', 'filiacao', 'academias', 'noticias', 'downloads', 'contato'];
      const scrollPosition = window.scrollY + 200; // Offset for better accuracy

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setCurrentTab(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy);
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans selection:bg-amber-500 selection:text-zinc-950">
      
      {/* Sticky Premium Header Navbar */}
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Single Page Structured Modules */}
      <main className="relative">
        {/* Hero Landing section */}
        <Hero onNavigate={setCurrentTab} />

        {/* Martial Arts / Disciplines section */}
        <div id="modalidades">
          <Disciplines />
        </div>

        {/* Championships Calendar & Registration section */}
        <div id="campeonatos">
          <Tournaments />
        </div>

        {/* Athlete Registry & Affiliation form section */}
        <div id="filiacao">
          <Affiliation />
        </div>

        {/* Certified Gyms Directory section */}
        <div id="academias">
          <Academies />
        </div>

        {/* News Feed section */}
        <div id="noticias">
          <News />
        </div>

        {/* Documents & Downloads section */}
        <div id="downloads">
          <Documents />
        </div>

        {/* Contact form & HQ location map section */}
        <div id="contato">
          <Contact />
        </div>
      </main>

      {/* Board of Directors & Legal Footer */}
      <Footer />
      
    </div>
  );
}
