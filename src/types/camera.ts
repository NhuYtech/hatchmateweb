export interface CameraSummary {
  totalCameras: number;
  onlineCameras: number;
  analyzedToday: number;
  aiAlerts: number;
}

export type CameraStatus = "online" | "offline";
export type CameraAiStatus = "analyzed" | "pending" | "alert";

export interface CameraItem {
  id: string;
  deviceId: string;
  deviceName: string;
  cameraName: string;
  locationLabel: string;
  status: CameraStatus;
  previewImage: string | null;
  lastCaptureAt: string;
  aiStatus: CameraAiStatus;
  aiAlertCount: number;
  lastAiSummary: string;
  lastAiConfidence?: number;
  streamEnabled: boolean;
  eggCount?: number;
  previousEggCount?: number;
  lastCountChangedAt?: string;
}

export type AiResultStatus = "normal" | "warning" | "danger";

export interface AiRecord {
  id: string;
  cameraId: string;
  deviceId: string;
  deviceName: string;
  capturedAt: string;
  imageUrl: string | null;
  resultStatus: AiResultStatus;
  resultTitle: string;
  resultSummary: string;
  confidence: number;
  processedBy: string;
  notes?: string | null;
}
