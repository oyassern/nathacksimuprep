import React, { useState } from 'react';
import styles from '../styles/styles';

function InstructorDashboard({ students, onHome }) {
  const [sortBy, setSortBy] = useState(null);
  const sorted = [...students].sort((a, b) => (sortBy ? b[sortBy] - a[sortBy] : 0));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFBFC', padding: '20px' }}>
      <div style={{ backgroundColor: '#002D72', color: '#FFF', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h1>SIMU PREP Instructor Dashboard</h1>
        <button
          style={{
            backgroundColor: '#4EA5D9',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
          onClick={onHome}
        >
          ⬅ Return to Home Page
        </button>
      </div>

      {students.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#002D72' }}>No student data yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#4EA5D9', color: '#FFF' }}>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th onClick={() => setSortBy('confidence')}>Confidence</th>
              <th onClick={() => setSortBy('preparedness')}>Preparedness</th>
              <th>Anxiety</th>
              <th>Stress</th>
              <th onClick={() => setSortBy('score')}>Score</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 ? '#F8F8F8' : '#FFF' }}>
                <td>{s.name}</td>
                <td>{s.id}</td>
                <td>{s.confidence}</td>
                <td>{s.preparedness}</td>
                <td>{s.anxiety}</td>
                <td>{s.stress}</td>
                <td>{s.score}/5</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InstructorDashboard;
