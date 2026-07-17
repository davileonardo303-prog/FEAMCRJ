import React from 'react';
import { Award, ShieldAlert, Trophy, Users, ShieldCheck, MapPin } from 'lucide-react';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const stats = [
    { label: 'Atletas Filiados', value: '4.800+', icon: Users, color: 'text-amber-500' },
    { label: 'Academias Registradas', value: '142', icon: ShieldCheck, color: 'text-red-500' },
    { label: 'Eventos Anuais', value: '18', icon: Trophy, color: 'text-yellow-500' },
    { label: 'Municípios do RJ', value: '28', icon: MapPin, color: 'text-blue-500' },
  ];

  const handleAction = (sectionId: string) => {
    onNavigate(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-zinc-950"
    >
      {/* Background Graphic / Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(185,28,28,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.12),transparent_50%)]" />
        {/* Dynamic Sportive Background Image with Overlay */}
        <img
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1920&auto=format&fit=crop"
          alt="Martial Arts Combat Background"
          className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity filter blur-[1px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40" />
      </div>

      {/* Grid Layout Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col items-center">
        {/* Warning badge or Tagline */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 mb-8 animate-fade-in">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">
            Filiadora Oficial do Estado do Rio de Janeiro
          </span>
        </div>

        {/* Title */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-tight">
            Federação Esportiva de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-500 to-amber-400">
              Arte Marcial e Combate
            </span> <br />
            Rio de Janeiro
          </h1>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Homologação profissional de atletas, credenciamento de academias e organização dos campeonatos oficiais mais importantes do cenário de lutas carioca.
          </p>
        </div>

        {/* Call To Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          <button
            onClick={() => handleAction('filiacao')}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold px-8 py-4 rounded-xl shadow-xl shadow-red-900/20 tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <Award className="w-5 h-5" />
            <span>Portal de Filiação</span>
          </button>
          
          <button
            onClick={() => handleAction('campeonatos')}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-zinc-900/95 hover:bg-zinc-800 text-white border border-zinc-700/80 font-bold px-8 py-4 rounded-xl tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Calendário 2026</span>
          </button>
        </div>

        {/* Highlighted Affiliation Check widget */}
        <div className="mt-12 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 p-4 rounded-xl max-w-lg w-full flex items-center justify-between text-left gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Selo Oficial FEAMCRJ</p>
              <p className="text-xs text-zinc-400">Consulte o registro cadastral de atletas federados de forma rápida.</p>
            </div>
          </div>
          <button
            onClick={() => handleAction('filiacao')}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs text-amber-500 hover:text-white font-bold rounded-lg border border-zinc-700 uppercase tracking-wider transition-all"
          >
            Buscar
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-20 w-full max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 flex flex-col items-center text-center hover:border-zinc-700/80 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-950/50"
                >
                  <div className={`p-3 bg-zinc-950 rounded-xl border border-zinc-800 mb-4 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {stat.value}
                  </span>
                  <span className="mt-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
