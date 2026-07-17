import React, { useState } from 'react';
import { INITIAL_NEWS } from '../data/mockData';
import { News as FedNews } from '../types';
import { Calendar, User, ArrowRight, X, Sparkles } from 'lucide-react';

export default function News() {
  const [selectedNews, setSelectedNews] = useState<FedNews | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredNews = categoryFilter === 'all'
    ? INITIAL_NEWS
    : INITIAL_NEWS.filter(n => n.category === categoryFilter);

  return (
    <section id="noticias" className="py-24 bg-zinc-900 border-t border-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Informativos <span className="text-amber-500">& Notícias</span>
          </h2>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-red-600 to-amber-500 mx-auto rounded-full" />
          <p className="mt-4 text-zinc-400 text-sm sm:text-base">
            Fique por dentro das últimas notícias, comunicados presidenciais da FEAMCRJ, convocatórias de seleções, cursos oficiais e alterações de regras.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: 'Ver Todas' },
            { id: 'Campeonato', label: 'Campeonatos' },
            { id: 'Filiação', label: 'Filiações' },
            { id: 'Curso', label: 'Cursos & Clínicas' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                categoryFilter === cat.id
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-850'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              onClick={() => setSelectedNews(news)}
              className="group bg-zinc-950 rounded-2xl border border-zinc-800/80 overflow-hidden hover:border-zinc-700 hover:scale-[1.01] cursor-pointer transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* News Image Header */}
                <div className="relative h-48 overflow-hidden bg-zinc-900">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 bg-amber-500 text-zinc-950 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-md">
                    {news.category}
                  </span>
                </div>

                {/* News Body Text */}
                <div className="p-6">
                  {/* Date line */}
                  <div className="flex items-center space-x-3 text-xs text-zinc-500 mb-2.5">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {new Date(news.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <User className="w-3.5 h-3.5 mr-1" />
                      {news.author.split(' - ')[0]}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 leading-tight tracking-wide transition-colors">
                    {news.title}
                  </h3>
                  
                  <p className="mt-3.5 text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                    {news.excerpt}
                  </p>
                </div>
              </div>

              {/* Bottom Action bar */}
              <div className="px-6 pb-6 pt-2">
                <span className="inline-flex items-center text-xs font-bold text-amber-500 group-hover:text-amber-400 group-hover:underline transition-all">
                  <span>Ler Matéria Completa</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

            </article>
          ))}
        </div>

      </div>

      {/* FULL ARTICLE VIEW MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 my-8">
            
            {/* Modal Image Header */}
            <div className="relative h-64 sm:h-80 bg-zinc-900">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute right-4 top-4 p-1.5 bg-black/70 hover:bg-black/90 rounded-lg text-zinc-400 hover:text-white transition-all border border-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Floating category */}
              <span className="absolute bottom-6 left-6 bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-md">
                {selectedNews.category}
              </span>
            </div>

            {/* Modal Text Content */}
            <div className="p-6 sm:p-8 space-y-4">
              {/* Metadata */}
              <div className="flex items-center space-x-4 text-xs text-zinc-400 pb-3 border-b border-zinc-900">
                <span className="flex items-center font-semibold">
                  <Calendar className="w-4 h-4 text-amber-500 mr-1.5" />
                  {new Date(selectedNews.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <User className="w-4 h-4 text-red-500 mr-1.5" />
                  Escrito por: <strong className="text-zinc-300 ml-1">{selectedNews.author}</strong>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                {selectedNews.title}
              </h3>

              {/* Long Content (formatted nicely) */}
              <div className="text-sm sm:text-base text-zinc-300 leading-relaxed space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedNews.content.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Modal footer warning */}
              <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500 font-medium">
                <span>© 2026 FEAMCRJ Assessoria de Comunicação</span>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs uppercase font-bold transition-all border border-zinc-800"
                >
                  Fechar Matéria
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
