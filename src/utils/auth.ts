// In-memory session fallback for environments where localStorage is blocked or throws errors
const memorySession: Record<string, string> = {};

export const getSessionItem = (key: string): string | null => {
  try {
    if (typeof window !== "undefined") {
      const val = localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch (e) {
    console.warn("localStorage.getItem blocked, falling back to memory:", e);
  }
  return memorySession[key] || null;
};

export const setSessionItem = (key: string, value: string): void => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn("localStorage.setItem blocked, falling back to memory:", e);
  }
  memorySession[key] = value;
};

export const removeSessionItem = (key: string): void => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn("localStorage.removeItem blocked, falling back to memory:", e);
  }
  delete memorySession[key];
};
