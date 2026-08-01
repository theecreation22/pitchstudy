"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useCloudSync } from "./useCloudSync";

type CloudSyncValue = ReturnType<typeof useCloudSync>;

const CloudSyncContext = createContext<CloudSyncValue | null>(null);

/**
 * Mounts useCloudSync exactly once for the whole app. It subscribes to auth
 * state and owns a debounced push loop — mounting it more than once (e.g. by
 * calling useCloudSync directly from the nav AND the /join page) would open
 * duplicate auth subscriptions and race two independent merges against the
 * same cloud row. Everything reads through useSync() instead.
 */
export function SyncProvider({ children }: { children: ReactNode }) {
  const value = useCloudSync();
  return <CloudSyncContext.Provider value={value}>{children}</CloudSyncContext.Provider>;
}

export function useSync(): CloudSyncValue {
  const ctx = useContext(CloudSyncContext);
  if (!ctx) throw new Error("useSync must be called within <SyncProvider>");
  return ctx;
}
