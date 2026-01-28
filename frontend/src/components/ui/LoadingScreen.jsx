import React from "react";

export default function LoadingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        backgroundColor: "black",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid rgba(255,255,255,0.2)",
          borderTop: "4px solid white",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      {/* Text */}
      <div
        style={{
          color: "white",
          marginTop: "16px",
          fontSize: "14px",
          letterSpacing: "1px",
        }}
      >
        Loading Xpecto...
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
