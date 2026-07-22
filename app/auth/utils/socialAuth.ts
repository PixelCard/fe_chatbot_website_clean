"use client";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const ZALO_AUTH_URL = "https://oauth.zaloapp.com/v4/permission";

const GOOGLE_STATE_KEY = "smartelec_google_oauth_state";
const ZALO_STATE_KEY = "smartelec_zalo_oauth_state";
const ZALO_VERIFIER_KEY = "smartelec_zalo_code_verifier";
const ZALO_REDIRECT_URI_KEY = "smartelec_zalo_redirect_uri";

type SocialProvider = "google" | "zalo";

export type SocialCallbackResult =
  | {
      provider: "google";
      idToken: string;
    }
  | {
      provider: "zalo";
      code: string;
      codeVerifier: string;
      redirectUri: string;
      state: string;
    };

function getBrowserRedirectUri() {
  return `${window.location.origin}${window.location.pathname}`;
}

function getRandomString(length = 64) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const values = new Uint32Array(length);
  window.crypto.getRandomValues(values);

  return Array.from(values, (value) => chars[value % chars.length]).join("");
}

function encodeBase64Url(bytes: ArrayBuffer) {
  const binary = String.fromCharCode(...new Uint8Array(bytes));

  return window
    .btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function createCodeChallenge(verifier: string) {
  const bytes = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);

  return encodeBase64Url(digest);
}

function assertBrowserApi(provider: SocialProvider) {
  if (typeof window === "undefined") {
    throw new Error(`Không thể đăng nhập ${provider} ở môi trường máy chủ.`);
  }
}

export function startGoogleLogin() {
  assertBrowserApi("google");

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

  if (!clientId) {
    throw new Error("Thiếu NEXT_PUBLIC_GOOGLE_CLIENT_ID để đăng nhập Google.");
  }

  const state = `google:${getRandomString(24)}`;
  const nonce = getRandomString(24);
  const redirectUri =
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI?.trim() ||
    getBrowserRedirectUri();
  const url = new URL(GOOGLE_AUTH_URL);

  window.sessionStorage.setItem(GOOGLE_STATE_KEY, state);

  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "id_token");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);
  url.searchParams.set("prompt", "select_account");

  window.location.assign(url.toString());
}

export async function startZaloLogin() {
  assertBrowserApi("zalo");

  const appId = process.env.NEXT_PUBLIC_ZALO_APP_ID?.trim();

  if (!appId) {
    throw new Error("Thiếu NEXT_PUBLIC_ZALO_APP_ID để đăng nhập Zalo.");
  }

  const redirectUri =
    process.env.NEXT_PUBLIC_ZALO_REDIRECT_URI?.trim() || getBrowserRedirectUri();
  const state = `zalo:${getRandomString(24)}`;
  const codeVerifier = getRandomString(96);
  const codeChallenge = await createCodeChallenge(codeVerifier);
  const url = new URL(ZALO_AUTH_URL);

  window.sessionStorage.setItem(ZALO_STATE_KEY, state);
  window.sessionStorage.setItem(ZALO_VERIFIER_KEY, codeVerifier);
  window.sessionStorage.setItem(ZALO_REDIRECT_URI_KEY, redirectUri);

  url.searchParams.set("app_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  window.location.assign(url.toString());
}

export function consumeSocialCallback(): SocialCallbackResult | null {
  assertBrowserApi("google");

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const googleIdToken = hashParams.get("id_token");
  const googleState = hashParams.get("state");

  if (googleIdToken && googleState?.startsWith("google:")) {
    const storedState = window.sessionStorage.getItem(GOOGLE_STATE_KEY);
    window.sessionStorage.removeItem(GOOGLE_STATE_KEY);

    if (storedState !== googleState) {
      throw new Error("Phiên đăng nhập Google không hợp lệ. Vui lòng thử lại.");
    }

    window.history.replaceState(null, "", window.location.pathname);

    return {
      provider: "google",
      idToken: googleIdToken,
    };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const zaloCode = searchParams.get("code");
  const zaloState = searchParams.get("state");

  if (zaloCode && zaloState?.startsWith("zalo:")) {
    const storedState = window.sessionStorage.getItem(ZALO_STATE_KEY);
    const codeVerifier = window.sessionStorage.getItem(ZALO_VERIFIER_KEY);
    const redirectUri =
      window.sessionStorage.getItem(ZALO_REDIRECT_URI_KEY) ||
      getBrowserRedirectUri();

    window.sessionStorage.removeItem(ZALO_STATE_KEY);
    window.sessionStorage.removeItem(ZALO_VERIFIER_KEY);
    window.sessionStorage.removeItem(ZALO_REDIRECT_URI_KEY);

    if (storedState !== zaloState || !codeVerifier) {
      throw new Error("Phiên đăng nhập Zalo không hợp lệ. Vui lòng thử lại.");
    }

    window.history.replaceState(null, "", window.location.pathname);

    return {
      provider: "zalo",
      code: zaloCode,
      codeVerifier,
      redirectUri,
      state: zaloState,
    };
  }

  return null;
}
