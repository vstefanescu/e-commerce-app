import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";

type Product = {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
};

type ProductsProps = {
  addToast: (message: string) => void;
};

function Products({ addToast }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    api<Product[]>("/api/products", "GET")
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddToCart = (product: Product) => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      })
    );
    addToast("Produsul a fost adăugat în coș!");
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Produse</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col"
          >
            {/* Container imagine */}
            <div className="relative overflow-hidden rounded-t-lg h-64 mb-4">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Titlu și preț */}
            <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
            <p className="text-indigo-600 font-bold text-xl mb-2">{product.price} RON</p>

            {/* Descriere - scrollabilă, înălțime fixă */}
            <p className="text-sm text-gray-700 mb-4 overflow-y-auto max-h-24">
              {product.description}
            </p>

            {/* Butoane */}
            <div className="mt-auto flex gap-2">
              <Link
                to={`/products/${product.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex-grow text-center"
              >
                Vezi detalii
              </Link>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex-grow"
              >
                Adaugă în coș
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
