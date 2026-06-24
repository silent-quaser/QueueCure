"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

export default function QueueBreakdownPie() {
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
    return (
      <div className="card">
        Loading...
      </div>
    );
  }

  const queueData = [
    {
      name: "Waiting",
      value:
        analytics.waitingPatients,
      color: "#06b6d4",
    },
    {
      name: "Serving",
      value:
        analytics.servingPatients,
      color: "#f59e0b",
    },
    {
      name: "Completed",
      value:
        analytics.completedPatients,
      color: "#22c55e",
    },
    {
      name: "Priority",
      value:
        analytics.priorityPatients,
      color: "#ef4444",
    },
  ];
return (
  <div className="card">
    <h2
      style={{
        fontSize: "1.2rem",
        fontWeight: "700",
        marginBottom: "20px",
      }}
    >
      Queue Breakdown
    </h2>

    <div
      style={{
        width: "100%",
        height: "300px",
      }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={queueData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {queueData.map(
              (
                entry,
                index
              ) => (
                <Cell
                  key={index}
                  fill={
                    entry.color
                  }
                />
              )
            )}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

    <div
      style={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {queueData.map(
        (item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              padding:
                "10px 14px",
              border:
                "1px solid #e5e7eb",
              borderRadius:
                "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius:
                    "50%",
                  background:
                    item.color,
                }}
              />

              <span>
                {item.name}
              </span>
            </div>

            <strong>
              {item.value}
            </strong>
          </div>
        )
      )}
    </div>
  </div>
);
  
}