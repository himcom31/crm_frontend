import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,Line, LineChart} from 'recharts';
import { IndianRupee, Users, Briefcase, TrendingUp, Target} from 'lucide-react';

const API_BAS = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  // Updated state for 3 cards logic
  const [stats, setStats] = useState({ 
    totalRevenue: 0, 
    totalAgents: 0, 
    totalClients: 0, 
    chartData: [], 
    agents: [] 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BAS}/api/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setStats({
          totalRevenue: res.data.totalRevenue || res.data.pipeline || 0, // Fallback to pipeline if backend key differs
          totalAgents: res.data.totalAgents || 0,
          totalClients: res.data.totalClients || 0,
          chartData: res.data.chartData || [],
          agents: res.data.agents || []
        });
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    getDashboardData();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f8f9fa]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#2dce89] border-t-transparent rounded-full animate-spin shadow-lg"></div>
        <p className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em] animate-pulse">Syncing Intelligence...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#f8f9fa] min-h-screen font-sans antialiased">
      
      {/* --- TOP 3 CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Gross Revenue" 
          value={`₹${Number(stats.totalRevenue).toLocaleString('en-IN')}`} 
          growth="+12.5%"
          icon={<IndianRupee size={22} className="text-emerald-500" />} 
          color="emerald"
        />
        <StatCard 
          title="Active Field Agents" 
          value={stats.totalAgents} 
          growth={stats.totalAgents}
          icon={<Briefcase size={22} className="text-blue-500" />} 
          color="blue"
        />
        <StatCard 
          title="Client Ecosystem" 
          value={stats.totalClients} 
          growth={stats.totalClients}
          icon={<Users size={22} className="text-indigo-500" />} 
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- ADVANCED CHART SECTION --- */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-black text-[12px] text-slate-800 uppercase tracking-[0.2em]">Growth Intelligence</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Revenue Performance Overview</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
               <span className="w-2 h-2 rounded-full bg-[#2dce89] animate-pulse"></span>
               <span className="text-[10px] font-black text-slate-600 uppercase">Live Analysis</span>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
  {stats.chartData.length > 0 ? (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={stats.chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
        
        {/* Stylish dotted grid lines */}
        <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#e2e8f0" />
        
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{fontSize: 10, fontWeight: '900', fill: '#94a3b8'}} 
          dy={15}
        />
        
        {/* YAxis ko chupa diya hai clean look ke liye */}
        <YAxis hide={true} domain={['auto', 'auto']} />
        
        {/* Premium Floating Tooltip */}
        <Tooltip 
          cursor={{ stroke: '#2dce89', strokeWidth: 2, strokeDasharray: '5 5' }}
          contentStyle={{ 
            borderRadius: '20px', 
            border: 'none', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)', 
            padding: '15px' 
          }}
          itemStyle={{ fontSize: '14px', fontWeight: '900', color: '#111' }}
          labelStyle={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}
          formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, "Revenue"]}
        />
        
        {/* --- THE BEAUTIFUL LINE --- */}
        <Line 
          type="monotone" // Curves ko smooth banane ke liye
          dataKey="revenue" 
          stroke="#2dce89" // Chaudhary & Sons Green
          strokeWidth={5} // Thicker line
          dot={{ r: 6, fill: '#fff', stroke: '#2dce89', strokeWidth: 3 }} // White dots with green border
          activeDot={{ r: 10, fill: '#2dce89', strokeWidth: 0 }} // Big dot on hover
          animationDuration={2500}
        />
      </LineChart>
    </ResponsiveContainer>
  ) : (
    /* EMPTY STATE (Loading) */
    <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2">
      <Target className="animate-bounce" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest italic tracking-[0.2em]">
        Syncing Performance Data...
      </p>
    </div>
  )}
</div>

        </div>

        {/* --- TOP AGENTS SECTION (Stays as requested) --- */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex flex-col mb-8">
            <h3 className="font-black text-[12px] text-slate-800 uppercase tracking-[0.2em]">Top Agents Sales Reps</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Leading Performance</p>
          </div>
          <div className="space-y-8">
            {stats.agents.length > 0 ? stats.agents.map((item, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-700 text-[14px] group-hover:bg-[#2dce89] group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-inner uppercase">
                    {item.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 group-hover:text-[#2dce89] transition-colors">{item.name}</p>
                    <div className="flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight">{item.deals} Won</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-sm font-black text-slate-800">₹{item.revenue?.toLocaleString('en-IN')}</p>
                   <p className="text-[9px] font-bold text-slate-300 uppercase">Valuation</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 opacity-30">
                <Users size={40} className="mx-auto mb-2 text-slate-300" />
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Awaiting Stats</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Custom StatCard with Dynamic Colors
function StatCard({ title, value, growth, icon, color }) {
  const colorMap = {
    emerald: "shadow-emerald-100 group-hover:bg-emerald-50",
    blue: "shadow-blue-100 group-hover:bg-blue-50",
    indigo: "shadow-indigo-100 group-hover:bg-indigo-50"
  };

  return (
    <div className="group bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h2>
        <div className="flex items-center gap-2 mt-2">
           <div className="flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
             <TrendingUp size={10} className="text-emerald-500" />
             <span className="text-[10px] font-black text-emerald-600">{growth}</span>
           </div>
           <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest">Vs Last Month</span>
        </div>
      </div>
      <div className={`w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner transition-all duration-500 ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  );
}