import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Clock, CheckCircle2, AlertCircle, Zap, Activity } from 'lucide-react';
import { toast } from 'react-toastify';

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRentals = async () => {
    try {
      const response = await api.get('/rent/me');
      setRentals(response.data);
    } catch (err) {
      toast.error("Falha na sincronização de contratos ativos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRentals(); }, []);

  const handleReturn = async (id_rent, id_car) => {
    if (!window.confirm("Confirmar encerramento do contrato e devolução?")) return;
    
    const returnPromise = api.patch(`/rent/return/${id_rent}`, { id_car });

    toast.promise(returnPromise, {
      pending: 'Processando devolução no cluster...',
      success: 'Ativo liberado com sucesso!',
      error: 'Erro ao processar devolução.'
    });

    try {
      await returnPromise;
      loadRentals();
    } catch (err) {}
  };

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
                Hyper Rent <span className="text-blue-600 not-italic font-light">RENTALS</span>
              </h1>
            </div>
            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.5em] ml-1">
              Active Contracts & Asset Lifecycle Management
            </p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 px-6 py-3 rounded-2xl text-blue-500 font-black text-[10px] tracking-widest flex items-center gap-3 shadow-2xl">
            <Clock size={14} className="animate-pulse" />
            {rentals.length} CONTRATOS EM EXECUÇÃO
          </div>
        </header>

        <div className="grid gap-6">
          {rentals.length === 0 ? (
            <div className="bg-[#0A0A0A] border border-dashed border-white/5 p-20 rounded-[3rem] text-center shadow-2xl">
              <AlertCircle className="mx-auto text-slate-800 mb-6" size={48} />
              <p className="text-slate-600 font-black uppercase text-[10px] tracking-[0.4em]">Nenhum contrato ativo identificado</p>
            </div>
          ) : (
            rentals.map(rent => (
              <div key={rent.id_rent} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center group hover:border-blue-500/30 transition-all shadow-2xl">
                <div className="flex items-center gap-8">
                  <div className="bg-black p-5 rounded-2xl text-blue-600 group-hover:text-blue-400 transition-colors shadow-inner">
                    <Clock size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase leading-none italic tracking-tighter">{rent.model_name}</h3>
                    <div className="flex gap-4 mt-3">
                      <span className="text-[11px] font-mono text-slate-500 bg-black/40 px-3 py-1 rounded border border-white/5 tracking-widest">
                        {rent.plate}
                      </span>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Activity size={10} className="text-green-500" />
                        INÍCIO: {new Date(rent.rent_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-10 mt-8 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-1">Taxa Acumulada</p>
                    <p className="text-3xl font-black text-white italic tracking-tighter">R$ {Number(rent.price).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => handleReturn(rent.id_rent, rent.id_car)}
                    className="flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 uppercase text-[10px] tracking-widest"
                  >
                    <CheckCircle2 size={18} />
                    Liberar Ativo
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRentals;