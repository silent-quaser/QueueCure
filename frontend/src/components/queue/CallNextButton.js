"use client";

import API from "@/services/api";

export default function CallNextButton() {
  const handleCallNext = async () => {
    try {
      const res = await API.post(
        "/queue/call-next"
      );

      const token =
        res.data.currentToken;

      alert(
        `Now Serving Token A-${token}`
      );

      if (
        "speechSynthesis" in window
      ) {
        const speech =
          new SpeechSynthesisUtterance(
            `Token A ${token}, please proceed to the consultation room.`
          );

        speech.rate = 0.9;
        speech.pitch = 1;
        speech.volume = 1;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(
          speech
        );
      }
    } catch (error) {
      alert(
        error?.response?.data
          ?.message ||
          "No patients waiting"
      );
    }
  };

  return (
    <button
      onClick={handleCallNext}
      style={{
        background: "#22c55e",
        color: "white",
        padding: "12px 18px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        width: "100%",
        fontWeight: "600",
      }}
    >
      Call Next Token
    </button>
  );
}