import React from "react";
import { useState } from "react";
import { Header } from "./components/Header";
import { CategoryFilter } from "./components/CategoryFilter";
import { ProductCard, Product } from "./components/ProductCard";
import { ProductDetails } from "./components/ProductDetails";
import { SellItemForm } from "./components/SellItemForm";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { AIChatbox } from "./components/AIChatbox";
import { ProfilePage } from "./components/ProfilePage";
import { Dashboard } from "./components/Dashboard";
import { OrdersPage } from "./components/OrdersPage";
import { CartPage } from "./components/CartPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { HelpPage } from "./components/HelpPage";
import { SignUpPage } from "./components/SignUpPage";
import { LoginPage } from "./components/LoginPage";
import { SellerVerificationPage } from "./components/SellerVerificationPage";
import { EcoReels } from "./components/EcoReels";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

const mockProducts: Product[] = [
  {
    id: "1",
    title: "Vintage Oak Dining Table",
    price: 245,
    category: "furniture",
    condition: "Good",
    location: "Portland, OR",
    image: "https://images.unsplash.com/photo-1668955254766-1bb2de25cf16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xlZCUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NjI4ODI4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    seller: "Sarah Miller",
    description: "Beautiful reclaimed oak dining table. Seats 6 comfortably. Minor scratches add character. Perfect for sustainable living!"
  },
  {
    id: "2",
    title: "Vintage Denim Jacket Collection",
    price: 45,
    category: "clothing",
    condition: "Like New",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1614990354198-b06764dcb13c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYyODgyODA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    seller: "Mike Chen",
    description: "Classic denim jacket from the 90s. Excellent condition, just doesn't fit anymore. Sustainable fashion at its best!"
  },
  {
    id: "3",
    title: "Refurbished Laptop - Dell",
    price: 320,
    category: "electronics",
    condition: "Good",
    location: "Seattle, WA",
    image: "https://images.unsplash.com/photo-1695712551666-e0c354b1e6b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xlZCUyMGVsZWN0cm9uaWNzfGVufDF8fHx8MTc2Mjg4MjgwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    seller: "Tech Renewals",
    description: "Dell laptop professionally refurbished. 8GB RAM, 256GB SSD. Perfect for students or remote work. Saving e-waste!"
  },
  {
    id: "4",
    title: "Handmade Upcycled Wall Art",
    price: 85,
    category: "decor",
    condition: "Like New",
    location: "Denver, CO",
    image: "https://images.unsplash.com/photo-1694537709541-672813820324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cGN5Y2xlZCUyMGRlY29yfGVufDF8fHx8MTc2Mjg4MjgwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    seller: "Artisan Collective",
    description: "Unique wall art created from reclaimed wood and metal. Each piece tells a story. Makes a statement in any room!"
  },
  {
    id: "5",
    title: "Classic Literature Collection",
    price: 35,
    category: "books",
    condition: "Good",
    location: "Boston, MA",
    image: "https://images.unsplash.com/photo-1737205788369-77514fcab7b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWNvbmQlMjBoYW5kJTIwYm9va3N8ZW58MXx8fHwxNzYyODgyODA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    seller: "Book Lover",
    description: "Set of 12 classic novels. Well-loved but in great reading condition. Give these stories a new home!"
  },
  {
    id: "6",
    title: "Recycled Craft Materials Bundle",
    price: 20,
    category: "materials",
    condition: "Good",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1691430596599-d8268793294b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xlZCUyMG1hdGVyaWFsc3xlbnwxfHx8fDE3NjI4ODI4MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    seller: "Eco Crafts",
    description: "Assorted recycled materials perfect for DIY projects. Includes fabric scraps, buttons, wood pieces, and more!"
  },
  {
    id: "7",
    title: "Mid-Century Modern Chair",
    price: 175,
    category: "furniture",
    condition: "Like New",
    location: "Brooklyn, NY",
    image: "https://images.unsplash.com/photo-1649003366476-2d968f76d37a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZnVybml0dXJlJTIwd29vZHxlbnwxfHx8fDE3NjI4ODMwNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    seller: "Vintage Finds",
    description: "Beautifully restored mid-century modern chair. Reupholstered with sustainable fabric. A timeless piece for any home."
  },
  {
    id: "8",
    title: "Organic Cotton Tote Bag",
    price: 15,
    category: "clothing",
    condition: "Like New",
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1677753727712-c79ce4c420c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHNob3BwaW5nJTIwYmFnfGVufDF8fHx8MTc2Mjg4MzA0Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    seller: "Eco Shop",
    description: "Handcrafted organic cotton tote bag. Perfect for groceries or daily use. Say goodbye to single-use plastics!"
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? "home" : "login";
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSellForm, setShowSellForm] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    setCurrentPage("login");
    toast.success("Logged out successfully", {
      description: "Come back soon to continue your sustainable journey!",
      duration: 3000,
    });
  };

  const filteredProducts = mockProducts.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
    toast.success("Item added to cart!", {
      description: "Check your cart to proceed to checkout",
      duration: 3000,
    });
    setSelectedProduct(null);
  };

  const renderPage = () => {
    if (!isLoggedIn && ['dashboard', 'profile', 'orders', 'cart', 'checkout', 'sellerverification', 'ecoreels'].includes(currentPage)) {
      setCurrentPage('login');
      return null;
    }
    switch (currentPage) {
      case "ecoreels":
        return <EcoReels onClose={() => setCurrentPage("home")} />;
      case "profile":
        return <ProfilePage />;
      case "dashboard":
        return <Dashboard onNavigate={setCurrentPage} />;
      case "orders":
        return <OrdersPage />;
      case "cart":
        return <CartPage onNavigate={setCurrentPage} />;
      case "checkout":
        return <CheckoutPage onNavigate={setCurrentPage} />;
      case "help":
        return <HelpPage />;
      case "signup":
        return <SignUpPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case "login":
        return <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case "sellerverification":
        return <SellerVerificationPage />;
      default:
        return (
          <>
            <Hero onSellClick={() => setShowSellForm(true)} />
            
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <Stats />
              
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-gray-900 mb-1">Featured Products</h2>
                    <p className="text-gray-600 text-sm">Discover unique pre-loved items</p>
                  </div>
                  <span className="text-sm text-gray-500">{filteredProducts.length} items</span>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🔍</span>
                    </div>
                    <h3 className="text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your filters or search term</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              )}
            </main>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {currentPage !== 'ecoreels' && (
        <Header
          onSellClick={() => setShowSellForm(true)}
          onAIChatClick={() => setShowAIChat(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          cartCount={cartCount}
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      )}

      {renderPage()}

      <ProductDetails
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <SellItemForm
        open={showSellForm}
        onClose={() => setShowSellForm(false)}
      />

      <AIChatbox
        open={showAIChat}
        onClose={() => setShowAIChat(false)}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}