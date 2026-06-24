"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import API from "@/services/api";
import { socket } from "@/services/socket";

export default function PatientPage() {
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

  const patientsAhead =
    queueData.waitingPatients.length;

  const estimatedWait =
    patientsAhead *
    queueData.averageConsultationTime;

  return (
    <DashboardLayout>
      <div>
        <h1 className="section-title">
          Patient Waiting Room
        </h1>

        <p className="section-subtitle">
          Live queue updates and estimated waiting time
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
            <div
              style={{
                color: "#64748b",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              NOW SERVING
            </div>

            <div
              style={{
                fontSize: "3.5rem",
                fontWeight: "900",
                color: "#4f7cff",
              }}
            >
              A-{queueData.currentToken}
            </div>
          </div>

          <div
            className="card"
            style={{
              borderLeft:
                "6px solid #06b6d4",
            }}
          >
            <div
              style={{
                color: "#64748b",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              WAITING
            </div>

            <div
              style={{
                fontSize: "3.5rem",
                fontWeight: "900",
                color: "#06b6d4",
              }}
            >
              {patientsAhead}
            </div>

            <div
              style={{
                color: "#64748b",
              }}
            >
              Patients
            </div>
          </div>

          <div
            className="card"
            style={{
              borderLeft:
                "6px solid #f59e0b",
            }}
          >
            <div
              style={{
                color: "#64748b",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              EST. WAIT
            </div>

            <div
              style={{
                fontSize: "3.5rem",
                fontWeight: "900",
                color: "#f59e0b",
              }}
            >
              {estimatedWait}
            </div>

            <div
              style={{
                color: "#64748b",
              }}
            >
              Minutes
            </div>
          </div>

          <div
            className="card"
            style={{
              borderLeft:
                "6px solid #22c55e",
            }}
          >
            <div
              style={{
                color: "#64748b",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              STATUS
            </div>

            <div
              style={{
                fontSize: "3rem",
                fontWeight: "900",
                color: "#22c55e",
              }}
            >
              LIVE
            </div>

            <div
              style={{
                color: "#64748b",
              }}
            >
              Queue Active
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
              fontSize: "2rem",
              fontWeight: "800",
              marginBottom: "30px",
            }}
          >
            Queue Flow
          </h2>

          {queueData.waitingPatients.length ===
          0 ? (
            <p>No patients waiting.</p>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  overflowX: "auto",
                  paddingBottom: "20px",
                }}
              >
                {queueData.waitingPatients
                  .slice(0, 10)
                  .map(
                    (
                      patient,
                      index
                    ) => (
                      <div
                        key={
                          patient._id
                        }
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                        }}
                      >
                        <div
                          style={{
                            minWidth:
                              "120px",
                            height:
                              "120px",
                            borderRadius:
                              "50%",
                            background:
                              patient.priority
                                ? "#fff7ed"
                                : "#f8fafc",
                            border:
                              patient.priority
                                ? "3px solid #f59e0b"
                                : "3px solid #4f7cff",
                            display:
                              "flex",
                            flexDirection:
                              "column",
                            justifyContent:
                              "center",
                            alignItems:
                              "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize:
                                "1.6rem",
                              fontWeight:
                                "800",
                            }}
                          >
                            A-
                            {
                              patient.tokenNumber
                            }
                          </div>

                          {patient.priority && (
                            <div
                              style={{
                                color:
                                  "#f59e0b",
                                fontSize:
                                  "12px",
                                fontWeight:
                                  "700",
                              }}
                            >
                              PRIORITY
                            </div>
                          )}
                        </div>

                        {index !==
                          queueData
                            .waitingPatients
                            .slice(
                              0,
                              10
                            )
                            .length -
                            1 && (
                          <div
                            style={{
                              width:
                                "70px",
                              height:
                                "4px",
                              background:
                                "#cbd5e1",
                            }}
                          />
                        )}
                      </div>
                    )
                  )}
              </div>

              <div
                style={{
                  marginTop: "20px",
                  textAlign:
                    "center",
                  fontSize: "1rem",
                  fontWeight:
                    "600",
                  color: "#64748b",
                }}
              >
                Showing next{" "}
                {Math.min(
                  queueData
                    .waitingPatients
                    .length,
                  10
                )}{" "}
                patients out of{" "}
                {
                  queueData
                    .waitingPatients
                    .length
                }
              </div>

              <div
                style={{
                  marginTop: "25px",
                  padding: "20px",
                  borderRadius:
                    "16px",
                  background:
                    "#f8fafc",
                  border:
                    "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "1.1rem",
                    fontWeight:
                      "700",
                    marginBottom:
                      "15px",
                  }}
                >
                  AI Queue Prediction
                </div>

                <div
                  style={{
                    color:
                      "#64748b",
                    lineHeight:
                      "1.9",
                  }}
                >
                  <div>
                    Current Token:
                    <strong>
                      {" "}
                      A-
                      {
                        queueData.currentToken
                      }
                    </strong>
                  </div>

                  <div>
                    Patients Waiting:
                    <strong>
                      {" "}
                      {patientsAhead}
                    </strong>
                  </div>

                  <div>
                    Average Consultation:
                    <strong>
                      {" "}
                      {
                        queueData.averageConsultationTime
                      }{" "}
                      min
                    </strong>
                  </div>

                  <div>
                    Estimated Queue Clearance:
                    <strong>
                      {" "}
                      {estimatedWait} min
                    </strong>
                  </div>

                  <div
                    style={{
                      marginTop:
                        "15px",
                      padding:
                        "12px",
                      borderRadius:
                        "12px",
                      background:
                        "#ecfeff",
                      color:
                        "#0f766e",
                      fontWeight:
                        "700",
                    }}
                  >
                    AI Prediction:
                    Queue expected to clear
                    in approximately{" "}
                    {estimatedWait}
                    minutes.
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}