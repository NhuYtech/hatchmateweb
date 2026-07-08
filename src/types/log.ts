export type LogCategory = "device" | "alert" | "control" | "admin";
export type LogLevel = "info" | "warning" | "danger";
export type ActorType = "system" | "admin" | "user";

export interface LogItem {
  id: string;
  timestamp: string;
  category: LogCategory;
  level: LogLevel;
  deviceId?: string | null;
  deviceName?: string | null;
  actorName?: string | null;
  actorType: ActorType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface LogsSummary {
  totalToday: number;
  deviceLogs: number;
  alertLogs: number;
  adminLogs: number;
}
