import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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

type ProductDetailsProps = {
  addToast: (message: string) => void;
};

function ProductDetails({ addToast }: ProductDetailsProps) {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/products");
      return;
    }
    api<Product>(`/api/products/${id}`, "GET")
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/products"); // daca produsul nu exista, redirect la lista
      });
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
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

  if (loading) return <div className="p-8 text-center">Se încarcă produsul...</div>;

  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto p-8 flex flex-col md:flex-row gap-10">
      {/* Imagine */}
      <div className="md:w-1/2 flex justify-center items-center overflow-hidden rounded-lg shadow-lg">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="object-contain w-full h-96 hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Detalii produs */}
      <div className="md:w-1/2 flex flex-col">
        <h1 className="text-4xl font-extrabold mb-4">{product.title}</h1>
        <p className="text-3xl font-bold text-indigo-600 mb-6">{product.price} RON</p>
        <p className="text-gray-700 mb-8 whitespace-pre-line">{product.description}</p>

        <button
          onClick={handleAddToCart}
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition font-semibold mb-6 max-w-max"
        >
          Adaugă în coș
        </button>

        <Link
          to="/products"
          className="text-indigo-600 hover:underline font-medium max-w-max"
        >
          &larr; Înapoi la produse
        </Link>
      </div>
    </div>
  );
}

export default ProductDetails;
