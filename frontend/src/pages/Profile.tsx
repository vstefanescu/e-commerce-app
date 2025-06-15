import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { User } from "../types/User";

type ProfileProps = {
  setIsLoggedIn: (v: boolean) => void;
  setUser: (u: User | null) => void;
  addToast: (msg: string) => void;
};

function getInitials(name?: string, email?: string) {
  if (name && name.length > 0) {
    return name
      .split(" ")
      .map((word) => word[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2);
  }
  if (email) return email[0]?.toUpperCase() || "";
  return "U";
}

const Profile = ({ setIsLoggedIn, setUser, addToast }: ProfileProps) => {
  const navigate = useNavigate();
  const [user, setUserProfile] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Lipsă token. Nu ești autentificat.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await api<{ message: string; user: User }>(
          "/api/user/profile",
          "GET",
          undefined,
          token
        );
        setUserProfile(data.user);
      } catch (err) {
        setError("Token invalid sau profil inexistent.");
      }
    };

    fetchProfile();
  }, []);

  if (error)
    return (
      <div className="text-red-600 text-center mt-12 text-lg font-semibold px-4">
        {error}
      </div>
    );

  if (!user)
    return (
      <div className="text-center mt-12 text-gray-600 text-lg font-medium px-4">
        Se încarcă profilul...
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gray-50 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 max-w-sm w-full flex flex-col items-center text-center">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-indigo-100 flex items-center justify-center mb-6 sm:mb-8 text-3xl sm:text-4xl text-indigo-700 font-extrabold shadow-md">
          {getInitials(user.name, user.email)}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{user.name || "Nume necunoscut"}</h2>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">{user.email}</p>
        <span
          className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${
            user.role === "admin"
              ? "bg-yellow-300 text-yellow-900"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          {user.role === "admin" ? "Administrator" : "User"}
        </span>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsLoggedIn(false);
            setUser(null);
            addToast("Te-ai delogat cu succes!");
            navigate("/login");
          }}
          className="mt-6 sm:mt-8 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-full shadow-md transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
