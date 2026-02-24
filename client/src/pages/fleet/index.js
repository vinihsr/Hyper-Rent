import { useEffect, useState } from 'react';
import api from '../../services/api';
import { CheckCircle, XCircle, Car as CarIcon, Activity, Zap } from 'lucide-react';
import { toast } from 'react-toastify';

const Fleet = () => {
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFleet = async () => {
      try {
        const response = await api.get('/cars');
        setFleet(response.data);
      } catch (err) {
        toast.error("Falha na sincronização da frota.");
      } finally {
        setLoading(false);
      }
    };
    loadFleet();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Activity className="text-blue-600 animate-pulse" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 flex flex-col items-center selection:bg-blue-500/30">
      <div className="w-full max-w-[1550px] px-12 py-12 flex flex-col gap-10">
        
        <header className="flex justify-between items-end border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-4 mb-3"> 
              <div className="bg-blue-600 p-2 rounded-lg">
                <Zap size={24} className="text-white fill-current" />
              </div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
                Hyper Rent <span className="text-blue-600 not-italic font-light">FLEET</span>
              </h1>
            </div>
            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.5em] ml-1">
              Data Infrastructure & Active Asset Tracking
            </p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 px-6 py-3 rounded-2xl text-blue-500 font-black text-xs tracking-widest flex items-center gap-3 shadow-2xl">
            <Activity size={14} className="text-green-500" />
            {fleet.length} ATIVOS IDENTIFICADOS
          </div>
        </header>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="sticky top-0 z-20 bg-[#0F0F0F]"> 
                <tr className="border-b border-white/5">
                  <th className="p-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Detalhes do Veículo</th>
                  <th className="p-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] text-center">Ano</th>
                  <th className="p-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Placa</th>
                  <th className="p-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Cor / Tipo</th>
                  <th className="p-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] text-right">Diária</th>
                  <th className="p-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {fleet.map((car) => (
                  <tr key={car.id_car} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-8">
                      <div className="flex items-center gap-5">
                        <div className="bg-black p-4 rounded-2xl text-slate-700 group-hover:text-blue-500 transition-colors shadow-inner">
                          <CarIcon size={22} />
                        </div>
                        <div>
                          <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em]">{car.brand_name || 'Generic'}</p>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none text-white">{car.model_name}</h3>
                        </div>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <span className="font-mono text-[11px] text-slate-400 bg-black/40 px-4 py-1.5 rounded-lg border border-white/5">
                        {car.year || '----'}
                      </span>
                    </td>
                    <td className="p-8 font-mono text-xs text-slate-500 tracking-[0.2em] uppercase">
                      {car.plate}
                    </td>
                    <td className="p-8">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-slate-200 tracking-widest">{car.color_name}</span>
                        <span className="text-[9px] uppercase text-slate-600 font-black tracking-widest">{car.type_name}</span>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <p className="font-black text-2xl text-white italic tracking-tighter leading-none">R$ {Number(car.price).toFixed(2)}</p>
                    </td>
                    <td className="p-8">
                      <div className="flex justify-center">
                        {car.rent_status === 'available' ? (
                          <span className="flex items-center gap-3 bg-green-500/5 text-green-500 text-[9px] px-6 py-2.5 rounded-xl font-black uppercase tracking-[0.1em] border border-green-500/10 shadow-lg shadow-green-900/5">
                            <CheckCircle size={14} /> Disponível
                          </span>
                        ) : (
                          <span className="flex items-center gap-3 bg-red-500/5 text-red-500 text-[9px] px-6 py-2.5 rounded-xl font-black uppercase tracking-[0.1em] border border-red-500/10 shadow-lg shadow-red-900/5">
                            <XCircle size={14} /> Alugado
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default Fleet; 