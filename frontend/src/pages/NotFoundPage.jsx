import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Page not found</p>
      <Link
        to="/"
        className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;