"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";

export default function JoinQueuePage() {
  const [patientName, setPatientName] =
    useState("");

  const [age, setAge] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [symptoms, setSymptoms] =
    useState("");

  const [hospital, setHospital] =
    useState("");

  const [nearestHospital, setNearestHospital] =
    useState(null);

  const [recommendedDoctor, setRecommendedDoctor] =
    useState(null);

  const [specialization, setSpecialization] =
    useState("");

  const [token, setToken] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const symptomOptions = [
    "Chest Pain",
    "Breathing Difficulty",
    "Headache / Migraine",
    "Skin Allergy",
    "Fever",
    "Cold & Cough",
    "Bone Fracture",
    "Joint Pain",
    "Stomach Pain",
    "Diabetes Consultation",
    "Blood Pressure Checkup",
    "General Checkup",
    "Heart Attack",
    "Stroke",
    "Severe Bleeding",
  ];

  useEffect(() => {
    if (!navigator.geolocation)
      return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          const res =
            await API.post(
              "/hospitals/nearest",
              {
                latitude,
                longitude,
              }
            );

          if (
            res.data.success
          ) {
            setNearestHospital(
              res.data.recommended
            );

            setHospital(
              res.data.recommended
                ?.name || ""
            );
          }
        } catch (error) {
          console.error(error);
        }
      },
      (error) => {
        console.error(error);

        alert(
          "Location access is required to recommend the nearest hospital."
        );
      }
    );
  }, []);

  useEffect(() => {
    const getRecommendation =
      async () => {
        try {
          if (
            !symptoms ||
            !hospital
          )
            return;

          const res =
            await API.post(
              "/doctors/recommend",
              {
                symptoms,
                hospital,
              }
            );

          if (
            res.data.success
          ) {
            setRecommendedDoctor(
              res.data
                .recommendedDoctor
            );

            setSpecialization(
              res.data
                .specialization
            );
          }
        } catch (error) {
          console.error(error);
        }
      };

    getRecommendation();
  }, [symptoms, hospital]);

  const joinQueue =
    async () => {
      if (
        !patientName ||
        !symptoms
      ) {
        alert(
          "Please complete all required fields."
        );
        return;
      }

      if (
        !recommendedDoctor
      ) {
        alert(
          "AI recommendation not available yet."
        );
        return;
      }

      try {
        setLoading(true);

        const res =
          await API.post(
            "/queue/add-patient",
            {
              patientName,
              age,
              gender,
              phoneNumber,
              symptoms,
              hospital,
              doctorName:
                recommendedDoctor.doctorName,
              specialization,
            }
          );

        setToken(
          res.data.patient
            .tokenNumber
        );
      } catch (error) {
        console.error(error);

        alert(
          error?.response?.data
            ?.message ||
            "Registration failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        background:
          "linear-gradient(135deg,#f8fbff,#eef7ff)",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "550px",
        }}
      >
        <h1
          style={{
            textAlign:
              "center",
            marginBottom:
              "20px",
            fontWeight:
              "800",
          }}
        >
          🏥 QueueCure Self Check-In
        </h1>

        {token ? (
          <div
            style={{
              textAlign:
                "center",
            }}
          >
            <div>
              Your Token
            </div>

            <div
              style={{
                fontSize:
                  "4rem",
                fontWeight:
                  "800",
                color:
                  "#2563eb",
              }}
            >
              A-{token}
            </div>

            <div
              style={{
                marginTop:
                  "15px",
                color:
                  "#64748b",
              }}
            >
              Please wait for
              voice announcement.
            </div>
          </div>
        ) : (
          <>
            {nearestHospital && (
              <div
                style={{
                  background:
                    "#ecfeff",
                  border:
                    "2px solid #06b6d4",
                  padding:
                    "15px",
                  borderRadius:
                    "12px",
                  marginBottom:
                    "20px",
                }}
              >
                <strong>
                  📍 Nearest
                  Hospital
                </strong>

                <div
                  style={{
                    marginTop:
                      "8px",
                    fontWeight:
                      "700",
                  }}
                >
                  {
                    nearestHospital.name
                  }
                </div>
              </div>
            )}

            <input
              placeholder="Patient Name"
              value={patientName}
              onChange={(e) =>
                setPatientName(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "14px",
                marginBottom:
                  "12px",
              }}
            />

            <input
              placeholder="Age"
              type="number"
              value={age}
              onChange={(e) =>
                setAge(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "14px",
                marginBottom:
                  "12px",
              }}
            />

            <select
              value={gender}
              onChange={(e) =>
                setGender(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "14px",
                marginBottom:
                  "12px",
              }}
            >
              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            <input
              placeholder="Phone Number"
              value={
                phoneNumber
              }
              onChange={(e) =>
                setPhoneNumber(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "14px",
                marginBottom:
                  "12px",
              }}
            />

            <select
              value={symptoms}
              onChange={(e) =>
                setSymptoms(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "14px",
                marginBottom:
                  "12px",
              }}
            >
              <option value="">
                Select Symptoms
              </option>

              {symptomOptions.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

            {recommendedDoctor && (
              <div
                style={{
                  background:
                    "#f0fdf4",
                  border:
                    "2px solid #22c55e",
                  padding:
                    "15px",
                  borderRadius:
                    "12px",
                  marginBottom:
                    "20px",
                }}
              >
                <strong>
                  🤖 AI
                  Recommended
                  Doctor
                </strong>

                <div
                  style={{
                    marginTop:
                      "10px",
                  }}
                >
                  {
                    recommendedDoctor.doctorName
                  }
                </div>

                <div>
                  {
                    specialization
                  }
                </div>
              </div>
            )}

            <button
              onClick={
                joinQueue
              }
              disabled={
                loading
              }
              style={{
                width: "100%",
                background:
                  "#2563eb",
                color:
                  "white",
                padding:
                  "16px",
                border:
                  "none",
                borderRadius:
                  "12px",
                fontWeight:
                  "700",
                cursor:
                  "pointer",
              }}
            >
              {loading
                ? "Joining..."
                : "Join Queue"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}