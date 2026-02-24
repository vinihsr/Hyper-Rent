import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { CheckCircle, Clock, ClipboardList, Activity, Zap } from 'lucide-react';

const UserHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await api.get('/rent/history/me');
        setHistory(response.data);
      } catch (err) {
        toast.error("Erro na extração do histórico.");
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Activity className="text-blue-600 animate-pulse" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 flex flex-col items-center selection:bg-blue-500/30">
      <div className="w-full max-w-[1500px] px-12 py-12 flex flex-col gap-10">
        
        <header className="flex justify-between items-end border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-4 mb-3"> 
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <Zap size={24} className="text-white fill-current" />
              </div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
                Hyper Rent <span className="text-blue-600 not-italic font-light">HISTORY</span>
              </h1>
            </div>
            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.5em] ml-1">
              Immutable Ledger & Asset Rental Logs
            </p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 px-6 py-3 rounded-2xl text-slate-500 font-black text-[10px] tracking-widest flex items-center gap-3 shadow-2xl">
            <ClipboardList size={14} className="text-blue-500" />
            {history.length} ENTRADAS NO LOG
          </div>
        </header>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-20 bg-[#0F0F0F]">
                <tr className="border-b border-white/5">
                  <th className="p-7 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Timestamp</th>
                  <th className="p-7 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Ativo</th>
                  <th className="p-7 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Identificador</th>
                  <th className="p-7 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Status Operacional</th>
                  <th className="p-7 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] text-right">Montante</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {history.map((item) => (
                  <tr key={item.id_rent} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-7 font-mono text-[11px] text-slate-500 group-hover:text-blue-400 transition-colors">
                      {new Date(item.rent_date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-7 font-black uppercase italic tracking-tighter text-base text-white">
                      {item.model_name}
                    </td>
                    <td className="p-7 font-mono text-xs text-blue-600 tracking-widest">
                      {item.plate}
                    </td>
                    <td className="p-7">
                      {item.rent_status === 'active' ? (
                        <span className="flex items-center gap-2 text-green-500 text-[9px] font-black uppercase tracking-widest bg-green-500/5 px-4 py-2 rounded-xl border border-green-500/10">
                          <Clock size={12} className="animate-pulse" /> Em Uso
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-slate-600 text-[9px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                          <CheckCircle size={12} /> Finalizado
                        </span>
                      )}
                    </td>
                    <td className="p-7 text-right font-black text-xl italic tracking-tighter text-white">
                      R$ {item.price ? Number(item.price).toFixed(2) : '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {history.length === 0 && (
              <div className="p-24 text-center">
                <p className="text-slate-700 font-black uppercase text-[10px] tracking-[0.4em]">Nenhum registro encontrado na base</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2563eb; }
      `}</style>
    </div>
  );
};

export default UserHistory;