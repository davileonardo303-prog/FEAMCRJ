import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, MessageSquare, Ticket } from 'lucide-react';
import { ContactMessage } from '../types';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Dúvida Geral');
  const [message, setMessage] = useState('');
  
  // Local list of submitted tickets
  const [submittedTickets, setSubmittedTickets] = useState<ContactMessage[]>([]);
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('feamcrj_submitted_tickets');
    if (saved) {
      setSubmittedTickets(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const randomTicketNum = Math.floor(100 + Math.random() * 900);
    const ticketId = `TK-2026-${randomTicketNum}`;

    const newTicket: ContactMessage = {
      id: ticketId,
      name,
      email,
      phone,
      subject,
      message,
      date: new Date().toLocaleDateString('pt-BR'),
    };

    const updatedTickets = [...submittedTickets, newTicket];
    setSubmittedTickets(updatedTickets);
    localStorage.setItem('feamcrj_submitted_tickets', JSON.stringify(updatedTickets));

    setSuccessTicketId(ticketId);

    // Clear form
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');

    // Clear success banner after delay
    setTimeout(() => {
      setSuccessTicketId(null);
    }, 5000);
  };

  return (
    <section id="contato" className="py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Fale <span className="text-amber-500">Conosco</span>
          </h2>
          <div className="mt-4 h-1 w-20 bg-gradient-to-r from-red-600 to-amber-500 mx-auto rounded-full" />
          <p className="mt-4 text-zinc-400 text-sm sm:text-base">
            Seja você um professor de academia, atleta querendo se filiar ou patrocinador de lutas, envie uma mensagem direta para a secretaria da FEAMCRJ.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Contact Info and Map representation */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 rounded-2xl">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white uppercase tracking-wide flex items-center">
                <MessageSquare className="w-5 h-5 text-amber-500 mr-2" />
                Informações de Contato
              </h3>

              <div className="space-y-4">
                {/* HQ address */}
                <div className="flex items-start">
                  <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl shrink-0 text-red-500 mr-4">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Sede Administrativa</h4>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 leading-relaxed">
                      Rua Conde de Bonfim, 342 - Sala 501 - Tijuca <br />
                      Rio de Janeiro - RJ, CEP: 20520-054
                    </p>
                  </div>
                </div>

                {/* Email address */}
                <div className="flex items-start">
                  <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl shrink-0 text-amber-500 mr-4">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">E-mail Oficial</h4>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 font-semibold">
                      secretaria@feamcrj.com.br
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl shrink-0 text-emerald-500 mr-4">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Secretaria de Lutas</h4>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 font-mono">
                      (21) 2568-9876 / (21) 98765-4321
                    </p>
                  </div>
                </div>

                {/* Service Hours */}
                <div className="flex items-start">
                  <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl shrink-0 text-zinc-400 mr-4">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Horário de Atendimento</h4>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                      Segunda a Sexta-feira: 09:00 às 17:00 <br />
                      (Fechado aos sábados, domingos e feriados estaduais)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom SVG Location Illustration representing RJ coastline */}
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Sede Oficial - Tijuca</p>
                <p className="text-[10px] text-zinc-500">Próximo ao Metrô Saens Peña</p>
              </div>
              <div className="w-16 h-16 bg-zinc-900 rounded-full border border-zinc-800 flex items-center justify-center relative">
                {/* Styled pulse radar animation */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400/20 animate-ping" />
                <MapPin className="w-6 h-6 text-red-500 relative z-10" />
              </div>
            </div>

          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-6">
                Envie uma Mensagem
              </h3>

              {successTicketId ? (
                <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-full border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Mensagem Recebida com Sucesso!</h4>
                  <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                    Seu chamado de suporte foi encaminhado para a diretoria técnica. Anote o número do seu chamado:
                  </p>
                  <p className="text-base font-mono font-black text-amber-500 bg-zinc-950 px-3.5 py-1.5 rounded-lg inline-block border border-zinc-800">
                    #{successTicketId}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Roberto Carlos da Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-700"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        E-mail de Contato <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="contato@seuprovedor.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="text"
                        placeholder="(21) 99999-9999"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-700"
                      />
                    </div>
                  </div>

                  {/* Subject drop */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Assunto da Mensagem
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none text-zinc-300"
                    >
                      <option value="Dúvida Geral">Dúvida Geral</option>
                      <option value="Problema com Filiação">Problema com Filiação / Carteirinha</option>
                      <option value="Inscrição de Campeonato">Inscrição de Campeonato</option>
                      <option value="Cadastrar Nova Academia">Credenciamento de Academia</option>
                      <option value="Arbitragem e Cursos">Cursos e Arbitragem</option>
                    </select>
                  </div>

                  {/* Message body */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Conteúdo da Mensagem <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Escreva sua dúvida, sugestão ou solicitação de suporte aqui..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none placeholder:text-zinc-700 resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4.5 bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Chamado Oficial</span>
                  </button>

                </form>
              )}
            </div>

            {/* List of submitted tickets saved in state / localStorage */}
            {submittedTickets.length > 0 && (
              <div className="mt-8 pt-6 border-t border-zinc-900">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center mb-3">
                  <Ticket className="w-4 h-4 text-amber-500 mr-1.5" />
                  Seus Chamados Ativos ({submittedTickets.length})
                </h4>
                <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                  {submittedTickets.map((tk, idx) => (
                    <div key={idx} className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white">{tk.name}</span>
                          <span className="text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded font-mono uppercase">{tk.id}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5 max-w-xs">{tk.subject}: "{tk.message}"</p>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                        Pendente
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
