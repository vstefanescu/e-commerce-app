import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

type NavbarProps = {
  isLoggedIn: boolean;
  user: { role?: string; email?: string; name?: string } | null;
  setIsLoggedIn: (value: boolean) => void;
  setUser: (user: { role?: string; email?: string; name?: string } | null) => void;
};

function Navbar({ isLoggedIn, user, setIsLoggedIn, setUser }: NavbarProps) {
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
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">E-Commerce</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link className="mx-2" to="/products">Products</Link>

        <Link className="mx-2 relative" to="/cart">
          Cart
          {cartQuantity > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartQuantity}
            </span>
          )}
        </Link>

        {isLoggedIn ? (
          <>
            <Link className="mx-2" to="/profile">Profile</Link>
            {user?.role === "admin" && (
              <Link className="mx-2 text-yellow-400 hover:text-yellow-300" to="/admin/users">
                Admin Panel
              </Link>
            )}
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