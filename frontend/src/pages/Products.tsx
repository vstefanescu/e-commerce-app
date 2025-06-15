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

const PRODUCTS_PER_PAGE = 6;

function Products({ addToast }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    setPage(1);
  }, [search, minPrice, maxPrice]);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams({
      page: String(page),
      limit: String(PRODUCTS_PER_PAGE),
    });

    if (search.trim()) params.append("search", search.trim());
    if (minPrice && Number(minPrice) >= 0) params.append("minPrice", minPrice);
    if (maxPrice && Number(maxPrice) > 0) params.append("maxPrice", maxPrice);

    api<{ products: Product[]; total: number }>(`/api/products?${params.toString()}`, "GET")
      .then((data) => {
        if (data.products.length === 0 && page > 1) {
          setPage(1);
        } else {
          setProducts(data.products);
          setTotal(data.total);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [page, search, minPrice, maxPrice]);

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

  const handleResetFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        Produsele Noastre
      </h2>

      {/* Filtre */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="Caută după titlu..."
          className="border px-3 py-2 rounded-md shadow-sm w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Preț minim"
          min={0}
          className="border px-3 py-2 rounded-md shadow-sm w-32"
          value={minPrice}
          onChange={(e) => {
            const value = e.target.value;
            if (Number(value) >= 0 || value === "") {
              setMinPrice(value);
            }
          }}
        />
        <input
          type="number"
          placeholder="Preț maxim"
          min={0}
          className="border px-3 py-2 rounded-md shadow-sm w-32"
          value={maxPrice}
          onChange={(e) => {
            const value = e.target.value;
            if (Number(value) >= 0 || value === "") {
              setMaxPrice(value);
            }
          }}
        />
        <button
          onClick={handleResetFilters}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm"
        >
          Resetează filtrele
        </button>
      </div>

      {/* Produse */}
      {loading ? (
        <div className="text-center text-gray-600 text-lg font-medium">
          Se încarcă produsele...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-red-500 font-semibold text-lg">
          Niciun produs găsit.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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

              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {product.title}
              </h3>
              <p className="text-indigo-600 font-bold text-lg mb-2">
                {product.price} RON
              </p>

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
      )}

      {/* Paginare */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                i + 1 === page
                  ? "bg-indigo-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;