"use client";

import { useEffect, useState } from "react";
import { socket } from "@/services/socket";

export default function LiveStatus() {
  const [mounted, setMounted] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setMounted(true);

    const onConnect = () => {
      setConnected(true);
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    if (socket.connected) {
      setConnected(true);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          padding: "12px 18px",
          borderRadius: "12px",
          background: "#f1f5f9",
          color: "#475569",
          fontWeight: "600",
          width: "fit-content",
        }}
      >
        Connecting...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "12px 18px",
        borderRadius: "12px",
        background: connected
          ? "#dcfce7"
          : "#fee2e2",
        color: connected
          ? "#166534"
          : "#991b1b",
        fontWeight: "600",
        width: "fit-content",
      }}
    >
      {connected
        ? "🟢 Live Connected"
        : "🔴 Disconnected"}
    </div>
  );
}