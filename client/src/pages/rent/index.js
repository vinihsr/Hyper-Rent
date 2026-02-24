import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Car, Zap, Activity, AlertCircle, ShoppingCart } from 'lucide-react';

const RentPage = () => {
  const [availableCars, setAvailableCars] = useState([]);
  const [myRentals, setMyRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [carsRes, rentalsRes] = await Promise.all([
        api.get('cars'),
        api.get('rent/me')
      ]);
      
      setAvailableCars(carsRes.data.filter(car => car.rent_status === 'available'));
      setMyRentals(rentalsRes.data);
    } catch (err) {
      toast.error("Falha na sincronização da infraestrutura de frota.");
    } finally {
      setLoading(false);
    }
  };

  const handleRent = async (carId) => {
    const rentPromise = api.post('rent', { id_car: carId });

    toast.promise(rentPromise, {
      pending: 'Processando requisição no cluster...',
      success: 'Ativo vinculado com sucesso!',
      error: 'Erro na transação. Tente novamente.'
    });

    try {
      await rentPromise;
      loadData();
    } catch (err) {}
  };

  const handleReturn = async (rentId, carId) => {
    if (!window.confirm("Confirmar encerramento de contrato?")) return;

    const returnPromise = api.patch(`rent/return/${rentId}`, { id_car: carId });

    toast.promise(returnPromise, {
      pending: 'Liberando ativo para o catálogo...',
      success: 'Contrato finalizado!',
      error: 'Erro ao processar devolução.'
    });

    try {
      await returnPromise;
      loadData();
    } catch (err) {}
  };

  if (loading && availableCars.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Activity className="text-blue-600 animate-pulse" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 flex flex-col items-center selection:bg-blue-500/30 overflow-x-hidden">
      <div className="w-full max-w-[1500px] px-12 py-12 flex flex-col gap-16">
        
        <header className="flex justify-between items-end border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-4 mb-3"> 
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <Zap size={24} className="text-white fill-current" />
              </div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
                Hyper Rent <span className="text-blue-600 not-italic font-light">HUB</span>
              </h1>
            </div>
            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.5em] ml-1">
              On-Demand Asset Rental & Catalog Management
            </p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/5 px-6 py-3 rounded-2xl text-blue-500 font-black text-[10px] tracking-widest flex items-center gap-3 shadow-2xl">
            <ShoppingCart size={14} className="text-blue-500" />
            {availableCars.length} ATIVOS DISPONÍVEIS
          </div>
        </header>

        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 italic mb-8 flex items-center gap-3">
             <Activity size={16} /> Meus Contratos Ativos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myRentals.length > 0 ? myRentals.map(rent => (
              <div key={rent.id_rent} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] flex justify-between items-center group shadow-2xl hover:border-blue-500/20 transition-all">
                <div className="flex items-center gap-6">
                  <div className="bg-black p-4 rounded-xl text-blue-600 shadow-inner">
                    <Car size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl italic uppercase tracking-tighter text-white leading-tight">{rent.model_name}</h3>
                    <div className="flex gap-3 mt-2">
                      <span className="text-[10px] font-mono text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                        {rent.plate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <p className="text-white font-black text-2xl italic tracking-tighter leading-none">R$ {Number(rent.price).toFixed(2)}</p>
                  <button 
                    onClick={() => handleReturn(rent.id_rent, rent.id_car)}
                    className="text-[9px] bg-red-500/5 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/10 px-6 py-2.5 rounded-xl font-black transition-all uppercase tracking-widest"
                  >
                    Encerrar
                  </button>
                </div>
              </div>
            )) : (
              <div className="md:col-span-2 bg-[#0A0A0A] border border-dashed border-white/5 p-12 rounded-[2.5rem] text-center">
                <AlertCircle className="mx-auto text-slate-800 mb-4" size={32} />
                <p className="text-slate-600 font-black uppercase text-[10px] tracking-widest italic">Sem aluguéis ativos</p>
              </div>
            )}
          </div>
        </section>

        <div className="h-px bg-white/5 w-full" />

        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white italic mb-10 flex items-center gap-3">
              <ShoppingCart size={16} className="text-blue-500" /> Catálogo de Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
            {availableCars.map(car => (
              <div key={car.id_car} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[3rem] hover:border-blue-500/30 transition-all flex flex-col justify-between group shadow-2xl">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-black p-4 rounded-2xl text-slate-700 group-hover:text-blue-500 transition-colors shadow-inner">
                      <Car size={24} />
                    </div>
                    <span className="text-[9px] text-blue-600 font-black uppercase tracking-[0.2em] bg-blue-600/5 px-4 py-1.5 rounded-full border border-blue-500/10">
                      {car.type_name}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-none">{car.model_name}</h3>
                  <p className="text-slate-500 text-[11px] mt-3 font-mono tracking-widest uppercase">{car.color_name} • {car.plate}</p>
                </div>
                
                <div className="flex justify-between items-center border-t border-white/5 mt-10 pt-8">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1">Taxa Diária</span>
                    <p className="font-black text-2xl text-white italic tracking-tighter">R$ {Number(car.price).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => handleRent(car.id_car)}
                    className="bg-blue-600 px-8 py-4 rounded-2xl text-[10px] font-black uppercase text-white hover:bg-white hover:text-blue-600 transition-all shadow-xl shadow-blue-900/10 active:scale-95 tracking-widest"
                  >
                    Alugar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RentPage;