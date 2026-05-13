import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Tag } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Input } from "./ui/input";
import { useState } from "react";

interface CartItem {
  id: string;
  product: string;
  image: string;
  seller: string;
  price: number;
  quantity: number;
  condition: string;
}

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export function CartPage({ onNavigate }: CartPageProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      product: "Vintage Oak Dining Table",
      image: "https://images.unsplash.com/photo-1668955254766-1bb2de25cf16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xlZCUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NjI4ODI4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      seller: "Sarah Miller",
      price: 245,
      quantity: 1,
      condition: "Good"
    },
    {
      id: "2",
      product: "Vintage Denim Jacket",
      image: "https://images.unsplash.com/photo-1614990354198-b06764dcb13c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYyODgyODA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      seller: "Mike Chen",
      price: 45,
      quantity: 1,
      condition: "Like New"
    },
  ]);

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 15;
  const total = subtotal + shipping;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">{cartItems.length} items in your cart</p>
      </div>

      {cartItems.length === 0 ? (
        <Card className="rounded-2xl border-gray-200">
          <CardContent className="py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl">
              Browse Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="rounded-2xl border-gray-200">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.product}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3 className="text-gray-900 mb-1">{item.product}</h3>
                          <p className="text-sm text-gray-600">by {item.seller}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 mb-3">
                        {item.condition}
                      </Badge>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm text-gray-900 w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-lg text-emerald-600">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card className="rounded-2xl border-gray-200">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-gray-900">Order Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">₹{shipping.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-900">Total</span>
                        <span className="text-xl text-emerald-600">₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl"
                    onClick={() => onNavigate("checkout")}
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-gray-200">
                <CardContent className="p-6">
                  <h4 className="text-gray-900 mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-emerald-600" />
                    Promo Code
                  </h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      className="rounded-xl border-gray-300"
                    />
                    <Button variant="outline" className="rounded-xl shrink-0">
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <p className="text-sm text-emerald-900">
                  🌱 <span>By shopping sustainably, you're helping reduce waste and support the circular economy!</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}