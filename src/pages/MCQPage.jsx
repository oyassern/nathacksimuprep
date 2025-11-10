import React, { useState, useEffect } from 'react';
import styles from '../styles/styles';
import MCQ_QUESTIONS from '../data/mcqQuestions';

function MCQPage({ program, simulation, onComplete, onBack }) {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [warning, setWarning] = useState('');
  const [questions, setQuestions] = useState([]);
  const [availableSimulations, setAvailableSimulations] = useState([]);

  // Get questions based on program AND simulation
  useEffect(() => {
    console.log('🔄 Loading questions for:', { program, simulation });
    
    if (program) {
      const programData = MCQ_QUESTIONS[program.toLowerCase()];
      
      if (programData) {
        // Get all available simulations for this program
        const simulations = Object.keys(programData);
        setAvailableSimulations(simulations);
        
        let selectedQuestions = [];
        let selectedSimulationName = simulation;
        
        // If simulation is provided and exists, use it
        if (simulation && programData[simulation]) {
          selectedQuestions = programData[simulation];
          console.log(`✅ Using ${selectedQuestions.length} questions from "${simulation}"`);
        } 
        // If simulation not provided or not found, use first available
        else {
          selectedSimulationName = simulations[0];
          selectedQuestions = programData[selectedSimulationName] || [];
          console.log(`🔄 Using "${selectedSimulationName}" with ${selectedQuestions.length} questions`);
        }
        
        setQuestions(selectedQuestions);
      } else {
        // Fallback if program not found
        console.log('❌ Program not found, using fallback');
        const fallbackProgram = Object.keys(MCQ_QUESTIONS)[0];
        const fallbackProgramData = MCQ_QUESTIONS[fallbackProgram];
        const fallbackSimulations = Object.keys(fallbackProgramData);
        const fallbackSimulation = fallbackSimulations[0];
        const fallbackQuestions = fallbackProgramData[fallbackSimulation] || [];
        
        setQuestions(fallbackQuestions);
        setAvailableSimulations(fallbackSimulations);
      }
    }
  }, [program, simulation]);

  const handleAnswer = (idx) => {
    setAnswers({ ...answers, [currentQ]: idx });
    setWarning(''); // clear warning when an option is chosen
  };

  const handleNext = () => {
    // Prevent skipping without selecting an answer
    if (answers[currentQ] === undefined) {
      setWarning('Please select an answer before continuing.');
      return;
    }

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
      onComplete(score);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  if (!started) {
    return (
      <div style={styles.gradientBg}>
        <button
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: '#4EA5D9',
            color: '#FFF',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            cursor: 'pointer'
          }}
          onClick={onBack}
        >
          ← Back
        </button>

        <div style={styles.card}>
          <h2 style={{ color: '#002D72' }}>Pre-Briefing Assessment</h2>
          <p>You'll complete {questions.length} questions to gauge your preparedness before simulation.</p>
          
          {/* Show simulation info */}
          <div style={{ 
            backgroundColor: '#E8F4FD', 
            padding: '15px', 
            borderRadius: '8px', 
            margin: '15px 0',
            border: '1px solid #4EA5D9'
          }}>
            <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#002D72' }}>
              Program: <span style={{ fontWeight: 'normal' }}>{program}</span>
            </p>
            <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#002D72' }}>
              Simulation: <span style={{ fontWeight: 'normal' }}>{simulation || availableSimulations[0]}</span>
            </p>
          </div>

          {/* Show available simulations for reference */}
          {availableSimulations.length > 1 && (
            <div style={{ 
              backgroundColor: '#F8F9FA', 
              padding: '10px', 
              borderRadius: '6px', 
              margin: '10px 0',
              fontSize: '14px',
              color: '#666'
            }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Available Simulations:</p>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {availableSimulations.map(sim => (
                  <li key={sim}>{sim}</li>
                ))}
              </ul>
            </div>
          )}

          <button 
            style={styles.button} 
            onClick={() => setStarted(true)}
            disabled={questions.length === 0}
          >
            {questions.length === 0 ? 'Loading Questions...' : 'Begin Assessment'}
          </button>
        </div>
      </div>
    );
  }

  // Show error if no questions available
  if (questions.length === 0) {
    return (
      <div style={styles.gradientBg}>
        <button
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: '#4EA5D9',
            color: '#FFF',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            cursor: 'pointer'
          }}
          onClick={onBack}
        >
          ← Back
        </button>

        <div style={styles.card}>
          <h2 style={{ color: '#D32F2F' }}>No Questions Available</h2>
          <p>No questions found for <strong>{simulation}</strong> in the <strong>{program}</strong> program.</p>
          <button style={styles.button} onClick={onBack}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.gradientBg}>
      <div style={styles.card}>
        {/* Navigation header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          {currentQ === 0 ? (
            <button
              style={{
                backgroundColor: '#4EA5D9',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
              onClick={onBack}
            >
              ← Back
            </button>
          ) : (
            <button
              style={{
                backgroundColor: '#E0E0E0',
                color: '#002D72',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
              onClick={handlePrev}
            >
              ← Previous
            </button>
          )}

          <span style={{ fontWeight: 'bold', color: '#002D72' }}>
            Question {currentQ + 1} / {questions.length}
          </span>
        </div>

        {/* Simulation info */}
        <div style={{ 
          backgroundColor: '#E8F4FD', 
          padding: '10px', 
          borderRadius: '8px', 
          marginBottom: '15px',
          border: '1px solid #4EA5D9'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#002D72' }}>
            <strong>Program:</strong> {program} | <strong>Simulation:</strong> {simulation || availableSimulations[0]}
          </p>
        </div>

        <h3 style={{ color: '#002D72', textAlign: 'left', fontWeight: 'bold' }}>
          {questions[currentQ].q}
        </h3>

        <div style={{ textAlign: 'left', marginTop: '20px' }}>
          {questions[currentQ].options.map((opt, idx) => (
            <label key={idx} style={{ display: 'block', marginBottom: '10px', cursor: 'pointer' }}>
              <input
                type="radio"
                checked={answers[currentQ] === idx}
                onChange={() => handleAnswer(idx)}
                style={{ marginRight: '10px' }}
              />
              {opt}
            </label>
          ))}
        </div>

        {/* Warning message if skipped */}
        {warning && (
          <p style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>
            ⚠ {warning}
          </p>
        )}

        <button
          style={{
            ...styles.button,
            marginTop: '20px',
            opacity: answers[currentQ] === undefined ? 0.8 : 1,
            cursor: answers[currentQ] === undefined ? 'not-allowed' : 'pointer',
          }}
          onClick={handleNext}
          disabled={answers[currentQ] === undefined}
        >
          {currentQ === questions.length - 1 ? 'Submit' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

export default MCQPage;