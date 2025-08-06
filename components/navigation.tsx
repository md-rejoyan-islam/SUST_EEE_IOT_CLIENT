"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart3,
  Bell,
  TabletsIcon as Devices,
  Home,
  LogOut,
  Menu,
  Settings,
  Shield,
  User,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "superAdmin";
}

export function Navigation() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  const mainNavItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
      description: "View and monitor all IoT devices",
    },
    {
      name: "Devices",
      href: "/devices",
      icon: Devices,
      description: "Manage individual devices",
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      description: "Device performance metrics",
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
      description: "Device alerts and notices",
    },
  ];

  const userManagementItems = [
    {
      name: "Create User",
      href: "/create-user",
      icon: UserPlus,
      description: "Add new device operators",
    },
    {
      name: "Manage Users",
      href: "/users",
      icon: Users,
      description: "View and manage all users",
    },
    {
      name: "User Activity",
      href: "/user-activity",
      icon: Activity,
      description: "Track user actions",
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50 ">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">IoT Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Main Navigation */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    <Home className="w-4 h-4 mr-2" />
                    Main
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={item.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                  isActive(item.href) &&
                                    "bg-blue-50 text-blue-600"
                                )}
                              >
                                <div className="flex items-center gap-2 text-sm font-medium leading-none">
                                  <Icon className="w-4 h-4" />
                                  {item.name}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* User Management - Only for Super Admin */}
                {user.role === "superAdmin" && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">
                      <Users className="w-4 h-4 mr-2" />
                      Users
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px]">
                        {userManagementItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <li key={item.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={item.href}
                                  className={cn(
                                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                    isActive(item.href) &&
                                      "bg-blue-50 text-blue-600"
                                  )}
                                >
                                  <div className="flex items-center gap-2 text-sm font-medium leading-none">
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {item.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          );
                        })}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}

                {/* Profile Link */}
                <NavigationMenuItem>
                  <Link href="/profile" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                        isActive("/profile") && "bg-blue-50 text-blue-600"
                      )}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Profile
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            {/* User Info - Desktop */}
            <div className="hidden xl:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                {user.role === "superAdmin" ? "Super Admin" : "Admin"}
              </Badge>
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-10 w-10 rounded-full bg-blue-100 hover:bg-blue-200"
                >
                  <User className="h-5 w-5 text-blue-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 w-fit mt-1"
                    >
                      {user.role === "superAdmin" ? "Super Admin" : "Admin"}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                {user.role === "superAdmin" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/create-user" className="flex items-center">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create User
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/users" className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Manage Users
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    IoT Hub Menu
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* User Info */}
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 w-fit mt-1"
                      >
                        {user.role === "superAdmin" ? "Super Admin" : "Admin"}
                      </Badge>
                    </div>
                  </div>

                  {/* Main Navigation */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Main Navigation
                    </h3>
                    <div className="space-y-1">
                      {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors",
                              isActive(item.href)
                                ? "bg-blue-100 text-blue-600"
                                : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Icon className="w-5 h-5" />
                            <div>
                              <div>{item.name}</div>
                              <div className="text-xs text-gray-500">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* User Management - Super Admin Only */}
                  {user.role === "superAdmin" && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        User Management
                      </h3>
                      <div className="space-y-1">
                        {userManagementItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors",
                                isActive(item.href)
                                  ? "bg-blue-100 text-blue-600"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                              )}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Icon className="w-5 h-5" />
                              <div>
                                <div>{item.name}</div>
                                <div className="text-xs text-gray-500">
                                  {item.description}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Profile & Logout */}
                  <div className="border-t pt-4">
                    <Link
                      href="/profile"
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors mb-2",
                        isActive("/profile")
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      Profile Settings
                    </Link>
                    <Button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
