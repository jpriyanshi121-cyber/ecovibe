import React from "react";
import { Package, Users, Leaf, TrendingUp } from "lucide-react";

export function Stats() {
  const stats = [
    {
      icon: Package,
      value: "15,234",
      label: "Active Listings",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Users,
      value: "10K+",
      label: "Happy Sellers",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Leaf,
      value: "2.5M kg",
      label: "CO₂ Saved",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: "Satisfaction Rate",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
            <stat.icon className="h-6 w-6" />
          </div>
          <div className="text-2xl text-gray-900 mb-1">{stat.value}</div>
          <p className="text-sm text-gray-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
