import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Award } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Header({ currentTab, setCurrentTab }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'inicio', label: 'Início' },
    { id: 'modalidades', label: 'Modalidades' },
    { id: 'campeonatos', label: 'Campeonatos' },
    { id: 'filiacao', label: 'Portal do Atleta' },
    { id: 'academias', label: 'Academias' },
    { id: 'noticias', label: 'Notícias' },
    { id: 'downloads', label: 'Regulamentos' },
    { id: 'contato', label: 'Fale Conosco' },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setIsMobileMenuOpen(false);
    // Scroll to section
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 shadow-lg'
          : 'bg-gradient-to-b from-zinc-950/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick('inicio')}
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-amber-400 p-[2px] transition-transform duration-300 group-hover:scale-105">
              <div className="flex items-center justify-center w-full h-full bg-zinc-950 rounded-[10px]">
                <Shield className="w-6 h-6 text-amber-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center border border-zinc-950">
                <span className="text-[8px] font-bold text-white">RJ</span>
              </div>
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="font-extrabold text-2xl tracking-tight text-white">FEAM</span>
                <span className="font-extrabold text-2xl tracking-tight text-amber-500">CRJ</span>
              </div>
              <span className="hidden sm:block text-[9px] uppercase tracking-wider text-zinc-400 font-medium">
                Federação de Arte Marcial & Combate
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'text-amber-500 bg-amber-500/10 border-b-2 border-amber-500'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Header Actions */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={() => handleNavClick('filiacao')}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-red-900/30 text-xs tracking-wider uppercase transition-all duration-200"
            >
              <Award className="w-4 h-4" />
              <span>Filiar-se</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
              aria-label="Abrir menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden animate-in fade-in slide-in-from-top duration-200 bg-zinc-950 border-b border-zinc-800">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium tracking-wide transition-all ${
                    isActive
                      ? 'text-amber-500 bg-amber-500/10 font-bold border-l-4 border-amber-500'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="pt-4 pb-2 px-4">
              <button
                onClick={() => handleNavClick('filiacao')}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg text-sm tracking-wider uppercase"
              >
                <Award className="w-5 h-5" />
                <span>Filiar-se Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
