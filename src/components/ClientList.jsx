import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { Mail, Phone, Edit, Trash2, Search, Plus, X, Check, Landmark, CreditCard, Calendar } from "lucide-react";
const API_BAS = import.meta.env.VITE_API_URL;

export default function ClientList() {
  const { clients, setClients, addNotification } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BAS}/api/admin/clients`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClients(response.data.data || response.data);
      } catch (error) {
        addNotification("❌ Could not load clients");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filtered = Array.isArray(clients) ? clients.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const deleteClient = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BAS}/api/admin/client/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(clients.filter((c) => c._id !== id));
      addNotification("✅ Client deleted");
    } catch (error) {
      addNotification("❌ Delete failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BAS}/api/admin/client/${editingClient._id}`,
        editingClient,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setClients(clients.map(c => c._id === editingClient._id ? response.data.data : c));
        addNotification("✅ Client updated");
        setEditingClient(null);
      }
    } catch (error) {
      addNotification("❌ Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] font-sans pb-10">
      <div className="w-full px-4 md:px-8 py-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
          <div>
            <h1 className="text-3xl font-bold text-[#344767] tracking-tight">Clients</h1>
            <p className="text-[#67748e] font-medium text-sm">Manage your client relationships</p>
          </div>
          
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-10 px-2">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#adb5bd]">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2dce89]/20 transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-[#67748e] font-bold animate-pulse">SYNCHRONIZING...</div>
        ) : (
          /* GRID: Yahan grid-cols ko 2 ya 3 rakha hai taaki card rectangle bane */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
            {filtered.map((c) => (
              <div 
                key={c._id} 
                onClick={() => setSelectedClient(c)}
                className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer relative flex flex-col justify-between min-h-[180px]"
              >
                {/* Actions Button */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditingClient(c); }} 
                    className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                  ><Edit size={14}/></button>
                  <button 
                    onClick={(e) => deleteClient(e, c._id)} 
                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  ><Trash2 size={14}/></button>
                </div>

                {/* Inner Content in Flex Row for Rectangle Shape */}
                <div className="flex items-center gap-6">
                  {/* Avatar Section */}
                  <div className="h-16 w-16 shrink-0 rounded-2xl bg-[#e8f5e9] text-[#2dce89] flex items-center justify-center text-2xl font-black border border-[#c8e6c9] shadow-inner">
                    {c.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-[#344767] truncate leading-tight mb-1">{c.name}</h3>
                    <p className="text-[#67748e] text-xs font-bold mb-3 opacity-70 uppercase tracking-wider">Investor Profile</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[13px] text-slate-500 font-medium">
                        <Mail size={14} className="opacity-50 shrink-0" />
                        <span className="truncate">{c.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-slate-500 font-medium">
                        <Phone size={14} className="opacity-50 shrink-0" />
                        <span>{c.mobile}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                  <span>Joined: {formatDate(c.createdAt)}</span>
                  <span className="text-[#2dce89] bg-[#e8f5e9] px-2 py-0.5 rounded-md">Verified</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- EDIT MODAL --- */}
        {editingClient && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in duration-200">
              <div className="p-8 bg-[#344767] text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black">Edit Profile</h2>
                  <p className="text-slate-300 text-xs uppercase font-bold tracking-widest mt-1">Record ID: {editingClient._id}</p>
                </div>
                <button onClick={() => setEditingClient(null)} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X /></button>
              </div>

              <form onSubmit={handleUpdate} className="p-8 overflow-y-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <EditInput label="Full Name" value={editingClient.name} onChange={(e) => setEditingClient({...editingClient, name: e.target.value})} />
                  <EditInput label="Email Address" value={editingClient.email} onChange={(e) => setEditingClient({...editingClient, email: e.target.value})} />
                  <EditInput label="Mobile Number" value={editingClient.mobile} onChange={(e) => setEditingClient({...editingClient, mobile: e.target.value})} />
                  <EditInput label="Date of Birth" type="date" value={editingClient.Date_of_Birth?.split('T')[0]} onChange={(e) => setEditingClient({ ...editingClient, Date_of_Birth: e.target.value })} />
                  <EditInput label="PAN Card No." value={editingClient.Pan_card_Number} onChange={(e) => setEditingClient({...editingClient, Pan_card_Number: e.target.value})} />
                  <EditInput label="Aadhar No." value={editingClient.Adhar_card_Number} onChange={(e) => setEditingClient({...editingClient, Adhar_card_Number: e.target.value})} />
                </div>

                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Landmark size={14}/> Banking Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EditInput label="Account Number" value={editingClient.Bank_Account_Number} onChange={(e) => setEditingClient({...editingClient, Bank_Account_Number: e.target.value})} />
                    <EditInput label="IFSC Code" value={editingClient.IFSC_Code} onChange={(e) => setEditingClient({...editingClient, IFSC_Code: e.target.value})} />
                    <EditInput label="Bank Branch" value={editingClient.Bank_Branch} onChange={(e) => setEditingClient({...editingClient, Bank_Branch: e.target.value})} />
                    <EditInput label="Account Holder Name" value={editingClient.Bank_Account_Name} onChange={(e) => setEditingClient({...editingClient, Bank_Account_Name: e.target.value})} />
                  </div>
                </div>

                <button type="submit" disabled={btnLoading} className="w-full py-4 bg-[#2dce89] text-white rounded-2xl font-black text-lg shadow-xl hover:bg-[#28b87b] transition-all flex justify-center items-center gap-2">
                  {btnLoading ? "Syncing..." : <><Check size={20} /> Update Record</>}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* --- DETAIL VIEW MODAL --- */}
        {selectedClient && !editingClient && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300">
               <div className="bg-[#344767] p-8 text-white relative">
                  <button onClick={() => setSelectedClient(null)} className="absolute top-6 right-6 p-2 bg-white/20 rounded-full">✕</button>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl font-black">
                      {selectedClient.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                      <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Investor Details</p>
                    </div>
                  </div>
               </div>
               <div className="p-8 space-y-4">
                  <DetailRow icon={<Calendar size={14}/>} label="Investment Date" value={formatDate(selectedClient.Date_of_Investment)} />
                  <DetailRow icon={<CreditCard size={14}/>} label="PAN Card" value={selectedClient.Pan_card_Number} />
                  <DetailRow icon={<Check size={14}/>} label="Aadhar No" value={selectedClient.Adhar_card_Number} />
                  <DetailRow icon={<Landmark size={14}/>} label="Bank A/C" value={selectedClient.Bank_Account_Number} />
                  <DetailRow icon={<Mail size={14}/>} label="Email" value={selectedClient.email} />
                  <button onClick={() => setSelectedClient(null)} className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-bold">Close Profile</button>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function EditInput({ label, value, onChange, type = "text" }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">{label}</label>
      <input 
        type={type} 
        value={value || ""} 
        onChange={onChange}
        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-sm focus:ring-2 focus:ring-[#2dce89] outline-none transition-all" 
      />
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 py-3">
      <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs">
        {icon} <span>{label}</span>
      </div>
      <span className="text-slate-800 font-black text-sm">{value || "N/A"}</span>
    </div>
  );
}