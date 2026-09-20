import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { ImageWithFallback } from "./common/ImageWithFallback";
import { apiFetch, getImageUrl } from "../../lib/api";

interface OrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total?: number;
  status: string;
  createdAt: string;
}

interface Sale {
  _id: string;
  buyer: { name: string } | string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
  delivered: { label: "Delivered", className: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  shipped: { label: "Shipped", className: "bg-blue-100 text-blue-700 border-blue-200", icon: Truck },
  confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-700 border-blue-200", icon: Package },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

const getStatusBadge = (status: string) => {
  const { label, className, icon: Icon } = statusConfig[status] || statusConfig.pending;
  return (
    <Badge className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export function OrdersPage() {
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const [ordersRes, salesRes] = await Promise.all([
          apiFetch("/orders"),
          apiFetch("/orders/sales/mine"),
        ]);
        setPurchases(ordersRes.orders || []);
        setSales(salesRes.sales || []);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Orders & Purchases</h1>
        <p className="text-gray-600">Manage your sales and track your purchases</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">Loading...</div>
      ) : error ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          Couldn't load orders. Check that the backend server is running.
        </div>
      ) : (
        <Tabs defaultValue="purchases" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-xl">
            <TabsTrigger value="purchases" className="rounded-lg data-[state=active]:bg-linear-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white">
              My Purchases
            </TabsTrigger>
            <TabsTrigger value="sales" className="rounded-lg data-[state=active]:bg-linear-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white">
              My Sales
            </TabsTrigger>
          </TabsList>

          <TabsContent value="purchases" className="space-y-4">
            {purchases.length === 0 ? (
              <Card className="rounded-2xl border-gray-200">
                <CardContent className="py-16 text-center text-gray-500 text-sm">
                  You haven't placed any orders yet.
                </CardContent>
              </Card>
            ) : (
              purchases.map((order) => (
                <Card key={order._id} className="rounded-2xl border-gray-200">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <ImageWithFallback src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm text-emerald-600">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                      </div>
                    ))}
                    {order.total !== undefined && (
                      <div className="flex justify-between border-t border-gray-100 pt-3">
                        <span className="text-sm text-gray-600">Total</span>
                        <span className="text-sm text-gray-900">₹{order.total.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            {sales.length === 0 ? (
              <Card className="rounded-2xl border-gray-200">
                <CardContent className="py-16 text-center text-gray-500 text-sm">
                  No sales yet — once someone buys one of your listings, it'll show up here.
                </CardContent>
              </Card>
            ) : (
              sales.map((sale) => (
                <Card key={sale._id} className="rounded-2xl border-gray-200">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Buyer: {typeof sale.buyer === "string" ? sale.buyer : sale.buyer?.name}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(sale.createdAt)}</p>
                      </div>
                      {getStatusBadge(sale.status)}
                    </div>
                    {sale.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <ImageWithFallback src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm text-emerald-600">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}