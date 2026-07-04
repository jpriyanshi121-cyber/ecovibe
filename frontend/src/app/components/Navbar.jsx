import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌿</span>
            <span className="font-bold text-xl">EcoVibe</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-green-200 transition">
              Home
            </Link>
            <Link to="/products" className="hover:text-green-200 transition">
              Shop
            </Link>
            {token ? (
              <>
                <Link to="/dashboard" className="hover:text-green-200 transition">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-200 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block hover:text-green-200">
              Home
            </Link>
            <Link to="/products" className="block hover:text-green-200">
              Shop
            </Link>
            {token ? (
              <>
                <Link to="/dashboard" className="block hover:text-green-200">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-red-500 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-green-200">
                  Login
                </Link>
                <Link to="/register" className="block hover:text-green-200">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;