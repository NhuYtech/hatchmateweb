"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ref, onValue, set } from "firebase/database";
import { rtdb } from "@/src/lib/firebase";
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

function DeviceConfigurationContent() {
  const searchParams = useSearchParams();
  const machineId = searchParams.get("id") || "MATG01";

  // 1. General state
  const [deviceName, setDeviceName] = useState("HatchMate Smart Pro");
  const [eggType, setEggType] = useState("chicken");
  const [opMode, setOpMode] = useState("auto");

  // 2. Incubation Cycle state
  const [startDate, setStartDate] = useState("2026-07-09");
  const [totalDays, setTotalDays] = useState(21);
  const [currentDay, setCurrentDay] = useState(1);
  const [currentPhase, setCurrentPhase] = useState("Giai đoạn 1");
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

  // Raw DB values state for read-only tracking
  const [rawDbData, setRawDbData] = useState<any>(null);

  // Popup state
  const [popupAlert, setPopupAlert] = useState<{
    type: "success" | "error" | "loading";
    title: string;
    message: string;
  } | null>(null);

  // Listen to database path `incubators/${machineId}`
  useEffect(() => {
    const deviceRef = ref(rtdb, `incubators/${machineId}`);
    const unsubscribe = onValue(deviceRef, (snapshot) => {
      if (snapshot.exists()) {
        const item = snapshot.val();
        setRawDbData(item);
        
        if (item.name) setDeviceName(item.name);
        if (item.mode) setOpMode(item.mode);
        if (item.cycle?.startDate) {
          setStartDate(item.cycle.startDate.substring(0, 10));
        }
        if (item.cycle?.totalDays !== undefined) {
          setTotalDays(item.cycle.totalDays);
        }
        if (item.telemetry?.day !== undefined) {
          setCurrentDay(item.telemetry.day);
        }
        if (item.telemetry?.phase !== undefined) {
          setCurrentPhase(`Giai đoạn ${item.telemetry.phase}`);
        }
        
        // Settings
        if (item.settings) {
          const s = item.settings;
          if (s.tempMin !== undefined) setTempMin(s.tempMin);
          if (s.tempMax !== undefined) setTempMax(s.tempMax);
          if (s.tempAlert !== undefined) setTempAlert(s.tempAlert);
          if (s.tempAdjustment !== undefined) setTempOffset(s.tempAdjustment);
          
          if (s.humidityMin !== undefined) setHumiMin(s.humidityMin);
          if (s.humidityMax !== undefined) setHumiMax(s.humidityMax);
          if (s.humidityAlert !== undefined) setHumiAlert(s.humidityAlert);
          
          if (s.turnInterval !== undefined) setTurnInterval(s.turnInterval);
          if (s.servoAngle !== undefined) setServoAngle(s.servoAngle);
          if (s.turnDuration !== undefined) setTurnDuration(s.turnDuration);
        }
      }
    });
    
    return () => unsubscribe();
  }, [machineId]);

  const handleSave = async () => {
    setPopupAlert({
      type: "loading",
      title: "Đang lưu cấu hình",
      message: `Đang gửi thiết lập mới tới máy ấp ${machineId}...`
    });
    try {
      // 1. Save settings
      const settingsRef = ref(rtdb, `incubators/${machineId}/settings`);
      await set(settingsRef, {
        tempMin,
        tempMax,
        tempAlert,
        tempAdjustment: tempOffset,
        humidityMin: humiMin,
        humidityMax: humiMax,
        humidityAlert: humiAlert,
        turnInterval,
        servoAngle,
        turnDuration
      });

      // 2. Save root attributes
      const nameRef = ref(rtdb, `incubators/${machineId}/name`);
      await set(nameRef, deviceName);

      const modeRef = ref(rtdb, `incubators/${machineId}/mode`);
      await set(modeRef, opMode);

      // 3. Save cycle
      const cycleRef = ref(rtdb, `incubators/${machineId}/cycle`);
      await set(cycleRef, {
        isActive: rawDbData?.cycle?.isActive ?? true,
        startDate: startDate + (rawDbData?.cycle?.startDate ? rawDbData.cycle.startDate.substring(10) : "T12:22:02.200783"),
        totalDays
      });

      setPopupAlert({
        type: "success",
        title: "Lưu thành công!",
        message: `Cấu hình đã được áp dụng và đồng bộ hóa tới máy ấp ${machineId}!`
      });
      setTimeout(() => setPopupAlert(null), 4000);
    } catch (err) {
      console.error("Lỗi khi lưu cấu hình:", err);
      setPopupAlert({
        type: "error",
        title: "Lưu thất bại",
        message: "Đã xảy ra sự cố khi lưu cấu hình thiết bị. Vui lòng kiểm tra kết nối mạng!"
      });
      setTimeout(() => setPopupAlert(null), 4000);
    }
  };

  const triggerMaintenance = (action: string) => {
    let actionTitle = "Đang gửi lệnh";
    let actionMessage = "Vui lòng đợi giây lát...";
    let successMessage = "Lệnh đã được thực thi thành công!";

    if (action === "restart") {
      actionTitle = "Khởi động lại";
      actionMessage = `Đang gửi lệnh khởi động lại tới máy ấp ${machineId}...`;
      successMessage = `Máy ấp ${machineId} đang khởi động lại hệ thống!`;
    } else if (action === "synctime") {
      actionTitle = "Đồng bộ thời gian";
      actionMessage = `Đang đồng bộ giờ thực tế cho máy ấp ${machineId}...`;
      successMessage = "Đồng bộ hóa thời gian thành công!";
    } else if (action === "firmware") {
      actionTitle = "Kiểm tra Firmware";
      actionMessage = "Đang kiểm tra và yêu cầu máy cập nhật bản mới nhất...";
      successMessage = "Thiết bị đang chạy phiên bản mới nhất!";
    } else if (action === "factoryreset") {
      actionTitle = "Khôi phục cài đặt gốc";
      actionMessage = "Đang tiến hành khôi phục cài đặt ban đầu cho lò ấp...";
      successMessage = "Khôi phục cài đặt gốc hoàn tất!";
    }

    setPopupAlert({
      type: "loading",
      title: actionTitle,
      message: actionMessage
    });

    setTimeout(() => {
      setPopupAlert({
        type: "success",
        title: "Thành công",
        message: successMessage
      });
      setTimeout(() => setPopupAlert(null), 4000);
    }, 1500);
  };

  // Derive live status states
  const liveTemp = rawDbData?.telemetry?.temp !== undefined ? Number(rawDbData.telemetry.temp) : 37.6;
  const liveHumi = rawDbData?.telemetry?.humi !== undefined ? Number(rawDbData.telemetry.humi) : 61;
  const liveStatus = rawDbData?.status || "Online";
  const liveFirmware = rawDbData?.firmware || "v1.2.0";

  return (
    <div className="grid gap-4">
        
        {/* Top Header Section */}
        <header className="flex flex-col gap-6 rounded-[24px] border border-sky-100/80 bg-white/90 backdrop-blur-md px-6 py-5 shadow-sm shadow-sky-100/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2.5">
            {/* Large Title & Subtitle */}
            <div className="flex items-center gap-4 mt-1 flex-wrap">
              <h5 className="text-1xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Cấu hình máy {machineId}
              </h5>
              
              <div className="flex gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  liveStatus.toLowerCase() === "online" 
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700" 
                    : "bg-slate-50 border border-slate-200 text-slate-500"
                }`}>
                  <span className={`h-2 w-2 rounded-full ${
                    liveStatus.toLowerCase() === "online" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                  }`} />
                  {liveStatus}
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
            {/* <button
              onClick={() => window.history.back()}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] duration-150 cursor-pointer"
            >
              Hủy
            </button> */}
            <button
              onClick={handleSave}
              disabled={popupAlert?.type === "loading"}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 text-sm font-bold text-white shadow-md shadow-sky-100 hover:bg-sky-600 active:scale-[0.98] transition disabled:opacity-75 disabled:cursor-not-allowed duration-150 cursor-pointer"
            >
              {popupAlert?.type === "loading" && popupAlert?.title === "Đang lưu cấu hình" ? (
                <>
                  <RotateCw className="h-4 w-4 animate-spin" />
                  <span>Đang lưu...</span>
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

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Left Column - 8 configuration cards */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-4">
            
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
                    disabled
                    className="h-11 rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-400 outline-none cursor-not-allowed select-none"
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

                <div className="flex flex-col gap-2 sm:col-span-2">
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
                    disabled={opMode === "auto"}
                    className={`h-11 rounded-xl border border-slate-200 bg-slate-50/30 px-4 text-sm font-medium text-slate-800 outline-none transition duration-200 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50 ${
                      opMode === "auto" ? "opacity-60 bg-slate-100 cursor-not-allowed" : ""
                    }`}
                  />
                </div>

                <UnitInput
                  label="Tổng số ngày ấp"
                  value={totalDays}
                  onChange={setTotalDays}
                  unit="ngày"
                  min={1}
                  disabled={opMode === "auto"}
                />

                <UnitInput
                  label="Ngày dừng đảo trứng"
                  value={stopTurningDay}
                  onChange={setStopTurningDay}
                  unit="ngày"
                  min={1}
                  disabled={opMode === "auto"}
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
                  disabled={opMode === "auto"}
                />
                
                <UnitInput
                  label="Nhiệt độ tối đa"
                  value={tempMax}
                  onChange={setTempMax}
                  unit="°C"
                  step={0.1}
                  disabled={opMode === "auto"}
                />

                <UnitInput
                  label="Ngưỡng cảnh báo"
                  value={tempAlert}
                  onChange={setTempAlert}
                  unit="°C"
                  step={0.1}
                  disabled={opMode === "auto"}
                />

                <UnitInput
                  label="Độ lệch hiệu chuẩn"
                  value={tempOffset}
                  onChange={setTempOffset}
                  unit="°C"
                  step={0.1}
                  disabled={opMode === "auto"}
                />

                <div className="sm:col-span-2">
                  <UnitInput
                    label="Sai số (Hysteresis)"
                    value={tempHysteresis}
                    onChange={setTempHysteresis}
                    unit="°C"
                    step={0.05}
                    disabled={opMode === "auto"}
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
                  disabled={opMode === "auto"}
                />
                
                <UnitInput
                  label="Độ ẩm tối đa"
                  value={humiMax}
                  onChange={setHumiMax}
                  unit="%"
                  disabled={opMode === "auto"}
                />

                <UnitInput
                  label="Ngưỡng cảnh báo"
                  value={humiAlert}
                  onChange={setHumiAlert}
                  unit="%"
                  disabled={opMode === "auto"}
                />

                <UnitInput
                  label="Độ lệch hiệu chuẩn"
                  value={humiOffset}
                  onChange={setHumiOffset}
                  unit="%"
                  disabled={opMode === "auto"}
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
                
                <div className={`flex items-center gap-3 ${opMode === "auto" ? "opacity-50 pointer-events-none" : ""}`}>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    {enableTurning ? "Tự động bật" : "Tự động tắt"}
                  </span>
                  <Toggle checked={enableTurning} onChange={setEnableTurning} />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <div className={`${(!enableTurning || opMode === "auto") && "opacity-50 pointer-events-none"}`}>
                  <UnitInput
                    label="Chu kỳ đảo trứng"
                    value={turnInterval}
                    onChange={setTurnInterval}
                    unit="giờ"
                    disabled={!enableTurning || opMode === "auto"}
                  />
                </div>
                
                <div className={`${(!enableTurning || opMode === "auto") && "opacity-50 pointer-events-none"}`}>
                  <UnitInput
                    label="Góc quay Servo"
                    value={servoAngle}
                    onChange={setServoAngle}
                    unit="°"
                    disabled={!enableTurning || opMode === "auto"}
                  />
                </div>

                <div className={`${(!enableTurning || opMode === "auto") && "opacity-50 pointer-events-none"} sm:col-span-2 md:col-span-1`}>
                  <UnitInput
                    label="Thời gian mỗi lần đảo"
                    value={turnDuration}
                    onChange={setTurnDuration}
                    unit="giây"
                    disabled={!enableTurning || opMode === "auto"}
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

              <div className="flex flex-wrap gap-4 items-center justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={() => triggerMaintenance("restart")}
                  disabled={popupAlert?.type === "loading"}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Khởi động lại máy
                </button>

                <button
                  type="button"
                  onClick={() => triggerMaintenance("synctime")}
                  disabled={popupAlert?.type === "loading"}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Clock className="h-4 w-4" />
                  Đồng bộ thời gian
                </button>

                <button
                  type="button"
                  onClick={() => triggerMaintenance("firmware")}
                  disabled={popupAlert?.type === "loading"}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <HardDriveDownload className="h-4 w-4" />
                  Kiểm tra Firmware
                </button>

                <div className="sm:ml-auto">
                  <button
                    type="button"
                    onClick={() => triggerMaintenance("factoryreset")}
                    disabled={popupAlert?.type === "loading"}
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
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-8 flex flex-col gap-4">
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
                    {liveStatus}
                  </span>
                </div>

                {/* Firmware */}
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm font-bold text-slate-500">Phiên bản Firmware</span>
                  <span className="font-mono text-sm font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                    {liveFirmware}
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
                    {liveTemp}°C
                  </span>
                </div>

                {/* Humidity */}
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm font-bold text-slate-500">Độ ẩm hiện tại</span>
                  <span className="text-lg font-extrabold text-emerald-600 flex items-center gap-0.5">
                    <Droplets className="h-4.5 w-4.5 text-emerald-400" />
                    {liveHumi}%
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

        {/* Floating Popup Alerts */}
        {popupAlert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className={`flex flex-col items-center text-center gap-4 rounded-2xl border px-6 py-6 shadow-2xl bg-white max-w-sm w-full animate-in zoom-in-95 duration-200 ${
              popupAlert.type === "success" 
                ? "border-emerald-100" 
                : popupAlert.type === "error"
                ? "border-rose-100"
                : "border-amber-100"
            }`}>
              <div className={`p-3 rounded-full ${
                popupAlert.type === "success" 
                  ? "bg-emerald-50 text-emerald-600" 
                  : popupAlert.type === "error"
                  ? "bg-rose-50 text-rose-600"
                  : "bg-amber-50 text-amber-600"
              }`}>
                {popupAlert.type === "success" ? (
                  <Check className="h-8 w-8" />
                ) : popupAlert.type === "error" ? (
                  <AlertCircle className="h-8 w-8" />
                ) : (
                  <RotateCw className="h-8 w-8 animate-spin" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-extrabold text-slate-800">{popupAlert.title}</h3>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">{popupAlert.message}</p>
              </div>
              {popupAlert.type !== "loading" && (
                <button 
                  onClick={() => setPopupAlert(null)}
                  className="mt-2 w-full h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition active:scale-[0.98] cursor-pointer"
                >
                  Đóng
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
}

export default function DeviceConfigurationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-20 gap-3">
        <RotateCw className="h-8 w-8 text-sky-500 animate-spin" />
        <span className="text-xs font-bold text-slate-500">Đang tải cấu hình thiết bị...</span>
      </div>
    }>
      <DeviceConfigurationContent />
    </Suspense>
  );
}
