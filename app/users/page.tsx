"use client";

import { CreateAdminModal } from "@/components/create-admin-modal";
import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Edit,
  Mail,
  Search,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "superAdmin";
  createdAt: string;
  lastLogin: string;
  status: "active" | "inactive";
}

export default function UserManagementPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

    // Mock data for admins
    const mockAdmins: Admin[] = [
      {
        id: "1",
        email: "admin@demo.com",
        firstName: "John",
        lastName: "Doe",
        role: "admin",
        createdAt: "2024-01-10T10:00:00Z",
        lastLogin: "2024-01-15T09:30:00Z",
        status: "active",
      },
      {
        id: "2",
        email: "super@demo.com",
        firstName: "Jane",
        lastName: "Smith",
        role: "superAdmin",
        createdAt: "2024-01-01T10:00:00Z",
        lastLogin: "2024-01-15T10:45:00Z",
        status: "active",
      },
      {
        id: "3",
        email: "admin2@demo.com",
        firstName: "Mike",
        lastName: "Johnson",
        role: "admin",
        createdAt: "2024-01-12T14:20:00Z",
        lastLogin: "2024-01-14T16:15:00Z",
        status: "active",
      },
    ];

    setTimeout(() => {
      setAdmins(mockAdmins);
      setFilteredAdmins(mockAdmins);
      setLoading(false);
    }, 1000);
  }, [router]);

  useEffect(() => {
    const filtered = admins.filter(
      (admin) =>
        admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAdmins(filtered);
  }, [searchTerm, admins]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteAdmin = (adminId: string) => {
    setAdmins((prev) => prev.filter((admin) => admin.id !== adminId));
    toast("Admin Deleted", {
      description: "Admin account has been removed successfully.",
    });
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-8 h-8 text-blue-600" />
              User Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage admin users and their permissions
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Admin
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Admins
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {admins.length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Super Admins
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      admins.filter((admin) => admin.role === "superAdmin")
                        .length
                    }
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {admins.filter((admin) => admin.status === "active").length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin List */}
        <Card className="bg-white border-0 shadow-md">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Admin Users
              </CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search admins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">
                        {admin.firstName} {admin.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {admin.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            admin.role === "superAdmin"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          {admin.role === "superAdmin"
                            ? "Super Admin"
                            : "Admin"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(admin.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(admin.lastLogin)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            admin.status === "active" ? "default" : "secondary"
                          }
                          className={
                            admin.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {admin.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {admin.id !== currentUser.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteAdmin(admin.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredAdmins.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No admins found
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "Try adjusting your search terms."
                    : "Create your first admin to get started."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CreateAdminModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
