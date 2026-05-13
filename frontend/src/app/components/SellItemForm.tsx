import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SellItemFormProps {
  open: boolean;
  onClose: () => void;
}

export function SellItemForm({ open, onClose }: SellItemFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    condition: "",
    location: "",
    description: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }
    const newImages = [...images, ...files];
    setImages(newImages);
    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }
    toast.success("Item listed successfully!", {
      description: "Your item is now live on EcoVibe!",
    });
    onClose();
    setFormData({ title: "", price: "", category: "", condition: "", location: "", description: "" });
    setImages([]);
    setPreviews([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl">List Your Item</DialogTitle>
          <DialogDescription>
            Share your pre-loved items with the EcoVibe community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Photos (max 5) *</Label>

            {/* Image Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-3">
                {previews.map((src, index) => (
                  <div key={index} className="relative rounded-xl overflow-hidden h-28">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Box */}
            {previews.length < 5 && (
              <label className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group block">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-100 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 group-hover:text-emerald-600" />
                </div>
                <p className="text-gray-700 mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB (max 5 photos)</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Vintage Oak Dining Table"
              className="h-12 rounded-xl border-gray-300"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="price">Price (₹) *</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  className="h-12 rounded-xl border-gray-300 pl-8"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="h-12 rounded-xl border-gray-300">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="furniture">🪑 Furniture</SelectItem>
                  <SelectItem value="clothing">👕 Clothing</SelectItem>
                  <SelectItem value="electronics">💻 Electronics</SelectItem>
                  <SelectItem value="decor">🏺 Home Decor</SelectItem>
                  <SelectItem value="books">📚 Books</SelectItem>
                  <SelectItem value="materials">♻️ Materials</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="condition">Condition *</Label>
              <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                <SelectTrigger className="h-12 rounded-xl border-gray-300">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Needs Repair">Needs Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="City, State"
                className="h-12 rounded-xl border-gray-300"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your item's condition, history, and why you're giving it a second life..."
              className="min-h-36 rounded-xl border-gray-300 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <h4 className="text-emerald-900 mb-2 flex items-center gap-2">
              <span className="text-lg">♻️</span>
              Sustainability Impact
            </h4>
            <p className="text-sm text-emerald-700">
              By listing this item, you're helping reduce waste and extend the life of useful products. 
              Thank you for being part of the circular economy!
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl border-gray-300" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all">
              List Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}