"use client";

import { useEffect, useState } from "react";

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("SW registered:", reg.scope);
          setReady(true);
        })
        .catch((err) => console.log("SW registration failed:", err));
    }

    if ("standalone" in window) {
      window.addEventListener("online", () => {
        document.body.classList.remove("offline");
      });
      window.addEventListener("offline", () => {
        document.body.classList.add("offline");
      });
    }

    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
      });
    }
  }, []);

  return <>{children}</>;
}