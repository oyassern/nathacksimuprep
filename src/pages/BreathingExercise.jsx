import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function BreathingExercise({ onBack }) {
  const [phase, setPhase] = useState("Ready");
  const [count, setCount] = useState(null);
  const [started, setStarted] = useState(false);
  const timerRef = useRef(null);
  const phaseIndex = useRef(0);

  const phases = [
    { name: "Inhale", seconds: 4 },
    { name: "Hold", seconds: 1 },
    { name: "Exhale", seconds: 4 },
    { name: "Hold", seconds: 1 },
  ];

  useEffect(() => {
    if (!started) return;

    function nextPhase() {
      const current = phases[phaseIndex.current];
      setPhase(current.name);
      setCount(current.seconds);
      let remaining = current.seconds;

      timerRef.current = setInterval(() => {
        remaining -= 1;
        setCount(remaining);
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          phaseIndex.current = (phaseIndex.current + 1) % phases.length;
          nextPhase();
        }
      }, 1000);
    }

    nextPhase();
    return () => clearInterval(timerRef.current);
  }, [started]);

  const handleStart = () => {
    if (started) return;
    setStarted(true);
  };

  const handleReturn = () => {
    // Use the onBack prop instead of window.location
    if (onBack) {
      onBack();
    } else {
      // Fallback in case prop isn't passed
      window.location.href = "/";
    }
  };

  // Proper phase scaling
  const scaleValue =
    phase === "Inhale" ? 1.4 :
    phase === "Exhale" ? 0.8 :
    phase === "Hold" && phaseIndex.current === 1 ? 1.4 : 0.8;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #002D72 0%, #4EA5D9 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5vw",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          padding: "40px 30px",
          width: "min(90%, 600px)",
          textAlign: "center",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ color: "#002D72", marginBottom: "15px" }}>Congratulations!</h1>

        <p
          style={{
            color: "#333",
            margin: "0 auto 50px auto",
            lineHeight: "1.6",
            fontSize: "clamp(14px, 2vw, 16px)",
          }}
        >
          Take a moment to slow your breathing and relax. 
          When you're ready, press <b>Start</b> to begin a short guided breathing exercise. 
          Breathe in as the circle expands, hold briefly, and breathe out as it gently shrinks.
        </p>

        {/* Breathing Circle */}
        <motion.div
          animate={{ scale: started ? scaleValue : 0.8 }}
          transition={{
            duration:
              phase === "Inhale" || phase === "Exhale" ? 4 :
              phase === "Hold" ? 1 : 0.5,
            ease: "easeInOut",
          }}
          style={{
            width: "min(40vw, 180px)",
            height: "min(40vw, 180px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, #4EA5D9 0%, #002D72 100%)",
            boxShadow: "0 0 30px rgba(0,0,0,0.2)",
            margin: "0 auto 60px auto",
          }}
        ></motion.div>

        {/* Breathing Phase */}
        {started ? (
          <>
            <h2 style={{ color: "#002D72", marginBottom: "8px" }}>{phase}</h2>
            <p style={{ fontSize: "18px", color: "#333" }}>
              {count !== null ? `${count}s` : ""}
            </p>
          </>
        ) : (
          <button
            onClick={handleStart}
            style={{
              backgroundColor: "#002D72",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "12px 28px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#003c9b")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#002D72")}
          >
            Start
          </button>
        )}

        {/* Return Button */}
        {started && (
          <div style={{ marginTop: "30px" }}>
            <button
              onClick={handleReturn}
              style={{
                backgroundColor: "#002D72",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "10px 24px",
                fontSize: "16px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#003c9b")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#002D72")}
            >
              Return
            </button>
          </div>
        )}

        <p
          style={{
            marginTop: "50px",
            color: "#555",
            fontSize: "clamp(12px, 1.8vw, 14px)",
            lineHeight: "1.4",
          }}
        >
          *Technique adapted from resonance-breathing research showing reduced
          stress and improved reflection after simulation (Benfatah et al., 2025;
          Cook et al., 2014).
        </p>
      </div>
    </div>
  );
}

export default BreathingExercise;