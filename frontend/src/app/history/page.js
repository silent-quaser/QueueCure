"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import API from "@/services/api";

export default function HistoryPage() {
  const [patients, setPatients] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get(
        "/queue/history"
      );

      setPatients(
        res.data.patients || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    window.open(
      "http://localhost:5000/api/queue/report",
      "_blank"
    );
  };

  const priorityCount =
    patients.filter(
      (p) => p.priority
    ).length;

  const averageTime =
    patients.length > 0
      ? Math.round(
          patients.reduce(
            (sum, p) =>
              sum +
              (p.consultationDuration || 0),
            0
          ) / patients.length
        )
      : 0;

  return (
    <DashboardLayout>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h1 className="section-title">
              Queue History
            </h1>

            <p className="section-subtitle">
              Completed consultations and reports
            </p>
          </div>

          <button
            onClick={downloadReport}
            style={{
              background:
                "#4f7cff",
              color: "white",
              border: "none",
              padding:
                "12px 20px",
              borderRadius:
                "12px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "15px",
            }}
          >
            📄 Generate PDF Report
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <div className="card">
            <div className="metric-value">
              {patients.length}
            </div>

            <div className="metric-label">
              Completed Patients
            </div>
          </div>

          <div className="card">
            <div className="metric-value">
              {priorityCount}
            </div>

            <div className="metric-label">
              Priority Cases
            </div>
          </div>

          <div className="card">
            <div className="metric-value">
              {averageTime}
            </div>

            <div className="metric-label">
              Avg Consultation (min)
            </div>
          </div>
        </div>

        <div className="card">
          <h2
            style={{
              fontSize: "1.4rem",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            Consultation Records
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse:
                    "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "#f8fafc",
                    }}
                  >
                    <th style={{ padding: "14px", textAlign: "left" }}>
                      Token
                    </th>

                    <th style={{ padding: "14px", textAlign: "left" }}>
                      Patient
                    </th>

                    <th style={{ padding: "14px", textAlign: "left" }}>
                      Priority
                    </th>

                    <th style={{ padding: "14px", textAlign: "left" }}>
                      Duration
                    </th>

                    <th style={{ padding: "14px", textAlign: "left" }}>
                      Completed
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {patients.map(
                    (patient) => (
                      <tr
                        key={
                          patient._id
                        }
                        style={{
                          borderBottom:
                            "1px solid #e2e8f0",
                        }}
                      >
                        <td
                          style={{
                            padding: "14px",
                            fontWeight: "700",
                          }}
                        >
                          A-
                          {
                            patient.tokenNumber
                          }
                        </td>

                        <td
                          style={{
                            padding: "14px",
                          }}
                        >
                          {
                            patient.patientName
                          }
                        </td>

                        <td
                          style={{
                            padding: "14px",
                          }}
                        >
                          {patient.priority ? (
                            <span
                              style={{
                                background:
                                  "#fff7ed",
                                color:
                                  "#f59e0b",
                                padding:
                                  "6px 10px",
                                borderRadius:
                                  "999px",
                                fontWeight:
                                  "700",
                              }}
                            >
                              PRIORITY
                            </span>
                          ) : (
                            "Normal"
                          )}
                        </td>

                        <td
                          style={{
                            padding: "14px",
                          }}
                        >
                          {
                            patient.consultationDuration
                          }{" "}
                          min
                        </td>

                        <td
                          style={{
                            padding: "14px",
                          }}
                        >
                          {patient.completedAt
                            ? new Date(
                                patient.completedAt
                              ).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}