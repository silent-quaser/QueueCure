"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import API from "@/services/api";
import { socket } from "@/services/socket";

export default function PatientTrackerPage() {
  const [tokenNumber, setTokenNumber] =
    useState("");

  const [queueData, setQueueData] =
    useState(null);

  const [patient, setPatient] =
    useState(null);

  const [searched, setSearched] =
    useState(false);

  const [peopleAhead, setPeopleAhead] =
    useState(0);

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
    fetchStatus();

    socket.on(
      "queueUpdated",
      fetchStatus
    );

    socket.on(
      "tokenCalled",
      fetchStatus
    );

    return () => {
      socket.off(
        "queueUpdated",
        fetchStatus
      );

      socket.off(
        "tokenCalled",
        fetchStatus
      );
    };
  }, [fetchStatus]);

  useEffect(() => {
    if (
      searched &&
      tokenNumber &&
      queueData
    ) {
      const found =
        queueData.waitingPatients.find(
          (p) =>
            p.tokenNumber ===
            Number(tokenNumber)
        );

      if (found) {
        const ahead =
          queueData.waitingPatients.findIndex(
            (p) =>
              p.tokenNumber ===
              found.tokenNumber
          );

        setPeopleAhead(ahead);
        setPatient(found);
      } else {
        setPatient(null);
        setPeopleAhead(0);
      }
    }
  }, [
    queueData,
    searched,
    tokenNumber,
  ]);

  const searchToken = () => {
    if (!queueData) return;

    const found =
      queueData.waitingPatients.find(
        (p) =>
          p.tokenNumber ===
          Number(tokenNumber)
      );

    if (found) {
      const ahead =
        queueData.waitingPatients.findIndex(
          (p) =>
            p.tokenNumber ===
            found.tokenNumber
        );

      setPeopleAhead(ahead);
      setPatient(found);
    } else {
      setPatient(null);
      setPeopleAhead(0);
    }

    setSearched(true);
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="section-title">
          Patient Tracker
        </h1>

        <p className="section-subtitle">
          Track your queue position in
          real time
        </p>

        <div
          className="card"
          style={{
            marginTop: "30px",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
            }}
          >
            Search Your Token
          </h2>

          <div
            style={{
              display: "flex",
              gap: "15px",
            }}
          >
            <input
              type="number"
              placeholder="Enter Token Number"
              value={tokenNumber}
              onChange={(e) =>
                setTokenNumber(
                  e.target.value
                )
              }
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "12px",
                border:
                  "1px solid #cbd5e1",
              }}
            />

            <button
              onClick={searchToken}
              style={{
                background:
                  "#4f7cff",
                color: "white",
                border: "none",
                borderRadius:
                  "12px",
                padding:
                  "14px 24px",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>
        </div>

        {searched && !patient && (
          <div
            className="card"
            style={{
              marginTop: "25px",
              borderLeft:
                "6px solid #ef4444",
            }}
          >
            <h2>
              Token Not Found
            </h2>

            <p
              style={{
                marginTop: "10px",
              }}
            >
              Please enter a valid
              active token number.
            </p>
          </div>
        )}

        {patient && (
          <div
            className="card"
            style={{
              marginTop: "25px",
            }}
          >
            <h2
              style={{
                marginBottom: "20px",
              }}
            >
              Your Queue Status
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: "20px",
              }}
            >
              <div>
                <strong>Token</strong>
                <br />
                A-{patient.tokenNumber}
              </div>

              <div>
                <strong>
                  Patient Name
                </strong>
                <br />
                {patient.patientName}
              </div>
<div>
  <strong>Age</strong>
  <br />
  {patient.age}
</div>

<div>
  <strong>Gender</strong>
  <br />
  {patient.gender}
</div>

<div>
  <strong>Phone Number</strong>
  <br />
  {patient.phoneNumber}
</div>
              <div>
                <strong>
                  Doctor
                </strong>
                <br />
                {patient.doctorName}
              </div>

              <div>
                <strong>
                  Department
                </strong>
                <br />
                {
                  patient.specialization
                }
              </div>

              <div>
                <strong>
                  Hospital
                </strong>
                <br />
                {patient.hospital}
              </div>

              <div>
                <strong>
                  Current Serving
                </strong>
                <br />
                A-
                {queueData?.currentToken ||
                  0}
              </div>

              <div>
                <strong>
                  Queue Position
                </strong>
                <br />
                #
                {peopleAhead + 1}
              </div>

              <div>
                <strong>
                  People Ahead
                </strong>
                <br />
                {peopleAhead}
              </div>

              <div>
                <strong>
                  Estimated Wait
                </strong>
                <br />
                {
                  patient.estimatedWaitTime
                }{" "}
                min
              </div>

              <div>
                <strong>
                  Priority Patient
                </strong>
                <br />
                {patient.priority
                  ? "Yes"
                  : "No"}
              </div>
            </div>

            <div
              style={{
                marginTop: "25px",
                padding: "16px",
                borderRadius: "12px",
                background:
                  "#eff6ff",
                border:
                  "1px solid #bfdbfe",
              }}
            >
              <strong>
                Live Status
              </strong>

              <p
                style={{
                  marginTop: "10px",
                }}
              >
                Your consultation is
                with{" "}
                <strong>
                  {patient.doctorName}
                </strong>{" "}
                in{" "}
                <strong>
                  {patient.hospital}
                </strong>
                . There are{" "}
                <strong>
                  {peopleAhead}
                </strong>{" "}
                patients ahead of you
                and the estimated
                waiting time is{" "}
                <strong>
                  {
                    patient.estimatedWaitTime
                  }{" "}
                  minutes
                </strong>
                .
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}