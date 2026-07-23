"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, User, Phone, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/src/components/AuthProvider";
import { db } from "@/src/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";

interface EditAdminModalProps {
  onClose: () => void;
}

export default function EditAdminModal({ onClose }: EditAdminModalProps) {
  const { currentUser, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userDocId, setUserDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (currentUser && !isInitialized) {
      setDisplayName(currentUser.displayName || "");
      setIsInitialized(true);
      
      const loadProfile = async () => {
        try {
          const usersCol = collection(db, "users");
          const q = query(usersCol, where("email", "==", currentUser.email?.toLowerCase()));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setUserDocId(userDoc.id);
            const data = userDoc.data();
            setPhoneNumber(data.phone || data.phoneNumber || "");
            if (data.fullName) {
              setDisplayName(data.fullName);
            }
          }
        } catch (err) {
          console.error("Failed to load user profile from Firestore:", err);
        }
      };
      
      loadProfile();
    }
  }, [currentUser, isInitialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!displayName.trim()) {
      newErrors.displayName = "Họ và tên không được để trống";
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại không được để trống";
    } else if (!/^[0-9+()#* -]{9,15}$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // 1. Update Firebase Auth Profile
      await updateUserProfile(displayName.trim(), currentUser?.photoURL || null);
      
      // 2. Update or create Firestore user profile doc
      if (userDocId) {
        const userDocRef = doc(db, "users", userDocId);
        await updateDoc(userDocRef, {
          fullName: displayName.trim(),
          phone: phoneNumber.trim(),
        });
      } else {
        const usersCol = collection(db, "users");
        await addDoc(usersCol, {
          fullName: displayName.trim(),
          email: currentUser?.email?.toLowerCase(),
          phone: phoneNumber.trim(),
          role: "admin",
          status: "active",
          createdAt: new Date().toISOString(),
          isActive: true,
          profilePicture: currentUser?.photoURL || "",
        });
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("Error updating admin profile:", err);
      setErrors({ global: err.message || "Đã xảy ra lỗi khi cập nhật thông tin" });
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 animate-fadeIn">
        {/* Success Modal Container */}
        <div className="relative w-full max-w-sm bg-white/95 rounded-[30px] shadow-2xl border border-emerald-100/50 p-8 flex flex-col items-center text-center overflow-hidden transition-all duration-300 transform scale-100 animate-scaleUp">
          
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
          
          {/* Success Check Icon */}
          <div className="mt-4 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-inner">
            <CheckCircle2 className="h-10 w-10 animate-bounce" />
          </div>

          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Cập nhật thành công!</h2>
          <p className="text-xs text-slate-400 font-semibold mt-2 max-w-xs">
            Thông tin tài khoản Admin của bạn đã được cập nhật thành công trên hệ thống.
          </p>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white/95 rounded-[30px] shadow-2xl border border-sky-100/50 p-6 sm:p-8 flex flex-col overflow-hidden transition-all duration-300 transform scale-100">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-150 cursor-pointer disabled:opacity-50"
          type="button"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-sky-950 uppercase tracking-wide">CHỈNH SỬA THÔNG TIN</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Cập nhật thông tin tài khoản Admin của bạn</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.global && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 p-3 text-xs text-rose-600 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errors.global}</span>
            </div>
          )}

          {/* Email (Readonly) */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-sky-950 uppercase tracking-wider">
              Email đăng nhập (Google)
            </label>
            <div className="relative flex h-11 w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-slate-500 font-medium text-xs">
              <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <span className="pl-6 select-all">{currentUser?.email}</span>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-sky-950 uppercase tracking-wider">
              Họ và tên
            </label>
            <div className="relative flex h-11 w-full items-center rounded-xl border border-slate-200 bg-white px-3.5 text-slate-700 focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-50 transition duration-150">
              <User className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nhập họ và tên..."
                className="w-full pl-6 bg-transparent text-xs font-semibold outline-none"
                disabled={loading}
              />
            </div>
            {errors.displayName && (
              <span className="text-[10px] text-rose-500 font-semibold">{errors.displayName}</span>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-sky-950 uppercase tracking-wider">
              Số điện thoại
            </label>
            <div className="relative flex h-11 w-full items-center rounded-xl border border-slate-200 bg-white px-3.5 text-slate-700 focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-50 transition duration-150">
              <Phone className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập số điện thoại..."
                className="w-full pl-6 bg-transparent text-xs font-semibold outline-none"
                disabled={loading}
              />
            </div>
            {errors.phoneNumber && (
              <span className="text-[10px] text-rose-500 font-semibold">{errors.phoneNumber}</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-10 rounded-xl px-4 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition active:scale-95 duration-100 cursor-pointer disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-10 rounded-xl px-5 border border-amber-200 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold transition active:scale-95 duration-100 cursor-pointer disabled:opacity-50 shadow-md shadow-orange-100"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
