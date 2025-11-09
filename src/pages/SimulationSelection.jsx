import React from 'react';
import styles from '../styles/styles';

function SimulationSelection({ program, onSelect, onBack }) {
  const simulations = {
    Paramedic: ['NAIT Pool: Pediatric Choking/Arrest', 'Peds ER: Cardiac Emergency'],
    'Animal Health': ['Dog Fight', 'Euthanasia: Terrier', 'Euthanasia: Cat'],
    'Respiratory Therapist': ['RESP 2695'],
  };

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
          fontWeight: '600',
          cursor: 'pointer'
        }}
        onClick={onBack}
      >
        ← Back
      </button>

      <h1 style={{ color: '#FFFFFF', fontSize: '28px', marginBottom: '40px' }}>Select Your Simulation</h1>

      {simulations[program]?.map((sim) => (
        <button
          key={sim}
          style={styles.ovalButton}
          onClick={() => onSelect(sim)}
        >
          {sim}
        </button>
      ))}
    </div>
  );
}

export default SimulationSelection;
