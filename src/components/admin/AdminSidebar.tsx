"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BellRing,
  Camera,
  ClipboardList,
  Cpu,
  Home,
  SlidersHorizontal,
  Users,
  LucideIcon,
} from "lucide-react";

interface MenuItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

const menus: MenuItem[] = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Thiết bị", icon: Cpu, href: "/devices" },
  { label: "Người dùng", icon: Users, href: "/users" },
  { label: "Camera & AI", icon: Camera, href: "/camera" },
  { label: "Cấu hình ấp", icon: SlidersHorizontal, href: "/settings" },
  // { label: "Cảnh báo", icon: BellRing, href: "/alerts" },
  { label: "Nhật ký", icon: ClipboardList, href: "/logs" },
  { label: "Báo cáo", icon: BarChart3, href: "/reports" },
];

interface SidebarNavItemProps {
  label: string;
  Icon: LucideIcon;
  href: string;
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}

function SidebarNavItem({
  label,
  Icon,
  href,
  active,
  collapsed,
  onClick,
}: SidebarNavItemProps) {
  return (
    <div className="group relative">
      <Link
        href={href}
        onClick={onClick}
        className={`flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-sm transition ${collapsed ? "justify-center px-0" : ""
          } ${active
            ? "bg-amber-100 text-slate-950 font-bold shadow-sm"
            : "text-slate-900 font-semibold hover:bg-amber-50/60 hover:text-black"
          }`}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span>{label}</span>}
      </Link>

      {/* Tooltip khi thu gọn */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
          {label}
        </span>
      )}
    </div>
  );
}

interface AdminSidebarProps {
  collapsed: boolean;
  onItemClick?: () => void;
}

export default function AdminSidebar({ collapsed, onItemClick }: AdminSidebarProps) {
  const pathname = usePathname() || "";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-slate-200 bg-white py-6 transition-all duration-300 md:static md:h-[calc(100vh-64px)] shrink-0 ${collapsed
        ? "-translate-x-full md:translate-x-0 md:w-[76px] md:px-2"
        : "translate-x-0 md:w-[260px] md:px-4"
        } w-[260px] px-4 overflow-y-auto`}
    >
      {/* Header Info (Optional/Simplified) */}
      <div className="mb-6 px-2">
        <div className="flex items-center gap-3">
          {/* Thay thế cụm div HM cũ: */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 font-extrabold text-sm border border-sky-100 overflow-hidden">
            <img
              src="/logov2.png" // Đường dẫn đến ảnh logo của bạn trong thư mục public
              alt="Logo"
              className="h-full w-full object-cover"
            />
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-sky-950 truncate">HatchMate</p>
              <p className="text-[10px] font-medium text-slate-400 truncate">Hệ thống ấp trứng gà thông minh</p>
            </div>
          )}
        </div>
      </div>



      <nav className="space-y-2">
        {menus.map((item) => {
          const Icon = item.icon;
          // Determine active status dynamically: active if pathname is exact or if it starts with the item's href (for nested subroutes)
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <SidebarNavItem
              key={item.label}
              label={item.label}
              Icon={Icon}
              href={item.href}
              active={isActive}
              collapsed={collapsed}
              onClick={onItemClick}
            />
          );
        })}
      </nav>
    </aside>
  );
}