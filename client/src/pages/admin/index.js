import { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  Trash2, PlusCircle, Car, LogOut, Edit3, 
  Terminal, Copy, RefreshCw, Check, Database, Activity
} from 'lucide-react';
import { AuthContext } from '../../context/authContext';

const Admin = () => {
  const { logout } = useContext(AuthContext);
  const [editingId, setEditingId] = useState(null); 
  const [carData, setCarData] = useState({ 
    brand: '', model: '', year: '', plate: '', color: '', type: 'Sedan', price: '' 
  });
  const [fleet, setFleet] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_URL;
  const fullUrl = `${BASE_URL}/admin/cars?apikey=${apiKey || '••••'}`;

  useEffect(() => {
    fetchCars();
    fetchApiKey();
  }, []);

  const fetchCars = async () => {
    try {
      const { data } = await api.get('cars');
      setFleet(data);
    } catch (err) {
      toast.error("Erro na sincronização.");
    }
  };

  const fetchApiKey = async () => {
    try {
      const { data } = await api.get('/admin/api-keys');
      if (data.length > 0) setApiKey(data[0].key_value);
    } catch (err) {
      console.log("Integração: Chave não encontrada.");
    }
  };

  const handleGenerateKey = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post('/admin/api-keys/generate');
      setApiKey(data.key_value);
      toast.success("API Key Rotacionada!");
    } catch (err) {
      toast.error("Erro no servidor.");
    } finally {
      setGenerating(false);
    }
  };

  const handleEdit = (car) => {
    setEditingId(car.id_car);
    setCarData({
      brand: car.brand_name || '',
      model: car.model_name || '',
      year: car.year || '',
      plate: car.plate || '',
      color: car.color_name || '',
      type: car.type_name || 'Sedan',
      price: car.price || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      brand: carData.brand.trim(), model: carData.model.trim(),
      year: parseInt(carData.year), color: carData.color.trim(),
      type: carData.type, price: parseFloat(carData.price),
      plate: carData.plate.toUpperCase().trim()
    };

    try {
      if (editingId) {
        await api.put(`cars/${editingId}`, payload);
        toast.success("Atualizado!");
      } else {
        await api.post('cars', payload);
        toast.success("Cadastrado!");
      }
      setEditingId(null);
      setCarData({ brand: '', model: '', year: '', plate: '', color: '', type: 'Sedan', price: '' });
      fetchCars(); 
    } catch (err) {
      toast.error("Erro na operação.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remover veículo?")) return;
    try {
      await api.delete(`cars/${id}`);
      fetchCars();
    } catch (err) {
      toast.error("Erro ao deletar.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-7xl px-8 py-8 h-screen flex flex-col">
        
        <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white leading-none">
              Hyper <span className="text-blue-600 not-italic font-light">Rent</span>
            </h1>
            <div className="flex items-center gap-2 text-slate-600 uppercase font-bold text-[8px] tracking-[0.4em] mt-1 border-l border-white/10 pl-4">
              <Activity size={10} className="text-green-500 animate-pulse" />
              Admin Control Plane
            </div>
          </div>
          <button onClick={logout} className="hover:text-red-500 transition-all uppercase text-[9px] font-black tracking-widest flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            Logout <LogOut size={12} />
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
          
          <section className="lg:col-span-4 flex flex-col gap-6 overflow-hidden">
            
            <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl shadow-xl">
              <h2 className="text-xs font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                <PlusCircle size={14} className="text-blue-500" /> {editingId ? 'Editar' : 'Novo'} Registro
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Marca" className="mini-input" value={carData.brand} onChange={e => setCarData({...carData, brand: e.target.value})} />
                  <input type="text" placeholder="Modelo" className="mini-input" value={carData.model} onChange={e => setCarData({...carData, model: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Ano" className="mini-input" value={carData.year} onChange={e => setCarData({...carData, year: e.target.value})} />
                  <input type="text" placeholder="Placa" className="mini-input uppercase" value={carData.plate} onChange={e => setCarData({...carData, plate: e.target.value})} />
                </div>
                <input type="text" placeholder="Cor" className="mini-input" value={carData.color} onChange={e => setCarData({...carData, color: e.target.value})} />
                <div className="grid grid-cols-2 gap-3">
                  <select className="mini-input" value={carData.type} onChange={e => setCarData({...carData, type: e.target.value})}>
                    <option value="Sedan">Sedan</option><option value="Hatch">Hatch</option><option value="SUV">SUV</option><option value="Pickup">Pickup</option>
                  </select>
                  <input type="number" placeholder="Diária" className="mini-input" value={carData.price} onChange={e => setCarData({...carData, price: e.target.value})} />
                </div>
                <button className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all mt-4 ${editingId ? 'bg-yellow-600 text-black' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'}`}>
                  {editingId ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                </button>
              </form>
            </div>

            <div className="bg-[#0A0A0A] border border-blue-500/10 p-6 rounded-3xl shadow-2xl flex flex-col gap-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Terminal size={14} className="text-green-500" /> ETL Data Source
              </h2>
              <div className="bg-black/60 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                <div className="truncate text-[10px] font-mono text-blue-400 opacity-80">{fullUrl}</div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { navigator.clipboard.writeText(fullUrl); setCopied(true); toast.info("URL Copiada!"); setTimeout(() => setCopied(false), 2000); }} 
                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 p-3 rounded-lg text-[9px] font-bold uppercase transition-all"
                  >
                    {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />} {copied ? 'Copiado' : 'Copiar URL'}
                  </button>
                  <button 
                    onClick={handleGenerateKey} 
                    disabled={generating} 
                    className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 p-3 rounded-lg text-[9px] font-bold uppercase transition-all"
                  >
                    <RefreshCw size={12} className={generating ? 'animate-spin' : ''} /> Rotar Key
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-8 bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-6 overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Database size={14} className="text-blue-500" /> Inventário de Ativos
              </h2>
              <span className="bg-white/5 px-4 py-1 rounded-full text-[9px] font-bold text-slate-500 border border-white/5 uppercase">
                {fleet.length} Veículos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar">
              {fleet.map(car => (
                <div key={car.id_car} className="flex flex-col justify-between p-5 bg-black border border-white/5 rounded-[1.5rem] group hover:border-blue-500/30 transition-all shadow-inner">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-600/10 p-2 rounded-lg text-blue-500"><Car size={16} /></div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(car)} className="p-2 hover:bg-yellow-500/10 hover:text-yellow-500 rounded-lg transition-colors"><Edit3 size={14} /></button>
                      <button onClick={() => handleDelete(car.id_car)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase italic tracking-tighter text-sm leading-none mb-1">{car.model_name}</h4>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{car.brand_name} • {car.plate}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <style jsx>{`
        .mini-input { width: 100%; padding: 0.9rem; background: #000; border: 1px solid rgba(255,255,255,0.05); border-radius: 0.9rem; font-size: 0.8rem; color: white; outline: none; transition: 0.2s; }
        .mini-input:focus { border-color: #3b82f6; background: #050505; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Admin;