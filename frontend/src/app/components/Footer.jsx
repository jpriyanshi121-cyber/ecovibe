import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">🌿 EcoVibe</h3>
            <p className="text-sm">
              A sustainable marketplace for pre-loved eco-friendly items. 
              Reduce waste, save money, save the planet.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-green-400">Home</a></li>
              <li><a href="/products" className="hover:text-green-400">Shop</a></li>
              <li><a href="#" className="hover:text-green-400">About Us</a></li>
              <li><a href="#" className="hover:text-green-400">Contact</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-400">Twitter</a>
              <a href="#" className="hover:text-green-400">Instagram</a>
              <a href="#" className="hover:text-green-400">Facebook</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 EcoVibe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;