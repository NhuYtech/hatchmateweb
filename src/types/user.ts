export type UserStatus = "active" | "disabled" | "pending";
export type UserRole = "admin" | "user";

export interface UserItem {
  id: string;
  fullName: string;
  email: string;
  uid: string;
  role: UserRole;
  status: UserStatus;
  deviceCount: number;
  devices: string[];
  createdAt: string;
  lastActiveAt: string;
  avatarUrl?: string | null;
}

export interface UsersSummary {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  disabledUsers: number;
}
