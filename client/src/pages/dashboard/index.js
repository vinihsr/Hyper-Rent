import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { LayoutDashboard, Info, Zap, Activity } from 'lucide-react'; 
import UserDashboard from '../../components/dashStatus/index'; 

const Dash = () => {
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('cars');
        setFleet(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        toast.error("Erro na extração de métricas.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Activity className="text-blue-500 animate-pulse" size={32} />
          <div className="text-slate-500 text-[10px] font-black tracking-[0.5em] uppercase">
            Sincronizando Cluster...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 flex flex-col items-center overflow-x-hidden selection:bg-blue-500/30">
      <div className="w-full max-w-[1500px] px-8 py-10 md:py-16">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/5 pb-10 gap-6"> 
          <div>
            <div className="flex items-center gap-4 mb-3"> 
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <Zap size={24} className="text-white fill-current" />
              </div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
                Hyper Rent <span className="text-blue-600 not-italic font-light">DASH</span>
              </h1>
            </div>
            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.5em] ml-1">
              Data Visualization & Fleet Intelligence
            </p>
          </div>

          <div className="flex items-center gap-5 bg-[#0A0A0A] px-8 py-4 rounded-2xl border border-white/5 shadow-xl group hover:border-blue-500/20 transition-all">
            <div className="text-right">
              <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Total Assets</p>
              <p className="text-2xl font-black italic text-white leading-none">{fleet.length}</p>
            </div>
            <div className="h-10 w-[1px] bg-white/5 mx-1" />
            <LayoutDashboard size={20} className="text-blue-500" />
          </div>
        </header>

        <main className="w-full">
          {fleet.length > 0 ? (
            <UserDashboard fleet={fleet} />
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-[#0A0A0A] rounded-[3rem] border border-white/5 shadow-2xl">
              <div className="bg-white/5 p-6 rounded-full mb-6 text-slate-700">
                <Info size={48} />
              </div>
              <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em]">
                Sem dados para processamento
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dash;