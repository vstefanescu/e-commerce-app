import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/cartSlice";
import type { RootState } from "../store";

type CheckoutProps = {
  addToast: (msg: string) => void;
};

const Checkout = ({ addToast }: CheckoutProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.products);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulăm procesarea comenzii
      setTimeout(() => {
        dispatch(clearCart()); // Golim coșul
        setLoading(false);
        addToast("Comanda ta a fost plasată cu succes!");
        navigate("/");
      }, 1500);
    } catch (error) {
      setLoading(false);
      addToast("Eroare la plasarea comenzii. Încearcă din nou.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] px-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-indigo-700">
          Finalizează comanda
        </h2>

        {/* Rezumat produse */}
        {cartItems.length > 0 && (
          <div className="mb-6 border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-2">Produsele tale:</h3>
            <ul className="text-sm space-y-1">
              {cartItems.map((item) => (
                <li key={item.id}>
                  {item.title} — {item.quantity} x {item.price} RON
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Nume complet"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Adresa livrare"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Număr telefon"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <div>
            <label className="font-semibold mb-2 block">Metodă plată:</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="card">Card bancar</option>
              <option value="cash">Cash la livrare</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold text-white ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } transition`}
          >
            {loading ? "Se procesează..." : "Plasează comanda"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
