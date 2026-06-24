"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { socket } from "@/services/socket";

export default function DoctorQueues() {
  const [queues, setQueues] =
    useState([]);

  const fetchQueues =
    async () => {
      try {
        const res =
          await API.get(
            "/queue/doctor-queues"
          );

        setQueues(
          res.data.queues || []
        );
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    fetchQueues();

    socket.on(
      "queueUpdated",
      fetchQueues
    );

    return () => {
      socket.off(
        "queueUpdated",
        fetchQueues
      );
    };
  }, []);

 return (
  <div className="card">
    <h2
      style={{
        fontSize: "1.4rem",
        fontWeight: "800",
        marginBottom: "20px",
      }}
    >
      👨‍⚕️ Multi Doctor Queue
    </h2>

    {queues.length === 0 ? (
      <p>No active doctor queues.</p>
    ) : (
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: "16px",
        }}
      >
        {queues.map((queue) => {
          let status = "Free";
          let color = "#22c55e";

          if (
            queue.waitingPatients >= 3
          ) {
            status = "Busy";
            color = "#f59e0b";
          }

          if (
            queue.waitingPatients >= 6
          ) {
            status = "Overloaded";
            color = "#ef4444";
          }

          return (
            <div
              key={queue._id}
              style={{
                padding: "18px",
                border:
                  "1px solid #e2e8f0",
                borderRadius:
                  "14px",
                background:
                  "#f8fafc",
              }}
            >
              <h3
                style={{
                  marginBottom:
                    "10px",
                }}
              >
                👨‍⚕️ {queue._id}
              </h3>

              <div>
                🩺 Department:
                {" "}
                {
                  queue.specialization
                }
              </div>

              <div>
                🏥 Hospital:
                {" "}
                {queue.hospital}
              </div>

              <div
                style={{
                  marginTop:
                    "10px",
                  color,
                  fontWeight:
                    "700",
                }}
              >
                {status}
              </div>

              <div
                style={{
                  marginTop:
                    "8px",
                  fontWeight:
                    "700",
                }}
              >
                👥 Waiting:
                {" "}
                {
                  queue.waitingPatients
                }
              </div>

              <div>
                ⏱ Estimated Wait:
                {" "}
                {
                  queue.waitingPatients *
                  5
                }{" "}
                mins
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
}