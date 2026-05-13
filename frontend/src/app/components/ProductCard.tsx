import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  image: string;
  seller: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 group border-gray-200 rounded-2xl bg-white" 
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
        <ImageWithFallback
          src={product.image}
          alt={product.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <button 
          className={`absolute top-3 right-3 rounded-full p-2.5 shadow-lg transition-all backdrop-blur-sm ${
            isFavorited 
              ? 'bg-emerald-500 hover:bg-emerald-600' 
              : 'bg-white/90 hover:bg-white'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isFavorited ? 'text-white fill-white' : 'text-gray-700'
            }`} 
          />
        </button>
        <Badge className="absolute top-3 left-3 bg-white/95 text-gray-900 backdrop-blur-sm border-0 shadow-md">
          {product.condition}
        </Badge>
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-gray-900 line-clamp-1 flex-1">{product.title}</h3>
          <div className="ml-3 shrink-0">
            <span className="text-emerald-600">₹{product.price.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
            {product.location}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"></div>
            <span className="text-xs text-gray-500">{product.seller.split(' ')[0]}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
