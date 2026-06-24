"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";

export default function QueueHealth() {
  const [analytics, setAnalytics] =
    useState(null);

  useEffect(() => {
    const fetchAnalytics =
      async () => {
        try {
          const res =
            await API.get(
              "/analytics"
            );

          setAnalytics(
            res.data.analytics
          );
        } catch (error) {
          console.error(error);
        }
      };

    fetchAnalytics();
  }, []);

  if (!analytics) {
    return null;
  }

  let status = "Healthy Queue";
  let icon = "🟢";
  let color = "#22c55e";

  if (
    analytics.waitingPatients > 10
  ) {
    status = "Busy Queue";
    icon = "🟡";
    color = "#f59e0b";
  }

  if (
    analytics.waitingPatients > 20
  ) {
    status = "Critical Queue";
    icon = "🔴";
    color = "#ef4444";
  }

  return (
    <div
      className="card"
      style={{
        borderLeft:
          `6px solid ${color}`,
      }}
    >
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
        }}
      >
        {icon} {status}
      </div>

      <div
        style={{
          marginTop: "10px",
          color: "#64748b",
        }}
      >
        Waiting Patients:{" "}
        {
          analytics.waitingPatients
        }
      </div>

      <div
        style={{
          color: "#64748b",
        }}
      >
        Avg Consultation:{" "}
        {
          analytics.averageConsultationTime
        }{" "}
        min
      </div>
    </div>
  );
}