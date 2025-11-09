import React from 'react';
import styles from '../styles/styles';
import SIMULATION_BRIEFS from '../data/simulationBriefs';

function SummaryPage({ simulation, score }) {
  const brief = SIMULATION_BRIEFS[simulation] || { focus: "General simulation practice", objectives: "Apply learned skills effectively" };
  const reminder = (
    <ol><li>“Expect to make mistakes!”… “We purposefully make the simulation challenging so that we can all learn from both the things that you do well, and from the things you don’t do so well.”</li>
<li>“What happens in sim, stays in sim! Don’t ruin the experience for the next participants.”</li>
<li>“Because we’ve done our best to make this scenario like ‘REAL LIFE’ we expect you to do your best and treat this like a real-life situation. You will perform all procedures/techniques as you would in real life”</li>
  <ul><li>“What you see… Is what you get”</li></ul></ol>
  );

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
        <p><b>Reminders</b> {reminder}</p>
      </div>
    </div>
  );
}

export default SummaryPage;
