"use client";
import {
  UserPlus,
  DollarSign,
  Stethoscope,
  Calendar,
  Gavel,
  FileText,
  Clock,
  LogOut,
  Shield,
  Users,
  Settings,
  LifeBuoy,
  Projector,
  Sofa,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import Link from "next/link";

export const navigationData = {
  user: {
    name: "Prison Management",
    email: "admin@prison.com",
    avatar: "https://github.com/shadcn.png",
  },
  navMain: [
    {
      label: "Jailer Dashboard",
      items: [
        { name: "Prisoners", url: "/app/jailer/prisoners", icon: UserPlus },
        { name: "Appointments", url: "/app/jailer/appointments", icon: Projector },
        { name: "Hearings", url: "/app/jailer/hearings", icon: Sofa },
        { name: "Medical", url: "/app/jailer/medical", icon: Stethoscope },
        { name: "Wages", url: "/app/jailer/wages", icon: DollarSign },
      ],
    },
    {
      label: "Family Dashboard",
      items: [
        { name: "Prisoner Information", url: "/app/family?section=prisoner-info", icon: FileText },
        { name: "Visit Appointments", url: "/app/family?section=appointments", icon: Calendar },
        { name: "Court Hearings", url: "/app/family?section=hearings", icon: Clock },
      ],
    },
    {
      label: "Settings",
      items: [
        { name: "Settings", url: "/app/settings", icon: Settings },
      ],
    },
  ],
  navSecondary: [
    { title: "Support", url: "/app/support", icon: LifeBuoy },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  pathname?: string;
  role?: "jailer" | "family";
}

export function AppSidebar({ pathname = "", role = "jailer", ...props }: AppSidebarProps) {
  // Filter navigation items based on role
  const filteredNavMain = navigationData.navMain.filter(section => {
    if (section.label === "Jailer Dashboard") return role === "jailer";
    if (section.label === "Family Dashboard") return role === "family";
    return true; // Always show Settings
  });

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={role === "jailer" ? "/app/jailer" : "/app/family"}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {role === "jailer" ? <Shield className="size-4" /> : <Users className="size-4" />}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Prison Management</span>
                  <span className="truncate text-xs">{role === "jailer" ? "Jailer Portal" : "Family Portal"}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} currentPath={pathname} />
        <NavSecondary
          items={navigationData.navSecondary}
          className="mt-auto"
          currentPath={pathname}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navigationData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
