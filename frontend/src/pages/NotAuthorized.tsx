import { Link } from "react-router-dom";

export default function NotAuthorized() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-4xl font-extrabold text-yellow-500 mb-3">
        Acces restricționat
      </h2>
      <p className="text-lg text-gray-700 mb-6">
        Nu ai permisiunea să accesezi această pagină. Poți reveni la homepage sau accesa o zonă autorizată.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
      >
        Înapoi la homepage
      </Link>
    </div>
  );
}
