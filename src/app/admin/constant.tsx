import { SideNavItem } from "@/types/Types";
import { IconHome, IconList, IconUsers } from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Users",
    path: "/admin/users",
    icon: <IconUsers width="24" height="24" />,
  },
  {
    title: "Manage Tributes",
    path: "/admin/tributes",
    icon: <IconList width="24" height="24" />,
  },
];
