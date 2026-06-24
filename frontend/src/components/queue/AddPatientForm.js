"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";

export default function AddPatientForm() {
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

  const [doctorName, setDoctorName] =
    useState("");

  const [doctors, setDoctors] =
    useState([]);

  const [recommendation, setRecommendation] =
    useState(null);

const [location, setLocation] =
  useState(null);

  const [
  nearestHospital,
  setNearestHospital,
] = useState(null);



const [emergencyMessage, setEmergencyMessage] =
  useState("");

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
    const fetchDoctors = async () => {
      try {
        const res = await API.get(
          "/doctors/all"
        );

        setDoctors(
          res.data.doctors || []
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
  if (
    !navigator.geolocation
  )
    return;

 navigator.geolocation.getCurrentPosition(
  async (position) => {
    try {
      const latitude =
        position.coords.latitude;

      const longitude =
        position.coords.longitude;

      setLocation({
        latitude,
        longitude,
      });

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
        if (
          !symptoms.trim() ||
          !hospital
        ) {
          setRecommendation(null);
          return;
        }

        try {
          const res =
            await API.post(
              "/doctors/recommend",
              {
                symptoms,
                hospital,
              }
            );

          if (
            res.data.success &&
            res.data.doctors
          ) {
            setRecommendation(
              res.data
            );

            setDoctorName(
              res.data
                .recommendedDoctor
                ?.doctorName || ""
            );
          }
        } catch (error) {
          console.error(error);
        }
      };

    getRecommendation();
  }, [symptoms, hospital]);

  const hospitals = [
    ...new Set(
      doctors.map(
        (doctor) => doctor.hospital
      )
    ),
  ];

  const filteredDoctors =
    hospital === ""
      ? []
      : doctors.filter(
          (doctor) =>
            doctor.hospital ===
            hospital
        );

  const handleSubmit = async () => {
  if (
    !patientName.trim() ||
    !doctorName
  )
    return;

  try {
    const res =
      await API.post(
        "/queue/add-patient",
        {
          patientName,
          age,
          gender,
          phoneNumber,
          doctorName,
          symptoms,
          hospital,
          specialization:
            recommendation?.specialization ||
            "",
        }
      );

    if (
      res.data
        .emergencyDetected
    ) {
      setEmergencyMessage(
        "🚨 Emergency Case Detected! Priority Queue Activated."
      );
    } else {
      setEmergencyMessage("");
    }

    setPatientName("");
    setAge("");
    setGender("");
    setPhoneNumber("");
    setSymptoms("");
    setHospital("");
    setDoctorName("");
    setRecommendation(
      null
    );
  } catch (error) {
    console.error(error);
  }
};

 return (
  <div
    className="card"
    style={{
      height: "100%",
    }}
  >
    {emergencyMessage && (
      <div
        style={{
          background:
            "#fef2f2",
          border:
            "2px solid #ef4444",
          color: "#b91c1c",
          padding: "16px",
          borderRadius: "12px",
          marginBottom: "20px",
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        {emergencyMessage}
      </div>
    )}
      <h2
        style={{
          fontSize: "1.4rem",
          fontWeight: "800",
          marginBottom: "10px",
        }}
      >
        AI Smart Registration
      </h2>

      <p
        style={{
          color: "#64748b",
          marginBottom: "25px",
        }}
      >
        AI recommends the best
        doctors based on symptoms.
      </p>

      <div
        style={{
          marginBottom: "10px",
          fontWeight: "600",
        }}
      >
        Patient Name
      </div>

      <input
        value={patientName}
        onChange={(e) =>
          setPatientName(
            e.target.value
          )
        }
        placeholder="Enter patient name"
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "14px",
          border: "1px solid #dbe3ef",
          background: "#f8fafc",
          marginBottom: "20px",
        }}
      />
<div
  style={{
    marginBottom: "10px",
    fontWeight: "600",
  }}
>
  Age
</div>

<input
  type="number"
  value={age}
  onChange={(e) =>
    setAge(e.target.value)
  }
  placeholder="Enter age"
  style={{
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #dbe3ef",
    background: "#f8fafc",
    marginBottom: "20px",
  }}
/>

<div
  style={{
    marginBottom: "10px",
    fontWeight: "600",
  }}
>
  Gender
</div>

<select
  value={gender}
  onChange={(e) =>
    setGender(e.target.value)
  }
  style={{
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #dbe3ef",
    background: "#f8fafc",
    marginBottom: "20px",
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

<div
  style={{
    marginBottom: "10px",
    fontWeight: "600",
  }}
>
  Phone Number
</div>

<input
  value={phoneNumber}
  onChange={(e) =>
    setPhoneNumber(
      e.target.value
    )
  }
  placeholder="Enter phone number"
  style={{
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #dbe3ef",
    background: "#f8fafc",
    marginBottom: "20px",
  }}
/>
      <div
  style={{
    marginBottom: "10px",
    fontWeight: "600",
  }}
>
  Symptoms / Problem
</div>

<select
  value={symptoms}
  onChange={(e) =>
    setSymptoms(
      e.target.value
    )
  }
  style={{
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #dbe3ef",
    background: "#f8fafc",
    marginBottom: "20px",
  }}
>
  <option value="">
    Select Symptom
  </option>

  {symptomOptions.map(
    (symptom) => (
      <option
        key={symptom}
        value={symptom}
      >
        {symptom}
      </option>
    )
  )}
</select>


      <div
        style={{
          marginBottom: "10px",
          fontWeight: "600",
        }}
      >
        Hospital
      </div>

      <select
        value={hospital}
        onChange={(e) =>
          setHospital(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "14px",
          border: "1px solid #dbe3ef",
          background: "#f8fafc",
          marginBottom: "20px",
        }}
      >
        <option value="">
          Select Hospital
        </option>

        {hospitals.map(
          (hospitalName) => (
            <option
              key={hospitalName}
              value={hospitalName}
            >
              {hospitalName}
            </option>
          )
        )}
      </select>

     {recommendation &&
  recommendation.doctors &&
  recommendation.doctors.length > 0 && (
    <div
      style={{
        background: "#dcfce7",
        border: "2px solid #22c55e",
        padding: "16px",
        borderRadius: "14px",
        marginBottom: "20px",
      }}
    >
      <h3
        style={{
          marginBottom: "15px",
          fontSize: "1.2rem",
          fontWeight: "800",
        }}
      >
        🤖 AI Smart Doctor Recommendations
      </h3>

      <div
        style={{
          marginBottom: "15px",
          fontWeight: "700",
          color: "#166534",
        }}
      >
        Recommended Department:{" "}
        {recommendation.specialization}
      </div>

      {recommendation.doctors.map(
        (doctor, index) => (
          <div
            key={doctor._id}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "12px",
              marginBottom: "12px",
              border:
                index === 0
                  ? "2px solid #22c55e"
                  : "1px solid #d1d5db",
              boxShadow:
                index === 0
                  ? "0 4px 12px rgba(34,197,94,0.15)"
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <strong>
                #{index + 1}{" "}
                {doctor.doctorName}
              </strong>

              {index === 0 && (
                <span
                  style={{
                    background:
                      "#22c55e",
                    color: "white",
                    padding:
                      "4px 10px",
                    borderRadius:
                      "999px",
                    fontSize:
                      "12px",
                    fontWeight:
                      "700",
                  }}
                >
                  AI PICK
                </span>
              )}
            </div>

            <div>
              🏥 Department:{" "}
              {
                doctor.specialization
              }
            </div>

            <div>
              ⭐ Rating:{" "}
              {doctor.rating}
            </div>
            <div
  style={{
    marginTop: "6px",
    marginBottom: "6px",
  }}
>
  <span
    style={{
      background:
        doctor.availability ===
        "Available"
          ? "#dcfce7"
          : doctor.availability ===
            "Busy"
          ? "#fef3c7"
          : "#fee2e2",
      color:
        doctor.availability ===
        "Available"
          ? "#166534"
          : doctor.availability ===
            "Busy"
          ? "#92400e"
          : "#991b1b",
      padding: "4px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "700",
    }}
  >
    {doctor.availability ===
    "Available"
      ? "🟢 Available"
      : doctor.availability ===
        "Busy"
      ? "🟡 Busy"
      : "🔴 Offline"}
  </span>
</div>

            <div>
              📅 Experience:{" "}
              {
                doctor.experience
              }{" "}
              Years
            </div>

          

            <div>
  👥 Current Queue:{" "}
  {doctor.currentQueue} Patients
</div>

<div>
  🩺 Avg Consultation:{" "}
  {doctor.averageConsultationTime} mins
</div>

<div>
  ⏱ AI Predicted Wait:{" "}
  {doctor.predictedWaitTime} mins
</div>

<div>
  🧠 AI Score:{" "}
  {Math.round(
    doctor.aiScore || 0
  )}
</div>
            {index === 0 &&
              recommendation.reason && (
                <div
                  style={{
                    marginTop:
                      "12px",
                    padding:
                      "10px",
                    background:
                      "#f0fdf4",
                    borderRadius:
                      "8px",
                    color:
                      "#166534",
                    fontWeight:
                      "600",
                  }}
                >
                  💡 Reason:
                  <br />
                  {
                    recommendation.reason
                  }
                </div>
              )}
          </div>
        )
      )}
    </div>
  )}

  {nearestHospital && (
  <div
    style={{
      background: "#ecfeff",
      border:
        "2px solid #06b6d4",
      padding: "15px",
      borderRadius: "12px",
      marginBottom: "20px",
    }}
  >
    <strong>
      📍 Nearest Hospital
    </strong>

    <br />

    <div
      style={{
        marginTop: "8px",
        fontSize: "1rem",
        fontWeight: "600",
      }}
    >
      {nearestHospital.name}
    </div>
  </div>
)}
      <div
        style={{
          marginBottom: "10px",
          fontWeight: "600",
        }}
      >
        Selected Doctor
      </div>

      <select
        value={doctorName}
        onChange={(e) =>
          setDoctorName(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "14px",
          border: "1px solid #dbe3ef",
          background: "#f8fafc",
          marginBottom: "20px",
        }}
      >
        <option value="">
          Select Doctor
        </option>

        {filteredDoctors.map(
          (doctor) => (
            <option
              key={doctor._id}
              value={
                doctor.doctorName
              }
            >
              {doctor.doctorName}
              {" • "}
              {
                doctor.specialization
              }
              {" • ⭐"}
              {doctor.rating}
            </option>
          )
        )}
      </select>

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          background:
            "linear-gradient(135deg,#2563eb,#60a5fa)",
          color: "white",
          padding: "15px",
          borderRadius: "14px",
          border: "none",
          cursor: "pointer",
          fontWeight: "700",
        }}
      >
        + Register Patient
      </button>
    </div>
  );
}