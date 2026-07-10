"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/src/lib/firebase";
import { signInWithGoogle as firebaseSignInWithGoogle, logout as firebaseLogout } from "@/src/lib/auth";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isMock?: boolean;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInMock: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if there is a saved mock user session in sessionStorage
    const savedMockUser = sessionStorage.getItem("hatchmate_mock_user");
    if (savedMockUser) {
      try {
        const parsed = JSON.parse(savedMockUser);
        setCurrentUser(parsed);
        setLoading(false);
        return;
      } catch (e) {
        console.error("Failed to parse mock user:", e);
        sessionStorage.removeItem("hatchmate_mock_user");
      }
    }

    // 2. If Firebase is configured, subscribe to auth state changes
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      throw new Error("Firebase chưa được cấu hình! Vui lòng sử dụng chế độ Đăng nhập Thử nghiệm.");
    }
    await firebaseSignInWithGoogle();
  };

  const signInMock = () => {
    const mockUser: AuthUser = {
      uid: "mock-admin-uid",
      email: "test-admin@hatchmate.vn",
      displayName: "Test Admin",
      photoURL: null,
      isMock: true,
    };
    setCurrentUser(mockUser);
    sessionStorage.setItem("hatchmate_mock_user", JSON.stringify(mockUser));
  };

  const logout = async () => {
    sessionStorage.removeItem("hatchmate_mock_user");
    setCurrentUser(null);
    if (isFirebaseConfigured) {
      try {
        await firebaseLogout();
      } catch (e) {
        console.error("Firebase logout error:", e);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signInWithGoogle, signInMock, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
