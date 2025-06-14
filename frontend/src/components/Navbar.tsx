import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

type NavbarProps = {
  isLoggedIn: boolean;
  user: { role?: string; email?: string; name?: string } | null;
  setIsLoggedIn: (value: boolean) => void;
  setUser: (user: { role?: string; email?: string; name?: string } | null) => void;
};

export default function Navbar({ isLoggedIn, user, setIsLoggedIn, setUser }: NavbarProps) {
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.products);
  const cartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-2xl font-extrabold tracking-tight">
        <Link to="/" className="hover:text-indigo-300 transition">
          Market
        </Link>
      </div>

      <div className="flex items-center space-x-6 text-lg font-medium">
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
                to="/admin/users"
                className="text-yellow-300 hover:text-yellow-400 transition font-semibold"
              >
                Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="ml-4 bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition text-white font-semibold"
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
    </nav>
  );
}
