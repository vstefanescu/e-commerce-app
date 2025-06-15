import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { removeFromCart, clearCart } from "../features/cartSlice";
import { Link } from "react-router-dom";

type CartProps = {
  addToast: (message: string) => void;
};

const Cart = ({ addToast }: CartProps) => {
  const products = useSelector((state: RootState) => state.cart.products);
  const dispatch = useDispatch();

  const total = products.reduce(
    (acc, prod) => acc + prod.price * prod.quantity,
    0
  );

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
    addToast("Produsul a fost eliminat din coș");
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    addToast("Coșul a fost golit");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Coșul tău de cumpărături</h1>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-20">
          Coșul este gol.
          <Link
            to="/products"
            className="text-indigo-600 hover:underline ml-2 font-semibold"
          >
            Vezi produse
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {products.map((prod) => (
              <li
                key={prod.id}
                className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-xl shadow-md p-4 gap-4"
              >
                <div className="flex flex-col sm:flex-row items-center sm:gap-5 w-full">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1 mt-3 sm:mt-0 text-center sm:text-left">
                    <h3 className="font-semibold text-lg">{prod.title}</h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      {prod.price} RON x {prod.quantity}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(prod.id)}
                  className="text-red-600 font-semibold hover:text-red-700 transition text-lg"
                  aria-label={`Elimină ${prod.title}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center mt-10 p-6 bg-gray-50 rounded-xl shadow-inner font-bold text-xl">
            <span>Total:</span>
            <span>{total.toFixed(2)} RON</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
            <button
              onClick={handleClearCart}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold w-full sm:w-auto"
            >
              Golește coșul
            </button>
            <Link
              to="/checkout"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold w-full sm:w-auto text-center"
            >
              Continuă spre Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
