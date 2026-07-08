import { ReportsSummary, ReportChartPoint, ReportSummaryItem } from "@/src/types/report";

export const reportsSummaryData: ReportsSummary = {
  trackedDevices: 5,
  avgOnlineRate: 96,
  totalAlerts: 18,
  avgTemperature: 37.5,
};

export const reportChartData: ReportChartPoint[] = [
  { date: "02/07", avgTemperature: 37.4, avgHumidity: 61, alertCount: 2 },
  { date: "03/07", avgTemperature: 37.5, avgHumidity: 60, alertCount: 3 },
  { date: "04/07", avgTemperature: 37.6, avgHumidity: 59, alertCount: 1 },
  { date: "05/07", avgTemperature: 37.3, avgHumidity: 62, alertCount: 4 },
  { date: "06/07", avgTemperature: 37.4, avgHumidity: 63, alertCount: 2 },
  { date: "07/07", avgTemperature: 37.5, avgHumidity: 61, alertCount: 5 },
  { date: "08/07", avgTemperature: 37.6, avgHumidity: 60, alertCount: 1 },
];

export const reportSummaryList: ReportSummaryItem[] = [
  {
    deviceId: "SEI-IoT-001",
    deviceName: "Máy ấp Alpha (Khu A)",
    avgTemperature: 37.6,
    avgHumidity: 62,
    alertCount: 2,
    uptimeRate: 99.8,
    incubationDay: 7,
    lastUpdated: "5 phút trước",
  },
  {
    deviceId: "SEI-IoT-002",
    deviceName: "HatchMate Bravo",
    avgTemperature: 37.2,
    avgHumidity: 60,
    alertCount: 5,
    uptimeRate: 98.5,
    incubationDay: 19,
    lastUpdated: "10 phút trước",
  },
  {
    deviceId: "SEI-IoT-003",
    deviceName: "HatchMate Delta (Sản xuất)",
    avgTemperature: 38.2,
    avgHumidity: 49,
    alertCount: 8,
    uptimeRate: 96.2,
    incubationDay: 12,
    lastUpdated: "12 phút trước",
  },
  {
    deviceId: "SEI-IoT-004",
    deviceName: "HatchMate Echo",
    avgTemperature: 36.5,
    avgHumidity: 58,
    alertCount: 3,
    uptimeRate: 90.0,
    incubationDay: 0,
    lastUpdated: "45 phút trước",
  },
  {
    deviceId: "SEI-IoT-005",
    deviceName: "HatchMate Foxtrot VIP",
    avgTemperature: 37.1,
    avgHumidity: 61,
    alertCount: 0,
    uptimeRate: 100.0,
    incubationDay: 8,
    lastUpdated: "1 phút trước",
  },
];
