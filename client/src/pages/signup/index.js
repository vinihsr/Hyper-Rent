import { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus, MapPin, Mail, Lock, Activity, Zap } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', last_name: '', cpf: '', email: '', password: '', phone: '',
    cep: '', street: '', number: '', neighborhood: '', city: '', state: ''
  });
  
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const signupPromise = signup(formData);

    toast.promise(signupPromise, {
      pending: 'Sincronizando dados...',
      success: 'Perfil de Motorista criado!',
      error: {
        render({ data }) {
          return data.response?.data?.message || "Erro na validação. Tente novamente.";
        }
      }
    });

    try {
      await signupPromise;
      navigate('/dashboard');
    } catch (err) {}
  };
  
  const inputClass = "w-full p-3.5 bg-black border border-white/5 rounded-xl focus:border-blue-500 outline-none transition-all text-white text-sm shadow-inner placeholder:text-slate-700";
  const labelClass = "block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1";

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 flex flex-col items-center justify-center p-6 selection:bg-blue-500/30 overflow-x-hidden">
      
      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Zap size={24} className="text-white fill-current" />
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Hyper <span className="text-blue-600 not-italic font-light">Rent</span>
          </h1>
        </div>
        <div className="flex items-center justify-center gap-2 text-slate-600 uppercase font-bold text-[8px] tracking-[0.5em]">
          <Activity size={10} className="text-green-500 animate-pulse" />
          Operator Registration Portal
        </div>
      </header>

      <article className="w-full max-w-4xl bg-[#0A0A0A] border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <UserPlus size={18} className="text-blue-500" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white italic">Dados Pessoais</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>Nome</label>
                <input type="text" required placeholder="Ex: Vinícius" className={inputClass} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Sobrenome</label>
                <input type="text" required placeholder="Ex: Silva" className={inputClass} onChange={e => setFormData({...formData, last_name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>CPF</label>
                <input type="text" required placeholder="000.000.000-00" className={inputClass} onChange={e => setFormData({...formData, cpf: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Telefone</label>
                <input type="text" required placeholder="(11) 99999-9999" className={inputClass} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <MapPin size={18} className="text-blue-500" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white italic">Endereço Residencial</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className={labelClass}>CEP</label>
                <input type="text" required placeholder="00000-000" className={inputClass} onChange={e => setFormData({...formData, cep: e.target.value})} />
              </div>
              <div className="md:col-span-3 space-y-1">
                <label className={labelClass}>Rua / Logradouro</label>
                <input type="text" required placeholder="Av. das Américas" className={inputClass} onChange={e => setFormData({...formData, street: e.target.value})} />
              </div>
              <div className="md:col-span-1 space-y-1">
                <label className={labelClass}>Nº</label>
                <input type="text" required placeholder="123" className={inputClass} onChange={e => setFormData({...formData, number: e.target.value})} />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className={labelClass}>Bairro</label>
                <input type="text" required placeholder="Centro" className={inputClass} onChange={e => setFormData({...formData, neighborhood: e.target.value})} />
              </div>
              <div className="md:col-span-3 space-y-1">
                <label className={labelClass}>Cidade</label>
                <input type="text" required placeholder="São Paulo" className={inputClass} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="md:col-span-1 space-y-1">
                <label className={labelClass}>UF</label>
                <input type="text" required maxLength="2" placeholder="SP" className={inputClass} onChange={e => setFormData({...formData, state: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={labelClass}>Email Corporativo</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" />
                <input type="email" required placeholder="seu@email.com" className={`${inputClass} pl-12`} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Senha de Acesso</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" />
                <input type="password" required placeholder="••••••••" className={`${inputClass} pl-12`} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-6">
            <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-900/10 transition-all transform active:scale-95 uppercase text-xs tracking-[0.2em]">
              Finalizar Cadastro de Motorista
            </button>
            
            <footer className="text-center">
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
                Já faz parte da frota? <Link to="/login" className="text-blue-500 hover:text-white transition-colors ml-2">Fazer Login</Link>
              </p>
            </footer>
          </div>
        </form>
      </article>
    </div>
  );
};

export default Signup;