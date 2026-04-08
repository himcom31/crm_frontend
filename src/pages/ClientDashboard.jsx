// src/pages/ClientDashboard.js
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function ClientDashboard() {
  const { currentUser, products } = useContext(AppContext);

  return (
    <div className="p-6">
      <h1>Welcome {currentUser?.name}</h1>

      <h2>Your Details</h2>
      <p>Email: {currentUser?.email}</p>
      <p>Mobile: {currentUser?.mobile}</p>

      <h2 className="mt-4">Products</h2>
      {products.map((p) => (
        <div key={p.id} className="border p-2 my-2">
          {p.name} - ₹{p.price}
        </div>
      ))}
    </div>
  );
}