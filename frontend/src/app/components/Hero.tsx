import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, Recycle, TrendingUp, Users } from "lucide-react";

interface HeroProps {
  onSellClick: () => void;
}

export function Hero({ onSellClick }: HeroProps) {
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-700">Join 10,000+ sustainable shoppers</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-gray-900 leading-tight">
              Give Products a{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Second Life
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Buy and sell pre-loved items in our sustainable marketplace. Reduce waste, 
              save money, and make a positive impact on the planet.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={onSellClick}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all rounded-full px-8"
              >
                Start Selling
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="rounded-full px-8 bg-white/80 backdrop-blur-sm hover:bg-white border-gray-300"
              >
                Browse Items
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <Recycle className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Eco-Friendly</h3>
                <p className="text-sm text-gray-600">Reduce waste and carbon footprint</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Community</h3>
                <p className="text-sm text-gray-600">Connect with like-minded sellers</p>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-gray-900 mb-2">Great Value</h3>
                <p className="text-sm text-gray-600">Quality items at fair prices</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-xl text-white">
                <div className="text-4xl mb-2">2.5M+</div>
                <p className="text-emerald-50">Items saved from landfills</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
