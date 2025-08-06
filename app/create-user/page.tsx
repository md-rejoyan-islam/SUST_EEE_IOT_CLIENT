"use client";

import type React from "react";

import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  TabletsIcon as Devices,
  Eye,
  EyeOff,
  Save,
  Shield,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Device {
  id: string;
  name: string;
  status: "online" | "offline";
  location: string;
}

export default function CreateUserPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "operator",
    department: "",
    phoneNumber: "",
    notes: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is super admin
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);

      if (user.role !== "superAdmin") {
        toast("Access Denied", {
          description: "You don't have permission to access this page.",
        });
        router.push("/");
        return;
      }
    }

    // Mock devices data
    const mockDevices: Device[] = [
      {
        id: "device-001",
        name: "Smart Display - Lobby",
        status: "online",
        location: "Main Lobby",
      },
      {
        id: "device-002",
        name: "Smart Display - Conference Room A",
        status: "online",
        location: "Floor 2",
      },
      {
        id: "device-003",
        name: "Smart Display - Break Room",
        status: "offline",
        location: "Floor 1",
      },
      {
        id: "device-004",
        name: "Smart Display - Reception",
        status: "online",
        location: "Ground Floor",
      },
      {
        id: "device-005",
        name: "Smart Display - Meeting Room B",
        status: "online",
        location: "Floor 3",
      },
    ];

    setTimeout(() => {
      setDevices(mockDevices);
      setLoading(false);
    }, 1000);
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeviceToggle = (deviceId: string) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleSelectAllDevices = () => {
    if (selectedDevices.length === devices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(devices.map((d) => d.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      toast("Validation Error", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    if (selectedDevices.length === 0) {
      toast("Validation Error", {
        description:
          "Please select at least one device for the user to control.",
      });
      return;
    }

    setCreating(true);

    // Mock API call to create user
    setTimeout(() => {
      toast("User Created Successfully", {
        description: `${formData.firstName} ${formData.lastName} has been created with access to ${selectedDevices.length} device(s).`,
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "operator",
        department: "",
        phoneNumber: "",
        notes: "",
      });
      setSelectedDevices([]);
      setCreating(false);

      // Redirect to users page
      router.push("/users");
    }, 2000);
  };

  if (!currentUser || currentUser.role !== "superAdmin") {
    return null;
  }

  if (loading) {
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/users">
              <Button variant="outline" className="mb-4 bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-3 rounded-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Create New User
                </h1>
                <p className="text-gray-600 mt-1">
                  Add a new user to control IoT devices
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* User Information */}
              <div className="lg:col-span-2">
                <Card className="bg-white border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      User Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="Enter first name"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Enter last name"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">User Role</Label>
                        <Select
                          value={formData.role}
                          onValueChange={(value) =>
                            handleInputChange("role", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="operator">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Device Operator
                              </div>
                            </SelectItem>
                            <SelectItem value="supervisor">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Supervisor
                              </div>
                            </SelectItem>
                            <SelectItem value="admin">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Admin
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          placeholder="e.g., IT, Operations, Marketing"
                          value={formData.department}
                          onChange={(e) =>
                            handleInputChange("department", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="Enter phone number"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional notes about the user..."
                        value={formData.notes}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Device Access */}
              <div>
                <Card className="bg-white border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Devices className="w-5 h-5 text-blue-600" />
                      Device Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Select Devices</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAllDevices}
                      >
                        {selectedDevices.length === devices.length
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {devices.map((device) => (
                        <div
                          key={device.id}
                          className="flex items-start space-x-3 p-3 border rounded-lg"
                        >
                          <Checkbox
                            id={device.id}
                            checked={selectedDevices.includes(device.id)}
                            onCheckedChange={() =>
                              handleDeviceToggle(device.id)
                            }
                          />
                          <div className="flex-1 min-w-0">
                            <Label
                              htmlFor={device.id}
                              className="cursor-pointer"
                            >
                              <div className="font-medium text-sm">
                                {device.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {device.location}
                              </div>
                              <Badge
                                variant={
                                  device.status === "online"
                                    ? "default"
                                    : "secondary"
                                }
                                className={`mt-1 text-xs ${
                                  device.status === "online"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {device.status}
                              </Badge>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <strong>{selectedDevices.length}</strong> of{" "}
                      <strong>{devices.length}</strong> devices selected
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/users")}
                className="flex-1 sm:flex-none bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creating}
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
              >
                {creating ? (
                  <>
                    <UserPlus className="w-4 h-4 mr-2 animate-pulse" />
                    Creating User...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
