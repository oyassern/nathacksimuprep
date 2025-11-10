import React, { useState } from 'react';
import styles from '../styles/styles';

const InstructorDashboard = ({ students, onHome }) => {
  const [filterProgram, setFilterProgram] = useState('All');
  const [filterSimulation, setFilterSimulation] = useState('All');

  // Mock data based on your SQL - replace with actual data from props
  const mockStudents = [
    { id: '001', name: 'Aria Patel', program: 'Paramedic', simulation: 'Paediatric Asthma Exacerbation', score: 4 },
    { id: '010', name: 'Mia Zhang', program: 'Animal Health', simulation: 'Dog Fight Simulation', score: 3 },
    { id: '003', name: 'Noah Singh', program: 'Animal Health', simulation: 'Euthanasia One', score: 5 },
    { id: '006', name: 'Isabella Lopez', program: 'Animal Health', simulation: 'Euthanasia Two', score: 5 },
    { id: '008', name: 'Olivia Brown', program: 'Paramedic', simulation: 'Billy Submersion (Peds Pool)', score: 4 },
    { id: '004', name: 'Sofia Kim', program: 'Paramedic', simulation: 'Septic Shock', score: 2 },
    { id: '002', name: 'Liam Chen', program: 'Paramedic', simulation: 'Cardiac Arrest Management', score: 3 },
    { id: '007', name: 'James Nguyen', program: 'Paramedic', simulation: 'Peds OR – Stage 2', score: 3 },
    { id: '005', name: 'Ethan Moore', program: 'Respiratory Therapy', simulation: 'Paediatric Asthma Exacerbation', score: 4 },
    { id: '009', name: 'Lucas Anderson', program: 'Respiratory Therapy', simulation: 'Peds ER Cardiac Emergency', score: 5 }
  ];

  // Use mock data for now, replace with actual students prop when ready
  const displayStudents = students && students.length > 0 ? students : mockStudents;

  // Get unique programs and simulations for filters
  const programs = ['All', ...new Set(displayStudents.map(student => student.program))];
  const simulations = ['All', ...new Set(displayStudents.map(student => student.simulation))];

  // Filter students based on selected program and simulation
  const filteredStudents = displayStudents.filter(student => {
    const programMatch = filterProgram === 'All' || student.program === filterProgram;
    const simulationMatch = filterSimulation === 'All' || student.simulation === filterSimulation;
    return programMatch && simulationMatch;
  });

  // Calculate average score
  const averageScore = filteredStudents.length > 0 
    ? (filteredStudents.reduce((sum, student) => sum + student.score, 0) / filteredStudents.length).toFixed(1)
    : 0;

  const getScoreColor = (score) => {
    if (score >= 4) return '#4CAF50'; // Green
    if (score >= 3) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getPerformanceText = (score) => {
    if (score >= 4) return 'Excellent';
    if (score >= 3) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div style={styles.gradientBg}>
      <div style={styles.header}>SIMU PREP</div>
      
      <div style={styles.card}>
        <h2 style={{ color: '#002D72', marginBottom: '20px', textAlign: 'center' }}>
          Instructor Dashboard
        </h2>
        
        {/* Summary Stats */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#002D72' }}>
              {filteredStudents.length}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Total Students</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#002D72' }}>
              {averageScore}/5
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Average Score</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#002D72',
              fontSize: '14px'
            }}>
              Filter by Program
            </label>
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              style={styles.input}
            >
              {programs.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
          </div>
          
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#002D72',
              fontSize: '14px'
            }}>
              Filter by Simulation
            </label>
            <select
              value={filterSimulation}
              onChange={(e) => setFilterSimulation(e.target.value)}
              style={styles.input}
            >
              {simulations.map(simulation => (
                <option key={simulation} value={simulation}>{simulation}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button
              onClick={() => {
                setFilterProgram('All');
                setFilterSimulation('All');
              }}
              style={{
                ...styles.button,
                backgroundColor: '#6c757d',
                padding: '10px 15px',
                fontSize: '14px'
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto',
          border: '1px solid #e9ecef',
          borderRadius: '8px'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#002D72' }}>
                <th style={{ ...styles.tableHeader, textAlign: 'left', paddingLeft: '15px' }}>Student Name</th>
                <th style={styles.tableHeader}>Program</th>
                <th style={styles.tableHeader}>Simulation</th>
                <th style={styles.tableHeader}>Score</th>
                <th style={styles.tableHeader}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr 
                  key={student.id} 
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                    borderBottom: '1px solid #e9ecef'
                  }}
                >
                  <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#002D72' }}>
                    {student.name}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                    {student.program}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                    {student.simulation}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: getScoreColor(student.score) 
                    }}>
                      {student.score}/5
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: getScoreColor(student.score) + '20',
                      color: getScoreColor(student.score)
                    }}>
                      {getPerformanceText(student.score)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#666',
              fontStyle: 'italic'
            }}>
              No students found matching the current filters
            </div>
          )}
        </div>

        {/* Back to Home Button */}
        <button 
          style={{ 
            ...styles.button, 
            marginTop: '20px',
            backgroundColor: '#4EA5D9'
          }} 
          onClick={onHome}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default InstructorDashboard;