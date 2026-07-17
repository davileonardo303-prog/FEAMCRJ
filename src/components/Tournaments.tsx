import React, { useState, useEffect } from 'react';
import { INITIAL_TOURNAMENTS } from '../data/mockData';
import { Tournament } from '../types';
import { Calendar, MapPin, DollarSign, Users, Search, Filter, Plus, CheckCircle, X, Award } from 'lucide-react';

interface RegisteredCompetitor {
  tournamentId: string;
  athleteName: string;
  cpf: string;
  gender: string;
  category: string;
  rank: string;
  academyName: string;
  registrationDate: string;
}

export default function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Registration Form Modal States
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [athleteName, setAthleteName] = useState('');
  const [cpf, setCpf] = useState('');
  const [gender, setGender] = useState('M');
  const [category, setCategory] = useState('Peso Médio');
  const [rank, setRank] = useState('Faixa Azul');
  const [academyName, setAcademyName] = useState('');
  const [competitors, setCompetitors] = useState<RegisteredCompetitor[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load registered competitors from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('feamcrj_tournament_competitors');
    if (saved) {
      setCompetitors(JSON.parse(saved));
    }
  }, []);

  // Filter Tournaments
  const filteredTournaments = tournaments.filter((tour) => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tour.modalities.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && tour.status === filterStatus;
  });

  // Handle Tournament Registration Submission
  const handleRegisterAthlete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTournament) return;

    if (!athleteName || !cpf || !academyName) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const newCompetitor: RegisteredCompetitor = {
      tournamentId: selectedTournament.id,
      athleteName,
      cpf,
      gender,
      category,
      rank,
      academyName,
      registrationDate: new Date().toLocaleDateString('pt-BR'),
    };

    const updatedCompetitors = [...competitors, newCompetitor];
    setCompetitors(updatedCompetitors);
    localStorage.setItem('feamcrj_tournament_competitors', JSON.stringify(updatedCompetitors));

    // Increment registered count in state for immediate visual update
    setTournaments(prev => prev.map(t => {
      if (t.id === selectedTournament.id) {
        return { ...t, registeredCount: t.registeredCount + 1 };
      }
      return t;
    }));

    setSuccessMessage(`Inscrição de ${athleteName} no campeonato "${selectedTournament.title}" realizada com sucesso!`);
    
    // Reset Form
    setAthleteName('');
    setCpf('');
    setAcademyName('');
    
    // Close modal after delay
    setTimeout(() => {
      setSelectedTournament(null);
      setSuccessMessage(null);
    }, 2500);
  };

  // Format Date to PT-BR (e.g. 15 de Agosto de 2026)
  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <section id="campeonatos" className="py-24 bg-zinc-900 border-t border-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Calendário de <span className="text-amber-500">Campeonatos</span>
          </h2>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-red-600 to-amber-500 mx-auto rounded-full" />
          <p className="mt-4 text-zinc-400 text-sm sm:text-base">
            Inscrições abertas e cronograma de torneios oficiais para a temporada 2026. Escolha seu evento, faça a sua filiação e compita nas melhores arenas do estado do Rio.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800/80 mb-10 flex flex-col md:flex-row items-center gap-4 justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por campeonato, local ou modalidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 text-white pl-11 pr-4 py-3 rounded-xl border border-zinc-800 focus:border-amber-500 focus:outline-none text-sm transition-all placeholder:text-zinc-500"
            />
          </div>

          {/* Status Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mr-2 hidden sm:inline">Filtrar:</span>
            {[
              { id: 'all', label: 'Todos' },
              { id: 'open', label: 'Inscrições Abertas' },
              { id: 'upcoming', label: 'Em Breve' },
              { id: 'closed', label: 'Encerrados' },
            ].map((status) => (
              <button
                key={status.id}
                onClick={() => setFilterStatus(status.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
                  filterStatus === status.id
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/10'
                    : 'bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

        </div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTournaments.length > 0 ? (
            filteredTournaments.map((tournament) => {
              const tourCompetitors = competitors.filter(c => c.tournamentId === tournament.id);
              return (
                <div
                  key={tournament.id}
                  className="bg-zinc-950 rounded-2xl border border-zinc-800/80 overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col md:flex-row group"
                >
                  {/* Tournament Cover Photo */}
                  <div className="relative w-full md:w-48 h-48 md:h-full min-h-[190px] overflow-hidden bg-zinc-900">
                    <img
                      src={tournament.image}
                      alt={tournament.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent" />
                    
                    {/* Floating Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md ${
                        tournament.status === 'open' ? 'bg-emerald-500/90 text-zinc-950' :
                        tournament.status === 'upcoming' ? 'bg-amber-500/90 text-zinc-950' :
                        'bg-red-500/95 text-white'
                      }`}>
                        {tournament.status === 'open' ? 'Inscrições Abertas' :
                         tournament.status === 'upcoming' ? 'Em Breve' :
                         'Encerrado'}
                      </span>
                    </div>
                  </div>

                  {/* Tournament Details */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                        {tournament.title}
                      </h3>
                      
                      {/* Technical Modality Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {tournament.modalities.map((mod, idx) => (
                          <span key={idx} className="bg-zinc-900 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800">
                            {mod}
                          </span>
                        ))}
                      </div>

                      <p className="mt-3.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {tournament.description}
                      </p>

                      {/* Info lines */}
                      <div className="mt-5 space-y-2">
                        <div className="flex items-center text-xs text-zinc-300">
                          <Calendar className="w-4 h-4 text-amber-500 mr-2 shrink-0" />
                          <span className="font-semibold">{formatDate(tournament.date)}</span>
                        </div>
                        <div className="flex items-center text-xs text-zinc-300">
                          <MapPin className="w-4 h-4 text-red-500 mr-2 shrink-0" />
                          <span>{tournament.location} ({tournament.city})</span>
                        </div>
                        <div className="flex items-center text-xs text-zinc-300">
                          <DollarSign className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                          <span>Taxa de Inscrição: <strong className="text-emerald-400">R$ {tournament.entryFee},00</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 pt-5 border-t border-zinc-900 flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
                        <Users className="w-4 h-4 text-zinc-500" />
                        <span><strong>{tournament.registeredCount + tourCompetitors.length}</strong> Atletas Confirmados</span>
                      </div>

                      {tournament.status === 'open' && (
                        <button
                          onClick={() => setSelectedTournament(tournament)}
                          className="flex items-center space-x-1 px-4.5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Inscrever-se</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-zinc-950 border border-zinc-800 p-12 rounded-2xl text-center">
              <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-lg font-bold text-white">Nenhum campeonato encontrado</p>
              <p className="text-sm text-zinc-400 mt-1">Tente ajustar sua busca ou refinar os filtros selecionados.</p>
            </div>
          )}
        </div>

        {/* Local Registrations Summary Box */}
        {competitors.length > 0 && (
          <div className="mt-16 bg-zinc-950/60 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white flex items-center mb-4">
              <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
              Suas Inscrições Recentes (Salvas Localmente)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="text-xs text-zinc-400 uppercase bg-zinc-900 border-b border-zinc-800">
                  <tr>
                    <th className="p-4">Atleta</th>
                    <th className="p-4">Campeonato</th>
                    <th className="p-4">Graduação / Categoria</th>
                    <th className="p-4">Academia</th>
                    <th className="p-4">Data Inscrição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {competitors.map((comp, idx) => {
                    const tour = tournaments.find(t => t.id === comp.tournamentId);
                    return (
                      <tr key={idx} className="hover:bg-zinc-900/40">
                        <td className="p-4 font-bold text-white">{comp.athleteName}</td>
                        <td className="p-4 text-amber-500 font-semibold">{tour?.title || 'Torneio'}</td>
                        <td className="p-4">
                          <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-xs text-zinc-300 mr-1.5">{comp.rank}</span>
                          <span className="text-xs text-zinc-400">{comp.category}</span>
                        </td>
                        <td className="p-4 text-zinc-400">{comp.academyName}</td>
                        <td className="p-4 text-zinc-500 font-mono text-xs">{comp.registrationDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* REGISTRATION MODAL FORM */}
      {selectedTournament && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 max-w-xl w-full rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 my-8">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-950 via-zinc-950 to-zinc-950 p-6 border-b border-zinc-800 relative">
              <button
                onClick={() => setSelectedTournament(null)}
                className="absolute right-6 top-6 p-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-white uppercase pr-8">Inscrição de Atleta</h3>
              <p className="text-xs text-amber-500 font-semibold mt-1 uppercase truncate">
                {selectedTournament.title}
              </p>
            </div>

            {/* Modal Body */}
            {successMessage ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full border border-emerald-500/30 flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-emerald-500 animate-bounce" />
                </div>
                <h4 className="text-lg font-bold text-white">Inscrição Processada!</h4>
                <p className="text-sm text-zinc-400 max-w-xs mx-auto mt-2 leading-relaxed">
                  {successMessage}
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterAthlete} className="p-6 space-y-5">
                
                {/* Warnings info */}
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-400 flex items-start gap-2.5">
                  <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    Atletas não filiados na FEAMCRJ devem certificar seu registro estadual ativo antes do dia de pesagem oficial do evento.
                  </span>
                </div>

                {/* Input Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Nome Completo do Atleta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pedro Henrique Silva de Souza"
                    value={athleteName}
                    onChange={(e) => setAthleteName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CPF */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      CPF do Competidor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-all placeholder:text-zinc-600"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Gênero <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setGender('M')}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                          gender === 'M'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        Masculino
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('F')}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                          gender === 'F'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        Feminino
                      </button>
                    </div>
                  </div>
                </div>

                {/* Academy */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Nome da Academia Afiliada <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Combat Team Copacabana"
                    value={academyName}
                    onChange={(e) => setAcademyName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Graduação */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Graduação / Faixa
                    </label>
                    <select
                      value={rank}
                      onChange={(e) => setRank(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-all"
                    >
                      <option value="Faixa Branca">Faixa Branca</option>
                      <option value="Faixa Azul">Faixa Azul</option>
                      <option value="Faixa Roxa">Faixa Roxa</option>
                      <option value="Faixa Marrom">Faixa Marrom</option>
                      <option value="Faixa Preta">Faixa Preta</option>
                      <option value="Iniciante / Sem Faixa">Iniciante / Sem Faixa</option>
                      <option value="Avançado / Graduado">Avançado / Graduado</option>
                    </select>
                  </div>

                  {/* Categoria Peso */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Categoria de Peso
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-all"
                    >
                      <option value="Peso Galo">Peso Galo (Até 57kg)</option>
                      <option value="Peso Pena">Peso Pena (Até 64kg)</option>
                      <option value="Peso Leve">Peso Leve (Até 70kg)</option>
                      <option value="Peso Pena">Peso Médio (Até 77kg)</option>
                      <option value="Peso Meio-Pesado">Meio-Pesado (Até 88kg)</option>
                      <option value="Peso Pesado">Peso Pesado (Até 100kg)</option>
                      <option value="Super Pesado">Super Pesado (Acima de 100kg)</option>
                      <option value="Absoluto">Absoluto (Sem Limite de Peso)</option>
                    </select>
                  </div>
                </div>

                {/* Submits */}
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-900 justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedTournament(null)}
                    className="px-5 py-3 bg-zinc-900 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-zinc-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                  >
                    Confirmar Inscrição
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
