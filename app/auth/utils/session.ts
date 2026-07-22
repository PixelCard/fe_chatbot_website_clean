"use client";

import { APP_ROUTES } from "@/app/config/routes";

type ClientRole = "ADMIN" | "TECHNICIAN" | "USER" | null;

const ACCESS_TOKEN_KEY = "accessToken";
const ROLE_KEY = "userRole";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const matched = cookies.find((entry) => entry.startsWith(`${name}=`));

  if (!matched) {
    return null;
  }

  return decodeURIComponent(matched.slice(name.length + 1));
}

function normalizeRole(role: unknown): ClientRole {
  return role === "ADMIN" || role === "TECHNICIAN" || role === "USER"
    ? role
    : null;
}

export function getClientTokenFromDocument(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY) || readCookie(ACCESS_TOKEN_KEY);
}

export function getClientRoleFromDocument(): ClientRole {
  if (typeof window === "undefined") {
    return null;
  }

  return normalizeRole(
    window.localStorage.getItem(ROLE_KEY) || readCookie(ROLE_KEY),
  );
}

export function setClientSession(token: string, role: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedRole = normalizeRole(role);

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  document.cookie = `${ACCESS_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; SameSite=Lax`;

  if (normalizedRole) {
    window.localStorage.setItem(ROLE_KEY, normalizedRole);
    document.cookie = `${ROLE_KEY}=${encodeURIComponent(normalizedRole)}; path=/; SameSite=Lax`;
    return;
  }

  window.localStorage.removeItem(ROLE_KEY);
  document.cookie = `${ROLE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export function clearClientSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(ROLE_KEY);
  window.localStorage.removeItem("user_profile");

  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  document.cookie = `${ROLE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export function syncStoredSessionToCookie(): {
  token: string | null;
  role: ClientRole;
} {
  if (typeof window === "undefined") {
    return { token: null, role: null };
  }

  const token =
    window.localStorage.getItem(ACCESS_TOKEN_KEY) || readCookie(ACCESS_TOKEN_KEY);
  const role = normalizeRole(
    window.localStorage.getItem(ROLE_KEY) || readCookie(ROLE_KEY),
  );

  if (token) {
    document.cookie = `${ACCESS_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
  }

  if (role) {
    document.cookie = `${ROLE_KEY}=${encodeURIComponent(role)}; path=/; SameSite=Lax`;
  }

  return { token, role };
}

export function getRouteByRole(role: unknown): string {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "ADMIN") {
    return APP_ROUTES.ADMIN.DASHBOARD;
  }

  if (normalizedRole === "TECHNICIAN") {
    return APP_ROUTES.TECHNICIAN.DASHBOARD;
  }

  return APP_ROUTES.CLIENT.CHAT_BOT;
}
