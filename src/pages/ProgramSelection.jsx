import React from 'react';
import styles from '../styles/styles';

function ProgramSelection({ onSelect, onBack }) {
  const programs = ['Paramedic', 'Animal Health', 'Respiratory Therapist'];

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
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
        onClick={onBack}
      >
        ← Back
      </button>

      <h1 style={{ color: '#FFFFFF', fontSize: '32px', marginBottom: '40px' }}>Select Your Program</h1>

      {programs.map((program) => (
        <button
          key={program}
          style={styles.ovalButton}
          onClick={() => onSelect(program)}
        >
          {program}
        </button>
      ))}
    </div>
  );
}

export default ProgramSelection;
