"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { ref, remove } from "firebase/database";
import { rtdb } from "@/src/lib/firebase";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  deviceId: string;
  deviceName: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onSuccess,
  deviceId,
  deviceName,
}: DeleteConfirmModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const targetRef = ref(rtdb, `incubators/${deviceId}`);
      await remove(targetRef);
      setLoading(false);
      onSuccess();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Đã xảy ra lỗi khi xóa thiết bị. Vui lòng thử lại.");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-sm bg-white/95 rounded-[30px] shadow-2xl border border-sky-100/50 p-6 sm:p-8 flex flex-col relative overflow-hidden transition-all duration-300 transform scale-100">
        
        {/* Decorative Top Accent (Red Warning theme) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-red-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-150 cursor-pointer disabled:opacity-50"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Content */}
        <div className="text-center mt-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 shadow-sm border border-rose-100 mb-4 animate-bounce">
            <AlertTriangle className="h-7 w-7 stroke-[2.2]" />
          </div>

          <h3 className="text-lg font-extrabold text-slate-900">Xóa máy ấp trứng?</h3>
          
          <p className="text-sm text-slate-500 mt-3 leading-relaxed">
            Bạn có chắc chắn muốn xóa máy ấp <strong className="text-slate-800 font-bold">"{deviceName}"</strong> (Mã: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono font-bold text-rose-600">{deviceId}</code>)?
          </p>

          <p className="text-xs text-slate-400 mt-2 italic leading-relaxed">
            * Hành động này không thể hoàn tác và toàn bộ dữ liệu cấu hình, đo lường của thiết bị sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-4 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl text-center">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-slate-100 mt-6">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex-1 h-12 flex items-center justify-center rounded-[18px] border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold transition active:scale-98 duration-100 cursor-pointer disabled:opacity-50 text-sm"
          >
            Hủy bỏ
          </button>
          
          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="flex-1 h-12 flex items-center justify-center rounded-[18px] bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-semibold shadow-md shadow-rose-200/50 hover:shadow-lg transition active:scale-95 duration-100 cursor-pointer disabled:opacity-50 text-sm gap-2"
          >
            {loading ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span>Xác nhận xóa</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
