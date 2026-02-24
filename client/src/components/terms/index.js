import { useState } from 'react';
import api from '../../services/api';

const TermsModal = ({ termData, onAccepted }) => {
  const [optIn, setOptIn] = useState(false);

  const handleConfirm = async () => {
    try {
      await api.post('/terms/accept', { 
        term_id: termData.id, 
        opt_in_study: optIn 
      });
      onAccepted();
    } catch (err) {
      alert("Erro ao salvar consentimento.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
      <div className="bg-[#0A0A0A] border border-white/5 w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-4">
          Termos de Uso <span className="text-blue-600">v{termData.version}</span>
        </h2>
        
        <div className="h-64 overflow-y-auto bg-black/40 rounded-2xl p-6 mb-8 text-slate-400 text-sm leading-relaxed custom-scrollbar border border-white/5">
          {termData.content}
        </div>

        <div className="flex flex-col gap-6">
          <label className="flex items-center gap-4 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={optIn} 
              onChange={(e) => setOptIn(e.target.checked)}
              className="w-5 h-5 rounded border-white/10 bg-black text-blue-600 focus:ring-blue-600"
            />
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-500 transition-colors">
              Aceito compartilhar dados para fins de estudo (Psicologia/Dados)
            </span>
          </label>

          <button 
            onClick={handleConfirm}
            className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-white hover:bg-white hover:text-blue-600 transition-all shadow-xl active:scale-95"
          >
            Confirmar e Acessar Hub
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;