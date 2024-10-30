// SidebarMenu.js
import {faListCheck, faHouse, faUsers, faCartPlus, faEnvelope ,faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

export const SidebarMenu = [
  {
    name: "Home",
    path: "/admin",
    icon: faHouse,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: faUsers,
  },
  {
    name: "Products",
    path: "/manage/products",
    icon: faListCheck,
  },
  {
    name: "Bookings",
    path: "/admin/bookings",
    icon: faCartPlus,
  },
  {
    name: "Complaints",
    path: "/admin/complaints",
    icon: faEnvelope,
  },
  {
    name: "Logout",
    path: "/",
    icon: faSignOutAlt,
    action: 'logout' // Indicate that this item triggers a logout
  }
];
