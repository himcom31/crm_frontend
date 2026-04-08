// src/App.js
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import { AppContext } from "./context/AppContext";

import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Notifications from "./components/Notifications";

// ✅ Protected Route
const ProtectedRoute = ({ children, role }) => {
  const { currentUser, userRole, loading } = useContext(AppContext);

  if (loading) return <p>Loading...</p>;

  if (!currentUser) return <Navigate to="/" />;

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default function App() {
  return (
    <>
      <Notifications />

      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/*"
          element={
            <ProtectedRoute role="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}