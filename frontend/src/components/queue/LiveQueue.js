"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { socket } from "@/services/socket";

export default function LiveQueue() {
  const [queues, setQueues] =
    useState({});

  const fetchQueue = async () => {
    try {
      const res = await API.get(
        "/queue/queue"
      );

      setQueues(
        res.data.queues || {}
      );
    } catch (error) {
      console.error(error);
    }
  };

  const makePriority = async (
    patientId
  ) => {
    try {
      await API.post(
        "/queue/priority",
        {
          patientId,
        }
      );

      fetchQueue();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQueue();

    socket.on(
      "queueUpdated",
      fetchQueue
    );

    return () => {
      socket.off(
        "queueUpdated",
        fetchQueue
      );
    };
  }, []);

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: "800",
          }}
        >
          Multi Doctor Queue
        </h2>

        <div
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "6px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "700",
          }}
        >
          LIVE
        </div>
      </div>

      {Object.keys(queues).map(
        (doctorName) => (
          <div
            key={doctorName}
            style={{
              marginBottom: "25px",
            }}
          >
            <h3
              style={{
                marginBottom: "12px",
                color: "#2563eb",
                fontWeight: "800",
              }}
            >
              👨‍⚕️ {doctorName}
            </h3>

            {queues[
              doctorName
            ]?.length === 0 ? (
              <div
                style={{
                  color:
                    "#64748b",
                  marginBottom:
                    "10px",
                }}
              >
                No patients waiting
              </div>
            ) : (
              queues[
                doctorName
              ].map(
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
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      padding:
                        "16px",
                      marginBottom:
                        "12px",
                      borderRadius:
                        "16px",
                      background:
                        patient.priority
                          ? "#fff7ed"
                          : "#f8fafc",
                      border:
                        patient.priority
                          ? "2px solid #f59e0b"
                          : "1px solid #e2e8f0",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "10px",
                        }}
                      >
                        <strong
                          style={{
                            fontSize:
                              "1.1rem",
                          }}
                        >
                          A-
                          {
                            patient.tokenNumber
                          }
                        </strong>

                        {patient.priority && (
                          <span
                            style={{
                              background:
                                "#f59e0b",
                              color:
                                "white",
                              padding:
                                "4px 10px",
                              borderRadius:
                                "999px",
                              fontSize:
                                "11px",
                              fontWeight:
                                "700",
                            }}
                          >
                            PRIORITY
                          </span>
                        )}
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

                      <div
                        style={{
                          color:
                            "#64748b",
                          fontSize:
                            "13px",
                          marginTop:
                            "4px",
                        }}
                      >
                        Position #
                        {index + 1}
                      </div>
                    </div>

                    {!patient.priority && (
                      <button
                        onClick={() =>
                          makePriority(
                            patient._id
                          )
                        }
                        style={{
                          background:
                            "#f59e0b",
                          color:
                            "white",
                          border:
                            "none",
                          padding:
                            "10px 14px",
                          borderRadius:
                            "12px",
                          cursor:
                            "pointer",
                          fontWeight:
                            "700",
                        }}
                      >
                        Priority
                      </button>
                    )}
                  </div>
                )
              )
            )}
          </div>
        )
      )}
    </div>
  );
}