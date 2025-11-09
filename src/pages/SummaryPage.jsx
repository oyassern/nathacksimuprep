import React, { useEffect, useState } from 'react';
import OpenAI from "openai";
import styles from '../styles/styles';
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

function SummaryPage({ simulation, score }) {
  const [feedback, setFeedback] = useState("Loading feedback...");
  
  const brief = SIMULATION_BRIEFS[simulation] || {
    focus: "General simulation practice",
    objectives: "Apply learned skills effectively",
  };

  const reminder = (
    <ol>
      <li>“Expect to make mistakes!” – “We make the simulation challenging so everyone can learn from both successes and mistakes.”</li>
      <li>“What happens in sim, stays in sim! Don’t ruin it for the next participants.”</li>
      <li>“Treat this as real life: perform all procedures as you would in a real clinical situation.”</li>
    </ol>
  );

  const getPreFeedback = (score) => {
    if (score <= 2) return "Focus on foundational skills and stay calm under pressure.";
    else if (score > 2 && score < 4) return "Good knowledge base – refine communication and decision-making.";
    return "Excellent readiness – maintain confidence and team awareness.";
  };

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

  return (
    <div style={styles.gradientBg}>
      <div style={styles.card}>
        <h2 style={{ color: '#002D72' }}>Pre-Simulation Briefing</h2>
        <p><b>Your Readiness Feedback:</b> {getPreFeedback(score)}</p>
        <p style={{ whiteSpace: 'pre-line' }}>{feedback}</p>
        <p><b>Scenario:</b> {simulation}</p>
        <p><b>Focus:</b> {brief.focus}</p>
        <p><b>Objectives:</b> {brief.objectives}</p>
        <p><b>Reminders:</b> {reminder}</p>
      </div>
    </div>
  );
}

export default SummaryPage;
