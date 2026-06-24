"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import API from "@/services/api";
import { socket } from "@/services/socket";

export default function CommandCenterPage() {
  const [queueData, setQueueData] = useState({
    currentToken: 0,
    waitingPatients: [],
    averageConsultationTime: 10,
  });

  const [activities, setActivities] = useState([
    "System Started",
  ]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await API.get("/queue/status");
      setQueueData(res.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    socket.on("queueUpdated", () => {
      fetchStatus();

      setActivities((prev) => [
        `Queue Updated • ${new Date().toLocaleTimeString()}`,
        ...prev.slice(0, 9),
      ]);
    });

    socket.on("tokenCalled", (data) => {
      fetchStatus();

      setActivities((prev) => [
        `Token A-${data.tokenNumber} Called`,
        ...prev.slice(0, 9),
      ]);
    });

    return () => {
      socket.off("queueUpdated");
      socket.off("tokenCalled");
    };
  }, [fetchStatus]);

  const priorityPatients =
    queueData.waitingPatients.filter(
      (p) => p.priority
    ).length;

  const totalPatients =
    queueData.currentToken +
    queueData.waitingPatients.length;

  let queueHealth = "Healthy";
  let healthColor = "#22c55e";

  if (
    queueData.waitingPatients.length > 10
  ) {
    queueHealth = "Busy";
    healthColor = "#f59e0b";
  }

  if (
    queueData.waitingPatients.length > 20
  ) {
    queueHealth = "Critical";
    healthColor = "#ef4444";
  }

  const estimatedClearance =
    queueData.waitingPatients.length *
    queueData.averageConsultationTime;

  let aiRecommendation =
    "Current load is normal. No action required.";

  if (
    queueData.waitingPatients.length > 10
  ) {
    aiRecommendation =
      "High waiting volume detected. Consider assigning another doctor.";
  }

  if (
    queueData.waitingPatients.length > 20
  ) {
    aiRecommendation =
      "Critical queue detected. Immediate intervention recommended.";
  }

  return (
    <DashboardLayout>
      <div>
        <h1 className="section-title">
          Command Center
        </h1>

        <p className="section-subtitle">
          Real-time hospital operations overview
        </p>

        {/* Top Stats */}

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
              {totalPatients}
            </div>

            <div className="metric-label">
              Total Patients
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
              A-{queueData.currentToken}
            </div>

            <div className="metric-label">
              Current Token
            </div>
          </div>

          <div
            className="card"
            style={{
              borderLeft:
                `6px solid ${healthColor}`,
            }}
          >
            <div
              className="metric-value"
              style={{
                color: healthColor,
              }}
            >
              {queueHealth}
            </div>

            <div className="metric-label">
              Queue Health
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
              {priorityPatients}
            </div>

            <div className="metric-label">
              Priority Patients
            </div>
          </div>
        </div>

        {/* Main Dashboard */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {/* Activity Feed */}

          <div className="card">
            <h2
              style={{
                fontSize: "1.6rem",
                fontWeight: "700",
                marginBottom: "20px",
              }}
            >
              Live Activity Feed
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {activities.map(
                (activity, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "14px",
                      background:
                        "#f8fafc",
                      borderRadius:
                        "12px",
                    }}
                  >
                    {activity}
                  </div>
                )
              )}
            </div>

            <div
              style={{
                marginTop: "25px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "700",
                  marginBottom: "15px",
                }}
              >
                Upcoming Queue
              </h3>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {queueData.waitingPatients
                  .slice(0, 8)
                  .map((patient) => (
                    <div
                      key={patient._id}
                      style={{
                        padding:
                          "10px 16px",
                        borderRadius:
                          "999px",
                        background:
                          patient.priority
                            ? "#fff7ed"
                            : "#f8fafc",
                        border: patient.priority
                          ? "1px solid #f59e0b"
                          : "1px solid #e2e8f0",
                        fontWeight:
                          "600",
                      }}
                    >
                      A-
                      {
                        patient.tokenNumber
                      }
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* System Status */}

          <div className="card">
            <h2
              style={{
                fontSize: "1.6rem",
                fontWeight: "700",
                marginBottom: "20px",
              }}
            >
              System Status
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <div>
                🟢 Backend Online
              </div>

              <div>
                🟢 Database Connected
              </div>

              <div>
                🟢 Socket Live
              </div>

              <div>
                🟢 Queue Active
              </div>

              <hr />

              <div>
                Avg Consultation:{" "}
                {
                  queueData.averageConsultationTime
                }{" "}
                min
              </div>

              <div>
                Waiting Patients:{" "}
                {
                  queueData.waitingPatients
                    .length
                }
              </div>

              <div>
                Estimated Clearance:{" "}
                {estimatedClearance} min
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight */}

        <div
          className="card"
          style={{
            marginTop: "20px",
            borderLeft:
              `6px solid ${healthColor}`,
            padding: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: "700",
              marginBottom: "15px",
            }}
          >
            AI Queue Insight
          </h2>

          <div
            style={{
              color: healthColor,
              fontWeight: "700",
              fontSize: "1.2rem",
              marginBottom: "12px",
            }}
          >
            Queue Status: {queueHealth}
          </div>

          <div
            style={{
              lineHeight: "1.6",
              color: "#64748b",
            }}
          >
            <div>
              Waiting Patients:{" "}
              {
                queueData.waitingPatients
                  .length
              }
            </div>

            <div>
              Average Consultation:{" "}
              {
                queueData.averageConsultationTime
              }{" "}
              min
            </div>

            <div>
              Estimated Queue Clearance:{" "}
              {estimatedClearance} min
            </div>
          </div>

          <div
            style={{
              marginTop: "15px",
              padding: "14px",
              background: "#f8fafc",
              borderRadius: "12px",
            }}
          >
            <strong>
              Recommendation:
            </strong>{" "}
            {aiRecommendation}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}