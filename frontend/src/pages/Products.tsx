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
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-semibold">{product.title}</h3>
            <p className="text-gray-500 mb-2">${product.price}</p>
            <p className="text-sm text-gray-700 mb-4">{product.description}</p>
            <div className="flex gap-2">
              <Link
                to={`/products/${product.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                View Details
              </Link>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
