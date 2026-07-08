import AdminSidebar from "@/src/components/admin/AdminSidebar";
import ReportsPageHeader from "@/src/components/reports/ReportsPageHeader";
import ReportsMiniStatCard from "@/src/components/reports/ReportsMiniStatCard";
import ReportFilterBar from "@/src/components/reports/ReportFilterBar";
import ReportsChartsSection from "@/src/components/reports/ReportsChartsSection";
import ReportSummaryTable from "@/src/components/reports/ReportSummaryTable";
import ReportExportCard from "@/src/components/reports/ReportExportCard";
import { reportsSummaryData, reportChartData, reportSummaryList } from "@/src/data/reportsMock";
import { 
  Cpu, 
  Activity, 
  AlertTriangle, 
  Thermometer
} from "lucide-react";

export const metadata = {
  title: "Báo cáo & thống kê - HatchMate Admin",
  description: "Tổng hợp hiệu suất thiết bị, dữ liệu môi trường và cảnh báo trong hệ thống HatchMate",
};

export default function ReportsPage() {
  const { trackedDevices, avgOnlineRate, totalAlerts, avgTemperature } = reportsSummaryData;

  return (
    <div className="min-h-screen text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] gap-6 px-4 py-5 xl:px-8">
        <AdminSidebar />

        <main className="flex min-h-screen flex-1 flex-col gap-6 min-w-0">
          {/* Header */}
          <ReportsPageHeader />

          {/* Mini Stats Component Section */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ReportsMiniStatCard
              label="Tổng thiết bị theo dõi"
              value={trackedDevices}
              icon={Cpu}
              accent="indigo"
            />
            <ReportsMiniStatCard
              label="Tỷ lệ online trung bình"
              value={`${avgOnlineRate}%`}
              icon={Activity}
              accent="emerald"
            />
            <ReportsMiniStatCard
              label="Tổng cảnh báo trong kỳ"
              value={totalAlerts}
              icon={AlertTriangle}
              accent="rose"
            />
            <ReportsMiniStatCard
              label="Nhiệt độ TB hệ thống"
              value={`${avgTemperature.toFixed(1)}°C`}
              icon={Thermometer}
              accent="amber"
            />
          </section>

          {/* Report Filter Bar */}
          <ReportFilterBar />

          {/* Charts Component Section */}
          <ReportsChartsSection data={reportChartData} />

          {/* Summary Table & Export Card Section */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <ReportSummaryTable items={reportSummaryList} />
            <ReportExportCard />
          </div>
        </main>
      </div>
    </div>
  );
}
