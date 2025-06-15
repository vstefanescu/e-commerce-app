import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");
        const data = await api<Product[]>(
          "/api/products",
          "GET",
          undefined,
          token
        );
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
    if (!imageUrl && !imageFile) {
      addToast("Trebuie să încarci o imagine.");
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

      let finalImageUrl = imageUrl.trim();

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Upload failed");

        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.imageUrl;

        // 🔥 Suprascriem blob-ul cu URL-ul real din backend
        setImageUrl(finalImageUrl);
      }

      const priceNumber = parseFloat(price);
      const newProd = await api<Product>(
        "/api/products",
        "POST",
        {
          title: title.trim(),
          price: priceNumber,
          imageUrl: finalImageUrl,
          description: description.trim(),
        },
        token
      );

      setProducts((prev) => [newProd, ...prev]);
      addToast("Produs adăugat cu succes!");

      // Resetăm formularul
      setTitle("");
      setPrice("");
      setImageUrl("");
      setDescription("");
      setImageFile(null);
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
    setImageFile(null);
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

      let finalImageUrl = imageUrl.trim();

      // 🔁 Dacă s-a selectat un fișier nou, îl urcăm pe server
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Upload failed");

        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.imageUrl;

        // 👇 salvăm URL-ul permanent în state, dacă vrei preview
        setImageUrl(finalImageUrl);
      }

      const priceNumber = parseFloat(price);
      const updated = await api<Product>(
        `/api/products/${editProduct.id}`,
        "PUT",
        {
          title: title.trim(),
          price: priceNumber,
          imageUrl: finalImageUrl,
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
      setImageFile(null);
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
    setImageFile(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setImageFile(acceptedFiles[0]);
        setImageUrl(URL.createObjectURL(acceptedFiles[0]));
      }
    },
  });

  if (loading)
    return <div className="p-8 text-center">Se încarcă produsele...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        Panou Administrare Produse
      </h1>

      <div className="mb-6 flex justify-end">
        <button
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          onClick={() => {
            setEditProduct(null);
            setShowAdd(true);
            setTitle("");
            setPrice("");
            setImageUrl("");
            setImageFile(null);
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
            <form
              onSubmit={editProduct ? handleEditProduct : handleAddProduct}
              className="space-y-4"
            >
              <input
                type="text"
                className="w-full border rounded p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Titlu"
              />
              <input
                type="number"
                className="w-full border rounded p-2"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min={0}
                step="any"
                placeholder="Preț"
              />
              <div
                {...getRootProps({
                  className:
                    "w-full border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition",
                })}
              >
                <input {...getInputProps()} />
                <p className="text-sm text-gray-600">
                  Trage o imagine aici sau apasă pentru a selecta una
                </p>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Previzualizare"
                    className="mt-2 mx-auto max-h-40 object-contain rounded"
                  />
                )}
              </div>
              <textarea
                className="w-full border rounded p-2 min-h-[80px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Descriere"
              />
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-2 rounded font-bold hover:bg-green-800 transition"
                disabled={addLoading || editLoading}
              >
                {editProduct
                  ? editLoading
                    ? "Se salvează..."
                    : "Salvează modificările"
                  : addLoading
                  ? "Se adaugă..."
                  : "Adaugă produs"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-xl shadow p-4 flex flex-col"
          >
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-40 object-contain rounded mb-4"
            />
            <h3 className="text-lg font-semibold mb-1">{product.title}</h3>
            <p className="text-green-700 font-bold mb-2">{product.price} RON</p>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {product.description}
            </p>
            <div className="mt-auto flex gap-2">
              <button
                className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded hover:bg-yellow-500 transition text-sm w-full"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm w-full"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
