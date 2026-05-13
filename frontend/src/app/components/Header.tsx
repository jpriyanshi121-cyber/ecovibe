import React from "react";
import { ShoppingBag, Plus, Search, User, ShoppingCart, LayoutDashboard, Package, HelpCircle, Sparkles, Menu, X, LogOut, LogIn, UserPlus, Shield, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  onSellClick: () => void;
  onAIChatClick: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  cartCount?: number;
  isLoggedIn?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

export function Header({ onSellClick, onAIChatClick, searchQuery, onSearchChange, currentPage, onNavigate, cartCount = 2, isLoggedIn = false, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(isLoggedIn ? 'home' : 'login')}>
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-2.5 shadow-lg shadow-emerald-200">
              <ShoppingBag className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl text-gray-900">EcoVibe</span>
                <Badge variant="secondary" className="text-xs px-2 py-0 bg-emerald-50 text-emerald-700 border-emerald-200">
                  Eco
                </Badge>
              </div>
              <p className="text-xs text-gray-500">Sustainable marketplace & community</p>
            </div>
          </div>

          {currentPage === 'home' && (
            <div className="flex-1 max-w-xl mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for recycled treasures..."
                  className="pl-12 pr-4 h-12 rounded-full border-gray-200 bg-gray-50 focus:bg-white focus:border-emerald-300 transition-all"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <Button
              onClick={onAIChatClick}
              variant="ghost"
              size="icon"
              className="rounded-full hidden lg:flex hover:bg-purple-50 relative group"
              title="AI Upcycle Assistant"
              >
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                AI Assistant
                </span>
              </Button>
            )}

            {isLoggedIn && (
              <Button
                onClick={() => onNavigate('cart')}
                variant="ghost"
                size="icon"
                className="rounded-full hidden sm:flex relative hover:bg-gray-100"
              >
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-xs text-white flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hidden sm:flex hover:bg-gray-100"
                >
                  <User className="h-5 w-5 text-gray-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem onClick={() => onNavigate('ecoreels')} className="cursor-pointer">
                      <Play className="h-4 w-4 mr-2" />
                      EcoReels
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate('profile')} className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('dashboard')} className="cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('sellerverification')} className="cursor-pointer">
                      <Shield className="h-4 w-4 mr-2" />
                      Seller Verification
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('orders')} className="cursor-pointer">
                      <Package className="h-4 w-4 mr-2" />
                      Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('cart')} className="cursor-pointer">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate('help')} className="cursor-pointer">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help & Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => onNavigate('help')} className="cursor-pointer">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help & Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate('login')} className="cursor-pointer">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate('signup')} className="cursor-pointer">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Signup
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {isLoggedIn && (
              <Button
                onClick={onLogout}
                variant="outline"
                className="rounded-full border-gray-300 hover:bg-gray-50 hidden sm:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}

            {isLoggedIn && (
              <Button
              onClick={onSellClick}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all rounded-full px-6"
              >
                <Plus className="h-5 w-5 mr-2" strokeWidth={2.5} />
                <span className="hidden sm:inline">Sell Item</span>
                <span className="sm:hidden">Sell</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {currentPage === 'home' && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-12 pr-4 h-11 rounded-full border-gray-200 bg-gray-50"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-4 border-t pt-4 space-y-2">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { onNavigate('ecoreels'); setMobileMenuOpen(false); }}>
                  <Play className="h-4 w-4 mr-2" /> EcoReels
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { onAIChatClick(); setMobileMenuOpen(false); }}>
                  <Sparkles className="h-4 w-4 mr-2" /> AI Assistant
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }}>
                  <User className="h-4 w-4 mr-2" /> Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}>
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { onNavigate('orders'); setMobileMenuOpen(false); }}>
                  <Package className="h-4 w-4 mr-2" /> Orders
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { onNavigate('cart'); setMobileMenuOpen(false); }}>
                  <ShoppingCart className="h-4 w-4 mr-2" /> Cart
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { onNavigate('help'); setMobileMenuOpen(false); }}>
                  <HelpCircle className="h-4 w-4 mr-2" /> Help
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-600" onClick={() => { onLogout?.(); setMobileMenuOpen(false); }}>
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { onNavigate('help'); setMobileMenuOpen(false); }}>
                  <HelpCircle className="h-4 w-4 mr-2" /> Help
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}>
                  <LogIn className="h-4 w-4 mr-2" /> Login
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { onNavigate('signup'); setMobileMenuOpen(false); }}>
                  <UserPlus className="h-4 w-4 mr-2" /> Signup
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}