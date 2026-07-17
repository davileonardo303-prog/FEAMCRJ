import React, { useState } from 'react';
import { INITIAL_DOCUMENTS } from '../data/mockData';
import { Document as FedDoc } from '../types';
import { Search, FileText, Download, CheckCircle, HelpCircle } from 'lucide-react';

export default function Documents() {
  const [documents, setDocuments] = useState<FedDoc[]>(INITIAL_DOCUMENTS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Download counts stored locally inside state
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({
    'doc-1': 1420,
    'doc-2': 841,
    'doc-3': 312,
    'doc-4': 458,
    'doc-5': 920
  });

  const handleDownload = (docId: string) => {
    setDownloadingId(docId);
    
    setTimeout(() => {
      setDownloadCounts(prev => ({
        ...prev,
        [docId]: (prev[docId] || 0) + 1
      }));
      setDownloadingId(null);
      // Triggers browser download alert
      alert(`Iniciando download do arquivo de regulamento em formato PDF/DOCX.`);
    }, 1200);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'all') return matchesSearch;
    return matchesSearch && doc.category === activeCategory;
  });

  return (
    <section id="downloads" className="py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Regulamentos <span className="text-amber-500">& Downloads</span>
          </h2>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-red-600 to-amber-500 mx-auto rounded-full" />
          <p className="mt-4 text-zinc-400 text-sm sm:text-base">
            Tenha acesso às diretrizes oficiais, regras técnicas unificadas de cada modalidade, tabelas de taxas administrativas e termos legais para menores de idade.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Pesquisar documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 text-white pl-11 pr-4 py-3 rounded-xl border border-zinc-800 focus:border-amber-500 focus:outline-none text-sm placeholder:text-zinc-500 transition-all"
            />
          </div>

          {/* Quick Filter badging */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'Regulamento', label: 'Regulamentos' },
              { id: 'Taxas', label: 'Taxas' },
              { id: 'Manual', label: 'Manuais' },
              { id: 'Formulário', label: 'Formulários' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'bg-zinc-950 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Catalog List */}
        <div className="bg-zinc-950 rounded-2xl border border-zinc-800 divide-y divide-zinc-900 overflow-hidden">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => {
              const isDownloading = downloadingId === doc.id;
              return (
                <div
                  key={doc.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/20 transition-all duration-200"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 shrink-0 text-red-500">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
                        {doc.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] sm:text-xs text-zinc-400">
                        <span className="bg-zinc-900 border border-zinc-800 text-amber-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {doc.category}
                        </span>
                        <span className="text-zinc-500">
                          Atualizado: {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="text-zinc-500">•</span>
                        <span>
                          Tamanho: <strong className="text-zinc-300">{doc.size}</strong>
                        </span>
                        <span className="text-zinc-500">•</span>
                        <span>
                          Downloads: <strong className="text-zinc-300">{downloadCounts[doc.id]}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleDownload(doc.id)}
                      disabled={isDownloading}
                      className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isDownloading
                          ? 'bg-zinc-900 border border-zinc-800 text-zinc-500'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-amber-500 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {isDownloading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                          <span>Baixando...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Download {doc.format}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-base font-bold text-white">Nenhum documento listado</p>
              <p className="text-xs text-zinc-500 mt-1">Ajuste seu termo de busca ou selecione outra categoria.</p>
            </div>
          )}
        </div>

        {/* FAQ helper footer */}
        <div className="mt-12 bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 flex flex-col md:flex-row items-center gap-5 justify-between">
          <div className="flex items-center space-x-3 text-left">
            <HelpCircle className="w-8 h-8 text-amber-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">Precisa de outro documento?</p>
              <p className="text-xs text-zinc-400">Solicitações de certificados antigos ou homologações internacionais podem ser feitas na aba de contato.</p>
            </div>
          </div>
          <button
            onClick={() => {
              const element = document.getElementById('contato');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white uppercase tracking-wider rounded-xl transition-all"
          >
            Falar com a Federação
          </button>
        </div>

      </div>
    </section>
  );
}
