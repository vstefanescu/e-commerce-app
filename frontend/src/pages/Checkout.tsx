import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { clearCart } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";

const Checkout = () => {
  const products = useSelector((state: RootState) => state.cart.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.address) {
      toast.error("Completează toate câmpurile!");
      return;
    }

    if (products.length === 0) {
      toast.error("Coșul este gol.");
      return;
    }

    // Simulăm trimiterea comenzii
    dispatch(clearCart());
    toast.success("Comandă trimisă cu succes!");
    navigate("/products");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Finalizare comandă</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nume complet"
          className="w-full border rounded p-2"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border rounded p-2"
        />
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Adresă de livrare"
          className="w-full border rounded p-2"
          rows={3}
        />

        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>{total.toFixed(2)} RON</span>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Trimite comanda
        </button>
      </form>
    </div>
  );
};

export default Checkout;
