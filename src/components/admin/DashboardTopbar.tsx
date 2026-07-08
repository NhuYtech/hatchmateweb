"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  Mail,
  Menu,
  UserCircle2,
} from "lucide-react";

interface DashboardTopbarProps {
  onMenuToggle?: () => void;
}

export default function DashboardTopbar({ onMenuToggle }: DashboardTopbarProps) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">

      {/* ── Left: Logo + Hamburger + Search ── */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <span className="text-[18px] font-bold tracking-tight text-gray-900 select-none">
          Hệ thống ấp trứng gà thông minh HatchMate
        </span>

        {/* Hamburger */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex items-center justify-center rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>


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
      </div>

      {/* ── Right: Links + Icons + Avatar ── */}
      <div className="flex items-center gap-6">
        {/* Documentation link — hidden on mobile
        <a
          href="#"
          className="hidden items-center gap-0.5 text-sm text-gray-500 transition hover:text-gray-800 sm:flex"
        >
          <span>Documentation</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </a> */}

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

        {/* Avatar */}
        <button
          type="button"
          className="flex items-center justify-center"
          aria-label="User profile"
        >
          <div className="h-9 w-9 overflow-hidden rounded-full border border-gray-200 bg-gray-100 ring-1 ring-gray-300">
            <UserCircle2 className="h-full w-full text-gray-400" strokeWidth={1.2} />
          </div>
        </button>
      </div>
    </header>
  );
}
