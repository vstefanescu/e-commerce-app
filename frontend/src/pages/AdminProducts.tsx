import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Product = {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
};

type AdminProductsProps = {
  addToast: (msg: string) => void;
};

const AdminProducts = ({ addToast }: AdminProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");
        const data = await api<Product[]>("/api/products", "GET", undefined, token);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError("Nu s-au putut încărca produsele.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      await api(`/api/products/${id}`, "DELETE", undefined, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      addToast("Produs șters cu succes!");
    } catch {
      addToast("Eroare la ștergerea produsului.");
    }
  };

  const validateProductInput = () => {
    if (title.trim().length < 3) {
      addToast("Titlul trebuie să conțină minim 3 caractere.");
      return false;
    }
    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      addToast("Prețul trebuie să fie un număr pozitiv.");
      return false;
    }
    if (!imageUrl.trim().startsWith("http")) {
      addToast("URL-ul imaginii trebuie să înceapă cu http:// sau https://");
      return false;
    }
    if (description.trim().length < 10) {
      addToast("Descrierea trebuie să conțină cel puțin 10 caractere.");
      return false;
    }
    return true;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);

    if (!validateProductInput()) {
      setAddLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      const priceNumber = parseFloat(price);
      const newProd = await api<Product>(
        "/api/products",
        "POST",
        {
          title: title.trim(),
          price: priceNumber,
          imageUrl: imageUrl.trim(),
          description: description.trim(),
        },
        token
      );
      setProducts((prev) => [newProd, ...prev]);
      addToast("Produs adăugat cu succes!");
      setTitle("");
      setPrice("");
      setImageUrl("");
      setDescription("");
      setShowAdd(false);
    } catch {
      addToast("Eroare la adăugarea produsului.");
    }
    setAddLoading(false);
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setTitle(product.title);
    setPrice(product.price.toString());
    setImageUrl(product.imageUrl);
    setDescription(product.description);
    setShowAdd(false);
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    setEditLoading(true);

    if (!validateProductInput()) {
      setEditLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      const priceNumber = parseFloat(price);
      const updated = await api<Product>(
        `/api/products/${editProduct.id}`,
        "PUT",
        {
          title: title.trim(),
          price: priceNumber,
          imageUrl: imageUrl.trim(),
          description: description.trim(),
        },
        token
      );
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setEditProduct(null);
      setTitle("");
      setPrice("");
      setImageUrl("");
      setDescription("");
      addToast("Produs editat cu succes!");
    } catch {
      addToast("Eroare la editarea produsului.");
    }
    setEditLoading(false);
  };

  const handleCancelEdit = () => {
    setEditProduct(null);
    setTitle("");
    setPrice("");
    setImageUrl("");
    setDescription("");
  };

  if (loading)
    return <div className="p-8 text-center">Se încarcă produsele...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Panou Administrare Produse</h1>
      <div className="mb-6 flex justify-end">
        <button
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          onClick={() => {
            setEditProduct(null);
            setShowAdd(true);
            setTitle("");
            setPrice("");
            setImageUrl("");
            setDescription("");
          }}
        >
          + Adaugă produs nou
        </button>
      </div>

      {(showAdd || editProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full relative">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-red-600 text-xl font-bold"
              onClick={() => {
                setShowAdd(false);
                handleCancelEdit();
              }}
              title="Închide"
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {editProduct ? "Editează produs" : "Adaugă produs nou"}
            </h2>
            <form onSubmit={editProduct ? handleEditProduct : handleAddProduct} className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Titlu</label>
                <input type="text" className="w-full border rounded p-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Preț (RON)</label>
                <input type="number" className="w-full border rounded p-2" value={price} onChange={(e) => setPrice(e.target.value)} required min={0} step="any" />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Imagine (URL)</label>
                <input type="text" className="w-full border rounded p-2" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Descriere</label>
                <textarea className="w-full border rounded p-2 min-h-[80px]" value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <button type="submit" className="w-full bg-green-700 text-white py-2 rounded font-bold hover:bg-green-800 transition" disabled={addLoading || editLoading}>
                {editProduct ? (editLoading ? "Se salvează..." : "Salvează modificările") : (addLoading ? "Se adaugă..." : "Adaugă produs")}
              </button>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-green-100 text-green-700">
            <th className="border border-gray-300 p-3 text-left">Titlu</th>
            <th className="border border-gray-300 p-3 text-left">Preț</th>
            <th className="border border-gray-300 p-3 text-left">Imagine</th>
            <th className="border border-gray-300 p-3 text-left">Descriere</th>
            <th className="border border-gray-300 p-3 text-center">Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-green-50">
              <td className="border border-gray-300 p-3">{product.title}</td>
              <td className="border border-gray-300 p-3">{product.price} RON</td>
              <td className="border border-gray-300 p-3">
                <img src={product.imageUrl} alt={product.title} className="w-16 h-16 object-cover rounded" />
              </td>
              <td className="border border-gray-300 p-3 max-w-xs overflow-auto">{product.description}</td>
              <td className="border border-gray-300 p-3 flex gap-2 justify-center">
                <button className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded hover:bg-yellow-500 transition" onClick={() => handleEdit(product)}>Edit</button>
                <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition" onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
