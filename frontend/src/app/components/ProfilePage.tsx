import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Camera, MapPin, Mail, Phone, Edit, ShieldCheck, Star } from "lucide-react";

export function ProfilePage() {
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
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-2xl">
                    SM
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              <h3 className="text-gray-900 mb-1">Sarah Miller</h3>
              <p className="text-sm text-gray-500 mb-3">@sarahmiller</p>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Verified Seller
                </Badge>
              </div>

              <div className="flex items-center justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 ml-2">(4.9)</span>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div>
                  <div className="text-xl text-gray-900">47</div>
                  <p className="text-xs text-gray-500">Sales</p>
                </div>
                <div>
                  <div className="text-xl text-gray-900">23</div>
                  <p className="text-xs text-gray-500">Listings</p>
                </div>
                <div>
                  <div className="text-xl text-gray-900">98%</div>
                  <p className="text-xs text-gray-500">Rating</p>
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
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  defaultValue="Sarah"
                  className="rounded-xl border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  defaultValue="Miller"
                  className="rounded-xl border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  defaultValue="sarah.miller@example.com"
                  className="rounded-xl border-gray-300 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="rounded-xl border-gray-300 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  defaultValue="Portland, OR"
                  className="rounded-xl border-gray-300 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell others about yourself and your passion for sustainability..."
                defaultValue="Passionate about sustainable living and giving items a second life. Selling quality pre-loved items to help reduce waste!"
                className="rounded-xl border-gray-300 min-h-24 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-gray-300"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card className="rounded-2xl border-gray-200">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive updates via email</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">SMS Alerts</p>
                <p className="text-xs text-gray-500">Get text message updates</p>
              </div>
              <input type="checkbox" className="w-4 h-4 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">Marketing Messages</p>
                <p className="text-xs text-gray-500">Promotional offers and tips</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200">
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start rounded-xl border-gray-300"
            >
              Change Password
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start rounded-xl border-gray-300"
            >
              Two-Factor Authentication
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start rounded-xl border-gray-300 text-red-600 hover:text-red-700"
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
