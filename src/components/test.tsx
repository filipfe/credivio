"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  console.log("d");
  useReportWebVitals((metric) => {
    console.log(metric);
  });

  return null;
}
