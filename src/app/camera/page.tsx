import AdminSidebar from "@/src/components/admin/AdminSidebar";
import CameraPageHeader from "@/src/components/camera/CameraPageHeader";
import CameraMiniStatCard from "@/src/components/camera/CameraMiniStatCard";
import CameraFilterBar from "@/src/components/camera/CameraFilterBar";
import CameraGrid from "@/src/components/camera/CameraGrid";
import AIAnalysisTable from "@/src/components/camera/AIAnalysisTable";
import { cameraSummaryData, cameraMockList, aiRecordMockList } from "@/src/data/cameraMock";
import { 
  Video,
  ShieldCheck,
  Camera,
  Brain
} from "lucide-react";

export const metadata = {
  title: "Camera & AI - HatchMate Admin",
  description: "Theo dõi camera thiết bị, ảnh chụp và kết quả phân tích AI trong hệ thống HatchMate",
};

export default function CameraPage() {
  const { totalCameras, onlineCameras, analyzedToday, aiAlerts } = cameraSummaryData;

  return (
    <div className="min-h-screen text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] gap-6 px-4 py-5 xl:px-8">
        <AdminSidebar />

        <main className="flex min-h-screen flex-1 flex-col gap-6 min-w-0">
          {/* Header */}
          <CameraPageHeader totalCameras={totalCameras} />

          {/* Mini Stats Component Section */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <CameraMiniStatCard
              label="Tổng camera"
              value={totalCameras}
              icon={Video}
              accent="indigo"
            />
            <CameraMiniStatCard
              label="Camera online"
              value={onlineCameras}
              icon={ShieldCheck}
              accent="emerald"
            />
            <CameraMiniStatCard
              label="Ảnh đã phân tích"
              value={analyzedToday}
              icon={Camera}
              accent="sky"
            />
            <CameraMiniStatCard
              label="Cảnh báo AI"
              value={aiAlerts}
              icon={Brain}
              accent="rose"
            />
          </section>

          {/* Camera Filter Bar */}
          <CameraFilterBar />

          {/* Camera Grid Section */}
          <CameraGrid cameras={cameraMockList} />

          {/* AI Analysis Section */}
          <AIAnalysisTable records={aiRecordMockList} />
        </main>
      </div>
    </div>
  );
}
