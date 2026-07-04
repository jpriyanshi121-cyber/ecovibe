import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🌿 Rethink Waste. Live Sustainable.
          </h1>
          <p className="text-xl mb-8">
            Buy and sell pre-loved eco-friendly items on EcoVibe
          </p>
          <Link
            to="/products"
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why EcoVibe?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-4xl mb-4">♻️</div>
              <h3 className="text-xl font-bold mb-2">Circular Economy</h3>
              <p className="text-gray-600">
                Give products a second life and reduce landfill waste
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-4xl mb-4">💚</div>
              <h3 className="text-xl font-bold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                Support sustainable products and sellers
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Save Money</h3>
              <p className="text-gray-600">
                Get quality items at affordable prices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
          <p className="text-lg mb-8">
            Join thousands making a positive impact on the planet
          </p>
          <Link
            to="/register"
            className="bg-white text-green-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;