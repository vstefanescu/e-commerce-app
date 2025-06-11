import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

interface User {
  id: number;
  name?: string;
  email?: string;
  role?: string;
}

type ProfileProps = {
  setIsLoggedIn: (v: boolean) => void;
  setUser: (u: User | null) => void;
};

function getInitials(name?: string, email?: string) {
  if (name && name.length > 0) {
    return name
      .split(" ")
      .map(word => word[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2);
  }
  if (email) return email[0]?.toUpperCase() || "";
  return "U";
}

const Profile = ({ setIsLoggedIn, setUser }: ProfileProps) => {
  const navigate = useNavigate();
  const [user, setUserProfile] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await api<{ message: string; user: User }>(
          "/api/profile",
          "GET",
          undefined,
          token
        );
        setUserProfile(data.user);
        console.log("PROFILE DATA", data.user);
      } catch (err: unknown) {
        setError("Profile fetch failed");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error)
    return <div className="text-red-600 text-center mt-8">{error}</div>;
  if (!user) return <div className="text-center mt-8">Loading profile...</div>;

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6 text-3xl text-indigo-600 font-bold">
          {getInitials(user.name, user.email)}
        </div>
        {/* Info */}
        <div className="mb-4 text-center">
          <div className="text-xl font-bold">{user.name || "Nume necunoscut"}</div>
          <div className="text-gray-600">{user.email}</div>
          <div className="mt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
              ${user.role === "admin" ? "bg-yellow-200 text-yellow-800" : "bg-gray-200 text-gray-700"}`}>
              {user.role === "admin" ? "Administrator" : "User"}
            </span>
          </div>
        </div>
        {/* Buton logout */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsLoggedIn(false);
            setUser(null);
            navigate("/login");
          }}
          className="mt-6 bg-red-600 text-white py-2 px-6 rounded-xl hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
