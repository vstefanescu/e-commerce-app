import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminProducts from "./pages/AdminProducts";
import UserEdit from "./pages/UserEdit";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotAuthorized from "./pages/NotAuthorized";
import NotFound from "./pages/NotFound";
import type { User } from "./types/User";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        const parsed = JSON.parse(userData) as User;
        setIsLoggedIn(true);
        setUser(parsed);
      } catch {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
      }
    }
    setAuthLoaded(true);
  }, []);

  const addToast = (msg: string) => {
    const id = Date.now();
    setToasts((prev) => {
      const updated = [...prev, { id, message: msg }];
      return updated.length > 5 ? updated.slice(updated.length - 5) : updated;
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (!authLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-indigo-600 font-bold text-xl">
          Se încarcă aplicația...
        </span>
      </div>
    );
  }

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
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Login
                setIsLoggedIn={setIsLoggedIn}
                setUser={setUser}
                addToast={addToast}
              />
            )
          }
        />
        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Register
                setIsLoggedIn={setIsLoggedIn}
                setUser={setUser}
                addToast={addToast}
              />
            )
          }
        />
        <Route
          path="/profile"
          element={
            <Profile
              setIsLoggedIn={setIsLoggedIn}
              setUser={setUser}
              addToast={addToast}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminDashboard
              isLoggedIn={isLoggedIn}
              user={user}
              authLoaded={authLoaded}
            />
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminUsers
              isLoggedIn={isLoggedIn}
              user={user}
              setIsLoggedIn={setIsLoggedIn}
              setUser={setUser}
              addToast={addToast}
              authLoaded={authLoaded}
            />
          }
        />
        <Route path="/admin/users/:id/edit" element={<UserEdit />} />
        <Route
          path="/admin/products"
          element={<AdminProducts addToast={addToast} />}
        />
        <Route path="/products" element={<Products addToast={addToast} />} />
        <Route
          path="/products/:id"
          element={<ProductDetails addToast={addToast} />}
        />
        <Route path="/cart" element={<Cart addToast={addToast} />} />
        <Route path="/checkout" element={<Checkout addToast={addToast} />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Toasts cu efect smooth și dismiss la click */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 ease-out transform animate-slide-fade cursor-pointer"
            onClick={() => removeToast(toast.id)}
            title="Click pentru a închide"
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Animatie fade + slide-in */}
      <style>
        {`
          @keyframes slideFadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slide-fade {
            animation: slideFadeIn 0.4s ease-out;
          }
        `}
      </style>
    </Router>
  );
}

export default App;