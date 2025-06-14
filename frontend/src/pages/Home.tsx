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
        setProducts(data.slice(0, 4)); // primele 4 produse recomandate
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Banner principal */}
      <section className="bg-gradient-to-r from-indigo-200 via-white to-indigo-200 rounded-lg p-12 mb-12 shadow-lg text-center">
        <h1 className="text-5xl font-extrabold text-indigo-800 mb-4">
          Bine ai venit în Market!
        </h1>
        <p className="text-xl mb-8 text-gray-700 max-w-3xl mx-auto">
          Descoperă selecția noastră de produse recomandate, adaugă în coș și bucură-te de o experiență modernă de cumpărături online.
        </p>
        <Link
          to="/products"
          className="inline-block px-10 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Vezi toate produsele
        </Link>
      </section>

      {/* Produse recomandate */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 text-indigo-700">Produse recomandate</h2>

        {loading ? (
          <div className="text-center text-gray-500">Se încarcă produse...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-lg shadow hover:shadow-xl transition p-4 flex flex-col items-center"
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="h-36 object-contain mb-4"
                />
                <h3 className="font-semibold text-lg text-center">{product.title}</h3>
                <p className="text-indigo-600 font-bold text-xl mt-2">{product.price} RON</p>
                <span className="text-indigo-500 underline mt-2 text-sm">Detalii produs</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
