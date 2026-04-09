import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Target, Plus } from 'lucide-react';

const API_BAS = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  // Stats ka initial state default arrays ke saath taaki .map() crash na kare
  const [stats, setStats] = useState({ pipeline: 0, chartData: [], agents: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BAS}/api/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Backend se data extract karte waqt safety checks
        setStats({
          pipeline: res.data.pipeline || 0,
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
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-[#2dce89] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Loading Analytics...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-[#f8f9fa] min-h-screen font-sans">
      
      {/* --- TOP CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Pipeline" 
          value={`₹${Number(stats.pipeline).toLocaleString('en-IN')}`} 
          growth="+12%" 
          icon={<DollarSign className="text-emerald-500" />} 
        />
        <StatCard 
          title="Win Rate" 
          value="34.2%" 
          growth="+3.8%" 
          icon={<Target className="text-blue-500" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- CHART SECTION --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-black text-[12px] text-slate-800 uppercase tracking-widest mb-6">Pipeline Overview</h3>
          
          {/* Chart Wrapper with fixed height to prevent ResponsiveContainer error */}
          <div className="h-[300px] w-full min-h-[300px]">
            {stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dce89" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2dce89" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 'bold'}} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2dce89" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-[10px] italic">
                No revenue data available for this period.
              </div>
            )}
          </div>
        </div>

        {/* --- TOP REPS SECTION --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-black text-[12px] text-slate-800 uppercase tracking-widest mb-6">Top Sales Reps</h3>
          <div className="space-y-6">
            {stats.agents.length > 0 ? stats.agents.map((item, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-600 text-[12px] group-hover:border-[#2dce89] transition-colors">
                    {item.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-black">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{item.deals} Deals Won</p>
                  </div>
                </div>
                <p className="text-[12px] font-black text-black">₹{item.revenue?.toLocaleString('en-IN')}</p>
              </div>
            )) : (
              <div className="text-center py-10">
                <p className="text-slate-400 text-[10px] italic uppercase tracking-widest">No active agents found</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, growth, icon }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center hover:scale-[1.02] transition-all cursor-pointer">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">{value}</h2>
        <div className="flex items-center gap-1 mt-1">
           <span className="text-[10px] font-bold text-emerald-500">{growth}</span>
           <span className="text-[9px] text-slate-300 font-bold uppercase">This Month</span>
        </div>
      </div>
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shadow-inner group-hover:bg-emerald-50 transition-colors">
        {icon}
      </div>
    </div>
  );
}