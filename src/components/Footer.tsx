import React from 'react';
import { Shield, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const usefulLinks = [
    { label: 'Secretaria de Esportes RJ', url: 'https://www.rj.gov.br/' },
    { label: 'Confederação Brasileira de Lutas', url: '#' },
    { label: 'Código de Ética Esportiva', url: '#downloads' },
    { label: 'Cadastrar Minha Academia', url: '#academias' },
  ];

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-[1.5px]">
                <div className="flex items-center justify-center w-full h-full bg-zinc-950 rounded-[9px]">
                  <Shield className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">FEAM</span>
                <span className="font-extrabold text-xl text-amber-500 tracking-tight">CRJ</span>
              </div>
            </div>
            
            <p className="text-xs text-zinc-500 leading-relaxed">
              FEDERAÇÃO ESPORTIVA DE ARTE MARCIAL E COMBATE RIO DE JANEIRO. <br />
              Entidade oficial reguladora e fomentadora do desporto de combate e artes marciais no estado do Rio de Janeiro.
            </p>
          </div>

          {/* Col 2: Board / Diretoria */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Conselho Executivo</h4>
            <ul className="text-xs space-y-1.5 text-zinc-500">
              <li><strong className="text-zinc-400">Presidente:</strong> Raphael Jaboque</li>
              <li><strong className="text-zinc-400">Vice-Presidente:</strong> Mestre Alexandre Silva</li>
              <li><strong className="text-zinc-400">Diretor Técnico:</strong> Mestre Wellington Santos</li>
              <li><strong className="text-zinc-400">Relações Públicas:</strong> Dra. Beatriz Ferreira Souza</li>
            </ul>
          </div>

          {/* Col 3: Useful Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Links Úteis</h4>
            <ul className="text-xs space-y-2">
              {usefulLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    className="hover:text-amber-500 flex items-center space-x-1 transition-colors"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-600" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contacts quick block */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Secretaria de Lutas</h4>
            <div className="text-xs space-y-2 text-zinc-500">
              <p className="flex items-center">
                <Mail className="w-4 h-4 text-amber-500 mr-2 shrink-0" />
                <span>secretaria@feamcrj.com.br</span>
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 text-amber-500 mr-2 shrink-0" />
                <span>(21) 2568-9876</span>
              </p>
              <p>
                Rua Conde de Bonfim, 342 - Sala 501 - Tijuca <br />
                Rio de Janeiro - RJ
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright details */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
          <p>© {currentYear} FEAMCRJ - Todos os direitos reservados.</p>
          <p className="font-mono text-[10px]">Homologada sob Registro de Cartório Civil de Pessoa Jurídica nº 812.428-RJ</p>
        </div>

      </div>
    </footer>
  );
}
