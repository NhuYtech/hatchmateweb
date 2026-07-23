"use client";

import React, { useState, useEffect } from "react";
import UserPageHeader from "@/src/components/users/UserPageHeader";
import UserMiniStatCard from "@/src/components/users/UserMiniStatCard";
import UserTable from "@/src/components/users/UserTable";
import AddUserModal from "@/src/components/users/AddUserModal";
import { ref, onValue } from "firebase/database";
import { collection, onSnapshot } from "firebase/firestore";
import { db, rtdb } from "@/src/lib/firebase";
import { UserItem } from "@/src/types/user";
import {
  Users,
  UserCheck,
  UserMinus,
  ShieldCheck
} from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const usersCol = collection(db, "users");
    const incubatorsRef = ref(rtdb, "incubators");

    let currentUsersData: any[] = [];
    let currentIncubatorsData: any = {};

    const combineAndSet = (usersData: any[], incubatorsData: any) => {
      const mappedUsers: UserItem[] = usersData.map((u) => {
        // Find all incubators matching this user's deviceCode or deviceName
        const userIncubators: any[] = [];
        if (incubatorsData) {
          Object.keys(incubatorsData).forEach((key) => {
            const inc = incubatorsData[key];
            if (
              (u.deviceCode && String(inc.code) === String(u.deviceCode)) ||
              (u.deviceName && String(inc.name) === String(u.deviceName))
            ) {
              userIncubators.push({ id: key, ...inc });
            }
          });
        }

        // 1. Trạng thái hoạt động của máy (Machine running status)
        let mappedStatus: any = "pending";
        if (userIncubators.length > 0) {
          const primaryInc = userIncubators[0];
          const rawStatus = String(primaryInc.status || "").toLowerCase();
          if (rawStatus === "online" || primaryInc.alert === "NORMAL") {
            mappedStatus = "active";
          } else {
            mappedStatus = "disabled"; // offline / other status
          }
        }

        // 2. Số thiết bị (total devices managed by user)
        const deviceCount = userIncubators.length;

        // 3. Thiết bị đang quản lý (names of machines)
        const devices = userIncubators.map((inc) => inc.name || inc.id);

        // 4. Ngày tạo là ngày người dùng khởi động máy (startDate of incubation cycle)
        let createdAtStr = u.createdAt || "";
        if (userIncubators.length > 0 && userIncubators[0].cycle?.startDate) {
          const startDate = new Date(userIncubators[0].cycle.startDate);
          if (!isNaN(startDate.getTime())) {
            createdAtStr = startDate.toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          }
        } else if (createdAtStr) {
          const dateObj = new Date(createdAtStr);
          if (!isNaN(dateObj.getTime())) {
            createdAtStr = dateObj.toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          }
        } else {
          createdAtStr = "Chưa khởi động";
        }

        return {
          id: u.uid || u.id,
          fullName: u.fullName || "Người dùng ẩn danh",
          email: u.email || "Chưa cập nhật",
          uid: u.uid || u.id,
          role: (u.role || "user") as any,
          status: mappedStatus,
          deviceCount: deviceCount,
          devices: devices,
          createdAt: createdAtStr,
          lastActiveAt: u.isActive ? "Đang hoạt động" : "Ngoại tuyến",
          avatarUrl: u.profilePicture || null,
        };
      });

      setUsers(mappedUsers);
    };

    // Listen to users from Firestore
    const unsubscribeUsers = onSnapshot(usersCol, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      currentUsersData = list;
      combineAndSet(currentUsersData, currentIncubatorsData);
      setLoading(false);
    }, (err) => {
      currentUsersData = [];
      combineAndSet(currentUsersData, currentIncubatorsData);
      setLoading(false);
    });

    // Listen to incubators from Realtime Database
    const unsubscribeIncubators = onValue(incubatorsRef, (snapshot) => {
      if (snapshot.exists()) {
        currentIncubatorsData = snapshot.val();
      } else {
        currentIncubatorsData = {};
      }
      combineAndSet(currentUsersData, currentIncubatorsData);
    }, (err) => {
      console.error("RTDB incubators listener failed:", err);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeIncubators();
    };
  }, [refreshTrigger]);

  const sortedUsers = [...users].sort((a, b) => a.fullName.localeCompare(b.fullName));

  // Calculate live summary stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const adminUsers = users.filter((u) => u.role === "admin" || u.role === "owner").length;
  const disabledUsers = users.filter((u) => u.status === "disabled").length;

  return (
    <div className="grid gap-4">
      {/* Header */}
      <UserPageHeader totalUsers={totalUsers} onAddUser={() => setIsAddModalOpen(true)} />

      {/* Mini Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          label="Chủ máy"
          value={adminUsers}
          icon={ShieldCheck}
          accent="sky"
        />
        <UserMiniStatCard
          label="Máy ngoại tuyến"
          value={disabledUsers}
          icon={UserMinus}
          accent="rose"
        />
      </section>

      {/* User Table Component Section */}
      <UserTable 
        users={sortedUsers} 
        onAddUser={() => setIsAddModalOpen(true)}
        onRefresh={() => setRefreshTrigger((prev) => prev + 1)} 
      />

      {/* Add User Modal */}
      {isAddModalOpen && (
        <AddUserModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            setRefreshTrigger((prev) => prev + 1);
          }}
        />
      )}
    </div>
  );
}
