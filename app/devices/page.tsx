"use client";

import React, { useEffect, useState } from "react";
import DevicePageHeader from "@/src/components/devices/DevicePageHeader";
import DeviceMiniStatCard from "@/src/components/devices/DeviceMiniStatCard";
import DeviceFilterBar from "@/src/components/devices/DeviceFilterBar";
import DeviceTable from "@/src/components/devices/DeviceTable";
import { ref, onValue, get } from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import { db, rtdb } from "@/src/lib/firebase";
import { 
  Cpu, 
  Wifi, 
  WifiOff, 
  AlertTriangle
} from "lucide-react";
import type { DeviceItem } from "@/src/types/device";

export default function DevicesPage() {
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerEmail, setOwnerEmail] = useState<string>("Đang tải...");

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("updated_desc");

  // 1. Fetch Owner Email from Firestore "users" collection
  useEffect(() => {
    const fetchOwnerEmail = async () => {
      try {
        const usersCol = collection(db, "users");
        const querySnapshot = await getDocs(usersCol);
        let foundEmail = "";

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.role === "owner" && userData.email) {
            foundEmail = userData.email;
          }
        });

        if (!foundEmail) {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if ((userData.role === "admin" || userData.role === "guest") && userData.email && !foundEmail) {
              foundEmail = userData.email;
            }
          });
        }

        if (foundEmail) {
          setOwnerEmail(foundEmail);
        } else {
          setOwnerEmail("owner@hatchmate.com");
        }
      } catch (err) {
        console.error("Error fetching users from Firestore:", err);
        setOwnerEmail("owner@hatchmate.com");
      }
    };

    fetchOwnerEmail();
  }, []);

  // Map snapshot value into DeviceItem array
  const mapDataToDevices = (data: any): DeviceItem[] => {
    const list: DeviceItem[] = [];
    Object.keys(data).forEach((key) => {
      const item = data[key];
      if (typeof item === "object" && item !== null) {
        const temperature = item.telemetry?.temp !== undefined 
          ? Number(item.telemetry.temp) 
          : (item.temperature !== undefined ? Number(item.temperature) : Number(item.temp ?? 0));

        const humidity = item.telemetry?.humi !== undefined 
          ? Number(item.telemetry.humi) 
          : (item.humidity !== undefined ? Number(item.humidity) : Number(item.humi ?? 0));

        const incubatingDay = item.telemetry?.day !== undefined 
          ? Number(item.telemetry.day) 
          : (item.incubatingDay !== undefined ? Number(item.incubatingDay) : Number(item.day ?? 0));

        const totalIncubationDays = item.cycle?.totalDays !== undefined 
          ? Number(item.cycle.totalDays) 
          : Number(item.totalIncubationDays ?? 21);

        const remainingDays = item.remainingDays !== undefined 
          ? Number(item.remainingDays) 
          : Math.max(0, totalIncubationDays - incubatingDay);

        const incubationStatus = 
          incubatingDay === 0 
            ? "paused" 
            : (totalIncubationDays - incubatingDay <= 3 ? "hatchingSoon" : "incubating");

        list.push({
          id: key,
          name: item.name ?? key,
          owner: ownerEmail,
          status: String(item.status ?? (item.alert === "NORMAL" ? "online" : (item.alert ? "warning" : "offline"))).toLowerCase() as any,
          incubationStatus,
          temperature,
          humidity,
          incubatingDay,
          totalIncubationDays,
          remainingDays,
          hasCamera: Boolean(item.hasCamera ?? item.control?.camera),
          battery: Number(item.battery ?? 100),
          wifi: Number(item.wifi ?? 5),
          lastSeen: item.lastSeen ?? "Vừa xong",
        });
      }
    });

    list.sort((a, b) => a.id.localeCompare(b.id));
    return list;
  };

  // 2. Fetch Devices list from Realtime Database (real-time listener)
  useEffect(() => {
    const devicesRef = ref(rtdb, "incubators");

    const unsubscribe = onValue(devicesRef, (snapshot) => {
      if (snapshot.exists()) {
        const list = mapDataToDevices(snapshot.val());
        setDevices(list);
      } else {
        setDevices([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [ownerEmail]);

  // 3. Manual refresh function triggered by clicking RotateCw
  const handleRefresh = async () => {
    const devicesRef = ref(rtdb, "incubators");
    try {
      const snapshot = await get(devicesRef);
      if (snapshot.exists()) {
        const list = mapDataToDevices(snapshot.val());
        setDevices(list);
      } else {
        setDevices([]);
      }
    } catch (err) {
      console.error("Manual refresh failed:", err);
    }
  };

  // Handle Filtering & Sorting client-side
  const filteredDevices = devices.filter((device) => {
    const matchesSearch = 
      device.name.toLowerCase().includes(search.toLowerCase()) ||
      device.id.toLowerCase().includes(search.toLowerCase()) ||
      device.owner.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === "all" || device.status === status;

    return matchesSearch && matchesStatus;
  });

  const sortedDevices = [...filteredDevices].sort((a, b) => {
    if (sort === "name_asc") {
      return a.name.localeCompare(b.name);
    } else if (sort === "incubating_desc") {
      return b.incubatingDay - a.incubatingDay;
    } else {
      // updated_desc / default: sort by id
      return a.id.localeCompare(b.id);
    }
  });

  // Calculate live KPI statistics
  const total = devices.length;
  const online = devices.filter((d) => d.status === "online").length;
  const offline = devices.filter((d) => d.status === "offline").length;
  const warning = devices.filter((d) => d.status === "warning").length;

  return (
    <div className="grid gap-4 w-full max-w-full min-w-0 overflow-hidden">
      {/* Header */}
      <DevicePageHeader totalDevices={total} />

      {/* Mini Stats Component Section */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DeviceMiniStatCard
          label="Tổng thiết bị"
          value={total}
          icon={Cpu}
          accent="indigo"
        />
        <DeviceMiniStatCard
          label="Thiết bị online"
          value={online}
          icon={Wifi}
          accent="emerald"
        />
        <DeviceMiniStatCard
          label="Thiết bị offline"
          value={offline}
          icon={WifiOff}
          accent="rose"
        />
        <DeviceMiniStatCard
          label="Thiết bị cảnh báo"
          value={warning}
          icon={AlertTriangle}
          accent="amber"
        />
      </section>

      {/* Search & Filter Bar */}
      <DeviceFilterBar 
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onSortChange={setSort}
      />

      {/* Device Table Component Section */}
      <DeviceTable 
        devices={sortedDevices} 
        onAddDevice={() => console.log("Thêm thiết bị click")}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
