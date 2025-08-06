"use client";

import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Shield, User, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { CreateAdminModal } from "@/components/create-admin-modal";
import { toast } from "sonner";

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "superAdmin";
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);

  useEffect(() => {
    // Get user data from localStorage (replace with proper auth)
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFirstName(parsedUser.firstName);
      setLastName(parsedUser.lastName);
    }
  }, []);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    // Mock API call to update profile
    setTimeout(() => {
      const updatedUser = { ...user, firstName, lastName };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSaving(false);
      toast("Profile Updated", {
        description: "Your profile has been saved successfully.",
      });
    }, 1000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account settings</p>
          </div>

          <div className="space-y-6">
            {/* Profile Information */}
            <Card className="bg-white border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-gray-600">{user.email}</p>
                    <Badge
                      variant="outline"
                      className="mt-2 bg-blue-50 text-blue-700 border-blue-200"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role === "superAdmin" ? "Super Admin" : "Admin"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-gray-500">
                    Email cannot be changed
                  </p>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {saving ? (
                    <>
                      <Save className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Admin Management - Only for Super Admin */}
            {user.role === "superAdmin" && (
              <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Admin Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    As a Super Admin, you can create new admin accounts for the
                    system.
                  </p>
                  <Button
                    onClick={() => setIsCreateAdminModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create New Admin
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <CreateAdminModal
        isOpen={isCreateAdminModalOpen}
        onClose={() => setIsCreateAdminModalOpen(false)}
      />
    </div>
  );
}
