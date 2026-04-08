import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  CheckCircle, Package, Trash2, Plus, 
  User, ShoppingCart, IndianRupee, Calendar, 
  BadgePercent, ShieldCheck 
} from "lucide-react";
const API_BAS = import.meta.env.VITE_API_URL;

export default function SalesForm() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [agents, setAgents] = useState([]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [form, setForm] = useState({
    clientId: "",
    investmentDate: "",
    agentId: "",
    commissionLabel: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [cRes, pRes, aRes] = await Promise.all([
          axios.get(`${API_BAS}/api/admin/clients`, { headers }),
          axios.get(`${API_BAS}/api/products`, { headers }),
          axios.get(`${API_BAS}/api/admin/agent/all`, { headers })
        ]);
        setClients(cRes.data.data || cRes.data);
        setProducts(pRes.data);
        setAgents(aRes.data);
      } catch (err) { console.error("Fetch Error", err); }
    };
    fetchData();
  }, []);

  const addProductToSale = (productId) => {
    if (!productId) return;
    const product = products.find((p) => p._id === productId);
    if (product && !selectedProducts.find((p) => p._id === productId)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeProduct = (id) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== id));
  };

  const totalProductPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const commissionAmount = (totalProductPrice * Number(form.commissionLabel)) / 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedProducts.length === 0) { setError("Select at least one product."); return; }
    setError(""); setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const salesData = {
        clientId: form.clientId,
        productIds: selectedProducts.map(p => p._id),
        investmentDate: form.investmentDate,
        agentId: form.agentId,
        commissionLabel: form.commissionLabel,
        totalAmount: totalProductPrice,
        commissionAmount: commissionAmount
      };
      const response = await axios.post(`${API_BAS}/api/admin/sales/add`, salesData, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) { navigate("/admin/sales/history"); }
    } catch (err) { setError(err.response?.data?.message || "Error saving sale."); } finally { setLoading(false); }
  };

  return (
    <div className="w-full h-screen bg-[#f8f9fa] p-2 md:p-4 font-sans overflow-hidden flex flex-col justify-center">
      
      <div className="max-w-7xl mx-auto w-full bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Header - Minimal Height */}
        <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center bg-white">
          <div>
            <h1 className="text-lg font-black !text-black leading-none">Sales Entry</h1>
            <p className="text-[15px] text-slate-400 mt-1 uppercase ">New Transaction Booking</p>
          </div>
          <div className="flex items-center gap-1 text-[#2dce89] font-black text-[9px] uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
            <ShieldCheck size={10} /> Revenue Secured
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          
          {error && (
            <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-red-100 flex items-center gap-2">
              <Plus className="rotate-45" size={12} /> {error}
            </div>
          )}

          {/* Section 1: Selection Grid (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
            <SelectField 
              label="Select Client" icon={<User size={12}/>} 
              value={form.clientId} 
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              options={clients} placeholder="Choose Investor"
            />
            <SelectField 
              label="Add Product" icon={<ShoppingCart size={12}/>} 
              onChange={(e) => addProductToSale(e.target.value)}
              options={products} placeholder="Select Asset" isProduct
            />
            <div className="flex flex-col gap-0.5">
              <label className="text-[14px] font-black !text-[#313131] uppercase  ml-1">Investment Date</label>
              <div className="relative group">
                <Calendar size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2dce89]" />
                <input 
                  type="date" onChange={(e) => setForm({ ...form, investmentDate: e.target.value })}
                  onClick={(e) => e.target.showPicker()}
                  className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-[#2dce89] font-bold text-[11px] !text-black cursor-pointer"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Product List Area (Shrinked Table-like view) */}
          <div className="border-y border-slate-50 py-2 max-h-[120px] overflow-y-auto">
            <label className="text-[14px] font-black !text-[#353535] uppercase  ml-1 mb-2 block">Selected Assets</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedProducts.length > 0 ? (
                selectedProducts.map((p) => (
                  <div key={p._id} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100 group">
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-[#2dce89]" />
                      <span className="text-[11px] font-bold !text-black">{p.name}</span>
                      <span className="text-[10px] font-black text-[#2dce89]">₹{p.price.toLocaleString('en-IN')}</span>
                    </div>
                    <button type="button" onClick={() => removeProduct(p._id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-slate-400 italic col-span-2 text-center py-2">No items selected.</p>
              )}
            </div>
          </div>

          {/* Section 3: Agent & Settlement (Blue Compact Card) */}
          <div className="bg-[#344767] p-3 rounded-xl text-white">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="flex flex-col gap-0.5">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Agent</label>
                <select 
                  value={form.agentId} onChange={(e) => setForm({ ...form, agentId: e.target.value })}
                  className="w-full p-1.5 bg-white/10 border border-white/20 rounded text-white font-bold text-[11px] outline-none" required
                >
                  <option value="" className="text-slate-800">-- Select Agent --</option>
                  {agents.map(a => <option key={a._id} value={a._id} className="text-slate-800">{a.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-0.5">
                <label className="text-[10px] font-bold text-slate-300 uppercase ">Comm %</label>
                <input 
                  type="number" placeholder="0" onChange={(e) => setForm({ ...form, commissionLabel: e.target.value })}
                  className="w-full p-1.5 bg-white/10 border border-white/20 rounded text-white font-bold text-[11px] outline-none" required
                />
              </div>

              <div className="lg:col-span-2 bg-white/5 rounded-lg p-2 border border-white/10 flex justify-between items-center">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase ">Total Business</p>
                    <p className="text-sm font-black">₹{totalProductPrice.toLocaleString('en-IN')}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-[#2dce89] uppercase ">Net Payout</p>
                    <p className="text-sm font-black text-[#2dce89]">₹{commissionAmount.toLocaleString('en-IN')}</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-1">
            <button 
              type="submit" disabled={loading}
              className="bg-[#2dce89] hover:bg-[#28b87b] text-white px-6 py-2 rounded-lg font-black text-[10px] shadow-sm active:scale-95 disabled:opacity-50 uppercase tracking-widest flex items-center gap-2"
            >
              {loading ? "..." : <><Plus size={12} strokeWidth={4} /> Save Transaction</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SelectField({ label, icon, value, onChange, options, placeholder, isProduct }) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-[14px] font-black !text-[#3a3b3b] uppercase  ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2dce89] z-10">
          {icon}
        </div>
        <select 
          value={value} onChange={onChange}
          className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:border-[#2dce89] font-bold text-[11px] !text-black appearance-none cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt._id} value={opt._id}>
              {opt.name} {isProduct ? `(₹${opt.price.toLocaleString()})` : ''}
            </option>
          ))}
        </select>
        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function ChevronDown(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}