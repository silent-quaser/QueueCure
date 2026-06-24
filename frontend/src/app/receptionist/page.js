import DashboardLayout from "@/components/layout/DashboardLayout";
import LiveStatus from "@/components/dashboard/LiveStatus";
import CallNextButton from "@/components/queue/CallNextButton";
import AnalyticsCards from "@/components/charts/AnalyticsCards";
import QueueAnalyticsChart from "@/components/charts/QueueAnalyticsChart";
import QueueQRCode from "@/components/queue/QueueQRCode";
import QueueHealth from "@/components/dashboard/QueueHealth";
import PriorityAlert from "@/components/dashboard/PriorityAlert";
import CommandCenter from "@/components/dashboard/CommandCenter";
import DoctorQueues from "@/components/queue/DoctorQueues";
import DoctorPerformance from "@/components/dashboard/DoctorPerformance";
import AddPatientForm from "@/components/queue/AddPatientForm";
import QueueBreakdownPie from "@/components/charts/QueueBreakdownPie";

export default function ReceptionistPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="section-title">
          Receptionist Dashboard
        </h1>

        <p className="section-subtitle">
          Manage patients, monitor queues and optimize clinic flow.
        </p>

        <div
  style={{
    marginTop: "25px",
    background:
      "linear-gradient(135deg,#2563eb,#1e40af)",
    color: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow:
      "0 10px 30px rgba(37,99,235,0.25)",
  }}
>
  <h2
    style={{
      fontSize: "1.8rem",
      fontWeight: "800",
      marginBottom: "8px",
    }}
  >
    🏥 QueueCure AI Command Center
  </h2>

  <p
    style={{
      opacity: 0.9,
      marginBottom: "15px",
    }}
  >
    Real-Time Hospital Operations &
    Smart Patient Routing
  </p>

  <div
    style={{
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
      fontWeight: "600",
    }}
  >
    <span>⚡ Live Monitoring</span>
    <span>🤖 AI Recommendations</span>
    <span>🚨 Emergency Detection</span>
    <span>📊 Analytics Engine</span>
  </div>
</div>

        <div
          style={{
            marginTop: "25px",
          }}
        >
          <CommandCenter />
        </div>

        <div
          style={{
            marginTop: "15px",
            marginBottom: "20px",
          }}
        >
          <LiveStatus />

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <QueueHealth />
            <PriorityAlert />
          </div>

          <div
            style={{
              marginTop: "25px",
            }}
          >
            <AnalyticsCards />
          </div>
        </div>

        <DoctorQueues />

       

        <div
          style={{
            marginTop: "20px",
            maxWidth: "250px",
          }}
        >
          <CallNextButton />
        </div>

        <div
          style={{
            marginTop: "30px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            alignItems: "start",
          }}
        >
          <AddPatientForm />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <QueueQRCode />
            <QueueBreakdownPie />
          </div>
        </div>

        <div
  style={{
    marginTop: "30px",
  }}
>
  <DoctorPerformance />
</div>

        <div
          style={{
            marginTop: "30px",
          }}
        >
          <QueueAnalyticsChart />
        </div>
      </div>
    </DashboardLayout>
  );
}