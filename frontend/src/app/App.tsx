import React from "react";
import { useState, useEffect } from "react";
import { apiFetch, getImageUrl } from "../lib/api";
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
  const [cartItems, setCartItems] = useState<{ productId: string; quantity: number }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("cartItems") || "[]");
    } catch {
      return [];
    }
  });
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);

  const loadProducts = async () => {
    setProductsLoading(true);
    setProductsError(false);
    try {
      const data = await apiFetch("/products");
      const mapped: Product[] = (data.products || []).map((p: any) => ({
        id: p._id,
        title: p.name,
        price: p.price,
        category: p.category,
        condition: p.condition || "Good",
        location: p.location || "",
        image: getImageUrl(p.images?.[0]) || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800",
        seller: p.seller?.name || "EcoVibe Seller",
        description: p.description,
      }));
      setProducts(mapped);
    } catch (err) {
      setProductsError(true);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

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

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { productId: product.id, quantity: 1 }];
    });
    toast.success("Item added to cart!", {
      description: "Check your cart to proceed to checkout",
      duration: 3000,
    });
    setSelectedProduct(null);
  };

  const updateCartQuantity = (productId: string, change: number) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.max(1, i.quantity + change) } : i
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  // Full cart items with product details joined in, for CartPage/CheckoutPage display
  const cartItemsWithDetails = cartItems
    .map((ci) => {
      const product = products.find((p) => p.id === ci.productId);
      return product ? { ...product, quantity: ci.quantity } : null;
    })
    .filter((i): i is Product & { quantity: number } => i !== null);

  const renderPage = () => {
    if (!isLoggedIn && ['dashboard', 'profile', 'orders', 'cart', 'checkout', 'sellerverification', 'ecoreels'].includes(currentPage)) {
      setCurrentPage('login');
      return null;
    }
    switch (currentPage) {
      case "ecoreels":
        return (
          <EcoReels
            onClose={() => setCurrentPage("home")}
            onShopProduct={(productId) => {
              const found = products.find((p) => p.id === productId);
              setCurrentPage("home");
              if (found) setSelectedProduct(found);
            }}
          />
        );
      case "profile":
        return <ProfilePage />;
      case "dashboard":
        return <Dashboard onNavigate={setCurrentPage} onAddItem={() => setShowSellForm(true)} />;
      case "orders":
        return <OrdersPage />;
      case "cart":
        return (
          <CartPage
            onNavigate={setCurrentPage}
            cartItems={cartItemsWithDetails}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
          />
        );
      case "checkout":
        return (
          <CheckoutPage
            onNavigate={setCurrentPage}
            cartItems={cartItemsWithDetails}
            onOrderPlaced={() => setCartItems([])}
          />
        );
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

              {productsLoading ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <span className="text-3xl">🌿</span>
                    </div>
                    <h3 className="text-gray-900 mb-2">Loading products...</h3>
                  </div>
                </div>
              ) : productsError ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">⚠️</span>
                    </div>
                    <h3 className="text-gray-900 mb-2">Couldn't load products</h3>
                    <p className="text-gray-500 text-sm">Check that the backend server is running and try refreshing.</p>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
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
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
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
        onItemListed={loadProducts}
      />

      <AIChatbox
        open={showAIChat}
        onClose={() => setShowAIChat(false)}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}