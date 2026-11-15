import { useState, useEffect } from "react";

export type DeviceType = "phone" | "tablet" | "desktop" | "tv";

function detectDevice(): DeviceType {
  if (typeof window === "undefined" || typeof navigator === "undefined") return "desktop";

  const ua = navigator.userAgent;
  const width = window.innerWidth;

  if (/SmartTV|Tizen|WebOS|HbbTV|GoogleTV|AppleTV|Android TV|Roku|FireTV/i.test(ua)) {
    return "tv";
  }

  // Android phones include "Mobile"; most Android tablets do not.
  const isPhone = /iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  if (isPhone) return "phone";

  const isIPad = /iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  const isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);
  if (isIPad || isAndroidTablet) return "tablet";

  // Viewport fallback also handles resized browser windows.
  if (width < 768) return "phone";
  if (width < 1024) return "tablet";
  return "desktop";
}

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>(detectDevice);

  useEffect(() => {
    const checkDevice = () => setDeviceType(detectDevice());

    checkDevice();
    window.addEventListener("resize", checkDevice);
    window.addEventListener("orientationchange", checkDevice);
    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("orientationchange", checkDevice);
    };
  }, []);

  return deviceType;
}
