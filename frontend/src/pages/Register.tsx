import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { User } from "../types/User";

type RegisterProps = {
  addToast: (msg: string) => void;
  setIsLoggedIn: (v: boolean) => void;
  setUser: (u: User | null) => void;
};

const Register = ({ addToast, setIsLoggedIn, setUser }: RegisterProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await api<{ token: string; user: User }>(
        "/api/auth/register",
        "POST",
        { email, name, password }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsLoggedIn(true);
      setUser(data.user);
      addToast("Cont creat cu succes! Bine ai venit!");
      navigate("/profile");
    } catch (err: unknown) {
      let msg = "Eroare la crearea contului";
      if (err instanceof Error) msg = err.message;
      setError(msg);
      addToast(msg);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-green-700">
          Înregistrează-te
        </h2>

        {error && (
          <p className="text-red-600 text-center font-medium mb-4 text-sm sm:text-base">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
          <input
            type="text"
            placeholder="Nume"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Parolă"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
          >
            Creează cont
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
