"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Eye, 
  Edit3, 
  MoreVertical, 
  User, 
  ShieldCheck, 
  Plus, 
  Download, 
  RotateCw, 
  Trash2, 
  Lock,
  Link,
  Shield
} from "lucide-react";
import { UserItem } from "@/src/types/user";
import DataTablePagination from "@/src/components/common/DataTablePagination";

interface UserTableProps {
  users: UserItem[];
  onAddUser?: () => void;
  onRefresh?: () => Promise<void> | void;
}

export default function UserTable({ users, onAddUser, onRefresh }: UserTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    if (onRefresh) {
      try {
        await onRefresh();
      } catch (err) {
        console.error(err);
      }
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleExportExcel = () => {
    const headers = [
      "Họ tên",
      "Email",
      "Vai trò",
      "Trạng thái máy",
      "Số thiết bị",
      "Thiết bị đang quản lý",
      "Ngày tạo (Khởi động)",
      "Trạng thái hoạt động"
    ];

    const rows = users.map(user => {
      const roleLabel = user.role === "admin" ? "Admin" : user.role === "owner" ? "Chủ máy" : user.role === "guest" ? "Khách" : "Thành viên";
      const statusLabel = user.status === "active" ? "Đang hoạt động" : user.status === "disabled" ? "Ngoại tuyến" : "Chờ kết nối";
      return [
        `"${user.fullName.replace(/"/g, '""')}"`,
        `"${user.email.replace(/"/g, '""')}"`,
        `"${roleLabel}"`,
        `"${statusLabel}"`,
        user.deviceCount,
        `"${user.devices.join(", ").replace(/"/g, '""')}"`,
        `"${user.createdAt}"`,
        `"${user.lastActiveAt}"`
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `danh_sach_thanh_vien_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset to page 1 if users list changes
  const [prevUsers, setPrevUsers] = useState(users);
  if (users !== prevUsers) {
    setPrevUsers(users);
    setCurrentPage(1);
  }

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(-2)
      .join("")
      .toUpperCase();
  };

  const getRoleBadge = (role: UserItem["role"]) => {
    const configs = {
      admin: "bg-amber-50 text-amber-700 border-amber-200/80 shadow-sm shadow-amber-50/50",
      user: "bg-sky-50 text-sky-700 border-sky-200/80 shadow-sm shadow-sky-50/50",
      owner: "bg-rose-50 text-rose-700 border-rose-200/80 shadow-sm shadow-rose-50/50",
      guest: "bg-slate-50 text-slate-600 border-slate-200/80 shadow-sm shadow-slate-50/50",
    };
    const labels = {
      admin: "Admin",
      user: "User",
      owner: "Chủ máy",
      guest: "Khách",
    };
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${configs[role] || configs.user}`}>
        {(role === "admin" || role === "owner") && <ShieldCheck className="h-3 w-3 stroke-[2.2]" />}
        {labels[role] || labels.user}
      </span>
    );
  };

  const getStatusBadge = (status: UserItem["status"]) => {
    const configs = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      disabled: "bg-rose-50 text-rose-700 border-rose-200/80",
      pending: "bg-amber-50 text-amber-700 border-amber-200/80",
    };
    const labels = {
      active: "Đang hoạt động",
      disabled: "Ngoại tuyến",
      pending: "Chờ kết nối",
    };
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${configs[status]}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${status === "active" ? "bg-emerald-500 animate-pulse" : status === "disabled" ? "bg-rose-500" : "bg-amber-500 animate-bounce"}`} />
        {labels[status]}
      </span>
    );
  };

  const renderDevices = (devices: string[]) => {
    if (devices.length === 0) {
      return <span className="text-xs text-slate-400 italic">Chưa liên kết</span>;
    }
    const maxVisible = 2;
    const visible = devices.slice(0, maxVisible);
    const extra = devices.length - maxVisible;

    return (
      <div className="flex flex-wrap items-center gap-1">
        {visible.map((d) => (
          <span 
            key={d} 
            className="inline-flex rounded-lg border border-sky-100 bg-sky-50/30 px-2 py-0.5 text-[11px] font-semibold text-sky-700"
          >
            {d}
          </span>
        ))}
        {extra > 0 && (
          <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-bold text-slate-500">
            +{extra}
          </span>
        )}
      </div>
    );
  };

  if (users.length === 0) {
    return (
      <div className="rounded-[24px] border border-sky-100/80 bg-white p-16 text-center shadow-sm shadow-sky-100/10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 shadow-sm shadow-amber-100">
          <User className="h-8 w-8 stroke-[2.2] animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-sky-950">Chưa có người dùng nào</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
          Không tìm thấy tài khoản người dùng nào khớp với bộ lọc hiện tại.
        </p>
        <button
          type="button"
          onClick={onAddUser}
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-amber-500 to-orange-500 px-5 text-sm font-semibold text-white shadow-md shadow-orange-100 transition hover:from-amber-600 hover:to-orange-600 active:scale-95 duration-150"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Thêm người dùng mới</span>
        </button>
      </div>
    );
  }

  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="rounded-[24px] border border-sky-100/80 bg-white shadow-sm shadow-sky-100/10 overflow-hidden">
      
      {/* Table Toolbar */}
      <div className="border-b border-slate-100 bg-white px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Danh sách thành viên
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[16px] border border-sky-100 bg-sky-50/20 px-4 text-xs font-bold text-sky-700 shadow-sm transition hover:bg-sky-50 hover:text-sky-800 active:scale-95 duration-150 cursor-pointer"
          >
            <Download className="h-4 w-4 text-sky-600" />
            <span>Xuất Excel</span>
          </button>
          
          <button
            type="button"
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[16px] border border-sky-100 bg-sky-50/20 text-sky-700 shadow-sm transition hover:bg-sky-50 hover:text-sky-800 active:scale-95 duration-150 cursor-pointer disabled:opacity-50"
            title="Làm mới bảng"
          >
            <RotateCw className={`h-4 w-4 text-sky-600 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto relative min-h-[300px]">
        <table className="w-full min-w-[1200px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">Người dùng</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Vai trò</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Số thiết bị</th>
              <th className="px-6 py-4">Thiết bị đang quản lý</th>
              <th className="px-6 py-4">Ngày tạo</th>
              <th className="px-6 py-4">Hoạt động gần nhất</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedUsers.map((user) => (
              <tr 
                key={user.id} 
                className="group hover:bg-sky-50/10 transition-colors duration-150"
              >
                {/* Người dùng */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 font-bold text-sky-700 border border-sky-100/50">
                      {user.avatarUrl ? (
                        <img 
                          src={user.avatarUrl} 
                          alt={user.fullName} 
                          className="h-full w-full object-cover rounded-xl"
                        />
                      ) : (
                        getInitials(user.fullName)
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sky-950 group-hover:text-sky-600 transition-colors">
                        {user.fullName}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4 font-medium text-slate-600">
                  {user.email}
                </td>

                {/* Vai trò */}
                <td className="px-6 py-4">
                  {getRoleBadge(user.role)}
                </td>

                {/* Trạng thái */}
                <td className="px-6 py-4">
                  {getStatusBadge(user.status)}
                </td>

                {/* Số thiết bị */}
                <td className="px-6 py-4 font-bold text-sky-950 text-center sm:text-left">
                  {user.deviceCount}
                </td>

                {/* Thiết bị đang quản lý */}
                <td className="px-6 py-4">
                  {renderDevices(user.devices)}
                </td>

                {/* Ngày tạo */}
                <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                  {user.createdAt}
                </td>

                {/* Hoạt động gần nhất */}
                <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                  {user.lastActiveAt}
                </td>

                {/* Row Actions Dropdown */}
                <td className="px-6 py-4 relative">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      title="Xem chi tiết"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition duration-150"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Chỉnh sửa"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition duration-150"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveDropdownId(activeDropdownId === user.id ? null : user.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition duration-150"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {activeDropdownId === user.id && (
                        <div 
                          ref={dropdownRef}
                          className="absolute right-0 top-full z-[100] mt-1.5 w-48 rounded-xl border border-sky-100 bg-white p-1.5 shadow-xl animate-in fade-in duration-100"
                        >
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-sky-950 hover:bg-sky-50 transition"
                          >
                            <Link className="h-3.5 w-3.5 text-slate-400" />
                            Gán thiết bị
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-sky-950 hover:bg-sky-50 transition"
                          >
                            <Lock className="h-3.5 w-3.5 text-slate-400" />
                            Khóa tài khoản
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-sky-950 hover:bg-sky-50 transition"
                          >
                            <Shield className="h-3.5 w-3.5 text-slate-400" />
                            Đổi vai trò
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Xóa khỏi danh sách
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      <DataTablePagination
        totalItems={users.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        itemLabel="người dùng"
      />
    </div>
  );
}
