import React, { useEffect, useState } from 'react';
import styles from '../styles/styles';
import OpenAI from "openai";
import SIMULATION_BRIEFS from '../data/simulationBriefs';

async function getFeedback(simulation, score) {
  const OPENAI_API_KEY = import.meta.env.VITE_OpenAI_KEY;
  const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // allows running in browser (Next.js client side)
  });

  const prompt = `
You are a clinical education assistant. A student just completed a simulation pre-test.
Simulation topic: "${simulation}"
They scored ${score} out of 5.

Write a short structured feedback summary including:
1. Overall performance overview (1–2 sentences)
2. Specific areas to review or study more (bullet points)
3. Practical improvement tips they can apply before simulation.
Keep it encouraging and clear for students in healthcare training.
Return only plain text with clear line breaks (no JSON or markdown formatting).
`;

  const response = await client.responses.create({
    model: "gpt-5-nano",
    input: prompt,
  });

  return response.output_text;
  // const response = await fetch("/api/feedback");
  // console.log(await response.json());
  // return "test";
}

function SummaryPage({ simulation, score, onContinue }) {
  const [feedback, setFeedback] = useState("Loading feedback...");
  const brief = SIMULATION_BRIEFS[simulation] || { description: "Scenario information unavailable." };

    // 🧠 Fetch feedback when component mounts or score/simulation changes
  useEffect(() => {
    async function fetchFeedback() {
      try {
        const text = await getFeedback(simulation, score);
        setFeedback(text);
      } catch (err) {
        console.error(err);
        setFeedback("Unable to generate feedback. Please try again later.");
      }
    }
    fetchFeedback();
  }, [simulation, score]);

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

