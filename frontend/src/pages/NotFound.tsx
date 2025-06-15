import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-5xl font-extrabold text-red-600 mb-4 animate-pulse">
        404
      </h1>
      <p className="text-xl sm:text-2xl text-gray-700 font-semibold mb-6">
        Pagina căutată nu există.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
      >
        Înapoi la pagina principală
      </Link>
    </div>
  );
}
