import React, { useState, useEffect } from 'react';
import { INITIAL_ATHLETES } from '../data/mockData';
import { Athlete } from '../types';
import { Search, ShieldCheck, Award, UserCheck, Calendar, IdCard, UserPlus, Building, Sparkles, Check, ChevronRight, CheckCircle, Smartphone } from 'lucide-react';

export default function Affiliation() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedAthlete, setSearchedAthlete] = useState<Athlete | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Form States for New Affiliation
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [newName, setNewName] = useState('');
  const [newCpf, setNewCpf] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGender, setNewGender] = useState<'M' | 'F'>('M');
  const [newModality, setNewModality] = useState('Jiu-Jitsu Brasileiro (BJJ)');
  const [newRank, setNewRank] = useState('Faixa Branca');
  const [newAcademy, setNewAcademy] = useState('');
  const [justRegisteredAthlete, setJustRegisteredAthlete] = useState<Athlete | null>(null);

  // Load and merge athletes from mockData + localStorage
  useEffect(() => {
    const saved = localStorage.getItem('feamcrj_custom_athletes');
    const localList = saved ? JSON.parse(saved) : [];
    setAthletes([...INITIAL_ATHLETES, ...localList]);
  }, []);

  // Search athlete handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    
    if (!searchQuery.trim()) {
      setSearchedAthlete(null);
      return;
    }

    const found = athletes.find(
      (ath) =>
        ath.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ath.cpf.replace(/\D/g, '').includes(searchQuery.replace(/\D/g, '')) ||
        ath.registrationNumber.toLowerCase() === searchQuery.toLowerCase().trim()
    );

    setSearchedAthlete(found || null);
  };

  // Submit new athlete affiliation application
  const handleNewAffiliation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName || !newCpf || !newEmail || !newAcademy) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Generate simulated Registration Number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const regId = `FEAM-2026-${randomNum}`;

    const newAthlete: Athlete = {
      id: `ath-custom-${Date.now()}`,
      name: newName,
      cpf: newCpf,
      dateOfBirth: newBirthDate || '1998-05-20',
      gender: newGender,
      email: newEmail,
      phone: newPhone || '(21) 90000-0000',
      rank: newRank,
      modality: newModality,
      academyName: newAcademy,
      registrationNumber: regId,
      status: 'active', // Approved instantly for simulation
      affiliationDate: new Date().toLocaleDateString('pt-BR'),
    };

    // Save locally
    const saved = localStorage.getItem('feamcrj_custom_athletes');
    const localList = saved ? JSON.parse(saved) : [];
    const updatedLocal = [...localList, newAthlete];
    localStorage.setItem('feamcrj_custom_athletes', JSON.stringify(updatedLocal));

    // Update state
    setAthletes(prev => [...prev, newAthlete]);
    setJustRegisteredAthlete(newAthlete);
    setSearchedAthlete(newAthlete); // Display their card immediately
    
    // Clear registration fields
    setNewName('');
    setNewCpf('');
    setNewBirthDate('');
    setNewEmail('');
    setNewPhone('');
    setNewAcademy('');
    
    // Set to final confirmation step
    setFormStep(3);
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setFormStep(1);
    setJustRegisteredAthlete(null);
  };

  return (
    <section id="filiacao" className="py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Portal do Atleta <span className="text-amber-500">& Filiação</span>
          </h2>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-red-600 to-amber-500 mx-auto rounded-full" />
          <p className="mt-4 text-zinc-400 text-sm sm:text-base">
            Consulte a legitimidade de atletas federados de forma instantânea ou solicite sua nova filiação estadual para receber sua Carteira de Combate Oficial de 2026.
          </p>
        </div>

        {/* Dual Mode Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setIsFormOpen(false)}
            className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all ${
              !isFormOpen
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/10'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <IdCard className="w-5 h-5" />
            <span>Consultar Carteira / Registro</span>
          </button>
          
          <button
            onClick={() => setIsFormOpen(true)}
            className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all ${
              isFormOpen
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/10'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span>Solicitar Nova Filiação</span>
          </button>
        </div>

        {!isFormOpen ? (
          /* ================= SEARCH REGISTRY SYSTEM ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Search input instruction */}
            <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 rounded-2xl flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                  <UserCheck className="w-5 h-5 text-amber-500 mr-2" />
                  Validador de Registro Oficial
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  Pesquise na base de dados da FEAMCRJ para confirmar se um competidor está devidamente federado e com status regularizado para campeonatos estaduais.
                </p>

                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Nome completo, CPF ou Nº Registro..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-600 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-amber-500 hover:text-white border border-zinc-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                  >
                    Consultar Credencial
                  </button>
                </form>
              </div>

              {/* Instructive Hints */}
              <div className="mt-8 pt-6 border-t border-zinc-800/80 text-xs text-zinc-500 space-y-2">
                <p className="font-bold uppercase tracking-wider text-zinc-400">Dica de busca:</p>
                <p>• Digite apenas o primeiro e segundo nome para ampliar a busca.</p>
                <p>• Exemplo de registro teste: <strong className="text-zinc-400 font-mono">FEAM-2021-0043</strong> (ou busque por "Carlos")</p>
              </div>
            </div>

            {/* Right side: Interactive Digital Athlete Card Display */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              {searchedAthlete ? (
                <div className="w-full max-w-md animate-in zoom-in-95 duration-200">
                  
                  {/* Digital ID Wrapper with glow border */}
                  <div className="relative bg-zinc-900 border-2 border-amber-500 rounded-3xl overflow-hidden shadow-2xl shadow-amber-950/20">
                    
                    {/* Header Golden Accent */}
                    <div className="bg-gradient-to-r from-red-700 via-amber-600 to-amber-500 p-4 flex items-center justify-between border-b border-zinc-800">
                      <div className="flex items-center space-x-2">
                        <Award className="w-6 h-6 text-white" />
                        <div>
                          <span className="font-black text-sm tracking-tight text-white block">FEAMCRJ</span>
                          <span className="text-[7px] text-zinc-100 font-bold uppercase tracking-widest block">Atleta Federado</span>
                        </div>
                      </div>
                      <span className="bg-zinc-950 text-amber-400 border border-amber-400/20 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                        Válido RJ 2026
                      </span>
                    </div>

                    {/* ID Card Body */}
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                        {/* Profile Photo Placeholder */}
                        <div className="w-28 h-28 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center p-2 shrink-0 relative overflow-hidden">
                          <IdCard className="w-12 h-12 text-zinc-700" />
                          <span className="text-[8px] font-bold text-zinc-500 uppercase mt-2 tracking-widest">FOTO ATLETA</span>
                          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        {/* Athlete Info details */}
                        <div className="space-y-2.5 flex-1 w-full">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">Nome do Atleta</span>
                            <span className="text-base font-extrabold text-white leading-tight block">{searchedAthlete.name}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">Nº de Registro</span>
                              <span className="text-xs font-mono font-bold text-amber-500 block">{searchedAthlete.registrationNumber}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">Graduação</span>
                              <span className="text-xs font-bold text-white block">{searchedAthlete.rank}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">Modalidade Principal</span>
                              <span className="text-xs font-semibold text-zinc-300 block">{searchedAthlete.modality}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">Status Cadastral</span>
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                                Regular
                              </span>
                            </div>
                          </div>

                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">Academia Representante</span>
                            <span className="text-xs font-medium text-zinc-400 block">{searchedAthlete.academyName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Fake Barcode and stamps */}
                      <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-between">
                        <div>
                          <p className="text-[8px] font-mono text-zinc-600 uppercase">Emissão: {searchedAthlete.affiliationDate}</p>
                          <p className="text-[8px] font-mono text-zinc-600 uppercase">Federação Esportiva de Arte Marcial - RJ</p>
                        </div>
                        {/* CSS-only barcode */}
                        <div className="flex flex-col items-end">
                          <div className="flex items-center space-x-[2px] h-6 bg-zinc-300 px-2 py-1 rounded">
                            <span className="w-[1px] h-full bg-zinc-950" />
                            <span className="w-[2px] h-full bg-zinc-950" />
                            <span className="w-[1px] h-full bg-zinc-950" />
                            <span className="w-[1px] h-full bg-zinc-950" />
                            <span className="w-[3px] h-full bg-zinc-950" />
                            <span className="w-[1px] h-full bg-zinc-950" />
                            <span className="w-[2px] h-full bg-zinc-950" />
                            <span className="w-[1px] h-full bg-zinc-950" />
                          </div>
                          <span className="text-[6px] font-mono text-zinc-600 mt-1">*{searchedAthlete.registrationNumber}*</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* ID Control Actions */}
                  <div className="mt-4 flex gap-3 justify-center">
                    <button
                      onClick={() => alert('Carteira Digital enviada por e-mail para download em PDF.')}
                      className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
                    >
                      <Smartphone className="w-4 h-4 text-amber-500" />
                      <span>Baixar no Celular</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Imprimir Registro</span>
                    </button>
                  </div>

                </div>
              ) : hasSearched ? (
                <div className="bg-zinc-900/40 border border-zinc-800/80 p-12 rounded-2xl text-center max-w-md w-full">
                  <Award className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-lg font-bold text-white">Atleta Não Encontrado</p>
                  <p className="text-sm text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
                    Não encontramos nenhuma credencial com os termos inseridos. Certifique-se de que digitou o nome correto ou clique no botão acima para solicitar a filiação.
                  </p>
                </div>
              ) : (
                <div className="bg-zinc-900/20 border border-dashed border-zinc-800 p-12 rounded-2xl text-center max-w-md w-full">
                  <IdCard className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-base font-bold text-zinc-400">Aguardando Consulta</p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto leading-relaxed">
                    Insira as informações de busca no painel ao lado para renderizar a carteira digital.
                  </p>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* ================= SOLICIT AFFILIATION FORM SYSTEM ================= */
          <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
            
            {/* Form Header Progress bar */}
            <div className="bg-zinc-950 p-6 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Ficha de Inscrição e Filiação de Atleta</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Torne-se um competidor homologado do estado do RJ.</p>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      formStep === step
                        ? 'bg-amber-500 text-zinc-950 scale-110 font-black'
                        : formStep > step
                        ? 'bg-emerald-500 text-white'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {formStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Steps */}
            {formStep === 1 && (
              <div className="p-6 sm:p-8 space-y-5">
                <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest flex items-center">
                  <Sparkles className="w-4.5 h-4.5 mr-1.5" />
                  Passo 1: Dados Pessoais
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Nome Completo do Atleta <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Gracie Filho"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        CPF <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="000.000.000-00"
                        value={newCpf}
                        onChange={(e) => setNewCpf(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Data de Nascimento <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={newBirthDate}
                        onChange={(e) => setNewBirthDate(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none text-zinc-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        E-mail de Contato <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="atleta@provedor.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Celular / WhatsApp
                      </label>
                      <input
                        type="text"
                        placeholder="(21) 99999-9999"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Gênero
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewGender('M')}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                          newGender === 'M'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        Masculino
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewGender('F')}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                          newGender === 'F'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        Feminino
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => setFormStep(2)}
                    disabled={!newName || !newCpf}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all disabled:opacity-50"
                  >
                    <span>Próximo Passo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {formStep === 2 && (
              <div className="p-6 sm:p-8 space-y-5">
                <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest flex items-center">
                  <Building className="w-4.5 h-4.5 mr-1.5" />
                  Passo 2: Filiação Esportiva
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Modalidade Esportiva Principal <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newModality}
                      onChange={(e) => setNewModality(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Jiu-Jitsu Brasileiro (BJJ)">Jiu-Jitsu Brasileiro (BJJ)</option>
                      <option value="Kickboxing">Kickboxing</option>
                      <option value="Muay Thai">Muay Thai</option>
                      <option value="Karate-Do">Karate-Do</option>
                      <option value="Taekwondo">Taekwondo</option>
                      <option value="Artes Marciais Mistas (MMA)">Artes Marciais Mistas (MMA)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Graduação Atual <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newRank}
                        onChange={(e) => setNewRank(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                      >
                        <option value="Faixa Branca">Faixa Branca</option>
                        <option value="Faixa Azul">Faixa Azul</option>
                        <option value="Faixa Roxa">Faixa Roxa</option>
                        <option value="Faixa Marrom">Faixa Marrom</option>
                        <option value="Faixa Preta">Faixa Preta</option>
                        <option value="Grau Branco (Iniciante)">Grau Branco (Iniciante)</option>
                        <option value="Grau Vermelho / Preto">Grau Vermelho / Preto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Nome da Academia Filiada <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Alliance Copacabana"
                        value={newAcademy}
                        onChange={(e) => setNewAcademy(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-700"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-400 space-y-1.5">
                    <p className="font-bold text-white uppercase text-[10px] tracking-wider">Atenção e Legitimidade:</p>
                    <p>1. Ao se registrar, você declara estar em perfeitas condições de saúde para a prática desportiva de combate.</p>
                    <p>2. A academia inserida receberá uma solicitação automática de homologação para confirmar sua matrícula regular.</p>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => setFormStep(1)}
                    className="px-5 py-3 bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleNewAffiliation}
                    disabled={!newAcademy}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all disabled:opacity-50"
                  >
                    <span>Concluir Filiação</span>
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {formStep === 3 && justRegisteredAthlete && (
              <div className="p-8 text-center space-y-5">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-white">Filiação Aprovada com Sucesso!</h4>
                  <p className="text-sm text-zinc-400 max-w-sm mx-auto mt-2">
                    Parabéns, seu cadastro como atleta federado de combate está ativo. Seu número de registro nacional é:
                  </p>
                  <p className="text-lg font-mono font-black text-amber-500 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl inline-block mt-3">
                    {justRegisteredAthlete.registrationNumber}
                  </p>
                </div>

                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-400 max-w-sm mx-auto">
                  Utilize o número acima ou o seu nome na aba de busca para verificar e consultar a sua Carteira Digital do Atleta a qualquer momento.
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Voltar para Consulta
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
