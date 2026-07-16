"use client";

import React, { useState, useEffect } from "react";
import UserPageHeader from "@/src/components/users/UserPageHeader";
import UserMiniStatCard from "@/src/components/users/UserMiniStatCard";
import UserFilterBar from "@/src/components/users/UserFilterBar";
import UserTable from "@/src/components/users/UserTable";
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

  // Search & filter states
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("name_asc");
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
      console.error("Firestore users listener failed:", err);
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

  // Filter & sort logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.uid.toLowerCase().includes(search.toLowerCase());

    const matchesRole = role === "all" || user.role === role;
    const matchesStatus = status === "all" || user.status === status;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sort === "name_asc") {
      return a.fullName.localeCompare(b.fullName);
    } else if (sort === "devices_desc") {
      return b.deviceCount - a.deviceCount;
    } else if (sort === "created_desc") {
      const parseDate = (dStr: string) => {
        if (!dStr || dStr === "Chưa khởi động") return 0;
        const parts = dStr.split(" ");
        const dateParts = parts[0].split("/");
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const year = parseInt(dateParts[2], 10);
        if (parts[1]) {
          const timeParts = parts[1].split(":");
          const hour = parseInt(timeParts[0], 10);
          const minute = parseInt(timeParts[1], 10);
          return new Date(year, month, day, hour, minute).getTime();
        }
        return new Date(year, month, day).getTime();
      };
      return parseDate(b.createdAt) - parseDate(a.createdAt);
    }
    return 0;
  });

  // Calculate live summary stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const adminUsers = users.filter((u) => u.role === "admin" || u.role === "owner").length;
  const disabledUsers = users.filter((u) => u.status === "disabled").length;

  return (
    <div className="grid gap-4">
      {/* Header */}
      <UserPageHeader totalUsers={totalUsers} />

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
          label="Quản trị & Chủ máy"
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

      {/* Search & Filter Bar */}
      <UserFilterBar 
        onSearchChange={setSearch}
        onRoleChange={setRole}
        onStatusChange={setStatus}
        onSortChange={setSort}
        onReset={() => {
          setSearch("");
          setRole("all");
          setStatus("all");
          setSort("name_asc");
        }}
      />

      {/* User Table Component Section */}
      <UserTable users={sortedUsers} onRefresh={() => setRefreshTrigger((prev) => prev + 1)} />
    </div>
  );
}
