import React, { useState } from 'react';
import { INITIAL_MARTIAL_ARTS } from '../data/mockData';
import { MartialArt } from '../types';
import * as Icons from 'lucide-react';

export default function Disciplines() {
  const [selectedArt, setSelectedArt] = useState<string | null>(null);

  // Dynamic Icon rendering helper
  const renderIcon = (iconName: string) => {
    // Falls back safely if dynamic naming fails
    switch (iconName) {
      case 'Shield': return <Icons.Shield className="w-8 h-8 text-amber-500" />;
      case 'Swords': return <Icons.Swords className="w-8 h-8 text-red-500" />;
      case 'Flame': return <Icons.Flame className="w-8 h-8 text-orange-500" />;
      case 'Zap': return <Icons.Zap className="w-8 h-8 text-yellow-500" />;
      case 'Trophy': return <Icons.Trophy className="w-8 h-8 text-yellow-400" />;
      default: return <Icons.Activity className="w-8 h-8 text-blue-500" />;
    }
  };

  return (
    <section id="modalidades" className="py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Modalidades <span className="text-amber-500">Homologadas</span>
          </h2>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-red-600 to-amber-500 mx-auto rounded-full" />
          <p className="mt-4 text-zinc-400 text-sm sm:text-base">
            Estas são as principais artes marciais regulamentadas pela FEAMCRJ no estado do Rio de Janeiro. Cada uma conta com corpo técnico dedicado, diretores de arbitragem e cronograma de torneios estaduais.
          </p>
        </div>

        {/* Disciplines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_MARTIAL_ARTS.map((art) => {
            const isExpanded = selectedArt === art.id;
            return (
              <div
                key={art.id}
                id={`card-${art.id}`}
                className={`group flex flex-col justify-between rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? 'bg-zinc-900 border-amber-500/80 shadow-lg shadow-amber-950/25 ring-1 ring-amber-500/20'
                    : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                {/* Upper Body */}
                <div className="p-6">
                  {/* Icon & Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                      {renderIcon(art.icon)}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                      art.category === 'Grappling' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      art.category === 'Percussão' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      art.category === 'Mista' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {art.category}
                    </span>
                  </div>

                  {/* Info Header */}
                  <h3 className="text-xl font-bold text-white tracking-wide">{art.name}</h3>
                  <p className="text-[11px] font-semibold text-amber-500/80 uppercase tracking-widest mt-1">
                    Origem: {art.origin}
                  </p>
                  
                  {/* Brief Excerpt */}
                  <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                    {art.description}
                  </p>

                  {/* Expanded Content Details */}
                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-zinc-800/80 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                          Responsável Técnico do Estado
                        </span>
                        <span className="text-sm font-semibold text-white mt-1 block">
                          {art.departmentHead}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                          Principais Torneios
                        </span>
                        <ul className="mt-1.5 space-y-1 text-sm text-zinc-300">
                          {art.majorCompetitions.map((comp, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              <span>{comp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Toggle Area */}
                <div className="p-4 bg-zinc-900/40 border-t border-zinc-800/60 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedArt(isExpanded ? null : art.id)}
                    className="flex items-center space-x-1 text-xs font-bold text-amber-500 hover:text-white uppercase tracking-wider transition-colors"
                  >
                    <span>{isExpanded ? 'Ver Menos' : 'Ver Detalhes'}</span>
                    <Icons.ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  <span className="text-[10px] font-mono text-zinc-500">
                    ID: FEAM-{art.id.toUpperCase()}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
