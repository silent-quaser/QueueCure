"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";

export default function DoctorPerformance() {
  const [doctors, setDoctors] =
    useState([]);

  useEffect(() => {
    const fetchPerformance =
      async () => {
        try {
          const res =
            await API.get(
              "/doctors/performance"
            );

          setDoctors(
            res.data.performance || []
          );
        } catch (error) {
          console.error(error);
        }
      };

    fetchPerformance();
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
        🏆 Top Performing Doctors
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: "16px",
        }}
      >
        {doctors
          .slice(0, 6)
          .map((doctor, index) => (
            <div
              key={
                doctor.doctorName
              }
              style={{
                padding: "18px",
                border:
                  "1px solid #e5e7eb",
                borderRadius:
                  "14px",
                background:
                  index === 0
                    ? "#fefce8"
                    : index === 1
                    ? "#f8fafc"
                    : index === 2
                    ? "#fff7ed"
                    : "#ffffff",
              }}
            >
              <h3
                style={{
                  marginBottom:
                    "10px",
                  fontWeight:
                    "800",
                }}
              >
                {index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : "🏅"}{" "}
                {
                  doctor.doctorName
                }
              </h3>

              <div>
                🩺{" "}
                {
                  doctor.specialization
                }
              </div>

              <div>
                ⭐{" "}
                {doctor.rating}
              </div>

              <div>
                👥 Served:{" "}
                {
                  doctor.patientsServed
                }
              </div>

              <div>
                ⏳ Queue:{" "}
                {
                  doctor.currentQueue
                }
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}