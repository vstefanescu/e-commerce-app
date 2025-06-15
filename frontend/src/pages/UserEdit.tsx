import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const UserEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const data = await api<User>(`/api/admin/users/${id}`, "GET", undefined, token);
        setUserData(data);
        setName(data.name);
        setEmail(data.email);
        setRole(data.role);
      } catch {
        setError("Nu s-au putut încărca datele utilizatorului.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      await api(`/api/admin/users/${id}`, "PATCH", { name, email, role }, token);
      navigate("/admin/users");
    } catch {
      setError("Eroare la actualizarea utilizatorului.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-indigo-600 font-semibold text-lg">Se încarcă utilizatorul...</span>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-red-600 font-semibold text-lg">{error || "Utilizator inexistent."}</span>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-6 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">Editează Utilizator</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold text-sm">Nume</label>
          <input
            type="text"
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-sm">Email</label>
          <input
            type="email"
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-sm">Rol</label>
          <select
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 rounded-md font-semibold text-white ${
            saving ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          } transition`}
        >
          {saving ? "Se salvează..." : "Salvează modificările"}
        </button>
      </form>
    </div>
  );
};

export default UserEdit;
