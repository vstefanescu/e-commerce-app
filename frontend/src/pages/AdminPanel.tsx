// src/pages/AdminPanel.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AdminPanelProps = {
  isLoggedIn: boolean;
  user: { role?: string } | null;
};

function AdminPanel({ isLoggedIn, user }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "admin") {
      navigate("/login");
      return;
    }

    if(user?.role !== "admin") {
      navigate("/not-authorized");
      return;
    }

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");
        const data = await api<User[]>(
          "/api/admin/users",
          "GET",
          undefined,
          token
        );
        setUsers(data);
      } catch {
        setError("Could not fetch users");
      }
    };

    fetchUsers();
  }, [isLoggedIn, user, navigate]);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-6">User List</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
