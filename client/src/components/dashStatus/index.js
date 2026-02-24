import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { Activity, BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react';

const UserDashboard = ({ fleet }) => {
  const topPriceData = [...fleet]
    .sort((a, b) => b.price - a.price)
    .slice(0, 10);

  const brandData = Object.entries(fleet.reduce((acc, car) => {
    acc[car.brand_name] = (acc[car.brand_name] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));

  const yearData = Object.entries(fleet.reduce((acc, car) => {
    acc[car.year] = (acc[car.year] || 0) + 1;
    return acc;
  }, {})).map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#1d4ed8', '#1e40af'];

  return (
    <div className="space-y-6 p-0 bg-[#050505] selection:bg-blue-500/30"> 
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-[#0A0A0A] p-8 rounded-[2.2rem] border border-white/5 h-72 shadow-2xl group hover:border-blue-500/20 transition-all">
          <header className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <BarChart3 size={14} className="text-blue-500" /> Valuation por Modelo
            </h3>
            <Activity size={12} className="text-green-500 animate-pulse" />
          </header>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={topPriceData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="model_name" type="category" stroke="#475569" fontSize={9} width={70} tickLine={false} axisLine={false} interval={0} 
                cursor={{fill: 'rgba(255,255,255,0.02)'}} 
                contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                itemStyle={{ color: '#fff', fontWeight: '900' }} 
              />
              <Bar dataKey="price" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0A0A0A] p-8 rounded-[2.2rem] border border-white/5 h-72 shadow-2xl group hover:border-blue-500/20 transition-all">
          <header className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <PieIcon size={14} className="text-blue-500" /> Mix de Marcas
            </h3>
          </header>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie data={brandData} innerRadius={55} outerRadius={75} paddingAngle={8} dataKey="value" stroke="none">
                {brandData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                itemStyle={{ color: '#fff', fontWeight: '900' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0A0A0A] p-8 rounded-[2.2rem] border border-white/5 h-72 shadow-2xl lg:col-span-2 group hover:border-blue-500/20 transition-all">
          <header className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <TrendingUp size={14} className="text-blue-500" /> Volume de Frota por Ano
            </h3>
          </header>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={yearData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                itemStyle={{ color: '#fff', fontWeight: '900' }}
              />
              <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;