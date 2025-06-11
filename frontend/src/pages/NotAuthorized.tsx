function NotAuthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <h2 className="text-3xl font-bold text-red-600 mb-4">Access denied</h2>
      <p className="text-lg">Nu ai permisiunea să accesezi această pagină.</p>
    </div>
  );
}

export default NotAuthorized;
