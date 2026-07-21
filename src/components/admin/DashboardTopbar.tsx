"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Mail,
  Menu,
  UserCircle2,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "@/src/components/AuthProvider";

interface DashboardTopbarProps {
  onMenuToggle?: () => void;
}

export default function DashboardTopbar({ onMenuToggle }: DashboardTopbarProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser, logout } = useAuth();

  const userName = currentUser?.displayName || "Admin HatchMate";
  const userEmail = currentUser?.email || "admin@hatchmate.vn";
  const userPhoto = currentUser?.photoURL || null;

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/");
    } catch (e) {
      console.error("Firebase SignOut error:", e);
    }
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">

      {/* ── Left: Logo + Hamburger ── */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Logo + Brand Name */}
        <div className="flex items-center gap-3 select-none">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 font-extrabold text-sm border border-sky-100 overflow-hidden">
            <img
              src="/logov2.png"
              alt="Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-base sm:text-lg font-extrabold tracking-wider leading-none">
              <span className="text-[#f97316]">HATCH</span>
              <span className="text-[#0284c7]">MATE</span>
            </p>
            <p className="text-xs font-medium text-slate-400 mt-1 hidden sm:block truncate">
              Hệ thống ấp trứng gà thông minh
            </p>
          </div>
        </div>

        {/* Hamburger */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex items-center justify-center rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* ── Right: Search + Links + Icons + Avatar ── */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Search */}
        <label className="hidden sm:flex relative w-[280px] items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-400 focus-within:ring-2 focus-within:ring-blue-200 transition">
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search"
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
          <Search className="h-4 w-4 shrink-0" />
        </label>

        {/* Bell */}
        <button
          type="button"
          className="flex items-center justify-center rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" strokeWidth={1.8} />
        </button>

        {/* Mail */}
        <button
          type="button"
          className="flex items-center justify-center rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Messages"
        >
          <Mail className="h-5 w-5" strokeWidth={1.8} />
        </button>

        {/* Avatar with dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-center cursor-pointer focus:outline-none"
            aria-label="User profile"
          >
            <div className="h-9 w-9 overflow-hidden rounded-full border border-gray-200 bg-gray-100 ring-1 ring-gray-300 transition hover:ring-[#FFD56B]">
              {userPhoto ? (
                <img src={userPhoto} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle2 className="h-full w-full text-gray-400" strokeWidth={1.2} />
              )}
            </div>
          </button>

          {showDropdown && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowDropdown(false)}
              />
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-white p-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.12)] border border-slate-100 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Header */}
                <div className="px-3 py-2 border-b border-slate-50 flex flex-col gap-0.5 select-none">
                  <p className="text-sm font-bold text-slate-800">{userName}</p>
                  <p className="text-xs font-semibold text-slate-400 truncate">{userEmail}</p>
                </div>

                {/* Actions */}
                <div className="mt-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      router.push("/settings");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Cấu hình hệ thống</span>
                  </button>

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-bold text-red-500 rounded-xl hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
