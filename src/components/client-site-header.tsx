"use client";
import React, { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";

export default function ClientSiteHeader() {
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    try {
      setEmployeeId(localStorage.getItem("employeeId"));
    } catch (e) {
      // localStorage may be unavailable in some environments; silently treat as no employee
      setEmployeeId(null);
    }
  }, []);

  if (!employeeId) return null;
  return <SiteHeader />;
}
