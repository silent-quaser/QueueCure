"use client";

import { QRCodeCanvas } from "qrcode.react";

export default function QueueQRCode() {
  const queueUrl =
  "http://10.10.239.187:3000/join-queue";

  return (
    <div className="card">
      <h2
        style={{
          fontSize: "1.2rem",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        Patient Self Check-In
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <QRCodeCanvas
          value={queueUrl}
          size={220}
        />
      </div>

      <p
        style={{
          marginTop: "20px",
          color: "#64748b",
          textAlign: "center",
        }}
      >
        Scan to join the queue
      </p>
    </div>
  );
}