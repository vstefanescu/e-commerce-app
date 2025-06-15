import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

type Product = {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Product[]>("/api/products", "GET")
      .then((data) => {
        setProducts(data.slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Banner principal */}
      <section className="bg-gradient-to-r from-indigo-200 via-white to-indigo-200 rounded-2xl p-10 sm:p-16 mb-12 shadow-xl text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-800 mb-4">
          Bine ai venit în Market!
        </h1>
        <p className="text-lg sm:text-xl mb-8 text-gray-700 max-w-3xl mx-auto">
          Descoperă selecția noastră de produse recomandate, adaugă în coș și bucură-te de o experiență modernă de cumpărături online.
        </p>
        <Link
          to="/products"
          className="inline-block px-8 sm:px-10 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Vezi toate produsele
        </Link>
      </section>

      {/* Produse recomandate */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-indigo-700">
          Produse recomandate
        </h2>

        {loading ? (
          <div className="text-center text-gray-500 py-10 text-lg animate-pulse">
            Se încarcă produse...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-600">Momentan nu sunt produse disponibile.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-4 flex flex-col items-center group"
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="h-36 object-contain mb-4 transition-transform duration-300 group-hover:scale-105"
                />
                <h3 className="font-semibold text-center text-lg">{product.title}</h3>
                <p className="text-indigo-600 font-bold text-xl mt-2">{product.price} RON</p>
                <span className="text-indigo-500 underline mt-1 text-sm">
                  Detalii produs
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}