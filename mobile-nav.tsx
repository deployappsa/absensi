import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  FileText,
  UserCircle,
  Menu as MenuIcon
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

const menuItems = [
  {
    title: "Beranda",
    icon: Home,
    href: "/"
  },
  {
    title: "Absensi",
    icon: Calendar,
    href: "/attendance"
  },
  {
    title: "Pengajuan",
    icon: FileText,
    href: "/leaves"
  },
  {
    title: "Profil",
    icon: UserCircle,
    href: "/profile"
  }
];

export function MobileNav() {
  const [location] = useLocation();
  const { data } = useQuery<{ user: User }>({ queryKey: ["/api/users/me"] });

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <a className="flex flex-col items-center py-2 px-3">
                  <Icon className={cn(
                    "h-6 w-6",
                    isActive ? "text-primary" : "text-gray-500"
                  )} />
                  <span className={cn(
                    "text-xs mt-1",
                    isActive ? "text-primary font-medium" : "text-gray-500"
                  )}>
                    {item.title}
                  </span>
                </a>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-primary text-white z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <img src="/logo.svg" alt="Logo" className="h-8" />
          {data?.user.role === "admin" && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-white">
                <div className="py-4">
                  <h2 className="text-lg font-semibold px-4 mb-2">Menu Admin</h2>
                  <nav className="space-y-1">
                    <Link href="/admin/dashboard">
                      <a className="block px-4 py-2 text-sm hover:bg-gray-100">
                        Dashboard Admin
                      </a>
                    </Link>
                    <Link href="/admin/employees">
                      <a className="block px-4 py-2 text-sm hover:bg-gray-100">
                        Data Karyawan
                      </a>
                    </Link>
                    <Link href="/admin/shifts">
                      <a className="block px-4 py-2 text-sm hover:bg-gray-100">
                        Pengaturan Shift
                      </a>
                    </Link>
                    <Link href="/settings">
                      <a className="block px-4 py-2 text-sm hover:bg-gray-100">
                        Pengaturan
                      </a>
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </header>
    </>
  );
}
