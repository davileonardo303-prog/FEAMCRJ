import React, { useState, useEffect } from 'react';
import { INITIAL_ACADEMIES } from '../data/mockData';
import { Academy } from '../types';
import { Search, MapPin, Phone, Mail, Award, CheckCircle, ShieldAlert, Plus, X, Building2, User } from 'lucide-react';

export default function Academies() {
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [selectedModality, setSelectedModality] = useState('all');

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [headInstructor, setHeadInstructor] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('feamcrj_custom_academies');
    const localList = saved ? JSON.parse(saved) : [];
    setAcademies([...INITIAL_ACADEMIES, ...localList]);
  }, []);

  // Filter unique neighborhoods for dropdown
  const uniqueNeighborhoods = Array.from(
    new Set(academies.map((acad) => acad.neighborhood))
  );

  // Filter unique modalities for dropdown
  const allStyles = Array.from(
    new Set(academies.flatMap((acad) => acad.modalities))
  );

  // Filter list of academies
  const filteredAcademies = academies.filter((acad) => {
    const matchesSearch =
      acad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acad.headInstructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acad.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesNeighborhood =
      selectedNeighborhood === 'all' || acad.neighborhood === selectedNeighborhood;

    const matchesModality =
      selectedModality === 'all' || acad.modalities.includes(selectedModality);

    return matchesSearch && matchesNeighborhood && matchesModality;
  });

  // Handle Style Select for registration form
  const handleStyleToggle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  // Submit new academy registration
  const handleSubmitAcademy = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !headInstructor || !address || !neighborhood || !email) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newAcad: Academy = {
      id: `acad-custom-${Date.now()}`,
      name,
      headInstructor,
      address,
      neighborhood,
      city: 'Rio de Janeiro',
      phone: phone || '(21) 2000-0000',
      email,
      modalities: selectedStyles.length > 0 ? selectedStyles : ['Jiu-Jitsu Brasileiro (BJJ)'],
      certifiedUntil: '2027-12-31',
      status: 'active',
    };

    // Save locally
    const saved = localStorage.getItem('feamcrj_custom_academies');
    const localList = saved ? JSON.parse(saved) : [];
    const updatedLocal = [...localList, newAcad];
    localStorage.setItem('feamcrj_custom_academies', JSON.stringify(updatedLocal));

    // Update state
    setAcademies(prev => [...prev, newAcad]);
    setSuccess(true);

    // Reset Form
    setName('');
    setHeadInstructor('');
    setAddress('');
    setNeighborhood('');
    setPhone('');
    setEmail('');
    setSelectedStyles([]);

    setTimeout(() => {
      setIsModalOpen(false);
      setSuccess(false);
    }, 2000);
  };

  return (
    <section id="academias" className="py-24 bg-zinc-900 border-t border-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              Academias <span className="text-amber-500">Credenciadas</span>
            </h2>
            <div className="mt-4 h-1 w-20 bg-gradient-to-r from-red-600 to-amber-500 rounded-full" />
            <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
              Consulte aqui os centros de treinamento oficiais, ginásios e dojôs homologados pela FEAMCRJ. Treine apenas em locais certificados com professores habilitados e seguros.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-5 py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shrink-0 self-start md:self-end transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Credenciar Academia</span>
          </button>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800/80 mb-10 flex flex-col xl:flex-row items-center gap-4 justify-between">
          
          {/* Search by Name */}
          <div className="relative w-full xl:w-80">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por academia ou professor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 text-white pl-11 pr-4 py-3 rounded-xl border border-zinc-800 focus:border-amber-500 focus:outline-none text-sm transition-all placeholder:text-zinc-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            {/* Filter by Neighborhood */}
            <div className="w-full sm:w-60">
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full bg-zinc-900 text-zinc-300 px-4 py-3 rounded-xl border border-zinc-800 focus:border-amber-500 focus:outline-none text-sm transition-all"
              >
                <option value="all">Todos os Bairros (Rio / Niterói)</option>
                {uniqueNeighborhoods.map((n, i) => (
                  <option key={i} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Filter by Style */}
            <div className="w-full sm:w-60">
              <select
                value={selectedModality}
                onChange={(e) => setSelectedModality(e.target.value)}
                className="w-full bg-zinc-900 text-zinc-300 px-4 py-3 rounded-xl border border-zinc-800 focus:border-amber-500 focus:outline-none text-sm transition-all"
              >
                <option value="all">Todas as Modalidades</option>
                {allStyles.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Academies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAcademies.length > 0 ? (
            filteredAcademies.map((acad) => (
              <div
                key={acad.id}
                className="bg-zinc-950 rounded-2xl border border-zinc-800/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all duration-300"
              >
                <div>
                  {/* Card Header & Certification Badge */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                      <Building2 className="w-6 h-6 text-amber-500" />
                    </div>
                    
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      acad.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {acad.status === 'active' ? 'Homologada 2026' : 'Expirada'}
                    </span>
                  </div>

                  {/* Title & Instructor */}
                  <h3 className="text-lg font-bold text-white tracking-wide">{acad.name}</h3>
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mt-1 flex items-center">
                    <User className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0" />
                    Instrutor: <span className="text-zinc-300 ml-1">{acad.headInstructor}</span>
                  </p>

                  {/* Modality Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {acad.modalities.map((m, i) => (
                      <span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* Contact / Address fields */}
                  <div className="mt-5 space-y-2 pt-4 border-t border-zinc-900">
                    <div className="flex items-start text-xs text-zinc-300 leading-relaxed">
                      <MapPin className="w-4 h-4 text-red-500 mr-2.5 shrink-0 mt-0.5" />
                      <span>{acad.address} - <strong className="text-zinc-400">{acad.neighborhood}</strong></span>
                    </div>
                    {acad.phone && (
                      <div className="flex items-center text-xs text-zinc-300">
                        <Phone className="w-4 h-4 text-amber-500 mr-2.5 shrink-0" />
                        <span>{acad.phone}</span>
                      </div>
                    )}
                    {acad.email && (
                      <div className="flex items-center text-xs text-zinc-300">
                        <Mail className="w-4 h-4 text-zinc-500 mr-2.5 shrink-0" />
                        <span className="truncate">{acad.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer validation check */}
                <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-zinc-500">
                    Selo Certificação: #{acad.id.substring(5, 12).toUpperCase()}
                  </span>
                  <div className="flex items-center text-xs font-bold text-zinc-400">
                    <span className="text-[10px] text-zinc-500 mr-1">Válido até:</span>
                    <span className="text-zinc-300 text-[10px]">{new Date(acad.certifiedUntil).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full bg-zinc-950 border border-zinc-800 p-12 rounded-2xl text-center">
              <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-lg font-bold text-white">Nenhuma academia cadastrada</p>
              <p className="text-sm text-zinc-400 mt-1">Experimente remover filtros de busca ou clique no botão acima para credenciar uma nova academia.</p>
            </div>
          )}
        </div>

      </div>

      {/* REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 max-w-xl w-full rounded-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 my-8">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-950 via-zinc-950 to-zinc-950 p-6 border-b border-zinc-800 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 p-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-white uppercase pr-8">Credenciar Academia</h3>
              <p className="text-xs text-amber-500 mt-1 uppercase font-semibold">
                Selo de Qualificação de Luta FEAMCRJ 2026
              </p>
            </div>

            {/* Modal Body */}
            {success ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full border border-emerald-500/30 flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-emerald-500 animate-bounce" />
                </div>
                <h4 className="text-lg font-bold text-white">Academia Registrada!</h4>
                <p className="text-sm text-zinc-400 max-w-xs mx-auto mt-2 leading-relaxed">
                  Sua academia foi adicionada com sucesso ao banco de dados estadual.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitAcademy} className="p-6 space-y-5">
                
                {/* Warnings info */}
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-400 flex items-start gap-2.5">
                  <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    O credenciamento inicial concede homologação temporária imediata para fins de consulta e inscrição de alunos.
                  </span>
                </div>

                {/* Gym name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Nome Oficial da Academia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Associação Copacabana de Combate"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                  />
                </div>

                {/* Head Instructor */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Professor Responsável Técnico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mestre Carlos Alberto Suzuki"
                    value={headInstructor}
                    onChange={(e) => setHeadInstructor(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                  />
                </div>

                {/* Address & Neighborhood */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Endereço (Rua, Número) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Rua Conde de Bonfim, 342"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Bairro <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Tijuca"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Telefone de Contato
                    </label>
                    <input
                      type="text"
                      placeholder="(21) 2222-3333"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      E-mail Institucional <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="secretaria@academia.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                {/* Styles taught (multiselect badges) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Modalidades Praticadas (Selecione todas que se aplicam)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Jiu-Jitsu Brasileiro (BJJ)', 'Kickboxing', 'Muay Thai', 'Karate-Do', 'Taekwondo', 'Artes Marciais Mistas (MMA)'].map((style, idx) => {
                      const isSelected = selectedStyles.includes(style);
                      return (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => handleStyleToggle(style)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-zinc-900 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-3 bg-zinc-900 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-zinc-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                  >
                    Homologar Academia
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
