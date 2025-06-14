import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
};

type ProductDetailsProps = {
  addToast: (message: string) => void;
};

function ProductDetails({ addToast }: ProductDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;

    // Ai grijă la ruta! /products/:id dacă ai setat în backend ca /api/products/:id
    api<Product>(`/products/${id}`, "GET")
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity: 1 }));
      addToast("Produsul a fost adăugat în coș!");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!product) return <div className="p-8">Produsul nu a fost găsit.</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <img
        src={product.imageUrl}
        alt={product.title}
        className="w-full h-80 object-cover rounded mb-4"
      />
      <h2 className="text-3xl font-bold mb-2">{product.title}</h2>
      <p className="text-xl text-gray-600 mb-4">{product.price} RON</p>
      <p className="mb-6">{product.description}</p>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        onClick={handleAddToCart}
      >
        Adaugă în coș
      </button>
    </div>
  );
}

export default ProductDetails;