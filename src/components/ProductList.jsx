import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { 
  Package, Search, Edit3, Trash2, IndianRupee, 
  Tag, ShieldCheck, Plus, X, Check, FileText 
} from "lucide-react";
import { Link } from "react-router-dom";
const API_BAS = import.meta.env.VITE_API_URL;

export default function ProductList() {
  const { products, setProducts, addNotification } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [dbCategories, setDbCategories] = useState([]); // Dropdown ke liye
  const [loading, setLoading] = useState(false);

  const API_URL = `${API_BAS}/api/products`;
  const token = localStorage.getItem("token");

  // ✅ Purane code wala Axios Instance
  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  // 🔄 1. Get All Products & Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Products fetch (Purane logic se)
        const response = await api.get("/");
        setProducts(response.data);

        // Categories fetch (Dropdown fix karne ke liye)
        const catRes = await axios.get(`${API_BAS}/api/admin/category/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Array.isArray(catRes.data)) {
          setDbCategories(catRes.data);
        }
      } catch (err) {
        console.error("Fetch error:", err.message);
      }
    };
    fetchData();
  }, [token]);

  // 🗑 2. Delete Product (Purane logic se)
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/${id}`);
      setProducts(products.filter((p) => (p._id || p.id) !== id));
      addNotification("🗑 Product Deleted Successfully");
    } catch (err) {
      addNotification("❌ Failed to delete product");
    }
  };

  // 💾 3. Save Edit (Inline Update Logic)
  const saveEdit = async () => {
    if (!editData.name || !editData.price) {
      alert("Name and Price are required");
      return;
    }
    setLoading(true);
    try {
      const response = await api.put(`/${editId}`, editData);
      
      // Local state update
      setProducts(products.map((p) => 
        (p._id === editId || p.id === editId) ? response.data : p
      ));
      
      setEditId(null);
      addNotification("✏️ Product Updated Successfully");
    } catch (err) {
      console.error("Update error:", err.response?.data);
      addNotification("❌ Error updating product");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product) => {
    setEditId(product._id || product.id);
    // Backend key 'Category' (Capital C) ensure kar rahe hain
    setEditData({ ...product, Category: product.Category || product.category });
  };

  // 🔍 Filter Logic
  const filtered = Array.isArray(products) ? products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    (p.Category || p.category)?.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] p-4 md:p-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="w-full flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
        </div>
        <Link to="/admin/inventory/add-product" className="flex items-center gap-2 bg-[#2dce89] text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-95 uppercase tracking-wider">
          <Plus size={16} strokeWidth={3} /> Add Product
        </Link>
      </div>

      {/* SEARCH & STATS CARD */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-emerald-50 text-[#2dce89] rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner">
            <Package size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#344767]">Asset Management</h2>
            <p className="text-[#67748e] text-sm">Total {products.length} investment products available.</p>
          </div>
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 bg-[#f8f9fa] rounded-xl border border-slate-200 outline-none focus:border-[#2dce89] focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-semibold text-slate-600 shadow-inner"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {filtered.map((p) => {
          const currentId = p._id || p.id;
          const isEditing = editId === currentId;

          return (
            <div key={currentId} className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all relative flex flex-col justify-between min-h-[220px]">
              
              {!isEditing && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <button onClick={() => startEdit(p)} className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all shadow-sm"><Edit3 size={14}/></button>
                  <button onClick={() => deleteProduct(currentId)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={14}/></button>
                </div>
              )}

              <div className="flex items-start gap-5">
                <div className="h-16 w-16 shrink-0 rounded-2xl bg-[#e8f5e9] text-[#2dce89] flex items-center justify-center text-2xl font-black border border-[#c8e6c9] shadow-inner uppercase">
                  {p.name?.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input 
                        className="w-full p-2 text-sm font-bold border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={editData.name} 
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                      />
                      {/* ✅ Category Update Fix: Dropdown */}
                      <select 
                        className="w-full p-2 text-xs font-bold border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50"
                        value={editData.Category} 
                        onChange={(e) => setEditData({...editData, Category: e.target.value})}
                      >
                        <option value="">Select Category</option>
                        {dbCategories.map(cat => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold text-[#344767] truncate mb-1">{p.name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <Tag size={12} className="text-[#2dce89]" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
                          {p.Category || p.category || "Uncategorized"}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 text-sm font-black text-[#344767]">
                      <IndianRupee size={14} className="text-slate-300" />
                      {isEditing ? (
                        <input type="number" className="border rounded px-2 w-full" value={editData.price} onChange={(e) => setEditData({...editData, price: e.target.value})} />
                      ) : (
                        <span>{p.price?.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    {!isEditing && (
                      <p className="text-xs text-slate-400 italic line-clamp-2">
                        {p.description || "No description provided."}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center">
                {isEditing ? (
                  <div className="flex gap-2 w-full">
                    <button onClick={saveEdit} disabled={loading} className="flex-1 bg-[#2dce89] text-white py-2 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-1 shadow-sm">
                      <Check size={12} /> {loading ? "Saving..." : "Save"}
                    </button>
                    <button onClick={() => setEditId(null)} className="flex-1 bg-slate-100 text-slate-500 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">Cancel</button>
                  </div>
                ) : (
                  <>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter flex items-center gap-1">
                      <ShieldCheck size={12} className="text-emerald-400" /> Secure Asset
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">UID: {currentId?.slice(-6)}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <Package size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-bold italic uppercase tracking-widest text-sm">Inventory is Empty</p>
        </div>
      )}

      <footer className="mt-16 pt-8 border-t border-slate-100 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
        
      </footer>
    </div>
  );
}