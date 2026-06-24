"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { socket } from "@/services/socket";

export default function AnalyticsCards() {
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

  const cards = [
    {
      icon: "👥",
      value:
        analytics.totalPatients,
      label:
        "Patients Today",
    },
    {
      icon: "🚨",
      value:
        analytics.priorityPatients,
      label:
        "Emergency Cases",
    },
    {
      icon: "🏥",
      value:
        analytics.activeDoctors,
      label:
        "Active Doctors",
    },
    {
      icon: "⚕️",
      value: `${analytics.doctorUtilization}%`,
      label:
        "Doctor Utilization",
    },
    {
      icon: "📈",
      value: `${analytics.queueEfficiency}%`,
      label:
        "Queue Efficiency",
    },
    {
      icon: "⏱",
      value: `${analytics.averageConsultationTime} min`,
      label:
        "Avg Consultation",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",
        gap: "20px",
      }}
    >
      {cards.map(
  (card, index) => (
    <div
      key={index}
      className="card"
      style={{
        textAlign:
          "center",
        padding:
          "24px",
        borderRadius:
          "18px",
        background:
          index === 0
            ? "#eff6ff"
            : index === 1
            ? "#fef2f2"
            : index === 2
            ? "#ecfdf5"
            : index === 3
            ? "#fff7ed"
            : index === 4
            ? "#f3e8ff"
            : "#ecfeff",
        border:
          "1px solid rgba(0,0,0,0.05)",
      }}
    >
            <div
              style={{
                fontSize:
                  "2rem",
                marginBottom:
                  "10px",
              }}
            >
              {card.icon}
            </div>

            <div
              style={{
                fontSize:
                  "2rem",
                fontWeight:
                  "800",
                color:
                  "#2563eb",
              }}
            >
              {card.value}
            </div>

            <div
              style={{
                marginTop:
                  "8px",
                color:
                  "#64748b",
                fontWeight:
                  "600",
              }}
            >
              {card.label}
            </div>
          </div>
        )
      )}
    </div>
  );
}