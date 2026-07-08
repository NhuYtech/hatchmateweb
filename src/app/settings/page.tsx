import SettingsPageHeader from "@/src/components/settings/SettingsPageHeader";
import SettingsSummaryCard from "@/src/components/settings/SettingsSummaryCard";
import SettingsScopeCard from "@/src/components/settings/SettingsScopeCard";
import EnvironmentSettingsCard from "@/src/components/settings/EnvironmentSettingsCard";
import TurningSettingsCard from "@/src/components/settings/TurningSettingsCard";
import IncubationPhaseTable from "@/src/components/settings/IncubationPhaseTable";
import AlertSettingsCard from "@/src/components/settings/AlertSettingsCard";
import { incubationSettingsSummaryData } from "@/src/data/settingsMock";
import { 
  BookOpen, 
  Cpu, 
  RefreshCw, 
  AlertTriangle,
} from "lucide-react";

export const metadata = {
  title: "Cấu hình ấp - HatchMate Admin",
  description: "Thiết lập nhiệt độ, độ ẩm, chu kỳ đảo và cảnh báo cho hệ thống ấp trứng HatchMate",
};

export default function SettingsPage() {
  const { activeProfile, appliedDevices, turnInterval, mainAlert } = incubationSettingsSummaryData;

  return (
    <div className="grid gap-6">
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

      {/* Incubation Phase Table */}
      <IncubationPhaseTable />

      {/* Alert Settings */}
      <AlertSettingsCard />
    </div>
  );
}
