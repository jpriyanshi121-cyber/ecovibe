import React from "react";
import { Badge } from "./ui/badge";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", label: "All Items", icon: "✨" },
  { id: "furniture", label: "Furniture", icon: "🪑" },
  { id: "clothing", label: "Clothing", icon: "👕" },
  { id: "electronics", label: "Electronics", icon: "💻" },
  { id: "decor", label: "Home Decor", icon: "🏺" },
  { id: "books", label: "Books", icon: "📚" },
  { id: "materials", label: "Materials", icon: "♻️" },
];

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-5 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap px-5 py-2.5 rounded-full transition-all text-sm ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md"
                  : "hover:bg-gray-50 border-gray-200 bg-white"
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              <span className="mr-2 text-base">{category.icon}</span>
              {category.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
