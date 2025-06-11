import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ role?: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setIsLoggedIn(!!token);
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">E-Commerce</Link>
      </div>
      <div>
        <Link className="mx-2" to="/products">
          Products
        </Link>
        <Link className="mx-2" to="/cart">
          Cart
        </Link>

        {isLoggedIn ? (
          <>
            <Link className="mx-2" to="/profile">
              Profile
            </Link>

            {user?.role === "admin" && (
              <Link
                className="mx-2 text-yellow-400 hover:text-yellow-300"
                to="/admin/users"
              >
                Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="mx-2 text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="mx-2" to="/login">
              Login
            </Link>
            <Link className="mx-2" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
