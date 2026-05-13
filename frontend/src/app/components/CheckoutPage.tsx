import React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  Smartphone,
  Lock,
  MapPin,
  Package,
  Leaf,
  CheckCircle2,
  Truck
} from "lucide-react";
import { toast } from "sonner";

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  seller: string;
}

const mockCartItems: CartItem[] = [
  {
    id: "1",
    title: "Vintage Oak Dining Table",
    price: 245,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1668955254766-1bb2de25cf16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xlZCUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NjI4ODI4MDV8MA&ixlib=rb-4.1.0&q=80&w=400",
    seller: "Sarah Miller"
  },
  {
    id: "2",
    title: "Vintage Denim Jacket Collection",
    price: 45,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1614990354198-b06764dcb13c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYyODgyODA1fDA&ixlib=rb-4.1.0&q=80&w=400",
    seller: "Mike Chen"
  }
];

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: ""
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [saveInfo, setSaveInfo] = useState(false);

  const subtotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15;
  const tax = subtotal * 0.08;
  const carbonOffset = 5; // Fixed carbon offset fee
  const total = subtotal + shipping + tax + carbonOffset;

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.address) {
      toast.error("Please fill in all required shipping information");
      return;
    }

    if (paymentMethod === "card" && (!cardInfo.cardNumber || !cardInfo.cardName || !cardInfo.expiry || !cardInfo.cvv)) {
      toast.error("Please fill in all payment information");
      return;
    }

    // Simulate successful order
    toast.success("Order placed successfully!", {
      description: "Thank you for supporting sustainable shopping!",
      duration: 4000,
    });

    setTimeout(() => {
      onNavigate("orders");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate("cart")}
            className="mb-4 hover:bg-emerald-50 text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-gray-900">Checkout</h1>
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <Leaf className="h-4 w-4" />
              <span className="text-sm">Eco-Friendly Purchase</span>
            </div>
          </div>
          <p className="text-gray-600">Complete your sustainable purchase</p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-gray-900">Shipping Information</h2>
                    <p className="text-sm text-gray-500">Where should we deliver your items?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={shippingInfo.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="h-11 rounded-xl border-gray-200 focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="h-11 rounded-xl border-gray-200 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="h-11 rounded-xl border-gray-200 focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street, Apt 4B"
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="h-11 rounded-xl border-gray-200 focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="h-11 rounded-xl border-gray-200 focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        placeholder="NY"
                        value={shippingInfo.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="h-11 rounded-xl border-gray-200 focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code *</Label>
                      <Input
                        id="zipCode"
                        placeholder="10001"
                        value={shippingInfo.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        className="h-11 rounded-xl border-gray-200 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-gray-900">Shipping Method</h2>
                    <p className="text-sm text-gray-500">Choose your delivery speed</p>
                  </div>
                </div>

                <RadioGroup defaultValue="standard" className="space-y-3">
                  <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="standard" id="standard" className="data-[state=checked]:border-emerald-500 data-[state=checked]:text-emerald-500" />
                      <div>
                        <p className="text-gray-900">Standard Delivery</p>
                        <p className="text-sm text-gray-500">5-7 business days</p>
                      </div>
                    </div>
                    <span className="text-emerald-600">₹150</span>
                  </label>

                  <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="express" id="express" className="data-[state=checked]:border-emerald-500 data-[state=checked]:text-emerald-500" />
                      <div>
                        <p className="text-gray-900">Express Delivery</p>
                        <p className="text-sm text-gray-500">2-3 business days</p>
                      </div>
                    </div>
                    <span className="text-emerald-600">₹250</span>
                  </label>

                  <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="pickup" id="pickup" className="data-[state=checked]:border-emerald-500 data-[state=checked]:text-emerald-500" />
                      <div>
                        <p className="text-gray-900">Local Pickup</p>
                        <p className="text-sm text-gray-500">Pick up from seller</p>
                      </div>
                    </div>
                    <span className="text-emerald-600">Free</span>
                  </label>
                </RadioGroup>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-gray-900">Payment Method</h2>
                    <p className="text-sm text-gray-500">Secure payment processing</p>
                  </div>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3 mb-6">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                    <RadioGroupItem value="card" id="card" className="data-[state=checked]:border-emerald-500 data-[state=checked]:text-emerald-500" />
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-900">Credit/Debit Card</span>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                    <RadioGroupItem value="paypal" id="paypal" className="data-[state=checked]:border-emerald-500 data-[state=checked]:text-emerald-500" />
                    <Wallet className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-900">PayPal</span>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                    <RadioGroupItem value="apple" id="apple" className="data-[state=checked]:border-emerald-500 data-[state=checked]:text-emerald-500" />
                    <Smartphone className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-900">Apple Pay</span>
                  </label>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardInfo.cardNumber}
                        onChange={(e) => handleCardInputChange("cardNumber", e.target.value)}
                        className="h-11 rounded-xl border-gray-200 focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name *</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardInfo.cardName}
                        onChange={(e) => handleCardInputChange("cardName", e.target.value)}
                        className="h-11 rounded-xl border-gray-200 focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date *</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardInfo.expiry}
                          onChange={(e) => handleCardInputChange("expiry", e.target.value)}
                          className="h-11 rounded-xl border-gray-200 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cardInfo.cvv}
                          onChange={(e) => handleCardInputChange("cvv", e.target.value)}
                          className="h-11 rounded-xl border-gray-200 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <Checkbox
                        id="saveInfo"
                        checked={saveInfo}
                        onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                        className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      <label htmlFor="saveInfo" className="text-sm text-gray-600 cursor-pointer">
                        Save payment information for future purchases
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h2 className="text-gray-900 mb-4">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {mockCartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm text-emerald-600">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>₹{shipping.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-600">
                    <div className="flex items-center gap-1">
                      <Leaf className="h-4 w-4" />
                      <span>Carbon Offset</span>
                    </div>
                    <span>₹{carbonOffset.toLocaleString('en-IN')}</span>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Sustainability Impact */}
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-900">Your Impact</p>
                      <p className="text-xs text-gray-600 mt-1">
                        This purchase saves approximately 12kg of CO₂ and prevents 2 items from landfills!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  className="w-full mt-6 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Place Order
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Lock className="h-3 w-3" />
                  <span>Secure checkout powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
