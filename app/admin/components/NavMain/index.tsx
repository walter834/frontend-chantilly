"use client";

import { useState } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  // Estado para controlar qué items están abiertos
  const [openItems, setOpenItems] = useState<Record<string, boolean>>(
    // Inicializar con items activos abiertos
    items.reduce((acc, item) => {
      acc[item.title] = item.isActive || false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleItem = (itemTitle: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }));
  };

  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const path = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            open={openItems[item.title]}
            onOpenChange={() => toggleItem(item.title)}
          >
            <SidebarMenuItem>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="flex justify-between items-center "
                    >
                      <div className="flex  gap-2">
                        <item.icon className="size-5" />
                        <span>{item.title}</span>
                      </div>
                      <div
                        className={`text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden flex aspect-square w-5 items-center justify-center rounded-md p-0 text-xs transition-transform duration-200 ${
                          openItems[item.title] ? "rotate-90" : ""
                        }`}
                      >
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        /* esteee */
                        <SidebarMenuSubItem
                          key={subItem.title}
                          className={path === subItem.url ? "bg-red-50 text-red-700 border border-red-200" : ""}

                        >
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url} onClick={handleNavClick}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
