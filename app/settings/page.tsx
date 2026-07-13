"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  Settings, 
  Cpu, 
  Wifi, 
  Thermometer, 
  Droplets, 
  RotateCw, 
  Camera, 
  Bell, 
  Wrench, 
  AlertTriangle,
  RefreshCw, 
  Check, 
  X, 
  Save,
  Info,
  Calendar,
  Flame,
  WifiOff,
  RefreshCcw,
  Clock,
  Radio,
  FileCheck2,
  HardDriveDownload,
  AlertCircle
} from "lucide-react";

// Segmented Control Component
const SegmentedControl = ({
  options,
  value,
  onChange
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
}) => {
  return (
    <div className="flex rounded-xl bg-slate-100/80 p-1 border border-slate-200/30">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="flex-1 rounded-lg py-2 text-xs font-bold transition-all duration-200 cursor-pointer text-slate-500 hover:text-slate-800"
          style={value === opt.value ? { backgroundColor: 'white', color: '#0EA5E9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' } : {}}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

// Clean IOS-style Toggle Switch
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-[#0EA5E9]" : "bg-slate-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

// Numeric Input with Unit Suffix
const UnitInput = ({
  label,
  value,
  onChange,
  unit,
  disabled = false,
  min,
  max,
  step
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  unit: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">{label}</label>
      <div className="relative flex items-center">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`h-11 w-full rounded-xl border border-slate-200 bg-slate-50/30 pl-4 pr-12 text-sm font-medium text-slate-800 outline-none transition-all duration-200 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50 ${
            disabled ? "opacity-60 bg-slate-100 cursor-not-allowed" : ""
          }`}
        />
        <span className="absolute right-4 text-xs font-bold text-slate-400 select-none">{unit}</span>
      </div>
    </div>
  );
};

export default function DeviceConfigurationPage() {
  // 1. General state
  const [deviceName, setDeviceName] = useState("HatchMate Smart Pro");
  const [machineId] = useState("MATG01");
  const [eggType, setEggType] = useState("chicken");
  const [opMode, setOpMode] = useState("auto");

  // 2. Incubation Cycle state
  const [startDate, setStartDate] = useState("2026-07-09");
  const [totalDays, setTotalDays] = useState(21);
  const [currentDay] = useState(4);
  const [currentPhase] = useState("Giai đoạn 1");
  const [stopTurningDay, setStopTurningDay] = useState(18);

  // 3. Temp state
  const [tempMin, setTempMin] = useState(37.5);
  const [tempMax, setTempMax] = useState(38.1);
  const [tempAlert, setTempAlert] = useState(39.0);
  const [tempOffset, setTempOffset] = useState(0.0);
  const [tempHysteresis, setTempHysteresis] = useState(0.2);

  // 4. Humi state
  const [humiMin, setHumiMin] = useState(55);
  const [humiMax, setHumiMax] = useState(65);
  const [humiAlert, setHumiAlert] = useState(70);
  const [humiOffset, setHumiOffset] = useState(0);

  // 5. Turning state
  const [enableTurning, setEnableTurning] = useState(true);
  const [turnInterval, setTurnInterval] = useState(2);
  const [servoAngle, setServoAngle] = useState(45);
  const [turnDuration, setTurnDuration] = useState(15);

  // 6. Camera state
  const [enableAI, setEnableAI] = useState(true);
  const [captureInterval, setCaptureInterval] = useState(30);
  const [resolution, setResolution] = useState("1080p");
  const [autoUpload, setAutoUpload] = useState(true);

  // 7. Notification toggles
  const [notifyTemp, setNotifyTemp] = useState(true);
  const [notifyHumi, setNotifyHumi] = useState(true);
  const [notifyOffline, setNotifyOffline] = useState(true);
  const [notifyFire, setNotifyFire] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);

  // Action feed/status states
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [maintenanceAction, setMaintenanceAction] = useState<string | null>(null);

  const handleSave = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1200);
  };

  const triggerMaintenance = (action: string) => {
    setMaintenanceAction(action);
    setTimeout(() => {
      setMaintenanceAction(action + "_success");
      setTimeout(() => setMaintenanceAction(null), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased max-w-full overflow-x-hidden selection:bg-sky-100">
      <div className="max-w-[1400px] mx-auto px-6 py-10 flex flex-col gap-10">
        
        {/* Top Header Section */}
        <header className="relative pb-8 border-b border-slate-100 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2.5">
            {/* Large Title & Subtitle */}
            <div className="flex items-center gap-4 mt-1 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Cấu hình máy {machineId}
              </h1>
              
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Đang chạy
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600 tracking-wider">
                  {machineId}
                </span>
              </div>
            </div>
            
            <p className="text-sm font-medium text-slate-500 max-w-xl">
              Thiết lập các ngưỡng vận hành, thông số chu kỳ ấp, vòng quay đảo trứng và cấu hình cảnh báo cho trạm ấp này.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3.5 shrink-0">
            <button
              onClick={() => window.history.back()}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] duration-150 cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 text-sm font-bold text-white shadow-md shadow-sky-100 hover:bg-sky-600 active:scale-[0.98] transition disabled:opacity-75 disabled:cursor-not-allowed duration-150 cursor-pointer"
            >
              {saveStatus === "saving" ? (
                <>
                  <RotateCw className="h-4 w-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : saveStatus === "success" ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Đã lưu thành công!</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Save feedback indicator */}
        {saveStatus === "success" && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-300">
            <Check className="h-5 w-5 text-emerald-600" />
            Cấu hình thiết bị đã được lưu thành công và đồng bộ hóa tới máy ấp {machineId}!
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column - 8 configuration cards */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-10">
            
            {/* Card 1 — General Information */}
            <section className="bg-white rounded-[24px] border border-slate-200/70 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_35px_rgb(0,0,0,0.03)] flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-500">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">Thông tin chung</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Nhận diện cơ bản và chế độ vận hành</p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Tên thiết bị</label>
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    className="h-11 rounded-xl border border-slate-200 bg-slate-50/30 px-4 text-sm font-medium text-slate-800 outline-none transition duration-200 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Mã thiết bị</label>
                  <input
                    type="text"
                    value={machineId}
                    disabled
                    className="h-11 rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-400 outline-none cursor-not-allowed select-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Loại trứng</label>
                  <select
                    value={eggType}
                    onChange={(e) => setEggType(e.target.value)}
                    className="h-11 rounded-xl border border-slate-200 bg-slate-50/30 px-4 text-sm font-semibold text-slate-700 outline-none transition duration-200 focus:border-sky-400 focus:bg-white"
                  >
                    <option value="chicken">Trứng gà</option>
                    <option value="duck">Trứng vịt</option>
                    <option value="quail">Trứng cút</option>
                    <option value="custom">Tự cấu hình</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Chế độ hoạt động</label>
                  <SegmentedControl
                    options={[
                      { label: "Tự động", value: "auto" },
                      { label: "Thủ công", value: "manual" }
                    ]}
                    value={opMode}
                    onChange={setOpMode}
                  />
                </div>
              </div>
            </section>

            {/* Card 2 — Incubation Cycle */}
            <section className="bg-white rounded-[24px] border border-slate-200/70 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_35px_rgb(0,0,0,0.03)] flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-500">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">Chu kỳ ấp trứng</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Theo dõi tiến độ và thời gian chu kỳ</p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-11 rounded-xl border border-slate-200 bg-slate-50/30 px-4 text-sm font-medium text-slate-800 outline-none transition duration-200 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50"
                  />
                </div>

                <UnitInput
                  label="Tổng số ngày ấp"
                  value={totalDays}
                  onChange={setTotalDays}
                  unit="ngày"
                  min={1}
                />

                <UnitInput
                  label="Ngày dừng đảo trứng"
                  value={stopTurningDay}
                  onChange={setStopTurningDay}
                  unit="ngày"
                  min={1}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Ngày thứ hiện tại</label>
                  <div className="h-11 rounded-xl border border-slate-200 bg-slate-100 flex items-center px-4 text-sm font-semibold text-slate-500 select-none">
                    Ngày {currentDay}
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Giai đoạn hiện tại</label>
                  <div className="h-11 rounded-xl border border-slate-200 bg-slate-100 flex items-center px-4 text-sm font-semibold text-slate-500 select-none">
                    {currentPhase} (Ấp trứng giai đoạn đầu)
                  </div>
                </div>
              </div>
            </section>

            {/* Card 3 — Temperature Settings */}
            <section className="bg-white rounded-[24px] border border-slate-200/70 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_35px_rgb(0,0,0,0.03)] flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-500">
                  <Thermometer className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">Cài đặt nhiệt độ</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Kiểm soát các ngưỡng nhiệt độ của lò ấp</p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <UnitInput
                  label="Nhiệt độ tối thiểu"
                  value={tempMin}
                  onChange={setTempMin}
                  unit="°C"
                  step={0.1}
                />
                
                <UnitInput
                  label="Nhiệt độ tối đa"
                  value={tempMax}
                  onChange={setTempMax}
                  unit="°C"
                  step={0.1}
                />

                <UnitInput
                  label="Ngưỡng cảnh báo"
                  value={tempAlert}
                  onChange={setTempAlert}
                  unit="°C"
                  step={0.1}
                />

                <UnitInput
                  label="Độ lệch hiệu chuẩn"
                  value={tempOffset}
                  onChange={setTempOffset}
                  unit="°C"
                  step={0.1}
                />

                <div className="sm:col-span-2">
                  <UnitInput
                    label="Sai số (Hysteresis)"
                    value={tempHysteresis}
                    onChange={setTempHysteresis}
                    unit="°C"
                    step={0.05}
                  />
                </div>
              </div>
            </section>

            {/* Card 4 — Humidity Settings */}
            <section className="bg-white rounded-[24px] border border-slate-200/70 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_35px_rgb(0,0,0,0.03)] flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-500">
                  <Droplets className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">Cài đặt độ ẩm</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Kiểm soát dải độ ẩm hoạt động</p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <UnitInput
                  label="Độ ẩm tối thiểu"
                  value={humiMin}
                  onChange={setHumiMin}
                  unit="%"
                />
                
                <UnitInput
                  label="Độ ẩm tối đa"
                  value={humiMax}
                  onChange={setHumiMax}
                  unit="%"
                />

                <UnitInput
                  label="Ngưỡng cảnh báo"
                  value={humiAlert}
                  onChange={setHumiAlert}
                  unit="%"
                />

                <UnitInput
                  label="Độ lệch hiệu chuẩn"
                  value={humiOffset}
                  onChange={setHumiOffset}
                  unit="%"
                />
              </div>
            </section>

            {/* Card 5 — Egg Turning */}
            <section className="bg-white rounded-[24px] border border-slate-200/70 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_35px_rgb(0,0,0,0.03)] flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-sky-500">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-800">Đảo trứng tự động</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Thiết lập chu kỳ và thông số góc xoay đảo trứng</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    {enableTurning ? "Tự động bật" : "Tự động tắt"}
                  </span>
                  <Toggle checked={enableTurning} onChange={setEnableTurning} />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <div className={`${!enableTurning && "opacity-50 pointer-events-none"}`}>
                  <UnitInput
                    label="Chu kỳ đảo trứng"
                    value={turnInterval}
                    onChange={setTurnInterval}
                    unit="giờ"
                    disabled={!enableTurning}
                  />
                </div>
                
                <div className={`${!enableTurning && "opacity-50 pointer-events-none"}`}>
                  <UnitInput
                    label="Góc quay Servo"
                    value={servoAngle}
                    onChange={setServoAngle}
                    unit="°"
                    disabled={!enableTurning}
                  />
                </div>

                <div className={`${!enableTurning && "opacity-50 pointer-events-none"} sm:col-span-2 md:col-span-1`}>
                  <UnitInput
                    label="Thời gian mỗi lần đảo"
                    value={turnDuration}
                    onChange={setTurnDuration}
                    unit="giây"
                    disabled={!enableTurning}
                  />
                </div>
              </div>
            </section>

            {/* Card 6 — Camera & AI */}
            <section className="bg-white rounded-[24px] border border-slate-200/70 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_35px_rgb(0,0,0,0.03)] flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-sky-500">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-800">Camera & AI</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Kiểm soát chụp ảnh & Trí tuệ nhân tạo (AI) phát hiện phôi</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    {enableAI ? "AI đang bật" : "AI đang tắt"}
                  </span>
                  <Toggle checked={enableAI} onChange={setEnableAI} />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <UnitInput
                  label="Tần suất chụp ảnh"
                  value={captureInterval}
                  onChange={setCaptureInterval}
                  unit="phút"
                />

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Độ phân giải hình ảnh</label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="h-11 rounded-xl border border-slate-200 bg-slate-50/30 px-4 text-sm font-semibold text-slate-700 outline-none transition duration-200 focus:border-sky-400 focus:bg-white"
                  >
                    <option value="720p">720p (HD)</option>
                    <option value="1080p">1080p (Full HD)</option>
                    <option value="4K">4K (Ultra HD)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end gap-2.5 sm:col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between h-11 border border-slate-100 bg-slate-50/20 rounded-xl px-4">
                    <span className="text-xs font-bold text-slate-500 uppercase">Tự động tải ảnh lên</span>
                    <Toggle checked={autoUpload} onChange={setAutoUpload} />
                  </div>
                </div>
              </div>
            </section>

            {/* Card 7 — Notifications */}
            <section className="bg-white rounded-[24px] border border-slate-200/70 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_35px_rgb(0,0,0,0.03)] flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-500">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">Thông báo & Cảnh báo</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Bật/tắt các kênh nhận thông báo và sự kiện quan trọng</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="flex items-center justify-between border border-slate-100 rounded-xl p-3.5 bg-slate-50/10">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Báo nhiệt độ</span>
                  <Toggle checked={notifyTemp} onChange={setNotifyTemp} />
                </div>
                
                <div className="flex items-center justify-between border border-slate-100 rounded-xl p-3.5 bg-slate-50/10">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Báo độ ẩm</span>
                  <Toggle checked={notifyHumi} onChange={setNotifyHumi} />
                </div>

                <div className="flex items-center justify-between border border-slate-100 rounded-xl p-3.5 bg-slate-50/10">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Mất kết nối máy</span>
                  <Toggle checked={notifyOffline} onChange={setNotifyOffline} />
                </div>

                <div className="flex items-center justify-between border border-slate-100 rounded-xl p-3.5 bg-slate-50/10">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Cảnh báo cháy nổ</span>
                  <Toggle checked={notifyFire} onChange={setNotifyFire} />
                </div>

                <div className="flex items-center justify-between border border-slate-100 rounded-xl p-3.5 bg-slate-50/10">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Thông báo đẩy (Push)</span>
                  <Toggle checked={notifyPush} onChange={setNotifyPush} />
                </div>

                <div className="flex items-center justify-between border border-slate-100 rounded-xl p-3.5 bg-slate-50/10">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Gửi Email cảnh báo</span>
                  <Toggle checked={notifyEmail} onChange={setNotifyEmail} />
                </div>
              </div>
            </section>

            {/* Card 8 — Maintenance */}
            <section className="bg-white rounded-[24px] border border-slate-200/70 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_35px_rgb(0,0,0,0.03)] flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-500">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800">Bảo trì & Đặt lại thiết bị</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Kiểm soát các lệnh kỹ thuật và hiệu chuẩn linh kiện</p>
                </div>
              </div>

              {/* Maintenance Status Feedback */}
              {maintenanceAction && (
                <div className={`p-4 rounded-xl text-sm font-semibold border flex items-center gap-2.5 animate-in fade-in duration-300 ${
                  maintenanceAction.endsWith("_success") 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                    : "bg-amber-50 border-amber-100 text-amber-800"
                }`}>
                  {maintenanceAction.endsWith("_success") ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>Thực hiện lệnh thành công!</span>
                    </>
                  ) : (
                    <>
                      <RotateCw className="h-4 w-4 animate-spin text-amber-600" />
                      <span>Đang truyền lệnh xuống máy ấp {machineId}...</span>
                    </>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-4 items-center justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={() => triggerMaintenance("restart")}
                  disabled={!!maintenanceAction}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Khởi động lại máy
                </button>

                <button
                  type="button"
                  onClick={() => triggerMaintenance("synctime")}
                  disabled={!!maintenanceAction}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Clock className="h-4 w-4" />
                  Đồng bộ thời gian
                </button>

                <button
                  type="button"
                  onClick={() => triggerMaintenance("firmware")}
                  disabled={!!maintenanceAction}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <HardDriveDownload className="h-4 w-4" />
                  Kiểm tra Firmware
                </button>

                <div className="sm:ml-auto">
                  <button
                    type="button"
                    onClick={() => triggerMaintenance("factoryreset")}
                    disabled={!!maintenanceAction}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-rose-200 hover:border-rose-300 bg-white hover:bg-rose-50 px-5 text-sm font-bold text-rose-600 shadow-sm transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Khôi phục cài đặt gốc
                  </button>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column - Sticky summary card */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-8 flex flex-col gap-6">
            <div className="bg-white rounded-[24px] border border-slate-200/70 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_35px_rgb(0,0,0,0.03)] flex flex-col gap-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 border-b border-slate-100 pb-3">
                Tổng quan trực tiếp
              </h3>

              <div className="flex flex-col gap-5 divide-y divide-slate-100">
                {/* Device Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500">Trạng thái máy</span>
                  <span className="inline-flex items-center gap-1.5 font-extrabold text-sm text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Hoạt động
                  </span>
                </div>

                {/* Firmware */}
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm font-bold text-slate-500">Phiên bản Firmware</span>
                  <span className="font-mono text-sm font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                    v1.2.0
                  </span>
                </div>

                {/* Wi-Fi */}
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm font-bold text-slate-500">Tín hiệu Wi-Fi</span>
                  <span className="inline-flex items-center gap-1 text-sm font-extrabold text-sky-600">
                    <Wifi className="h-4 w-4" />
                    Cực tốt
                  </span>
                </div>

                {/* Last Sync */}
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm font-bold text-slate-500">Đồng bộ cuối</span>
                  <span className="text-sm font-bold text-slate-600 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    2 phút trước
                  </span>
                </div>

                {/* Temperature */}
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm font-bold text-slate-500">Nhiệt độ hiện tại</span>
                  <span className="text-lg font-extrabold text-[#0EA5E9] flex items-center gap-0.5">
                    <Thermometer className="h-4.5 w-4.5 text-sky-400" />
                    37.6°C
                  </span>
                </div>

                {/* Humidity */}
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm font-bold text-slate-500">Độ ẩm hiện tại</span>
                  <span className="text-lg font-extrabold text-emerald-600 flex items-center gap-0.5">
                    <Droplets className="h-4.5 w-4.5 text-emerald-400" />
                    61%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Profile Summary Tip */}
            <div className="bg-slate-50 border border-slate-200/50 rounded-[20px] p-5 flex gap-3 text-xs text-slate-500 leading-relaxed font-semibold">
              <Info className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
              <p>
                Giao diện này dùng để cấu hình trực tiếp trạm ấp <strong>{machineId}</strong>. Các thay đổi sẽ được gửi và áp dụng xuống thiết bị IoT ngay khi bấm <strong>Lưu thay đổi</strong>.
              </p>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}
