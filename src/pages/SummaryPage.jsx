import React, { useEffect, useState } from 'react';
import styles from '../styles/styles';
import SIMULATION_BRIEFS from '../data/simulationBriefs';

function SummaryPage({ simulation, score, onContinue }) {
  const brief = SIMULATION_BRIEFS[simulation] || { description: "Scenario information unavailable." };
  const [feedback, setFeedback] = useState("Generating pre-briefing feedback...");

  useEffect(() => {
    async function getFeedback() {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-pro",
            messages: [
              {
                role: "user",
                content: `Provide a short, encouraging pre-briefing message for a student preparing to run the simulation "${simulation}". Focus on emotional readiness, confidence, and teamwork.`,
              },
            ],
          }),
        });

        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content || "Unable to generate pre-briefing feedback.";
        setFeedback(text);
      } catch (err) {
        console.error(err);
        setFeedback("Unable to generate feedback at this time.");
      }
    }

    getFeedback();
  }, [simulation]);

  // ✅ Fixed navigation: use onContinue instead of window.location
  const handleNext = () => {
    if (typeof onContinue === "function") onContinue();
  };

  return (
    <div style={styles.gradientBg}>
      <div style={styles.card}>
        {/* Scenario Title */}
        <h1 style={{ color: '#002D72', fontSize: '28px', fontWeight: '600', marginBottom: '20px' }}>
          {simulation}
        </h1>

        {/* Pre-Briefing Description */}
        <h3 style={{ color: '#002D72', marginBottom: '8px' }}>Pre-Briefing Description</h3>
        <p style={{ marginBottom: '24px', lineHeight: '1.6', color: '#333' }}>
          {brief.description}
        </p>

        {/* Pre-Briefing Feedback */}
        <h3 style={{ color: '#002D72', marginBottom: '8px' }}>Pre-Briefing Feedback</h3>
        <p style={{ whiteSpace: 'pre-line', color: '#333', marginBottom: '40px' }}>
          {feedback}
        </p>

        {/* Centered Continue Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleNext}
            style={{
              backgroundColor: '#002D72',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: '0.3s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#003c9b')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#002D72')}
          >
            Continue to Breathing Exercise
          </button>
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;

