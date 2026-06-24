"use client";

import { useEffect, useState, useCallback } from "react";
import API from "@/services/api";
import { socket } from "@/services/socket";

export default function DisplayBoardPage() {
  const [queueData, setQueueData] = useState({
    currentToken: 0,
    waitingPatients: [],
    averageConsultationTime: 10,
  });

  const [currentTime, setCurrentTime] =
    useState("");

  const fetchStatus = useCallback(async () => {
    try {
      const res = await API.get(
        "/queue/status"
      );
      setQueueData(res.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    speechSynthesis.getVoices();

    speechSynthesis.onvoiceschanged =
      () => {
        speechSynthesis.getVoices();
      };
  }, []);

  useEffect(() => {
    fetchStatus();

    socket.on("connect", () => {
      console.log(
        "SOCKET CONNECTED:",
        socket.id
      );
    });

    socket.on("connected", (data) => {
      console.log(
        "SERVER MESSAGE:",
        data
      );
    });

    socket.on("queueUpdated", () => {
      console.log(
        "QUEUE UPDATED RECEIVED"
      );

      fetchStatus();
    });

    socket.on("tokenCalled", (data) => {
      console.log(
        "TOKEN CALLED RECEIVED",
        data
      );

      fetchStatus();

      speechSynthesis.cancel();

      const announcement =
        new SpeechSynthesisUtterance(
          `Token A ${data.tokenNumber}, please proceed to the consultation room`
        );

      announcement.rate = 0.9;
      announcement.pitch = 1;
      announcement.volume = 1;

      const voices =
        speechSynthesis.getVoices();

      console.log(
        "AVAILABLE VOICES:",
        voices.length
      );

      if (voices.length > 0) {
        announcement.voice =
          voices[0];
      }

      console.log(
        "Speaking announcement..."
      );

      setTimeout(() => {
        speechSynthesis.speak(
          announcement
        );
      }, 300);
    });

    return () => {
      socket.off("connect");
      socket.off("connected");
      socket.off("queueUpdated");
      socket.off("tokenCalled");
    };
  }, [fetchStatus]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString()
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const nextTokens =
    queueData.waitingPatients.slice(0, 5);

  const priorityPatients =
    queueData.waitingPatients.filter(
      (p) => p.priority
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: "800",
              }}
            >
              QueueCure
            </h1>

            <p
              style={{
                color: "#64748b",
              }}
            >
              Live Clinic Display Board
            </p>
          </div>

          <div
            className="card"
            style={{
              padding: "16px 24px",
            }}
          >
            <strong>
              {currentTime}
            </strong>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <div
            className="card"
            style={{
              borderLeft:
                "6px solid #5b8def",
            }}
          >
            <div
              style={{
                color: "#64748b",
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              NOW SERVING
            </div>

            <div
              style={{
                fontSize: "4rem",
                fontWeight: "900",
                color: "#5b8def",
              }}
            >
              A-{queueData.currentToken}
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
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              WAITING
            </div>

            <div
              style={{
                fontSize: "4rem",
                fontWeight: "900",
                color: "#f59e0b",
              }}
            >
              {queueData.waitingPatients.length}
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
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              AVG WAIT
            </div>

            <div
              style={{
                fontSize: "4rem",
                fontWeight: "900",
                color: "#06b6d4",
              }}
            >
              {queueData.averageConsultationTime}
            </div>

            <div
              style={{
                color: "#64748b",
              }}
            >
              minutes
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
                fontWeight: "600",
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
          </div>
        </div>

        {priorityPatients.length > 0 && (
          <div
            className="card"
            style={{
              marginBottom: "25px",
              borderLeft:
                "6px solid #f59e0b",
              background:
                "#fff7ed",
            }}
          >
            <h2>
              ⚠ Priority Patients
            </h2>

            <p
              style={{
                marginTop: "10px",
              }}
            >
              {
                priorityPatients.length
              }{" "}
              priority patient(s)
              waiting
            </p>
          </div>
        )}

        <div className="card">
          <h2
            style={{
              marginBottom: "25px",
              fontSize: "1.6rem",
              fontWeight: "700",
            }}
          >
            Upcoming Queue
          </h2>

          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            {nextTokens.map(
              (patient) => (
                <div
                  key={patient._id}
                  style={{
                    minWidth: "180px",
                    padding: "20px",
                    borderRadius:
                      "18px",
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
                  <h2>
                    A-
                    {
                      patient.tokenNumber
                    }
                  </h2>

                  <p>
                    {
                      patient.patientName
                    }
                  </p>

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
        </div>
      </div>
    </main>
  );
}