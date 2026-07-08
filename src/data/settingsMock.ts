import { 
  IncubationSettingsSummary, 
  IncubationProfile, 
  EnvironmentSettings, 
  TurningSettings,
  IncubationPhase
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
    id: "P1",
    phaseName: "Giai đoạn 1 (Đầu kỳ)",
    startDay: 1,
    endDay: 7,
    targetTemperature: 37.8,
    targetHumidity: 60,
    turnIntervalMin: 120,
    turnDurationSec: 60,
    turningMode: "auto",
    notes: "Bắt đầu chu kỳ tạo phôi nóng và phân nhánh mạch máu đỏ.",
  },
  {
    id: "P2",
    phaseName: "Giai đoạn 2 (Giữa kỳ)",
    startDay: 8,
    endDay: 14,
    targetTemperature: 37.5,
    targetHumidity: 55,
    turnIntervalMin: 120,
    turnDurationSec: 60,
    turningMode: "auto",
    notes: "Định hình các cơ quan nội tạng chính và chi.",
  },
  {
    id: "P3",
    phaseName: "Giai đoạn 3 (Chuẩn bị nở)",
    startDay: 15,
    endDay: 18,
    targetTemperature: 37.2,
    targetHumidity: 55,
    turnIntervalMin: 180,
    turnDurationSec: 45,
    turningMode: "auto",
    notes: "Xoay dọc đầu phôi hướng buồng khí.",
  },
  {
    id: "P4",
    phaseName: "Giai đoạn 4 (Mổ vỏ & Nở)",
    startDay: 19,
    endDay: 21,
    targetTemperature: 37.0,
    targetHumidity: 70,
    turnIntervalMin: 0,
    turnDurationSec: 0,
    turningMode: "disabled",
    notes: "Ngừng đảo tuyệt đối để tránh làm xoay ngôi thai lúc mổ vỏ.",
  },
];
