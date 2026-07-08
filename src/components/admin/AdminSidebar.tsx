"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BellRing,
  Camera,
  ClipboardList,
  Cpu,
  Home,
  Menu,
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
  { label: "Cảnh báo", icon: BellRing, href: "/alerts" },
  { label: "Nhật ký", icon: ClipboardList, href: "/logs" },
  { label: "Báo cáo", icon: BarChart3, href: "/reports" },
];

interface SidebarNavItemProps {
  label: string;
  Icon: LucideIcon;
  href: string;
  active: boolean;
  collapsed: boolean;
}

function SidebarNavItem({
  label,
  Icon,
  href,
  active,
  collapsed,
}: SidebarNavItemProps) {
  return (
    <div className="group relative">
      <Link
        href={href}
        className={`flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-sm font-medium transition ${
          collapsed ? "justify-center px-0" : ""
        } ${
          active
            ? "bg-sky-50 text-sky-700 shadow-sm"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
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

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname() || "";

  return (
    <aside
      className={`sticky top-5 hidden h-[calc(100vh-40px)] flex-col rounded-[16px] border border-slate-200/80 bg-white py-6 shadow-sm transition-all duration-300 md:flex ${
        collapsed ? "w-[88px] px-3" : "w-[280px] px-5"
      }`}
    >
      {/* Header */}
      <div
        className={`mb-10 rounded-[24px] border border-slate-200/60 bg-slate-50 shadow-sm ${
          collapsed ? "p-2" : "p-4"
        }`}
      >
        <div
          className={`flex items-center gap-3 ${collapsed ? "flex-col" : "mb-5"}`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-sky-100 text-sky-700">
            <span className="text-lg font-semibold">HM</span>
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold text-slate-900">HatchMate Admin</p>
              <p className="text-xs text-slate-500">Bảng điều khiển hệ thống</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {!collapsed && (
          <div className="rounded-3xl bg-white p-3 text-sm text-slate-500">
            Web admin giám sát hệ thống ấp trứng thông minh
          </div>
        )}
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
            />
          );
        })}
      </nav>
    </aside>
  );
}