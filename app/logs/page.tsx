import AdminSidebar from "@/src/components/admin/AdminSidebar";
import LogsPageHeader from "@/src/components/logs/LogsPageHeader";
import LogsMiniStatCard from "@/src/components/logs/LogsMiniStatCard";
import LogFilterBar from "@/src/components/logs/LogFilterBar";
import LogsTable from "@/src/components/logs/LogsTable";
import { logsSummaryData, logMockList } from "@/src/data/logsMock";
import { 
  Database, 
  Cpu, 
  ShieldAlert, 
  Settings
} from "lucide-react";

export const metadata = {
  title: "Nhật ký hệ thống - HatchMate Admin",
  description: "Theo dõi lịch sử hoạt động của thiết bị, cảnh báo và thao tác quản trị trong HatchMate",
};

export default function LogsPage() {
  const { totalToday, deviceLogs, alertLogs, adminLogs } = logsSummaryData;

  return (
    <div className="min-h-screen text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] gap-6 px-4 py-5 xl:px-8">
        <AdminSidebar />

        <main className="flex min-h-screen flex-1 flex-col gap-6 min-w-0">
          {/* Header */}
          <LogsPageHeader totalToday={totalToday} />

          {/* Mini Stats Component Section */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <LogsMiniStatCard
              label="Tổng log hôm nay"
              value={totalToday}
              icon={Database}
              accent="indigo"
            />
            <LogsMiniStatCard
              label="Log thiết bị"
              value={deviceLogs}
              icon={Cpu}
              accent="emerald"
            />
            <LogsMiniStatCard
              label="Log cảnh báo"
              value={alertLogs}
              icon={ShieldAlert}
              accent="rose"
            />
            <LogsMiniStatCard
              label="Log quản trị"
              value={adminLogs}
              icon={Settings}
              accent="amber"
            />
          </section>

          {/* Search & Filter Bar */}
          <LogFilterBar />

          {/* Logs Table Component Section */}
          <LogsTable logs={logMockList} />
        </main>
      </div>
    </div>
  );
}
