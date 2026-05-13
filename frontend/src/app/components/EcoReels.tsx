import React from "react";
import { useState, useEffect, useRef } from "react";
import { X, Heart, ShoppingBag, Share2, Volume2, VolumeX, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

interface Reel {
  id: string;
  videoUrl: string;
  thumbnail: string;
  title: string;
  creator: string;
  description: string;
  product: {
    name: string;
    price: number;
    wasteMaterial: string;
  };
  likes: number;
  views: string;
  transformation: {
    before: string;
    after: string;
  };
}

interface EcoReelsProps {
  onClose: () => void;
}

const mockReels: Reel[] = [
  {
    id: "1",
    videoUrl: "",
    thumbnail: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Turning Plastic Bottles into Modern Planters",
    creator: "Sarah's Eco Crafts",
    description: "Watch how I transform old plastic bottles into beautiful hanging planters! ♻️🌱",
    product: {
      name: "Upcycled Bottle Planter Set",
      price: 28,
      wasteMaterial: "Plastic Bottles"
    },
    likes: 12400,
    views: "45.2K",
    transformation: {
      before: "5 Plastic Bottles",
      after: "Vertical Garden"
    }
  },
  {
    id: "2",
    videoUrl: "",
    thumbnail: "https://images.unsplash.com/photo-1668955254766-1bb2de25cf16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Old Pallets → Rustic Coffee Table",
    creator: "Wood Revival Co.",
    description: "From abandoned pallets to a stunning coffee table. The transformation is incredible! 🪵✨",
    product: {
      name: "Reclaimed Pallet Coffee Table",
      price: 185,
      wasteMaterial: "Wood Pallets"
    },
    likes: 28900,
    views: "127K",
    transformation: {
      before: "Discarded Pallets",
      after: "Coffee Table"
    }
  },
  {
    id: "3",
    videoUrl: "",
    thumbnail: "https://images.unsplash.com/photo-1614990354198-b06764dcb13c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Vintage Denim Scraps into Tote Bags",
    creator: "Stitch & Save",
    description: "Zero waste sewing! Watch me turn old jeans into a stylish tote bag 👖👜",
    product: {
      name: "Upcycled Denim Tote",
      price: 42,
      wasteMaterial: "Old Jeans"
    },
    likes: 15600,
    views: "62.3K",
    transformation: {
      before: "Old Denim",
      after: "Tote Bag"
    }
  },
  {
    id: "4",
    videoUrl: "",
    thumbnail: "https://images.unsplash.com/photo-1695712551666-e0c354b1e6b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "E-Waste to Desk Organizer",
    creator: "Tech Upcycle",
    description: "Giving old circuit boards a second life as modern desk organizers! 💻🔧",
    product: {
      name: "Circuit Board Organizer",
      price: 55,
      wasteMaterial: "E-Waste"
    },
    likes: 9800,
    views: "38.1K",
    transformation: {
      before: "Circuit Boards",
      after: "Desk Organizer"
    }
  },
  {
    id: "5",
    videoUrl: "",
    thumbnail: "https://images.unsplash.com/photo-1694537709541-672813820324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    title: "Wine Corks → Wall Art Masterpiece",
    creator: "Cork Creations",
    description: "200+ wine corks transformed into stunning wall art 🍷🎨",
    product: {
      name: "Cork Wall Art Panel",
      price: 95,
      wasteMaterial: "Wine Corks"
    },
    likes: 21300,
    views: "89.4K",
    transformation: {
      before: "Wine Corks",
      after: "Wall Art"
    }
  }
];

export function EcoReels({ onClose }: EcoReelsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const currentReel = mockReels[currentIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diff = startY.current - currentY.current;

    // Swipe up - next reel
    if (diff > 50 && currentIndex < mockReels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    // Swipe down - previous reel
    else if (diff < -50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && currentIndex < mockReels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleLike = () => {
    setLikedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentReel.id)) {
        newSet.delete(currentReel.id);
      } else {
        newSet.add(currentReel.id);
      }
      return newSet;
    });
  };

  const isLiked = likedReels.has(currentReel.id);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-all"
      >
        <X className="h-5 w-5 text-white" />
      </button>

      {/* EcoReel Label */}
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
          <span className="text-white text-xs drop-shadow-lg">EcoReel 🌱</span>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative h-full w-full max-w-[500px] mx-auto">
        {/* Video/Image Background */}
        <div className="absolute inset-0">
          <img
            src={currentReel.thumbnail}
            alt={currentReel.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-3 bottom-24 z-30 flex flex-col gap-5">
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1"
          >
            <Heart
              className={`h-7 w-7 drop-shadow-lg transition-all ${
                isLiked ? "fill-red-500 text-red-500 scale-110" : "text-white"
              }`}
            />
            <span className="text-white text-xs drop-shadow-lg">
              {(currentReel.likes + (isLiked ? 1 : 0)).toLocaleString()}
            </span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <MessageCircle className="h-7 w-7 text-white drop-shadow-lg" />
            <span className="text-white text-xs drop-shadow-lg">142</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <Share2 className="h-6 w-6 text-white drop-shadow-lg" />
            <span className="text-white text-xs drop-shadow-lg">Share</span>
          </button>

          <button
            onClick={() => setMuted(!muted)}
            className="flex flex-col items-center gap-1"
          >
            {muted ? (
              <VolumeX className="h-6 w-6 text-white drop-shadow-lg" />
            ) : (
              <Volume2 className="h-6 w-6 text-white drop-shadow-lg" />
            )}
          </button>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 pb-6 space-y-3">
          {/* Creator Info */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <span className="text-white text-xs">
                {currentReel.creator.charAt(0)}
              </span>
            </div>
            <span className="text-white text-sm drop-shadow-lg">
              {currentReel.creator}
            </span>
            <Button
              size="sm"
              className="h-7 px-3 bg-transparent border border-white/50 hover:bg-white/10 text-white text-xs rounded-lg"
            >
              Follow
            </Button>
          </div>

          {/* Caption */}
          <div className="pr-16">
            <p className="text-white text-sm drop-shadow-lg line-clamp-2">
              {currentReel.description}
            </p>
            <p className="text-white/80 text-xs mt-1 drop-shadow-lg">
              Made from {currentReel.product.wasteMaterial} ♻️
            </p>
          </div>

          {/* Compact Product Bar */}
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 flex items-center justify-between gap-3 shadow-xl">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Available Now</p>
              <p className="text-sm text-gray-900 truncate">
                {currentReel.product.name}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-lg text-emerald-600">
                ₹{currentReel.product.price.toLocaleString('en-IN')}
              </span>
              <Button
                size="sm"
                className="h-8 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg text-xs"
              >
                Shop
              </Button>
            </div>
          </div>
        </div>

        {/* Swipe Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-1.5">
            {mockReels.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-6 bg-white"
                    : "w-1 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
