import React from 'react';
import styles from '../styles/styles';

function SimulationSelection({ program, onSelect, onBack }) {
  // Group simulations by scenario type as per your markdown structure
  const scenarioGroups = {
    Paramedic: {
      'Pediatric Emergency Scenarios': [
        'NAIT Pool: Pediatric Choking/Arrest', 
        'Peds ER: Cardiac Emergency',
        'RESP 2695 (Pediatric OR - PALS)'
      ]
    },
    'Animal Health': {
      'Veterinary Scenarios': [
        'Dog Fight', 
        'Euthanasia: Cat',
        'Euthanasia: Terrier'
      ]
    },
    'Respiratory Therapist': {
      'Respiratory Scenarios': [
        'Stage 1: Induction and Emergence',
        'Stage 2: Cardiac Arrest – Post op', 
        'Stage 3: Withdrawal of Care',
        'Stage 4: Withdrawal of Care'
      ]
    },
  };

  const programScenarios = scenarioGroups[program];

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

      <h1 style={{ color: '#FFFFFF', fontSize: '28px', marginBottom: '20px' }}>Select Your Simulation</h1>
      
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.2)', 
        padding: '15px', 
        borderRadius: '10px', 
        marginBottom: '30px',
        color: 'white',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, fontSize: '18px' }}>
          Program: <strong>{program}</strong>
        </p>
      </div>

      {/* Render each scenario group */}
      {Object.entries(programScenarios).map(([groupName, simulations]) => (
        <div key={groupName} style={{ marginBottom: '30px' }}>
          <h2 style={{ 
            color: '#FFFFFF', 
            fontSize: '20px', 
            marginBottom: '15px',
            textAlign: 'center',
            borderBottom: '2px solid rgba(255,255,255,0.3)',
            paddingBottom: '8px'
          }}>
            {groupName}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            {simulations.map((sim) => (
              <button
                key={sim}
                style={styles.ovalButton}
                onClick={() => onSelect(sim)}
              >
                {sim}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Instruction info */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px',
        textAlign: 'center',
        maxWidth: '500px',
        margin: '30px auto 0'
      }}>
        <p style={{ margin: 0 }}>
          Select a simulation to begin your pre-briefing assessment
        </p>
      </div>
    </div>
  );
}

export default SimulationSelection;