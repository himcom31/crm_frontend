// DashboardLayout.js or where you render the main layout
import React from 'react';
import Sidebar from '../components/AdminSidebar'; 
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout = () => {
  const location = useLocation();

  const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="flex min-h-screen font-sans text-slate-900 overflow-hidden">
      {/* Background with Animation stays constant */}
      <div className="fixed inset-0 -z-10 bg-slate-50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-purple-100/50 to-pink-100/50 animate-gradient-slow"></div>
      </div>

      <Sidebar /> {/* Your original Sidebar or our refined one */}

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} {...pageTransition}>
            {/* The Outlet will render the CategoryManager or other pages */}
            <Outlet /> 
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DashboardLayout;