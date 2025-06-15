import { Link } from "react-router-dom";
import { ShieldCheck, ShoppingCart } from "lucide-react";
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
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-indigo-700">
        Panou Administrator
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Link
          to="/admin/users"
          className="flex flex-col items-center justify-center bg-indigo-100 hover:bg-indigo-200 rounded-2xl shadow-md p-8 transition text-center"
        >
          <ShieldCheck className="w-12 h-12 text-indigo-600 mb-4" />
          <span className="text-xl font-semibold text-indigo-800">Gestiune Utilizatori</span>
        </Link>

        <Link
          to="/admin/products"
          className="flex flex-col items-center justify-center bg-green-100 hover:bg-green-200 rounded-2xl shadow-md p-8 transition text-center"
        >
          <ShoppingCart className="w-12 h-12 text-green-600 mb-4" />
          <span className="text-xl font-semibold text-green-800">Gestiune Produse</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
