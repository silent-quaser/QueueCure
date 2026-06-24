"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import API from "@/services/api";

export default function HomePage() {
  const [stats, setStats] = useState({
    currentToken: 0,
    waitingPatients: [],
    averageConsultationTime: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get(
        "/queue/status"
      );

      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const waitingCount =
    stats.waitingPatients.length;

  const priorityCount =
    stats.waitingPatients.filter(
      (p) => p.priority
    ).length;

  return (
    <DashboardLayout>
      <div>
        <h1 className="section-title">
          QueueCure Dashboard
        </h1>

        <p className="section-subtitle">
          Real-time hospital queue overview
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div
            className="card"
            style={{
              borderLeft:
                "6px solid #4f7cff",
            }}
          >
            <div className="metric-value">
              A-{stats.currentToken}
            </div>

            <div className="metric-label">
              Current Token
            </div>
          </div>

          <div
            className="card"
            style={{
              borderLeft:
                "6px solid #06b6d4",
            }}
          >
            <div className="metric-value">
              {waitingCount}
            </div>

            <div className="metric-label">
              Waiting Patients
            </div>
          </div>

          <div
            className="card"
            style={{
              borderLeft:
                "6px solid #22c55e",
            }}
          >
            <div className="metric-value">
              {
                stats.averageConsultationTime
              }
            </div>

            <div className="metric-label">
              Avg Consultation
            </div>
          </div>

          <div
            className="card"
            style={{
              borderLeft:
                "6px solid #f59e0b",
            }}
          >
            <div className="metric-value">
              {priorityCount}
            </div>

            <div className="metric-label">
              Priority Patients
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{
            marginTop: "30px",
          }}
        >
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            Quick Navigation
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "20px",
            }}
          >
            <a
              href="/receptionist"
              className="card"
              style={{
                textDecoration:
                  "none",
                color: "inherit",
              }}
            >
              <h3>👥 Receptionist</h3>
              <p>
                Manage patients and
                tokens
              </p>
            </a>

            <a
              href="/doctor"
              className="card"
              style={{
                textDecoration:
                  "none",
                color: "inherit",
              }}
            >
              <h3>🩺 Doctor</h3>
              <p>
                View queue and call
                patients
              </p>
            </a>

            <a
              href="/command-center"
              className="card"
              style={{
                textDecoration:
                  "none",
                color: "inherit",
              }}
            >
              <h3>🎛️ Command Center</h3>
              <p>
                Monitor hospital
                operations
              </p>
            </a>

            <a
              href="/history"
              className="card"
              style={{
                textDecoration:
                  "none",
                color: "inherit",
              }}
            >
              <h3>📊 Queue History</h3>
              <p>
                Review completed
                consultations
              </p>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}