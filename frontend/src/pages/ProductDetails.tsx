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

const ProductDetails = ({ addToast }: ProductDetailsProps) => {
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
        navigate("/products");
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

  if (loading)
    return (
      <div className="p-8 text-center text-lg text-gray-600">Se încarcă produsul...</div>
    );

  if (!product)
    return (
      <div className="p-8 text-center text-red-600">
        Produsul nu a fost găsit.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
      {/* Imagine produs */}
      <div className="md:w-1/2 flex flex-col items-start">
        {/* Breadcrumb */}
        <nav className="text-sm text-indigo-600 mb-4">
          <Link to="/products" className="hover:underline">
            Produse
          </Link>{" "}
          / <span className="text-gray-700">{product.title}</span>
        </nav>

        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] bg-white rounded-xl shadow-md overflow-hidden flex justify-center items-center">
          <img
            src={product.imageUrl || "/placeholder.jpg"}
            alt={product.title}
            className="object-contain w-full h-full transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Detalii produs */}
      <div className="md:w-1/2 flex flex-col justify-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
        <p className="text-xl sm:text-2xl text-indigo-600 font-semibold mb-6">
          {product.price} RON
        </p>
        <p className="text-gray-700 mb-8 whitespace-pre-line text-sm sm:text-base">
          {product.description}
        </p>

        <button
          onClick={handleAddToCart}
          aria-label={`Adaugă ${product.title} în coș`}
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition font-semibold w-full sm:w-max mb-4"
        >
          Adaugă în coș
        </button>

        <Link
          to="/products"
          className="text-indigo-600 hover:underline font-medium text-sm sm:text-base"
        >
          &larr; Înapoi la produse
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;