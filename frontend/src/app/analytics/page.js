"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AnalyticsCards from "@/components/charts/AnalyticsCards";
import QueueAnalyticsChart from "@/components/charts/QueueAnalyticsChart";
import API from "@/services/api";
import jsPDF from "jspdf";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] =
    useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get(
          "/analytics"
        );

        setAnalytics(
          res.data.analytics
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchAnalytics();

    const interval = setInterval(
      fetchAnalytics,
      3000
    );

    return () =>
      clearInterval(interval);
  }, []);

  const generatePDF = () => {
    if (!analytics) return;

    let queueHealth =
      "Healthy";

    if (
      analytics.waitingPatients > 10
    ) {
      queueHealth = "Busy";
    }

    if (
      analytics.waitingPatients > 20
    ) {
      queueHealth = "Critical";
    }

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text(
      "QueueCure Analytics Report",
      20,
      20
    );

    doc.setFontSize(11);

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      20,
      35
    );

    doc.line(
      20,
      42,
      190,
      42
    );

    doc.setFontSize(16);

    doc.text(
      "Queue Statistics",
      20,
      55
    );

    doc.setFontSize(12);

    doc.text(
      `Total Patients: ${analytics.totalPatients}`,
      20,
      70
    );

    doc.text(
      `Waiting Patients: ${analytics.waitingPatients}`,
      20,
      80
    );

    doc.text(
      `Serving Patients: ${analytics.servingPatients}`,
      20,
      90
    );

    doc.text(
      `Completed Patients: ${analytics.completedPatients}`,
      20,
      100
    );

    doc.text(
      `Priority Patients: ${analytics.priorityPatients}`,
      20,
      110
    );

    doc.text(
      `Average Consultation Time: ${analytics.averageConsultationTime} min`,
      20,
      120
    );

    doc.text(
      `Queue Efficiency: ${analytics.queueEfficiency}%`,
      20,
      130
    );

    doc.text(
      `Queue Health: ${queueHealth}`,
      20,
      140
    );

    doc.line(
      20,
      150,
      190,
      150
    );

    doc.setFontSize(16);

    doc.text(
      "AI Assessment",
      20,
      165
    );

    doc.setFontSize(12);

    doc.text(
      `Current system status is ${queueHealth}.`,
      20,
      180
    );

    doc.text(
      "QueueCure analytics generated successfully.",
      20,
      190
    );

    doc.save(
      `QueueCure_Report_${Date.now()}.pdf`
    );
  };

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
          }}
        >
          <div>
            <h1 className="section-title">
              Analytics Dashboard
            </h1>

            <p className="section-subtitle">
              Real-time queue intelligence
              and operational insights
            </p>
          </div>

          <button
            onClick={generatePDF}
            style={{
              background: "#4f7cff",
              color: "white",
              border: "none",
              borderRadius: "14px",
              padding:
                "14px 22px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            📄 Generate PDF Report
          </button>
        </div>

        <div
          style={{
            marginTop: "30px",
          }}
        >
          <AnalyticsCards />
        </div>

        <div
          style={{
            marginTop: "30px",
          }}
        >
          <QueueAnalyticsChart />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div className="card">
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: "700",
                marginBottom: "15px",
              }}
            >
              Queue Insights
            </h2>

            <ul
              style={{
                lineHeight: "2",
                color: "#64748b",
              }}
            >
              <li>
                Live patient flow monitoring
              </li>
              <li>
                Consultation efficiency tracking
              </li>
              <li>
                Priority patient management
              </li>
              <li>
                Queue load prediction
              </li>
            </ul>
          </div>

          <div className="card">
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: "700",
                marginBottom: "15px",
              }}
            >
              AI Recommendations
            </h2>

            <div
              style={{
                color: "#64748b",
                lineHeight: "2",
              }}
            >
              Maintain current staffing
              levels.
              <br />
              Queue performance is
              healthy.
              <br />
              No congestion detected.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}