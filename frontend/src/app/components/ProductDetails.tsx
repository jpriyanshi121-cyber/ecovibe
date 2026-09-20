import React from "react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { MapPin, ShieldCheck, Package, Star, ShoppingCart, Heart } from "lucide-react";
import { Product } from "./ProductCard";
import { ImageWithFallback } from "./common/ImageWithFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { apiFetch, getImageUrl } from "../../lib/api";
import { toast } from "sonner";

interface ProductDetailsProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

interface Review {
  _id: string;
  user: { name: string; avatar?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export function ProductDetails({ product, open, onClose, onAddToCart }: ProductDetailsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!open || !product) return;
    const loadDetails = async () => {
      setReviewsLoading(true);
      try {
        const res = await apiFetch(`/products/${product.id}`);
        setReviews(res.product.reviews || []);
        setAverageRating(res.product.averageRating || 0);
        setNumReviews(res.product.numReviews || 0);
      } catch (err) {
        // Non-critical — leave reviews empty rather than blocking the dialog
      } finally {
        setReviewsLoading(false);
      }
    };
    loadDetails();
  }, [open, product?.id]);

  if (!product) return null;

  const handleToggleSave = async () => {
    try {
      const res = await apiFetch(`/users/me/saved/${product.id}`, { method: "POST" });
      setSaved(res.saved);
      toast.success(res.saved ? "Saved to your list" : "Removed from your list");
    } catch (err: any) {
      toast.error(err?.message || "Couldn't update saved items");
    }
  };

  const handleSubmitReview = async () => {
    if (myRating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await apiFetch(`/products/${product.id}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating: myRating, comment: myComment }),
      });
      setReviews(res.product.reviews || []);
      setAverageRating(res.product.averageRating || 0);
      setNumReviews(res.product.numReviews || 0);
      setMyRating(0);
      setMyComment("");
      toast.success("Review submitted!");
    } catch (err: any) {
      toast.error(err?.message || "Couldn't submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

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
                    star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {numReviews > 0 ? `${averageRating.toFixed(1)} (${numReviews} reviews)` : "No reviews yet"}
            </span>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-linear-to-br from-gray-100 to-gray-50 shadow-lg">
              <ImageWithFallback
                src={product.image}
                alt={product.title}
                className="object-cover w-full h-full"
              />
              <button
                onClick={handleToggleSave}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all"
              >
                <Heart className={`h-5 w-5 ${saved ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
              </button>
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
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shrink-0">
                  {product.seller.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-900">{product.seller}</span>
                  </div>
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

            <div className="border-t border-gray-200 pt-6 space-y-3">
              <Button
                className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all h-12 rounded-xl"
                onClick={() => product && onAddToCart?.(product)}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl border-gray-300"
                onClick={handleToggleSave}
              >
                <Heart className={`h-4 w-4 mr-2 ${saved ? "fill-red-500 text-red-500" : ""}`} />
                {saved ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <Tabs defaultValue="reviews" className="space-y-4">
            <TabsList className="bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="reviews" className="rounded-lg">
                Customer Reviews ({numReviews})
              </TabsTrigger>
              <TabsTrigger value="seller" className="rounded-lg">
                Seller Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-4">
              {reviewsLoading ? (
                <p className="text-sm text-gray-400 text-center py-6">Loading reviews...</p>
              ) : (
                <>
                  {numReviews > 0 && (
                    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
                      <div className="text-center">
                        <div className="text-4xl text-gray-900 mb-1">{averageRating.toFixed(1)}</div>
                        <div className="flex items-center gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{numReviews} reviews</p>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = reviews.filter((r) => r.rating === rating).length;
                          const percentage = numReviews > 0 ? (count / numReviews) * 100 : 0;
                          return (
                            <div key={rating} className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-gray-600 w-8">{rating}★</span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }} />
                              </div>
                              <span className="text-sm text-gray-600 w-8">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-6">
                        No reviews yet — be the first to review this item!
                      </p>
                    ) : (
                      reviews.map((review) => (
                        <div key={review._id} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-linear-to-br from-purple-400 to-pink-500 text-white">
                                {review.user?.name?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <span className="text-sm text-gray-900">{review.user?.name || "EcoVibe Member"}</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-3 w-3 ${
                                            star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {review.comment && <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <p className="text-sm text-gray-900">Write a Review</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setMyRating(star)}>
                          <Star
                            className={`h-6 w-6 ${
                              star <= myRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Share your experience with this item..."
                      value={myComment}
                      onChange={(e) => setMyComment(e.target.value)}
                      className="rounded-xl border-gray-300 resize-none"
                    />
                    <Button
                      onClick={handleSubmitReview}
                      disabled={submittingReview}
                      className="w-full rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="seller" className="space-y-4">
              <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl shrink-0">
                  {product.seller.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-gray-900">{product.seller}</h3>
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    {product.location ? `Based in ${product.location}` : "EcoVibe seller"}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}