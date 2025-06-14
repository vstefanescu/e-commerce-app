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
import ToastList from "./components/ToastList";

type Toast = {
  id: number;
  message: string;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ role?: string; email?: string; name?: string } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const addToast = (message: string) => {
    setToasts((prev) => {
      if (prev.length >= 5) {
        return [...prev.slice(1), { id: Date.now() + Math.random(), message }];
      }
      return [...prev, { id: Date.now() + Math.random(), message }];
    });
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
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
        {/* Home nu primește props deoarece nu le folosește */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products addToast={addToast} />} />
        <Route path="/products/:id" element={<ProductDetails addToast={addToast} />} />
        <Route path="/cart" element={<Cart addToast={addToast} />} />
        <Route path="/checkout" element={<Checkout addToast={addToast} />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/profile" replace />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} addToast={addToast} />
            )
          }
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/profile" replace /> : <Register addToast={addToast} />}
        />
        <Route
          path="/profile"
          element={<Profile setIsLoggedIn={setIsLoggedIn} setUser={setUser} addToast={addToast} />}
        />
        <Route path="/admin/users" element={<AdminPanel isLoggedIn={isLoggedIn} user={user} />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>

      <ToastList toasts={toasts} removeToast={removeToast} />
    </Router>
  );
}

export default App;
