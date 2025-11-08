import React, { useState } from 'react';
import styles from '../styles/styles';
import MCQ_QUESTIONS from '../data/mcqQuestions';

function MCQPage({ program, onComplete, onBack }) {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [warning, setWarning] = useState('');

  const questions = MCQ_QUESTIONS[program.toLowerCase()] || MCQ_QUESTIONS.paramedic;

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
          <p>You'll complete 5 questions to gauge your preparedness before simulation.</p>
          <button style={styles.button} onClick={() => setStarted(true)}>Begin</button>
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
            cursor: 'pointer',
          }}
          onClick={handleNext}
        >
          {currentQ === questions.length - 1 ? 'Submit' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

export default MCQPage;



