import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { User } from "../types/User";

type LoginProps = {
  setIsLoggedIn: (value: boolean) => void;
  setUser: (user: User | null) => void;
  addToast: (msg: string) => void;
};

const Login = ({ setIsLoggedIn, setUser, addToast }: LoginProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api<{ token: string; user: User }>("/api/auth/login", "POST", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsLoggedIn(true);
      setUser(data.user);
      addToast("Autentificare reușită!");
      navigate("/profile");
    } catch (err: unknown) {
      let msg = "Autentificare eșuată";
      if (err instanceof Error) msg = err.message;
      setError(msg);
      addToast(msg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-indigo-700">
          Autentificare
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-center text-sm sm:text-base font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Parolă"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            Autentificare
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
