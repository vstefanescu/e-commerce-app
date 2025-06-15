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

  if (loading)
    return (
      <div className="p-8 text-center text-lg font-semibold text-gray-500">
        Se încarcă produsele...
      </div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">Produsele Noastre</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 p-4 flex flex-col"
          >
            <div className="overflow-hidden rounded-xl h-48 flex items-center justify-center bg-gray-100 mb-4">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-1">{product.title}</h3>
            <p className="text-indigo-600 font-bold text-lg mb-2">{product.price} RON</p>

            <p className="text-gray-600 text-sm mb-4 line-clamp-4">
              {product.description}
            </p>

            <div className="mt-auto flex flex-col sm:flex-row gap-2">
              <Link
                to={`/products/${product.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition w-full"
              >
                Vezi detalii
              </Link>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full"
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
