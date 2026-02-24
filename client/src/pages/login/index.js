import { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogIn, Activity, Zap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    try {
      await login(cleanEmail, password);
      toast.success("Acesso autorizado!");
      if (cleanEmail === process.env.REACT_APP_ADMIN_EMAIL) {
        navigate('/admin');
      } else {
        navigate('/fleet');
      }
    } catch (err) {
      toast.error("Credenciais inválidas.");
    }
  };
  
  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 flex flex-col items-center justify-center p-6 selection:bg-blue-500/30">
      <header className="mb-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Zap size={28} className="text-white fill-current" />
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
            Hyper <span className="text-blue-600 not-italic font-light">Rent</span>
          </h1>
        </div>
        <div className="flex items-center justify-center gap-3 text-slate-600 uppercase font-bold text-[9px] tracking-[0.6em]">
          <Activity size={12} className="text-green-500 animate-pulse" />
          Fleet Management System
        </div>
      </header>

      <article className="w-full max-w-[480px] bg-[#0A0A0A] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-black uppercase italic text-white flex items-center gap-3">
              <LogIn size={20} className="text-blue-500" /> Entrar
            </h2>
            <p className="text-slate-500 text-xs font-medium">Insira suas credenciais para acessar o painel.</p>
          </div>

          <div className="space-y-5">
            <div className="group">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">Email corporativo</label>
              <input 
                type="email" 
                required 
                placeholder="nome@exemplo.com" 
                className="w-full p-4 bg-black border border-white/5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white text-sm"
                value={email}
                onChange={e => setEmail(e.target.value)} 
              />
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">Senha de acesso</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                className="w-full p-4 bg-black border border-white/5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white text-sm"
                value={password}
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-900/10 transition-all transform active:scale-95 uppercase text-xs tracking-[0.2em]">
            Autenticar no Sistema
          </button>
        </form>

        <footer className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            Não possui conta? <Link to="/signup" className="text-blue-500 hover:text-white transition-colors ml-2">Registrar-se</Link>
          </p>
        </footer>
      </article>
    </div>
  );
};

export default Login;