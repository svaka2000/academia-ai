"use client";

import { useEffect, useState } from "react";

/** True once the client has mounted — guards localStorage-backed UI from SSR mismatch. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
