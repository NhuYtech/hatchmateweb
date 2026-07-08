import AdminSidebar from "@/src/components/admin/AdminSidebar";
import DevicePageHeader from "@/src/components/devices/DevicePageHeader";
import DeviceMiniStatCard from "@/src/components/devices/DeviceMiniStatCard";
import DeviceFilterBar from "@/src/components/devices/DeviceFilterBar";
import DeviceTable from "@/src/components/devices/DeviceTable";
import { devicesSummaryData, deviceMockList } from "@/src/data/devicesMock";
import { 
  Cpu, 
  Wifi, 
  WifiOff, 
  AlertTriangle
} from "lucide-react";

export const metadata = {
  title: "Quản lý thiết bị - HatchMate Admin",
  description: "Theo dõi, tìm kiếm và quản lý các máy ấp trong hệ thống HatchMate",
};

export default function DevicesPage() {
  const { totalDevices, onlineDevices, offlineDevices, warningDevices } = devicesSummaryData;

  return (
    <div className="min-h-screen text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] gap-6 px-4 py-5 xl:px-8">
        <AdminSidebar />

        <main className="flex min-h-screen flex-1 flex-col gap-6 min-w-0">
          {/* Header */}
          <DevicePageHeader totalDevices={totalDevices} />

          {/* Mini Stats Component Section */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <DeviceMiniStatCard
              label="Tổng thiết bị"
              value={totalDevices}
              icon={Cpu}
              accent="indigo"
            />
            <DeviceMiniStatCard
              label="Thiết bị online"
              value={onlineDevices}
              icon={Wifi}
              accent="emerald"
            />
            <DeviceMiniStatCard
              label="Thiết bị offline"
              value={offlineDevices}
              icon={WifiOff}
              accent="rose"
            />
            <DeviceMiniStatCard
              label="Thiết bị cảnh báo"
              value={warningDevices}
              icon={AlertTriangle}
              accent="amber"
            />
          </section>

          {/* Search & Filter Bar */}
          <DeviceFilterBar />

          {/* Device Table Component Section */}
          <DeviceTable devices={deviceMockList} />
        </main>
      </div>
    </div>
  );
}
