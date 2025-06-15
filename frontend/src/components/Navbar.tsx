import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import type { User } from "../types/User";

type NavbarProps = {
  isLoggedIn: boolean;
  user: User | null;
  setIsLoggedIn: (value: boolean) => void;
  setUser: (user: User | null) => void;
};

export default function Navbar({ isLoggedIn, user, setIsLoggedIn, setUser }: NavbarProps) {
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.products);
  const cartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-indigo-700 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-tight">
          <Link to="/" className="hover:text-indigo-300 transition">
            Market
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="sm:hidden text-white text-2xl focus:outline-none"
        >
          ☰
        </button>

        {/* Menu */}
        <div className={`flex-col sm:flex sm:flex-row sm:items-center gap-6 text-lg font-medium ${menuOpen ? "flex" : "hidden"} sm:flex`}>
          <Link to="/products" className="hover:text-indigo-300 transition">
            Produse
          </Link>

          <Link to="/cart" className="relative hover:text-indigo-300 transition">
            Coș
            {cartQuantity > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartQuantity}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/profile" className="hover:text-indigo-300 transition">
                Profil
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-yellow-300 hover:text-yellow-400 transition font-semibold"
                >
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition text-sm font-semibold whitespace-nowrap"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-300 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-indigo-300 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}