import React from 'react';
import styles from '../styles/styles';
import SIMULATION_BRIEFS from '../data/simulationBriefs';

function SummaryPage({ simulation, score }) {
  const brief = SIMULATION_BRIEFS[simulation] || { focus: "General simulation practice", objectives: "Apply learned skills effectively" };

  const getFeedback = (score) => {
    if (score <= 2) return "Focus on foundational skills and stay calm under pressure.";
    if (score <= 4) return "Good knowledge base – refine communication and decision-making.";
    return "Excellent readiness – maintain confidence and team awareness.";
  };

  return (
    <div style={styles.gradientBg}>
      <div style={styles.card}>
        <h2 style={{ color: '#002D72' }}>Pre-Simulation Briefing</h2>
        <p><b>Your Readiness Feedback:</b> {getFeedback(score)}</p>
        <p><b>Scenario:</b> {simulation}</p>
        <p><b>Focus:</b> {brief.focus}</p>
        <p><b>Objectives:</b> {brief.objectives}</p>
      </div>
    </div>
  );
}

export default SummaryPage;
