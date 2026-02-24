import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { 
  LayoutDashboard, 
  CarFront, 
  History, 
  Search, 
  LogOut,
  ClipboardList,
  Zap,
  Activity
} from 'lucide-react';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const { logout } = useContext(AuthContext); 
  const location = useLocation();
  
  const isPublicPage = ['/login', '/signup', '/'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isPublicPage || isAdminPage) return null;

  const handleLogout = async () => {
    try {
      await logout();
      toast.info("Conexão encerrada.");
    } catch (err) {
      toast.error("Erro ao desconectar.");
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18}/> },
    { name: 'Alugar Veículo', path: '/rent', icon: <CarFront size={18}/> },
    { name: 'Meus Aluguéis', path: '/my-rentals', icon: <History size={18}/> },
    { name: 'Meu Histórico', path: '/history', icon: <ClipboardList size={18}/> },
    { name: 'Frota Disponível', path: '/fleet', icon: <Search size={18}/> },
  ];

  return (
    <aside className="w-64 h-screen bg-[#050505] border-r border-white/5 p-6 flex flex-col fixed left-0 top-0 z-50 selection:bg-blue-500/30">
      
      <div className="mb-12 px-2">
        <div className="flex items-center gap-3 mb-2">
          <Zap size={20} className="text-blue-600 fill-current" />
          <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">
            Hyper <span className="text-blue-600 not-italic font-light">Rent</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 text-slate-600 uppercase font-bold text-[7px] tracking-[0.4em] ml-1">
          <Activity size={10} className="text-green-500 animate-pulse" />
          User guide
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-black transition-all group ${
              location.pathname === item.path 
              ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-lg shadow-blue-900/10' 
              : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
            }`}
          >
            <span className={`${location.pathname === item.path ? 'text-blue-500' : 'text-slate-600 group-hover:text-blue-500'} transition-colors`}>
              {item.icon}
            </span>
            <span className="text-[11px] uppercase tracking-widest">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-500 font-black hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all w-full group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;