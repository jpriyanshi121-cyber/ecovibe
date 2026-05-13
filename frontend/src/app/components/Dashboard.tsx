import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { TrendingUp, DollarSign, Package, Eye, Users, ShoppingBag, ArrowUp, ArrowDown, Shield, AlertCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const salesData = [
  { month: "Jan", sales: 12, revenue: 340 },
  { month: "Feb", sales: 19, revenue: 580 },
  { month: "Mar", sales: 15, revenue: 420 },
  { month: "Apr", sales: 28, revenue: 890 },
  { month: "May", sales: 22, revenue: 670 },
  { month: "Jun", sales: 31, revenue: 1020 },
];

const topProducts = [
  { name: "Vintage Oak Dining Table", views: 342, sales: 1, revenue: 245 },
  { name: "Mid-Century Modern Chair", views: 289, sales: 2, revenue: 350 },
  { name: "Vintage Denim Jacket", views: 256, sales: 3, revenue: 135 },
  { name: "Upcycled Wall Art", views: 198, sales: 1, revenue: 85 },
];

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Seller Dashboard</h1>
        <p className="text-gray-600">Track your performance and grow your sustainable business</p>
      </div>

      {/* Verification Status Banner */}
      <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-2">Complete Your Seller Verification</h3>
            <p className="text-gray-600 text-sm mb-4">
              Become a verified seller to unlock full selling capabilities, build trust with buyers, and increase your sales potential. Verification typically takes 2-3 business days.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => onNavigate?.("sellerverification")}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Shield className="h-4 w-4 mr-2" />
                Start Verification
              </Button>
              <Button 
                variant="outline" 
                className="rounded-xl border-amber-300 hover:bg-amber-50"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="rounded-2xl border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-0">
                <ArrowUp className="h-3 w-3 mr-1" />
                12%
              </Badge>
            </div>
            <div className="text-2xl text-gray-900 mb-1">₹3,245</div>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-0">
                <ArrowUp className="h-3 w-3 mr-1" />
                8%
              </Badge>
            </div>
            <div className="text-2xl text-gray-900 mb-1">47</div>
            <p className="text-sm text-gray-600">Total Sales</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <Badge className="bg-red-100 text-red-700 border-0">
                <ArrowDown className="h-3 w-3 mr-1" />
                3%
              </Badge>
            </div>
            <div className="text-2xl text-gray-900 mb-1">23</div>
            <p className="text-sm text-gray-600">Active Listings</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-0">
                <ArrowUp className="h-3 w-3 mr-1" />
                24%
              </Badge>
            </div>
            <div className="text-2xl text-gray-900 mb-1">1,892</div>
            <p className="text-sm text-gray-600">Profile Views</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
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
              <LineChart data={salesData}>
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
              <BarChart data={salesData}>
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

      {/* Top Products */}
      <Card className="rounded-2xl border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-emerald-600" />
              Top Performing Products
            </CardTitle>
            <Button variant="outline" size="sm" className="rounded-xl">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="text-gray-900 mb-1">{product.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {product.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="h-4 w-4" />
                      {product.sales} sales
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg text-emerald-600">₹{product.revenue.toLocaleString('en-IN')}</div>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Button className="h-auto py-6 flex-col gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl">
          <Package className="h-6 w-6 text-emerald-600" />
          <span>Add New Item</span>
        </Button>
        <Button className="h-auto py-6 flex-col gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl">
          <Users className="h-6 w-6 text-blue-600" />
          <span>View Messages</span>
        </Button>
        <Button className="h-auto py-6 flex-col gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl">
          <TrendingUp className="h-6 w-6 text-purple-600" />
          <span>Analytics</span>
        </Button>
        <Button className="h-auto py-6 flex-col gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl">
          <DollarSign className="h-6 w-6 text-orange-600" />
          <span>Payouts</span>
        </Button>
      </div>
    </div>
  );
}