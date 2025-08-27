"use client";

import * as React from "react";
import { BriefcaseBusiness, Command } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "../NavMain";
import { NavUser } from "../NavUser";

const data = {
  user: {
    name: "user",
    email: "m@example.com",
    avatar: "/avatar.jpeg",
  },
  navMain: [
    {
      title: "Mantenimiento",

      icon: BriefcaseBusiness,
      isActive: true,
      items: [
        {
          title: "Productos",
          url: "/admin/productos",
        },
        {
          title: "Banners",
          url: "/admin/banners",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex gap-2">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Chantilly SAC</span>
                <span className="truncate text-xs">Empresa</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
