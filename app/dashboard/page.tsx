import AdminSidebar from "@/src/components/admin/AdminSidebar";
import DashboardTopbar from "@/src/components/admin/DashboardTopbar";
import WelcomeBanner from "@/src/components/dashboard/WelcomeBanner";
import StatCard from "@/src/components/dashboard/StatCard";
import EnvironmentCharts from "@/src/components/dashboard/EnvironmentCharts";
import DeviceOverviewTable from "@/src/components/dashboard/DeviceOverviewTable";
import RecentAlertsCard from "@/src/components/dashboard/RecentAlertsCard";
import RecentCameraCard from "@/src/components/dashboard/RecentCameraCard";
import {
  chartData,
  dashboardSummary,
  deviceList,
  recentAlerts,
  cameraFeeds,
} from "@/src/data/dashboardMock";
import { Activity, Droplet, Flame, ShieldCheck, Thermometer, Zap } from "lucide-react";

export const metadata = {
  title: "HatchMate Admin Dashboard",
  description: "Dashboard HatchMate với welcome banner và KPI cards",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] gap-6 px-4 py-5 xl:px-8">
        <AdminSidebar />

        <main className="flex min-h-screen flex-1 flex-col gap-6 min-w-0">
          <DashboardTopbar />

          <div className="grid gap-6">
            <WelcomeBanner summary={dashboardSummary} />

            <section className="grid gap-6 xl:grid-cols-3">
              <StatCard
                label="Tổng thiết bị"
                value={`${dashboardSummary.totalDevices}`}
                description="Tổng số trạm ấp đang quản lý"
                accent="default"
                icon={<Activity className="h-5 w-5" />}
              />
              <StatCard
                label="Thiết bị online"
                value={`${dashboardSummary.onlineDevices}`}
                description="Thiết bị đang kết nối ổn định"
                accent="success"
                icon={<ShieldCheck className="h-5 w-5" />}
              />
              <StatCard
                label="Thiết bị đang ấp"
                value={`${dashboardSummary.incubatingDevices}`}
                description="Thiết bị đang trong chu kỳ ấp"
                accent="temperature"
                icon={<Flame className="h-5 w-5" />}
              />
              <StatCard
                label="Thiết bị cảnh báo"
                value={`${dashboardSummary.warningDevices}`}
                description="Thiết bị cần kiểm tra nhanh"
                accent="warning"
                icon={<Zap className="h-5 w-5" />}
              />
              <StatCard
                label="Nhiệt độ trung bình"
                value={`${dashboardSummary.avgTemperature.toFixed(1)}°C`}
                description="Mức nhiệt độ toàn hệ thống"
                accent="temperature"
                icon={<Thermometer className="h-5 w-5" />}
              />
              <StatCard
                label="Độ ẩm trung bình"
                value={`${dashboardSummary.avgHumidity}%`}
                description="Độ ẩm tổng thể của môi trường"
                accent="humidity"
                icon={<Droplet className="h-5 w-5" />}
              />
            </section>

            <EnvironmentCharts data={chartData} />

            <DeviceOverviewTable devices={deviceList} />

            <section className="grid gap-6 md:grid-cols-2">
              <RecentAlertsCard alerts={recentAlerts} />
              <RecentCameraCard feeds={cameraFeeds} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
