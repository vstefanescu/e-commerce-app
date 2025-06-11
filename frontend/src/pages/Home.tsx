import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

type Product = {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
};

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Product[]>("/api/products", "GET")
      .then(data => {
        setProducts(data.slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO BANNER */}
      <div className="flex flex-col items-center justify-center h-[70vh] bg-gradient-to-br from-blue-100 to-indigo-100">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 text-center drop-shadow-lg">
          Welcome to <span className="text-indigo-600">E-Commerce Demo</span>!
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 mb-8 text-center max-w-2xl">
          Discover products, manage your cart, and explore admin features. <br />
          This is a modern full-stack demo built with React, Node, Prisma & PostgreSQL.
        </p>
        <Link
          to="/products"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg font-semibold text-lg transition"
        >
          Explore Products
        </Link>
      </div>
      {/* GRID PRODUSE */}
      <div className="mt-16 w-full max-w-6xl px-4 mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Products</h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map(product => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition flex flex-col items-center"
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="h-32 object-contain mb-4"
                />
                <div className="font-semibold mb-1 text-center">{product.title}</div>
                <div className="text-indigo-600 font-bold text-lg mb-2">
                  {product.price} RON
                </div>
                <span className="text-indigo-500 underline text-sm">
                  See details
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
