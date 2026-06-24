"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { socket } from "@/services/socket";
import {
  ResponsiveContainer,
  BarChart,
  PieChart,
  Pie,
  Cell,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function QueueAnalyticsChart() {
  const [analytics, setAnalytics] =
    useState(null);

  useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const res = await API.get(
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

  socket.on(
    "queueUpdated",
    fetchAnalytics
  );

  socket.on(
    "tokenCalled",
    fetchAnalytics
  );

  return () => {
    socket.off(
      "queueUpdated",
      fetchAnalytics
    );

    socket.off(
      "tokenCalled",
      fetchAnalytics
    );
  };
}, []);
  if (!analytics) {
    return (
      <div className="card">
        Loading Analytics...
      </div>
    );
  }

  const queueData = [
  {
    name: "Waiting",
    value: analytics.waitingPatients,
    color: "#06b6d4",
  },
  {
    name: "Serving",
    value: analytics.servingPatients,
    color: "#f59e0b",
  },
  {
    name: "Completed",
    value: analytics.completedPatients,
    color: "#22c55e",
  },
  {
    name: "Priority",
    value: analytics.priorityPatients,
    color: "#ef4444",
  },
];

 return (
  <div
    className="card"
    style={{
      height: "550px",
    }}
  >
      <div
        className="card"
        style={{
          height: "550px",
        }}
      >
        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: "800",
            marginBottom: "20px",
          }}
        >
          Queue Distribution
        </h2>

        <div
          style={{
            width: "100%",
            height: "420px",
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={queueData}
            >
              <XAxis
                dataKey="name"
              />
              <YAxis />
              <Tooltip />

              <Bar dataKey="value">
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
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

     
    </div>
  );
}