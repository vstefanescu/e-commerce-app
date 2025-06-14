import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

type RegisterProps = {
  addToast: (msg: string) => void;
};

const Register = ({ addToast }: RegisterProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await api<{ token: string; user: object }>(
        '/api/auth/register',
        'POST',
        { email, name, password }
      );

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      addToast('Cont creat cu succes! Bine ai venit!');
      navigate('/profile');
    } catch (err: unknown) {
      let msg = "Eroare la crearea contului";
      if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
      addToast(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Register;
