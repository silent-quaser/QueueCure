"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import API from "@/services/api";
import { socket } from "@/services/socket";

export default function DoctorPage() {
  const [queueData, setQueueData] = useState({
    currentToken: 0,
    waitingPatients: [],
    averageConsultationTime: 10,
  });

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

    socket.on("queueUpdated", fetchStatus);
    socket.on("tokenCalled", fetchStatus);

    return () => {
      socket.off("queueUpdated", fetchStatus);
      socket.off("tokenCalled", fetchStatus);
    };
  }, [fetchStatus]);

  const currentPatient =
    queueData.waitingPatients[0];

  const upcomingPatients =
    queueData.waitingPatients.slice(1, 5);

  const servedToday =
    queueData.currentToken || 0;

  const priorityCount =
    queueData.waitingPatients.filter(
      (p) => p.priority
    ).length;

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

  return (
    <DashboardLayout>
      <div>
        <h1 className="section-title">
          Doctor Dashboard
        </h1>

        <p className="section-subtitle">
          Live consultation overview
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
                "6px solid #06b6d4",
            }}
          >
            <div className="metric-value">
              {
                queueData.waitingPatients
                  .length
              }
            </div>

            <div className="metric-label">
              Patients Waiting
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
                queueData.averageConsultationTime
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
        </div>

        {/* Main Layout */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1.5fr 1fr",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {/* Current Consultation */}

          <div
            className="card"
            style={{
              padding: "35px",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                marginBottom: "25px",
              }}
            >
              Current Consultation
            </h2>

            {currentPatient ? (
              <>
                <div
                  style={{
                    fontSize: "4rem",
                    fontWeight: "900",
                    color: "#4f7cff",
                  }}
                >
                  A-
                  {
                    currentPatient.tokenNumber
                  }
                </div>

                <div
                  style={{
                    fontSize: "1.5rem",
                    marginTop: "10px",
                    fontWeight: "600",
                  }}
                >
                  {
                    currentPatient.patientName
                  }
                </div>

                {currentPatient.priority && (
                  <div
                    style={{
                      marginTop: "15px",
                      display:
                        "inline-block",
                      background:
                        "#fff7ed",
                      color:
                        "#f59e0b",
                      padding:
                        "8px 14px",
                      borderRadius:
                        "999px",
                      fontWeight:
                        "700",
                    }}
                  >
                    ⭐ Priority Patient
                  </div>
                )}

                <div
                  style={{
                    marginTop: "30px",
                    padding: "20px",
                    borderRadius:
                      "14px",
                    background:
                      "#f8fafc",
                  }}
                >
                  Consultation Active
                </div>
              </>
            ) : (
              <p>
                No patients waiting.
              </p>
            )}
          </div>

          {/* Queue Health */}

          <div className="card">
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: "800",
                marginBottom: "20px",
              }}
            >
              Queue Health
            </h2>

            <div
              style={{
                fontSize: "2rem",
                fontWeight: "900",
                color: healthColor,
              }}
            >
              {queueHealth}
            </div>

            <div
              style={{
                marginTop: "20px",
                lineHeight: "2",
              }}
            >
              <div>
                Waiting Patients:{" "}
                {
                  queueData
                    .waitingPatients
                    .length
                }
              </div>

              <div>
                Priority Patients:{" "}
                {priorityCount}
              </div>

              <div>
                Patients Served:{" "}
                {servedToday}
              </div>

              <div>
                Avg Consultation:{" "}
                {
                  queueData.averageConsultationTime
                }{" "}
                min
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Patients */}

        <div
          className="card"
          style={{
            marginTop: "25px",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "800",
              marginBottom: "20px",
            }}
          >
            Upcoming Patients
          </h2>

          {upcomingPatients.length ===
          0 ? (
            <p>
              No upcoming patients.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: "15px",
              }}
            >
              {upcomingPatients.map(
                (patient) => (
                  <div
                    key={patient._id}
                    style={{
                      padding: "18px",
                      borderRadius:
                        "14px",
                      background:
                        "#f8fafc",
                      border:
                        "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          "1.8rem",
                        fontWeight:
                          "800",
                      }}
                    >
                      A-
                      {
                        patient.tokenNumber
                      }
                    </div>

                    <div
                      style={{
                        marginTop:
                          "6px",
                      }}
                    >
                      {
                        patient.patientName
                      }
                    </div>

                    {patient.priority && (
                      <div
                        style={{
                          marginTop:
                            "10px",
                          color:
                            "#f59e0b",
                          fontWeight:
                            "700",
                        }}
                      >
                        PRIORITY
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}