import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
};

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificare rapidă în consolă pentru debug
    console.log("ProductDetails PAGE MOUNTED", id);

    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!product) return <div className="p-8">Product not found.</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <img
        src={product.imageUrl}
        alt={product.title}
        className="w-full h-80 object-cover rounded mb-4"
      />
      <h2 className="text-3xl font-bold mb-2">{product.title}</h2>
      <p className="text-xl text-gray-600 mb-4">${product.price}</p>
      <p className="mb-6">{product.description}</p>
      <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Add to Cart
      </button>
    </div>
  );
}

export default ProductDetails;
