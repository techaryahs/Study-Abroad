"use client";

/**
 * Lightweight session helper over token.ts.
 *
 * Single source of truth for credential presence and cached user identity.
 * Does NOT own membership, entitlements, or React context.
 *
 * token.ts remains the storage layer (localStorage).
 * This module is the only place UI should ask "is the user authenticated?"
 */

import { useEffect, useState } from "react";
import { getToken, getUser } from "@/app/lib/token";

export type SessionSnapshot = {
  /** Bearer credential from localStorage (null if guest). */
  token: string | null;
  /** Cached user snapshot from login (may be null even if token exists). */
  user: any | null;
  /** True when a session credential exists. Independent of membership. */
  isAuthenticated: boolean;
};

/**
 * Read the current session from token.ts / localStorage.
 * Safe on server: returns unauthenticated snapshot.
 */
export function getSession(): SessionSnapshot {
  const token = getToken();
  const user = getUser();
  return {
    token,
    user,
    isAuthenticated: Boolean(token),
  };
}

/** Session credential, or null when guest. */
export function getSessionToken(): string | null {
  return getToken();
}

/** Cached user from login (auth_user), or null. */
export function getSessionUser(): any | null {
  return getUser();
}

/**
 * Canonical authentication check for the website.
 * Authenticated = has session token.
 * Membership / plan / entitlement are separate concerns.
 */
export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

/**
 * Subscribe a client component to session changes (login / logout / setUser).
 * Re-reads token.ts when `user-updated` fires — no AuthProvider, no duplicated store.
 */
export function useSession(): SessionSnapshot {
  const [snapshot, setSnapshot] = useState<SessionSnapshot>(() => getSession());

  useEffect(() => {
    const refresh = () => setSnapshot(getSession());
    refresh();
    window.addEventListener("user-updated", refresh);
    return () => window.removeEventListener("user-updated", refresh);
  }, []);

  return snapshot;
}
