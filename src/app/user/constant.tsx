import { SideNavItem } from "@/types/Types";
import {
  IconHome,
  IconUsers,
  IconTrident,
  IconUser,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/user/dashboard",
    icon: <IconHome width="24" height="24" />,
  },
  {
    title: "Tributes",
    path: "/user/tributes",
    icon: <IconTrident width="24" height="24" />,
  },
  {
    title: "Users",
    path: "/user/users",
    icon: <IconUsers width="24" height="24" />,
  },
  {
    title: "Profile",
    path: "/user/profile",
    icon: <IconUser width="24" height="24" />,
  },
];
