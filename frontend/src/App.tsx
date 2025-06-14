import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import NotAuthorized from "./pages/NotAuthorized";
import Checkout from "./pages/Checkout";
import AlertBox from "./components/AlertBox";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    role?: string;
    email?: string;
    name?: string;
  } | null>(null);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const triggerAlert = (message: string) => {
    setPopupMessage(message);
  };

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route
          path="/products/:id"
          element={<ProductDetails triggerAlert={triggerAlert} />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/profile" replace />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isLoggedIn ? <Navigate to="/profile" replace /> : <Register />
          }
        />
        <Route
          path="/profile"
          element={<Profile setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
        />
        <Route
          path="/admin/users"
          element={<AdminPanel isLoggedIn={isLoggedIn} user={user} />}
        />
        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>

      {popupMessage && (
        <AlertBox message={popupMessage} onClose={() => setPopupMessage("")} />
      )}
    </Router>
  );
}

export default App;
