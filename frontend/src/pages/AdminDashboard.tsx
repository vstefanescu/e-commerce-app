import { Link } from "react-router-dom";
import type { User } from "../types/User";

type AdminDashboardProps = {
  isLoggedIn: boolean;
  user: User | null;
  authLoaded: boolean;
};

const AdminDashboard = ({ isLoggedIn, user, authLoaded }: AdminDashboardProps) => {
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
    <div className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-12">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link
          to="/admin/users"
          className="block bg-indigo-100 hover:bg-indigo-200 rounded-2xl shadow-xl p-12 text-center transition text-2xl font-semibold"
        >
          Gestiune Utilizatori
        </Link>
        <Link
          to="/admin/products"
          className="block bg-green-100 hover:bg-green-200 rounded-2xl shadow-xl p-12 text-center transition text-2xl font-semibold"
        >
          Gestiune Produse
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
