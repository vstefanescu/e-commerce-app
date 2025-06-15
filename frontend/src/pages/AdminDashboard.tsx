import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ShoppingCart } from "lucide-react";
import type { User } from "../types/User";
import { api } from "../lib/api";

interface AdminDashboardProps {
  isLoggedIn: boolean;
  user: User | null;
  authLoaded: boolean;
  addToast?: (msg: string) => void;
}

interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  popularProductTitle: string;
}

const AdminDashboard = ({
  isLoggedIn,
  user,
  authLoaded,
}: AdminDashboardProps) => {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const data = await api<AdminStats>("/api/admin/stats", "GET", undefined, token);
        setStats(data);
      } catch (error) {
        console.error("Eroare la preluarea statisticilor:", error);
      }
    };
    fetchStats();
  }, []);

  if (!authLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-indigo-600 font-bold text-xl">Se încarcă...</span>
      </div>
    );
  }

  if (!isLoggedIn || user?.role !== "admin") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-red-600 font-bold text-xl">Acces restricționat!</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-indigo-700">
        Panou Administrator
      </h1>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold text-gray-500">Utilizatori</h2>
            <p className="text-3xl font-bold text-indigo-700">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold text-gray-500">Produse</h2>
            <p className="text-3xl font-bold text-green-600">{stats.totalProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold text-gray-500">Comenzi</h2>
            <p className="text-3xl font-bold text-yellow-600">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold text-gray-500">Cel mai nou produs</h2>
            <p className="text-md font-bold text-gray-800">{stats.popularProductTitle}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Link
          to="/admin/users"
          className="flex flex-col items-center justify-center bg-indigo-100 hover:bg-indigo-200 rounded-2xl shadow-md p-8 transition text-center"
        >
          <ShieldCheck className="w-12 h-12 text-indigo-600 mb-4" />
          <span className="text-xl font-semibold text-indigo-800">
            Gestiune Utilizatori
          </span>
        </Link>

        <Link
          to="/admin/products"
          className="flex flex-col items-center justify-center bg-green-100 hover:bg-green-200 rounded-2xl shadow-md p-8 transition text-center"
        >
          <ShoppingCart className="w-12 h-12 text-green-600 mb-4" />
          <span className="text-xl font-semibold text-green-800">
            Gestiune Produse
          </span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
