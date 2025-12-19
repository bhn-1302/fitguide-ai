import type { UserProfile } from "../types/user";

const STORAGE_KEY = "fitguide:user-profile";

export function saveUserProfile(data: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getUserProfile(): UserProfile | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as UserProfile;
  } catch {
    return null;
  }
}

export function clearUserProfile() {
  localStorage.removeItem(STORAGE_KEY);
}
