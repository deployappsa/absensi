import { Link, useLocation } from "wouter";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Home, Calendar, ClipboardList, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function Nav() {
  const [location] = useLocation();
  const { data } = useQuery<{ user: User }>({ queryKey: ["/api/users/me"] });

  const handleLogout = async () => {
    await apiRequest("POST", "/api/auth/logout");
    window.location.href = "/login";
  };

  const isActive = (path: string) => location === path;

  return (
    <NavigationMenu className="max-w-full w-full justify-between px-4 py-2 border-b">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/">
            <Button variant={isActive("/") ? "default" : "ghost"}>
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/attendance">
            <Button variant={isActive("/attendance") ? "default" : "ghost"}>
              <Calendar className="mr-2 h-4 w-4" />
              Attendance
            </Button>
          </Link>
        </NavigationMenuItem>
        {data?.user.role === "admin" && (
          <NavigationMenuItem>
            <Link href="/admin/dashboard">
              <Button variant={isActive("/admin/dashboard") ? "default" : "ghost"}>
                <ClipboardList className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
