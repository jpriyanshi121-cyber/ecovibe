import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Package, Truck, CheckCircle, XCircle, Eye, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const orders = [
  {
    id: "ORD-2024-001",
    product: "Vintage Oak Dining Table",
    image: "https://images.unsplash.com/photo-1668955254766-1bb2de25cf16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xlZCUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NjI4ODI4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    buyer: "John Doe",
    date: "Nov 10, 2025",
    amount: 245,
    status: "delivered"
  },
  {
    id: "ORD-2024-002",
    product: "Vintage Denim Jacket",
    image: "https://images.unsplash.com/photo-1614990354198-b06764dcb13c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYyODgyODA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    buyer: "Jane Smith",
    date: "Nov 9, 2025",
    amount: 45,
    status: "in_transit"
  },
  {
    id: "ORD-2024-003",
    product: "Refurbished Laptop",
    image: "https://images.unsplash.com/photo-1695712551666-e0c354b1e6b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xlZCUyMGVsZWN0cm9uaWNzfGVufDF8fHx8MTc2Mjg4MjgwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    buyer: "Mike Johnson",
    date: "Nov 8, 2025",
    amount: 320,
    status: "pending"
  },
  {
    id: "ORD-2024-004",
    product: "Upcycled Wall Art",
    image: "https://images.unsplash.com/photo-1694537709541-672813820324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cGN5Y2xlZCUyMGRlY29yfGVufDF8fHx8MTc2Mjg4MjgwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    buyer: "Emily Davis",
    date: "Nov 7, 2025",
    amount: 85,
    status: "delivered"
  },
];

const purchases = [
  {
    id: "PUR-2024-001",
    product: "Mid-Century Modern Chair",
    image: "https://images.unsplash.com/photo-1649003366476-2d968f76d37a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZnVybml0dXJlJTIwd29vZHxlbnwxfHx8fDE3NjI4ODMwNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    seller: "Vintage Finds",
    date: "Nov 5, 2025",
    amount: 175,
    status: "delivered"
  },
  {
    id: "PUR-2024-002",
    product: "Organic Cotton Tote Bag",
    image: "https://images.unsplash.com/photo-1677753727712-c79ce4c420c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHNob3BwaW5nJTIwYmFnfGVufDF8fHx8MTc2Mjg4MzA0Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    seller: "Eco Shop",
    date: "Nov 3, 2025",
    amount: 15,
    status: "in_transit"
  },
];

const getStatusBadge = (status: string) => {
  const config = {
    delivered: { label: "Delivered", className: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
    in_transit: { label: "In Transit", className: "bg-blue-100 text-blue-700 border-blue-200", icon: Truck },
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Package },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
  };
  
  const { label, className, icon: Icon } = config[status as keyof typeof config] || config.pending;
  
  return (
    <Badge className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
};

export function OrdersPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Orders & Purchases</h1>
        <p className="text-gray-600">Manage your sales and track your purchases</p>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-xl">
          <TabsTrigger value="sales" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white">
            My Sales
          </TabsTrigger>
          <TabsTrigger value="purchases" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white">
            My Purchases
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="rounded-2xl border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <ImageWithFallback
                      src={order.image}
                      alt={order.product}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-gray-900 mb-1">{order.product}</h3>
                        <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Buyer</p>
                        <p className="text-sm text-gray-900">{order.buyer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm text-gray-900">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="text-sm text-emerald-600">${order.amount}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="rounded-xl">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-xl">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Buyer
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="rounded-2xl border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <ImageWithFallback
                      src={purchase.image}
                      alt={purchase.product}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-gray-900 mb-1">{purchase.product}</h3>
                        <p className="text-sm text-gray-600">Order ID: {purchase.id}</p>
                      </div>
                      {getStatusBadge(purchase.status)}
                    </div>
                    
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Seller</p>
                        <p className="text-sm text-gray-900">{purchase.seller}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm text-gray-900">{purchase.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="text-sm text-emerald-600">${purchase.amount}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="rounded-xl">
                        <Eye className="h-4 w-4 mr-2" />
                        Track Order
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-xl">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Seller
                      </Button>
                      {purchase.status === "delivered" && (
                        <Button size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-700">
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
