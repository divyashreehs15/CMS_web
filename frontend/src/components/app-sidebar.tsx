"use client";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Calendar,
  FileText,
  DollarSign,
  Stethoscope,
  Home,
  LogOut,
  BarChart3,
  UserCircle,
  Gavel,
} from "lucide-react";

interface AppSidebarProps {
  variant?: "inset";
}

export function AppSidebar({ variant }: AppSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const jailerNavItems = [
    {
      title: "Dashboard",
      href: "/app/jailer",
      icon: Home,
    },
    {
      title: "Prisoners",
      href: "/app/jailer/prisoners",
      icon: Users,
    },
    {
      title: "Family Connections",
      href: "/app/jailer/family-connections",
      icon: Users,
    },
    {
      title: "Appointments",
      href: "/app/jailer/appointments",
      icon: Calendar,
    },
    {
      title: "Medical Records",
      href: "/app/jailer/medical",
      icon: Stethoscope,
    },
    {
      title: "Wages",
      href: "/app/jailer/wages",
      icon: DollarSign,
    },
    {
      title: "Court Hearings",
      href: "/app/jailer/court",
      icon: Gavel,
    },
    {
      title: "Analytics",
      href: "/app/jailer/analytics",
      icon: BarChart3,
    },
  ];

  const familyNavItems = [
    {
      title: "Dashboard",
      href: "/app/family/analytics",
      icon: Home,
    },
    {
      title: "Prisoner Info",
      href: "/app/family/prisoner-info",
      icon: UserCircle,
    },
    {
      title: "Appointments",
      href: "/app/family/appointments",
      icon: Calendar,
    },
    {
      title: "Wages",
      href: "/app/family/wages",
      icon: DollarSign,
    },
    {
      title: "Analytics",
      href: "/app/family/analytics",
      icon: BarChart3,
    },
  ];

  const navItems = user.role === "jailer" ? jailerNavItems : familyNavItems;

  return (
    <div className={cn(
      "flex h-screen w-64 flex-col border-r bg-background",
      variant === "inset" && "border-0"
    )}>
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold tracking-tight">
          Prison Management
        </h2>
        <p className="text-sm text-muted-foreground">
          {user.role === "jailer" ? "Jailer Portal" : "Family Portal"}
        </p>
      </div>
      <ScrollArea className="flex-1 px-2 py-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === item.href && "bg-muted font-medium"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
