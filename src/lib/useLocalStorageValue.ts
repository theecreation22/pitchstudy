"use client";

import { useCallback, useSyncExternalStore } from "react";

const CHANGE_EVENT_PREFIX = "pitchstudy-storage-change:";

function subscribe(key: string) {
  return (callback: () => void) => {
    const eventName = CHANGE_EVENT_PREFIX + key;
    window.addEventListener(eventName, callback);
    window.addEventListener("storage", callback);
    return () => {
      window.removeEventListener(eventName, callback);
      window.removeEventListener("storage", callback);
    };
  };
}

function getServerSnapshot(): string | null {
  return null;
}

/**
 * A localStorage-backed value kept in sync via useSyncExternalStore rather
 * than an effect + setState (the latter trips react-hooks/set-state-in-effect
 * under this project's eslint-config-next setup).
 */
export function useLocalStorageValue(key: string): [string | null, (value: string) => void] {
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

  const value = useSyncExternalStore(subscribe(key), getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: string) => {
      try {
        window.localStorage.setItem(key, next);
      } catch {
        // localStorage unavailable — value simply won't persist
      }
      window.dispatchEvent(new Event(CHANGE_EVENT_PREFIX + key));
    },
    [key],
  );

  return [value, setValue];
}
