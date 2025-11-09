import React, { useState } from 'react';
import styles from '../styles/styles';
import { Range } from 'react-range';

function SlidersPage({ onComplete, onBack }) {
  const [confidence, setConfidence] = useState(5);
  const [preparedness, setPreparedness] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [stress, setStress] = useState(5);

  const handleSubmit = () => {
    onComplete({ confidence, preparedness, anxiety, stress });
  };

  const renderSlider = (label, value, setValue, color = '#002D72') => (
    <div style={{ marginBottom: '30px', width: '100%' }}>
      <label
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
          color: '#002D72',
          fontWeight: '600',
        }}
      >
        {label}
        <span>{value}/10</span>
      </label>

      <Range
        step={1}
        min={1}
        max={10}
        values={[value]}
        onChange={(values) => setValue(values[0])}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '8px',
              width: '100%',
              borderRadius: '5px',
              background: `linear-gradient(90deg, ${color} ${(value - 1) * 11.1}%, #d9e3f0 ${(value - 1) * 11.1}%)`,
              cursor: 'pointer',
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '22px',
              width: '22px',
              borderRadius: '50%',
              backgroundColor: color,
              border: '2px solid white',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
              cursor: 'grab',
              transition: 'transform 0.1s ease, background 0.2s ease',
            }}
            onMouseDown={(e) => (e.target.style.cursor = 'grabbing')}
            onMouseUp={(e) => (e.target.style.cursor = 'grab')}
          />
        )}
      />
    </div>
  );

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
          cursor: 'pointer',
        }}
        onClick={onBack}
      >
        ← Back
      </button>

      <div style={styles.card}>
        <h2 style={{ color: '#002D72', marginBottom: '15px' }}>Pre-Simulation Check-In</h2>
        <p style={{ marginBottom: '25px', color: '#000000', fontSize: '15px' }}>
          Rate how you feel before simulation.
        </p>

        {renderSlider('Confidence', confidence, setConfidence, '#002D72')}
        {renderSlider('Preparedness', preparedness, setPreparedness, '#003E99')}
        {renderSlider('Anxiety', anxiety, setAnxiety, '#E63946')}
        {renderSlider('Stress', stress, setStress, '#FF8C00')}

        <button style={styles.button} onClick={handleSubmit}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default SlidersPage;
