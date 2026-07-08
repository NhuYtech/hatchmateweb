import { 
  IncubationSettingsSummary, 
  IncubationProfile, 
  EnvironmentSettings, 
  TurningSettings,
  IncubationPhase,
  AlertSettings,
} from "@/src/types/incubation-settings";

export const incubationSettingsSummaryData: IncubationSettingsSummary = {
  activeProfile: "Gà ta 21 ngày",
  appliedDevices: 5,
  turnInterval: "120 phút/lần",
  mainAlert: ">39°C / <50% RH",
};

export const incubationProfilesMock: IncubationProfile[] = [
  {
    id: "chicken",
    name: "Gà ta 21 ngày",
    totalDays: 21,
    stagesCount: 4,
    description: "Nhiệt độ giảm dần từ 37.8°C xuống 37.2°C. 3 ngày cuối ngưng đảo trứng, tăng độ ẩm lên 70% RH để hỗ trợ mở vỏ thở.",
  },
  {
    id: "duck",
    name: "Vịt 28 ngày",
    totalDays: 28,
    stagesCount: 4,
    description: "Nhiệt độ trung bình 37.5°C. Cần phun sương làm mát từ ngày thứ 12 trở đi. 3 ngày cuối tăng độ ẩm mạnh đạt 75% RH.",
  },
  {
    id: "quail",
    name: "Chim cút",
    totalDays: 17,
    stagesCount: 3,
    description: "Chu kỳ ngắn 17 ngày. Đảo trứng liên tục đến ngày thứ 14. Nhiệt độ duy trì cao ổn định 37.8°C.",
  },
  {
    id: "custom",
    name: "Tùy chỉnh cá nhân",
    totalDays: 21,
    stagesCount: 1,
    description: "Thông số nhiệt độ, độ ẩm mục tiêu và chu kỳ quay đảo do quản trị viên thiết lập thủ công toàn bộ.",
  },
];

export const defaultEnvironmentSettings: EnvironmentSettings = {
  targetTemperature: 37.5,
  targetHumidity: 58,
  tempTolerance: 0.5,
  sensorIntervalSec: 10,
  syncIntervalSec: 30,
};

export const defaultTurningSettings: TurningSettings = {
  autoTurningEnabled: true,
  turnIntervalMin: 120,
  turnDurationSec: 60,
  maxTurnsPerDay: 8,
  stopTurningLastDays: true,
};

export const incubationPhasesMock: IncubationPhase[] = [
  {
    id: "phase-1",
    phaseName: "Phát triển phôi",
    startDay: 1,
    endDay: 7,
    targetTemperature: 37.8,
    targetHumidity: 55,
    turnIntervalMin: 120,
    turnDurationSec: 60,
    turningMode: "auto",
    notes: "Giai đoạn hình thành phôi, giữ ổn định nhiệt độ cao và đảo đều đặn.",
  },
  {
    id: "phase-2",
    phaseName: "Tạo hình cơ thể",
    startDay: 8,
    endDay: 14,
    targetTemperature: 37.6,
    targetHumidity: 57,
    turnIntervalMin: 120,
    turnDurationSec: 60,
    turningMode: "auto",
    notes: "Cơ thể gà con bắt đầu hình thành, duy trì chu kỳ đảo đều.",
  },
  {
    id: "phase-3",
    phaseName: "Hoàn thiện cơ quan",
    startDay: 15,
    endDay: 18,
    targetTemperature: 37.4,
    targetHumidity: 60,
    turnIntervalMin: 180,
    turnDurationSec: 45,
    turningMode: "manual",
    notes: "Giảm tần suất đảo, tăng nhẹ độ ẩm để hỗ trợ cơ quan hô hấp.",
  },
  {
    id: "phase-4",
    phaseName: "Chuẩn bị nở",
    startDay: 19,
    endDay: 21,
    targetTemperature: 37.2,
    targetHumidity: 70,
    turnIntervalMin: 0,
    turnDurationSec: 0,
    turningMode: "disabled",
    notes: "Ngừng đảo, tăng độ ẩm cao để gà con dễ mở vỏ trứng và thở.",
  },
];

export const defaultAlertSettings: AlertSettings = {
  // A. Temperature
  highTempAlertEnabled: true,
  highTempThreshold: 39,
  lowTempAlertEnabled: true,
  lowTempThreshold: 36.5,

  // B. Humidity
  lowHumidityAlertEnabled: true,
  lowHumidityThreshold: 50,
  highHumidityAlertEnabled: false,
  highHumidityThreshold: 75,

  // C. Connectivity
  deviceOfflineAlert: true,
  cameraOfflineAlert: true,
  sensorNoResponseAlert: true,

  // D. Notification channels
  pushNotificationEnabled: true,
  adminNotificationEnabled: true,
  realtimeAlertEnabled: true,
};


