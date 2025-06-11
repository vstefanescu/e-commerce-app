import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ role?: string } | null>(null);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    checkAuth();

    // Optional: când alt tab face login/logout
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    checkAuth(); // actualizează imediat navbarul
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">E-Commerce</Link>
      </div>
      <div>
        <Link className="mx-2" to="/products">Products</Link>
        <Link className="mx-2" to="/cart">Cart</Link>

        {isLoggedIn ? (
          <>
            {user?.role === "admin" && (
              <Link className="mx-2" to="/admin/users">Admin Panel</Link>
            )}
            <Link className="mx-2" to="/profile">Profile</Link>
            <button onClick={handleLogout} className="mx-2 text-red-400 hover:text-red-300">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="mx-2" to="/login">Login</Link>
            <Link className="mx-2" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
