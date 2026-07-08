import AdminSidebar from "@/src/components/admin/AdminSidebar";
import SettingsPageHeader from "@/src/components/settings/SettingsPageHeader";
import SettingsSummaryCard from "@/src/components/settings/SettingsSummaryCard";
import SettingsScopeCard from "@/src/components/settings/SettingsScopeCard";
import EnvironmentSettingsCard from "@/src/components/settings/EnvironmentSettingsCard";
import TurningSettingsCard from "@/src/components/settings/TurningSettingsCard";
import IncubationPhaseTable from "@/src/components/settings/IncubationPhaseTable";
import { incubationSettingsSummaryData, incubationPhasesMock } from "@/src/data/settingsMock";
import { 
  BookOpen, 
  Cpu, 
  RefreshCw, 
  AlertTriangle
} from "lucide-react";

export const metadata = {
  title: "Cấu hình ấp - HatchMate Admin",
  description: "Thiết lập nhiệt độ, độ ẩm, chu kỳ đảo và cảnh báo cho hệ thống ấp trứng HatchMate",
};

export default function SettingsPage() {
  const { activeProfile, appliedDevices, turnInterval, mainAlert } = incubationSettingsSummaryData;

  return (
    <div className="min-h-screen text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] gap-6 px-4 py-5 xl:px-8">
        <AdminSidebar />

        <main className="flex min-h-screen flex-1 flex-col gap-6 min-w-0">
          {/* Header */}
          <SettingsPageHeader activeProfile={activeProfile} />

          {/* Summary Cards Section */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <SettingsSummaryCard
              label="Hồ sơ ấp đang hoạt động"
              value={activeProfile}
              icon={BookOpen}
              accent="orange"
            />
            <SettingsSummaryCard
              label="Thiết bị đang áp dụng"
              value={`${appliedDevices} máy ấp`}
              icon={Cpu}
              accent="blue"
            />
            <SettingsSummaryCard
              label="Chu kỳ đảo trứng"
              value={turnInterval}
              icon={RefreshCw}
              accent="emerald"
            />
            <SettingsSummaryCard
              label="Ngưỡng cảnh báo chính"
              value={mainAlert}
              icon={AlertTriangle}
              accent="rose"
            />
          </section>

          {/* Scope and Profile Card Section */}
          <SettingsScopeCard />

          {/* Environment and Turning Controls Section */}
          <section className="grid gap-6 md:grid-cols-2">
            <EnvironmentSettingsCard />
            <TurningSettingsCard />
          </section>

          {/* Incubation Phases Config Table */}
          <IncubationPhaseTable phases={incubationPhasesMock} />

          {/* Placeholders Content */}
          <div className="grid gap-6">

            {/* 5. Alert Settings Placeholder */}
            <div className="rounded-[24px] border border-sky-100/80 bg-white p-6 shadow-sm shadow-sky-100/10">
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                  Alert Settings Placeholder
                </h3>
                <p className="text-xs text-slate-500 mt-1">Cấu hình giới hạn an toàn, phương thức nhận cảnh báo (App, SMS, Email)</p>
              </div>

              <div className="border border-dashed border-slate-200 rounded-[20px] p-6 text-center bg-slate-50/50">
                <AlertTriangle className="h-8 w-8 text-slate-300 mx-auto mb-2 animate-pulse" />
                <p className="text-xs font-bold text-sky-950">Thiết lập ngưỡng cảnh báo an toàn</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                  Kích hoạt còi báo, ngắt thanh nhiệt khi quá nhiệt hoặc gửi thông báo đẩy đến điện thoại của quản trị viên khi xảy ra lỗi kẹt khay đảo.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
