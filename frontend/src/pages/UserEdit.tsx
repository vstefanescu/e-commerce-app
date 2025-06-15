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
        setLoading(false);
      } catch (err) {
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      await api(`/api/admin/users/${id}`, "PATCH", { name, email, role }, token);
      navigate("/admin/users");
    } catch {
      setError("Failed to update user");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading user data...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!userData) return null;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-6">Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Name
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </label>

        <label className="block">
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </label>

        <label className="block">
          Role
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UserEdit;
