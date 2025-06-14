import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api'; 

type LoginProps = {
  setIsLoggedIn: (value: boolean) => void;
  setUser: (user: { role?: string } | null) => void;
  addToast: (msg: string) => void;
};

const Login = ({ setIsLoggedIn, setUser, addToast }: LoginProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await api<{ token: string; user: { role?: string } }>(
        '/api/auth/login',
        'POST',
        { email, password }
      );

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsLoggedIn(true);
      setUser(data.user);
      addToast("Autentificare reușită!");
      navigate('/profile');
    } catch (err: unknown) {
      let msg = "Autentificare eșuată";
      if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
      addToast(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Log in
        </button>
      </form>
    </div>
  );
};

export default Login;
