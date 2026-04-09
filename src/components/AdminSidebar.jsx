import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, Package, LayoutDashboard, ChevronDown, ChevronLeft,
  UserPlus, Database, PlusCircle, LayoutList, Tag, 
  Users2, TrendingUp, Settings, BookOpen, X, Menu, Briefcase,CreditCard
} from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // Mobile Toggle
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop Collapse Toggle
  
  const [openMenus, setOpenMenus] = useState({
    clients: false,
    agents: false,
    inventory: false,
    sales: false
  });

  const toggleMenu = (menu) => {
    // Agar sidebar collapsed hai aur hum click karte hain, to pehle expand karein
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* --- MOBILE TOGGLE --- */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* --- MAIN SIDEBAR --- */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-40 bg-white border-r border-slate-200 flex flex-col
        transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isCollapsed ? "w-20" : "w-72"}
      `}>
        
        {/* LOGO SECTION & COLLAPSE BUTTON */}
        <div className={`p-6 flex items-center border-b border-slate-50 relative ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 bg-emerald-600 rounded-xl shrink-0 flex items-center justify-center text-white font-bold shadow-lg">C</div>
            {!isCollapsed && (
              <span className="font-bold text-slate-800 tracking-tight text-lg italic whitespace-nowrap animate-in fade-in duration-500">
                Hexile
              </span>
            )}
          </div>

          {/* Desktop Collapse Toggle Button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute -right-3 top-16 h-6 w-6 bg-white border border-slate-200 rounded-full items-center justify-center shadow-sm hover:bg-slate-50 z-50"
          >
            <ChevronLeft size={14} className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar overflow-x-hidden">
          
          <SidebarItem 
            to="/admin/dash/main" 
            icon={<LayoutDashboard size={20}/>} 
            label="Dashboard" 
            active={isActive("/admin/dash/main")} 
            collapsed={isCollapsed} 
          />

          {/* 1. CLIENTS DROP-DOWN */}
          <div className="space-y-1">
            <DropdownHeader 
              icon={<Users size={20}/>} 
              label="Clients" 
              isOpen={openMenus.clients} 
              onClick={() => toggleMenu('clients')} 
              active={location.pathname.includes('clients')}
              collapsed={isCollapsed}
            />
            {!isCollapsed && openMenus.clients && (
              <div className="ml-9 space-y-1 animate-in slide-in-from-top-2 duration-200">
                <SubItem to="/admin/clients/add" label="Add Client" active={isActive("/admin/clients/add")} />
                <SubItem to="/admin/clients/view" label="Client List" active={isActive("/admin/clients/view")} />
              </div>
            )}
          </div>

          {/* 2. AGENTS DROP-DOWN */}
          <div className="space-y-1">
            <DropdownHeader 
              icon={<Users2 size={20}/>} 
              label="Agents" 
              isOpen={openMenus.agents} 
              onClick={() => toggleMenu('agents')} 
              active={location.pathname.includes('agents')}
              collapsed={isCollapsed}
            />
            {!isCollapsed && openMenus.agents && (
              <div className="ml-9 space-y-1 animate-in slide-in-from-top-2">
                <SubItem to="/admin/agents/add" label="Register Agent" active={isActive("/admin/agents/add")} />
                <SubItem to="/admin/agents/view" label="Agent Database" active={isActive("/admin/agents/view")} />
              </div>
            )}
          </div>

          {/* 3. INVENTORY DROP-DOWN */}
          <div className="space-y-1">
            <DropdownHeader 
              icon={<Package size={20}/>} 
              label="Products" 
              isOpen={openMenus.inventory} 
              onClick={() => toggleMenu('inventory')} 
              active={location.pathname.includes('inventory')}
              collapsed={isCollapsed}
            />
            {!isCollapsed && openMenus.inventory && (
              <div className="ml-9 space-y-1 animate-in slide-in-from-top-2">
                <SubItem to="/admin/inventory/add-product" label="New Product" active={isActive("/admin/inventory/add-product")} />
                <SubItem to="/admin/inventory/view-inventory" label="View Products" active={isActive("/admin/inventory/view-inventory")} />
              </div>
            )}
          </div>

{/* --- 3. SALES SECTION --- */}
<div className="space-y-1">
  <DropdownHeader
    icon={<CreditCard size={20} />} // 'Package' ki jagah 'CreditCard' ya 'ShoppingCart' icon use karein
    label="Sales"
    isOpen={openMenus.sales} // 'inventory' ki jagah 'sales' state use karein
    onClick={() => toggleMenu('sales')}
    active={location.pathname.includes('sales')}
    collapsed={isCollapsed}
  />
  
  {!isCollapsed && openMenus.sales && (
    <div className="ml-9 space-y-1 animate-in slide-in-from-top-2">
      {/* Naya Sale add karne ke liye */}
      <SubItem 
        to="/admin/sales/add" 
        label="New Sale" 
        active={isActive("/admin/sales/add")} 
      />
      {/* Sales ka history dekhne ke liye */}
      <SubItem 
        to="/admin/sales/history" 
        label="Sales History" 
        active={isActive("/admin/sales/history")} 
      />
    </div>
  )}
</div>


{/* --- 4. CATEGORY MANAGEMENT (Single Click) --- */}
<div className="space-y-1">
  <Link
    to="/admin/inventory/manage-categories" // Click karte hi seedha is page par jayega
    className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 group ${
      location.pathname.includes('category') 
        ? 'bg-[#2dce89] text-white shadow-lg shadow-emerald-200' 
        : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    <div className="flex items-center gap-3">
      <Tag 
        size={20} 
        className={`${location.pathname.includes('category') ? 'text-white' : 'text-slate-400 group-hover:text-[#2dce89]'}`} 
      />
      {!isCollapsed && (
        <span className="font-bold text-sm tracking-tight">Categories</span>
      )}
    </div>
    
    {/* Active indicator dot (Optional) */}
    {!isCollapsed && location.pathname.includes('category') && (
      <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></div>
    )}
  </Link>
</div>

        </div>

        {/* PROFILE FOOTER */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className={`flex items-center gap-3 p-2 rounded-xl ${isCollapsed ? "justify-center" : ""}`}>
            <div className="h-9 w-9 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-black shrink-0">HC</div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden animate-in fade-in duration-500">
                <p className="text-sm font-bold text-slate-800 truncate">Himanshu C.</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Super Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

// --- SUB-COMPONENTS ---

function SidebarItem({ to, icon, label, active, collapsed }) {
  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'} ${collapsed ? "justify-center px-0" : ""}`}>
      <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} shrink-0`}>{icon}</span>
      {!collapsed && <span className="font-semibold text-sm whitespace-nowrap animate-in fade-in">{label}</span>}
    </Link>
  );
}

function DropdownHeader({ icon, label, isOpen, onClick, active, collapsed }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active && !isOpen ? 'bg-slate-50 text-slate-900' : 'text-slate-600 hover:bg-slate-50'} ${collapsed ? "justify-center px-0" : ""}`}
    >
      <span className={`${active ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-600'} shrink-0`}>{icon}</span>
      {!collapsed && (
        <>
          <span className="font-semibold text-sm flex-1 text-left whitespace-nowrap animate-in fade-in">{label}</span>
          <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </>
      )}
    </button>
  );
}

function SubItem({ to, label, active }) {
  return (
    <Link 
      to={to} 
      className={`block pr-25 px-4 py-2 text-[13px] font-medium rounded-lg transition-all ${active ? 'text-emerald-600 bg-emerald-50/50 font-bold border-l-2 border-emerald-500' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
    >
      {label}
    </Link>
  );
}