import {
  BarChart3,
  BellRing,
  Camera,
  ClipboardList,
  Cpu,
  Home,
  SlidersHorizontal,
  Users,
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

export default function AdminSidebar() {
  return (
    <aside className="hidden h-screen min-w-[280px] flex-col border-r border-slate-200/80 bg-white/90 px-5 py-6 shadow-sm xl:flex">
      <div className="mb-10 flex items-center gap-3 rounded-3xl border border-slate-200/60 bg-slate-50 p-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
          <span className="text-lg font-semibold">HM</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">HatchMate Admin</p>
          <p className="text-xs text-slate-500">Bảng điều khiển hệ thống</p>
        </div>
      </div>

      <nav className="space-y-1">
        {menus.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm font-medium transition ${
                item.active
                  ? "bg-amber-50 text-amber-700 shadow-sm"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
