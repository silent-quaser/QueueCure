"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";

export default function PriorityAlert() {
  const [priorityCount, setPriorityCount] =
    useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res =
          await API.get(
            "/queue/status"
          );

        const patients =
          res.data
            ?.waitingPatients || [];

        const count =
          patients.filter(
            (p) => p.priority
          ).length;

        setPriorityCount(count);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  if (priorityCount === 0) {
    return null;
  }

  return (
    <div
      className="card"
      style={{
        borderLeft:
          "6px solid #f59e0b",
        background:
          "#fff7ed",
      }}
    >
      <h3
        style={{
          fontSize: "1.2rem",
          fontWeight: "700",
        }}
      >
        ⚠ Priority Alert
      </h3>

      <p
        style={{
          marginTop: "8px",
        }}
      >
        {priorityCount} priority
        patient(s) waiting.
      </p>
    </div>
  );
}