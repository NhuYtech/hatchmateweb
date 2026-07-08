import AdminSidebar from "@/src/components/admin/AdminSidebar";
import UserPageHeader from "@/src/components/users/UserPageHeader";
import UserMiniStatCard from "@/src/components/users/UserMiniStatCard";
import UserFilterBar from "@/src/components/users/UserFilterBar";
import UserTable from "@/src/components/users/UserTable";
import { usersSummaryData, userMockList } from "@/src/data/usersMock";
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  ShieldCheck
} from "lucide-react";

export const metadata = {
  title: "Quản lý người dùng - HatchMate Admin",
  description: "Theo dõi tài khoản, phân quyền và quản lý người dùng trong hệ thống HatchMate",
};

export default function UsersPage() {
  const { totalUsers, activeUsers, adminUsers, disabledUsers } = usersSummaryData;

  return (
    <div className="min-h-screen text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] gap-6 px-4 py-5 xl:px-8">
        <AdminSidebar />

        <main className="flex min-h-screen flex-1 flex-col gap-6 min-w-0">
          {/* Header */}
          <UserPageHeader totalUsers={totalUsers} />

          {/* Mini Stats Cards */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <UserMiniStatCard
              label="Tổng người dùng"
              value={totalUsers}
              icon={Users}
              accent="indigo"
            />
            <UserMiniStatCard
              label="Đang hoạt động"
              value={activeUsers}
              icon={UserCheck}
              accent="emerald"
            />
            <UserMiniStatCard
              label="Quản trị viên"
              value={adminUsers}
              icon={ShieldCheck}
              accent="sky"
            />
            <UserMiniStatCard
              label="Tài khoản khóa"
              value={disabledUsers}
              icon={UserMinus}
              accent="rose"
            />
          </section>

          {/* Search & Filter Bar */}
          <UserFilterBar />

          {/* User Table Component Section */}
          <UserTable users={userMockList} />
        </main>
      </div>
    </div>
  );
}
