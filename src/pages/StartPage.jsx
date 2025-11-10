import React, { useState } from 'react';
import styles from '../styles/styles';

function StartPage({ onStudentSubmit, onInstructorLogin }) {
  const [role, setRole] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');

  const handleStudentSubmit = () => {
    if (firstName && lastName && studentId) {
      onStudentSubmit({ firstName, lastName, studentId });
    }
  };

  const handleInstructorLogin = () => {
    if (accessCode === 'NAIT2025') {
      onInstructorLogin();
    } else {
      setError('Invalid Access Code');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleBack = () => {
    setRole(null);
    setFirstName('');
    setLastName('');
    setStudentId('');
    setAccessCode('');
    setError('');
  };

  if (role === null) {
    return (
      <div style={styles.gradientBg}>
        <div style={styles.header}>SIMU PREP</div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#FFFFFF', fontSize: '32px', marginBottom: '40px' }}>
            Choose your role
          </h1>
          <button style={styles.button} onClick={() => setRole('student')}>Student</button>
          <button style={{ ...styles.button, marginTop: '20px' }} onClick={() => setRole('instructor')}>Instructor</button>
        </div>
      </div>
    );
  }

  if (role === 'student') {
    return (
      <div style={styles.gradientBg}>
        <div style={styles.header}>SIMU PREP</div>
        <div style={styles.card}>
          <h2 style={{ color: '#002D72', marginBottom: '20px' }}>Student Access</h2>
          <input style={styles.input} placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input style={styles.input} placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <input style={styles.input} placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          <button style={styles.button} onClick={handleStudentSubmit}>Continue</button>
          <button style={{ ...styles.button, backgroundColor: '#4EA5D9', marginTop: '10px' }} onClick={handleBack}>Back</button>
        </div>
      </div>
    );
  }
  
  if (role === 'instructor') {
    return (
      <div style={styles.gradientBg}>
        <div style={styles.header}>SIMU PREP</div>
        <div style={styles.card}>
          <h2 style={{ color: '#002D72', marginBottom: '20px' }}>Instructor Access</h2>
          <input 
            style={styles.input} 
            placeholder="Access Code" 
            value={accessCode} 
            onChange={(e) => setAccessCode(e.target.value)}
            type="password"
          />
          {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
          <button style={styles.button} onClick={handleInstructorLogin}>Access Dashboard</button>
          <button style={{ ...styles.button, backgroundColor: '#4EA5D9', marginTop: '10px' }} onClick={handleBack}>Back</button>
        </div>
      </div>
    );
  }
}

export default StartPage;