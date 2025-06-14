import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { removeFromCart, clearCart } from "../features/cartSlice";
import { Link } from "react-router-dom";

const Cart = () => {
  const products = useSelector((state: RootState) => state.cart.products);
  const dispatch = useDispatch();

  const total = products.reduce(
    (acc, prod) => acc + prod.price * prod.quantity,
    0
  );

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      {products.length === 0 ? (
        <div className="text-center text-gray-500">Cart is empty.</div>
      ) : (
        <>
          <ul className="space-y-4">
            {products.map((prod) => (
              <li
                key={prod.id}
                className="flex items-center justify-between bg-white rounded-2xl shadow p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div>
                    <div className="font-medium">{prod.title}</div>
                    <div className="text-sm text-gray-500">
                      {prod.price} RON x {prod.quantity}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(prod.id)}
                  className="text-red-500 font-bold hover:text-red-700 transition"
                  aria-label="Remove"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center mt-8 p-4 bg-gray-50 rounded-xl">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-lg">{total.toFixed(2)} RON</span>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handleClearCart}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Golește coșul
            </button>
            <Link
              to="/checkout"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
