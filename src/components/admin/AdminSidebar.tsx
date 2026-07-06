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

const menus = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "Thiết bị", icon: Cpu, active: false },
  { label: "Người dùng", icon: Users, active: false },
  { label: "Camera & AI", icon: Camera, active: false },
  { label: "Cấu hình ấp", icon: SlidersHorizontal, active: false },
  { label: "Cảnh báo", icon: BellRing, active: false },
  { label: "Nhật ký", icon: ClipboardList, active: false },
  { label: "Báo cáo", icon: BarChart3, active: false },
];

function SidebarNavItem({
  label,
  Icon,
  active,
}: {
  label: string;
  Icon: LucideIcon;
  active: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-sm font-medium transition ${
        active
          ? "bg-sky-50 text-sky-700 shadow-sm"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}

export default function AdminSidebar() {
  return (
    <aside className="hidden h-screen min-w-[280px] flex-col border-r border-slate-200/80 bg-white px-5 py-6 shadow-sm xl:flex">
      <div className="mb-10 rounded-[24px] border border-slate-200/60 bg-slate-50 p-4 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-100 text-sky-700">
            <span className="text-lg font-semibold">HM</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">HatchMate Admin</p>
            <p className="text-xs text-slate-500">Bảng điều khiển hệ thống</p>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-3 text-sm text-slate-500">
          Web admin giám sát hệ thống ấp trứng thông minh
        </div>
      </div>

      <nav className="space-y-2">
        {menus.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarNavItem
              key={item.label}
              label={item.label}
              Icon={Icon}
              active={item.active}
            />
          );
        })}
      </nav>
    </aside>
  );
}
