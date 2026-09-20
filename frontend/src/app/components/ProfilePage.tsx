import React from "react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Camera, MapPin, Mail, Edit, ShieldCheck, Leaf } from "lucide-react";
import { apiFetch, getImageUrl } from "../../lib/api";
import { toast } from "sonner";

interface Profile {
  _id: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  avatar: string;
  role: string;
  isVerified: boolean;
  ecoScore: number;
  followers: string[];
  following: string[];
}

export function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listingsCount, setListingsCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);

  const [form, setForm] = useState({ name: "", bio: "", location: "" });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const meRes = await apiFetch("/users/me");
        const u: Profile = meRes.user;
        setProfile(u);
        setForm({ name: u.name || "", bio: u.bio || "", location: u.location || "" });

        const [productsRes, salesRes] = await Promise.all([
          apiFetch(`/users/${u._id}/products`),
          apiFetch("/orders/sales/mine"),
        ]);
        setListingsCount((productsRes.products || []).length);
        const units = (salesRes.sales || []).reduce(
          (sum: number, sale: any) => sum + sale.items.reduce((s: number, i: any) => s + i.quantity, 0),
          0
        );
        setSalesCount(units);
      } catch (err: any) {
        toast.error(err?.message || "Couldn't load your profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = new FormData();
      body.append("name", form.name);
      body.append("bio", form.bio);
      body.append("location", form.location);
      if (avatarFile) body.append("avatar", avatarFile);

      const res = await apiFetch("/users/me", { method: "PUT", body });
      setProfile(res.user);
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err?.message || "Couldn't save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-gray-400 text-sm">Loading profile...</div>;
  }
  if (!profile) {
    return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-gray-400 text-sm">Couldn't load your profile.</div>;
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 rounded-2xl border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-24 h-24">
                  {(avatarPreview || profile.avatar) && (
                    <AvatarImage src={avatarPreview || getImageUrl(profile.avatar)} />
                  )}
                  <AvatarFallback className="bg-linear-to-br from-emerald-500 to-teal-600 text-white text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <Camera className="h-4 w-4 text-gray-600" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>

              <h3 className="text-gray-900 mb-1">{profile.name}</h3>
              <p className="text-sm text-gray-500 mb-3 capitalize">{profile.role}</p>

              <div className="flex items-center justify-center gap-2 mb-4">
                {profile.isVerified && (
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-center gap-1 mb-6 text-emerald-600">
                <Leaf className="h-4 w-4" />
                <span className="text-sm">{profile.ecoScore} EcoScore</span>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div>
                  <div className="text-xl text-gray-900">{salesCount}</div>
                  <p className="text-xs text-gray-500">Sales</p>
                </div>
                <div>
                  <div className="text-xl text-gray-900">{listingsCount}</div>
                  <p className="text-xs text-gray-500">Listings</p>
                </div>
                <div>
                  <div className="text-xl text-gray-900">{profile.followers?.length || 0}</div>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="lg:col-span-2 rounded-2xl border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-emerald-600" />
              Edit Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="rounded-xl border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="rounded-xl border-gray-300 pl-10 bg-gray-50 text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-400">Email can't be changed here.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="rounded-xl border-gray-300 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell others about yourself and your passion for sustainability..."
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                className="rounded-xl border-gray-300 min-h-24 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                disabled={saving}
                onClick={handleSave}
                className="flex-1 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}