import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, User, MessageCircle, Share2, Heart, ShieldCheck, Package, Star, ShoppingCart } from "lucide-react";
import { Product } from "./ProductCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface ProductDetailsProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart?: () => void;
}

const reviews = [
  {
    id: 1,
    author: "Emily Johnson",
    rating: 5,
    date: "Nov 5, 2025",
    comment: "Absolutely love this! Exactly as described and in great condition. The seller was very responsive and helpful.",
    verified: true
  },
  {
    id: 2,
    author: "Michael Brown",
    rating: 4,
    date: "Nov 1, 2025",
    comment: "Good quality item. Minor wear but that was mentioned in the description. Very happy with the purchase!",
    verified: true
  },
  {
    id: 3,
    author: "Jessica Lee",
    rating: 5,
    date: "Oct 28, 2025",
    comment: "Amazing find! So glad I chose to buy recycled. Great value and eco-friendly too!",
    verified: true
  },
];

export function ProductDetails({ product, open, onClose, onAddToCart }: ProductDetailsProps) {
  if (!product) return null;

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl">{product.title}</DialogTitle>
          <DialogDescription className="sr-only">
            View detailed information about {product.title} including photos, description, seller information, and customer reviews
          </DialogDescription>
          <div className="flex items-center gap-2 pt-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= averageRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({reviews.length} reviews)</span>
          </div>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 shadow-lg">
              <ImageWithFallback
                src={product.image}
                alt={product.title}
                className="object-cover w-full h-full"
              />
              <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all">
                <Heart className="h-5 w-5 text-gray-700" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="aspect-square rounded-xl bg-gray-100"></div>
              <div className="aspect-square rounded-xl bg-gray-100"></div>
              <div className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                +3
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <div className="text-3xl text-emerald-600 mb-2">₹{product.price.toLocaleString('en-IN')}</div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  {product.condition}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shrink-0">
                  {product.seller.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-900">{product.seller}</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-sm text-gray-600">Verified seller • 98% positive reviews</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                {product.location}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-gray-900 mb-3">Description</h4>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              <p className="text-gray-600 leading-relaxed mt-3">
                This item has been carefully inspected and is ready for its next home. 
                By choosing pre-loved items, you're making a sustainable choice that helps 
                reduce waste and protect our environment.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-gray-900 mb-3">Product Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="text-sm text-gray-900 capitalize">{product.category}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Condition</p>
                  <p className="text-sm text-gray-900">{product.condition}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <Package className="h-5 w-5 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-900">
                <span>Free local pickup available</span>
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all h-12 rounded-xl"
                onClick={onAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button className="rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-0">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Button variant="outline" className="rounded-xl border-gray-300">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <Tabs defaultValue="reviews" className="space-y-4">
            <TabsList className="bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="reviews" className="rounded-lg">
                Customer Reviews ({reviews.length})
              </TabsTrigger>
              <TabsTrigger value="seller" className="rounded-lg">
                Seller Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-4">
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="text-4xl text-gray-900 mb-1">{averageRating.toFixed(1)}</div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= averageRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{reviews.length} reviews</p>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviews.filter(r => r.rating === rating).length;
                    const percentage = (count / reviews.length) * 100;
                    return (
                      <div key={rating} className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600 w-8">{rating}★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                          {review.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-900">{review.author}</span>
                              {review.verified && (
                                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs px-2 py-0">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${
                                      star <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full rounded-xl">
                Write a Review
              </Button>
            </TabsContent>

            <TabsContent value="seller" className="space-y-4">
              <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl shrink-0">
                  {product.seller.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-gray-900">{product.seller}</h3>
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      4.9 Rating
                    </span>
                    <span>47 Sales</span>
                    <span>98% Positive</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Passionate about sustainable living and giving items a second life. 
                    Selling quality pre-loved items to help reduce waste!
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}