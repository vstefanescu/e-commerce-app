import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

interface User {
  userId: number;
  email?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('🚫 No token found. Redirecting to login.');
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await api<{ message: string; user: User }>('/api/profile');
        setUser(data.user);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred.');
        }
        console.error('Profile fetch failed:', err);
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;
  if (!user) return <div className="text-center mt-8">Loading profile...</div>;

    return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow text-center">
        <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
        <p><strong>User ID:</strong> {user.userId}</p>
        <p><strong>Email:</strong> {user.email}</p>

        <button
        onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }}
        className="mt-6 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
        Logout
        </button>
    </div>
    );
};


export default Profile;
