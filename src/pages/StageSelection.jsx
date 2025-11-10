import React from 'react';
import styles from '../styles/styles';

function StageSelection({ onSelect, onBack }) {
  const stages = [
    'Stage 1 - OR Induction & Emergence',
    'Stage 2 - Post-Op Cardiac Arrest (PALS)',
    'Stage 3 - Withdrawal of Care',
    'Stage 4 - Compassionate Extubation',
  ];

  return (
    <div style={styles.gradientBg}>
      <button
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: '#4EA5D9',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '10px',
          padding: '10px 20px',
          cursor: 'pointer'
        }}
        onClick={onBack}
      >
        ← Back
      </button>

      <h1 style={{ color: '#FFFFFF', fontSize: '24px', marginBottom: '30px' }}>
        RESP 2695 – Select Simulation Stage
      </h1>

      {stages.map((stage) => (
        <div
          key={stage}
          style={{ ...styles.card, cursor: 'pointer', maxWidth: '350px' }}
          onClick={() => onSelect(stage)}
        >
          <h3 style={{ color: '#002D72', margin: 0 }}>{stage}</h3>
        </div>
      ))}
    </div>
  );
}

export default StageSelection;
