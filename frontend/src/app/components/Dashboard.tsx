import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { TrendingUp, DollarSign, Package, ShoppingBag, Shield, AlertCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { apiFetch } from "../../lib/api";
import { toast } from "sonner";

interface DashboardData {
  totalRevenue: number;
  totalSales: number;
  activeListings: number;
  totalOrders: number;
  topProducts: { name: string; sales: number; revenue: number }[];
  salesData: { month: string; sales: number; revenue: number }[];
}

interface DashboardProps {
  onNavigate?: (page: string) => void;
  onAddItem?: () => void;
}

export function Dashboard({ onNavigate, onAddItem }: DashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiFetch("/orders/dashboard/mine");
        setData(res.dashboard);
      } catch (err: any) {
        toast.error(err?.message || "Couldn't load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Seller Dashboard</h1>
        <p className="text-gray-600">Track your performance and grow your sustainable business</p>
      </div>

      {/* Verification Status Banner */}
      <div className="mb-8 bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-2">Complete Your Seller Verification</h3>
            <p className="text-gray-600 text-sm mb-4">
              Become a verified seller to unlock full selling capabilities, build trust with buyers, and increase your sales potential.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => onNavigate?.("sellerverification")}
                className="bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Shield className="h-4 w-4 mr-2" />
                Start Verification
              </Button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">Loading dashboard...</div>
      ) : !data ? (
        <div className="text-center py-20 text-gray-400 text-sm">Couldn't load your dashboard.</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="rounded-2xl border-gray-200">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-2xl text-gray-900 mb-1">₹{data.totalRevenue.toLocaleString("en-IN")}</div>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-gray-200">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl text-gray-900 mb-1">{data.totalSales}</div>
                <p className="text-sm text-gray-600">Units Sold</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-gray-200">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl text-gray-900 mb-1">{data.activeListings}</div>
                <p className="text-sm text-gray-600">Active Listings</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-gray-200">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl text-gray-900 mb-1">{data.totalOrders}</div>
                <p className="text-sm text-gray-600">Orders Fulfilled</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          {data.salesData.length === 0 ? (
            <Card className="rounded-2xl border-gray-200 mb-8">
              <CardContent className="py-16 text-center text-gray-400 text-sm">
                No sales yet — charts will appear once you make your first sale.
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <Card className="rounded-2xl border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Sales Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data.salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip />
                      <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    Revenue Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data.salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Top Products */}
          <Card className="rounded-2xl border-gray-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-600" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.topProducts.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No sales yet.</p>
              ) : (
                <div className="space-y-4">
                  {data.topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-1">{product.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="h-4 w-4" />
                            {product.sales} sold
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg text-emerald-600">₹{product.revenue.toLocaleString("en-IN")}</div>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Button
              onClick={onAddItem}
              className="h-auto py-6 flex-col gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl"
            >
              <Package className="h-6 w-6 text-emerald-600" />
              <span>Add New Item</span>
            </Button>
            <Button
              disabled
              className="h-auto py-6 flex-col gap-2 bg-white border border-gray-200 text-gray-400 rounded-2xl cursor-not-allowed opacity-60"
            >
              <DollarSign className="h-6 w-6 text-gray-400" />
              <span>Payouts (Coming soon)</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}