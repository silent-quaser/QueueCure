"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { socket } from "@/services/socket";

export default function CommandCenter() {
  const [data, setData] = useState({
    currentToken: 0,
    waitingPatients: [],
    averageConsultationTime: 10,
  });

  const fetchData = async () => {
    try {
      const res =
        await API.get("/queue/status");

      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();

    socket.on(
      "queueUpdated",
      fetchData
    );

    socket.on(
      "tokenCalled",
      fetchData
    );

    return () => {
      socket.off(
        "queueUpdated",
        fetchData
      );

      socket.off(
        "tokenCalled",
        fetchData
      );
    };
  }, []);

  const priorityCount =
    data.waitingPatients.filter(
      (p) => p.priority
    ).length;

  let healthText = "Healthy";
  let healthColor = "#22c55e";

  if (
    data.waitingPatients.length > 10
  ) {
    healthText = "Busy";
    healthColor = "#f59e0b";
  }

  if (
    data.waitingPatients.length > 20
  ) {
    healthText = "Critical";
    healthColor = "#ef4444";
  }

  const cards = [
    {
      title: "Current Token",
      value: `A-${data.currentToken}`,
      color: "#5b8def",
    },
    {
      title: "Waiting Patients",
      value:
        data.waitingPatients.length,
      color: "#06b6d4",
    },
    {
      title: "Priority Patients",
      value: priorityCount,
      color: "#f59e0b",
    },
    {
      title: "Queue Health",
      value: healthText,
      color: healthColor,
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
      {cards.map((card) => (
        <div
          key={card.title}
          className="card"
          style={{
            borderLeft:
              `6px solid ${card.color}`,
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              color: card.color,
            }}
          >
            {card.value}
          </div>

          <div
            style={{
              marginTop: "8px",
              color: "#64748b",
              fontWeight: "500",
            }}
          >
            {card.title}
          </div>
        </div>
      ))}
    </div>
  );
}