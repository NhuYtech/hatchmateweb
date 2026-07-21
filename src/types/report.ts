export interface ReportsSummary {
  trackedDevices: number;
  activeIncubatingCount: number;
  maintenanceCount: number;
}

export interface ReportChartPoint {
  date: string;
  avgTemperature: number;
  avgHumidity: number;
  alertCount: number;
}

export interface ReportSummaryItem {
  deviceId: string;
  deviceName: string;
  avgTemperature: number;
  avgHumidity: number;
  alertCount: number;
  uptimeRate: number;
  incubationDay: number;
  lastUpdated: string;
}
