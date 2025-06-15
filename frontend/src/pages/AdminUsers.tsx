import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { User } from "../types/User";

type AdminUsersProps = {
  isLoggedIn: boolean;
  user: User | null;
  setIsLoggedIn: (v: boolean) => void;
  setUser: (u: User | null) => void;
  addToast: (msg: string) => void;
  authLoaded: boolean;
};

const AdminUsers = ({
  isLoggedIn,
  user,
  setIsLoggedIn,
  setUser,
  addToast,
  authLoaded,
}: AdminUsersProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoaded) return;
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (user?.role !== "admin") {
      navigate("/not-authorized");
      return;
    }

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const data = await api<User[]>("/api/admin/users", "GET", undefined, token);
        setUsers(data);
        setLoading(false);
      } catch {
        setError("Nu s-au putut încărca utilizatorii.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isLoggedIn, user, navigate, authLoaded]);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await api(`/api/admin/users/${id}`, "DELETE", undefined, token);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      addToast("Utilizator șters cu succes!");

      if (user?.id === id) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
        addToast("Ți-ai șters propriul cont. Ai fost delogat.");
        navigate("/login");
      }
    } catch (err) {
      addToast("Eroare la ștergerea utilizatorului.");
      console.error("❌ Eroare la delete:", err);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/users/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-indigo-600">
        Se încarcă utilizatorii...
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">
        Panou Administrare Utilizatori
      </h1>

      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-indigo-100 text-indigo-700">
            <th className="border border-gray-300 p-3 text-left">Nume</th>
            <th className="border border-gray-300 p-3 text-left">Email</th>
            <th className="border border-gray-300 p-3 text-left">Rol</th>
            <th className="border border-gray-300 p-3 text-center">Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-indigo-50">
              <td className="border border-gray-300 p-3">{u.name}</td>
              <td className="border border-gray-300 p-3">{u.email}</td>
              <td className="border border-gray-300 p-3 capitalize">{u.role}</td>
              <td className="border border-gray-300 p-3 flex justify-center gap-3">
                <button
                  className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded hover:bg-yellow-500 transition"
                  onClick={() => handleEdit(u.id)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={() => handleDelete(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
