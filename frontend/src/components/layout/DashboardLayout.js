"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  MonitorSmartphone,
  Activity,
  History,
  Home,
  BarChart3,
  Search,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Receptionist",
    href: "/receptionist",
    icon: Users,
  },
  {
    title: "Patient View",
    href: "/patient",
    icon: LayoutDashboard,
  },
  {
  title: "Patient Tracker",
  href: "/patient-tracker",
  icon: Search,
},
  {
    title: "Doctor",
    href: "/doctor",
    icon: Stethoscope,
  },
  {
    title: "Display Board",
    href: "/display-board",
    icon: MonitorSmartphone,
  },
  {
    title: "Command Center",
    href: "/command-center",
    icon: Activity,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Queue History",
    href: "/history",
    icon: History,
  },
];

export default function DashboardLayout({
  children,
}) {
  const pathname = usePathname();

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <aside
        style={{
          width: "290px",
          background: "#ffffff",
          borderRight:
            "1px solid #e2e8f0",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "900",
              color: "#4f7cff",
              marginBottom: "6px",
            }}
          >
            QueueCure
          </h1>

          <p
            style={{
              fontSize: "0.9rem",
              color: "#64748b",
            }}
          >
            Smart Clinic Queue System
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  textDecoration: "none",
                  background: active
                    ? "#4f7cff"
                    : "transparent",
                  color: active
                    ? "#ffffff"
                    : "#334155",
                  fontWeight: active
                    ? "700"
                    : "500",
                  transition:
                    "all 0.25s ease",
                }}
              >
                <Icon size={20} />

                {item.title}
              </Link>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: "20px",
          }}
        >
          <div
            className="card"
            style={{
              background:
                "linear-gradient(135deg,#4f7cff,#6c8fff)",
              color: "white",
            }}
          >
            <div
              style={{
                fontSize: "0.9rem",
                opacity: 0.9,
              }}
            >
              Queue Status
            </div>

            <div
              style={{
                fontSize: "1.3rem",
                fontWeight: "800",
                marginTop: "6px",
              }}
            >
              🟢 Live
            </div>
          </div>
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          padding: "32px",
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </div>
  );
}