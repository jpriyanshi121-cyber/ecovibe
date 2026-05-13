import { apiFetch } from '../../lib/api';
import React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Recycle, Leaf, ShoppingBag, Store, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface SignUpPageProps {
  onNavigate: (page: string) => void;
  onLogin: () => void;
}

export function SignUpPage({ onNavigate, onLogin }: SignUpPageProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [accountTypes, setAccountTypes] = useState({
    buyer: true,
    seller: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAccountTypeChange = (type: "buyer" | "seller") => {
    setAccountTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });
      localStorage.setItem('token', data.token);
      toast.success("Account created! Welcome to EcoVibe!");
      onLogin();
      setTimeout(() => onNavigate("home"), 1500);
    } catch (err) {
      toast.error("Sign up failed. Try a different email.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md mx-auto">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/50 mb-4 transform hover:scale-110 transition-transform duration-300">
            <Recycle className="size-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">Join ReCircle</h1>
          <p className="text-gray-600">Start your sustainable shopping journey</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-500/10 border border-emerald-100/50 overflow-hidden">
          {/* Gradient header bar */}
          <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
          
          <div className="p-8">
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="pl-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-11 pr-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-11 pr-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              {/* Account Type Selection */}
              <div className="space-y-3">
                <Label className="text-gray-700">I want to:</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleAccountTypeChange("buyer")}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                      accountTypes.buyer
                        ? "border-emerald-500 bg-emerald-50 shadow-sm shadow-emerald-500/20"
                        : "border-gray-200 bg-white hover:border-emerald-300"
                    }`}
                  >
                    <ShoppingBag className={`size-6 ${accountTypes.buyer ? "text-emerald-600" : "text-gray-400"}`} />
                    <span className={`text-sm ${accountTypes.buyer ? "text-emerald-700" : "text-gray-600"}`}>
                      Buy Items
                    </span>
                    {accountTypes.buyer && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAccountTypeChange("seller")}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                      accountTypes.seller
                        ? "border-teal-500 bg-teal-50 shadow-sm shadow-teal-500/20"
                        : "border-gray-200 bg-white hover:border-teal-300"
                    }`}
                  >
                    <Store className={`size-6 ${accountTypes.seller ? "text-teal-600" : "text-gray-400"}`} />
                    <span className={`text-sm ${accountTypes.seller ? "text-teal-700" : "text-gray-600"}`}>
                      Sell Items
                    </span>
                    {accountTypes.seller && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Sustainability Message */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 flex gap-3">
                <Leaf className="size-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  By joining ReCircle, you're contributing to a sustainable future and helping reduce waste in our community.
                </p>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  className="mt-0.5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                  I agree to the{" "}
                  <button type="button" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                    Terms and Conditions
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Create Account
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => onNavigate("login")}
                  className="text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-500 mt-8">
          ReCircle - Building a circular economy, one transaction at a time
        </p>
      </div>
    </div>
  );
}