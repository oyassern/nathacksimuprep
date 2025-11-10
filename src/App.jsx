import React, { useState } from 'react';
import styles from './styles/styles';
import StartPage from './pages/StartPage';
import ProgramSelection from './pages/ProgramSelection';
import SimulationSelection from './pages/SimulationSelection';
import StageSelection from './pages/StageSelection';
import MCQPage from './pages/MCQPage';
import SlidersPage from './pages/SlidersPage';
import SummaryPage from './pages/SummaryPage';
import InstructorDashboard from './pages/InstructorDashboard';
import BreathingExercise from './pages/BreathingExercise';

function App() {
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [page, setPage] = useState('start');
  const [program, setProgram] = useState('');
  const [simulation, setSimulation] = useState('');
  const [score, setScore] = useState(0);
  const [isInstructor, setIsInstructor] = useState(false);
  const [instructorSimulation, setInstructorSimulation] = useState('');

  const handleStudentSubmit = (data) => {
    setCurrentStudent({ name: `${data.firstName} ${data.lastName}`, id: data.studentId });
    setPage('program');
    setIsInstructor(false);
  };

  const handleInstructorLogin = () => {
    setIsInstructor(true);
    setPage('instructor'); // Go directly to dashboard after access code
  };

  const handleProgramSelect = (p) => {
    setProgram(p);
    setPage('simulation');
  };

  const handleSimulationSelect = (sim) => {
    setSimulation(sim);

    // Student flow only - instructors don't go through this
    if (sim === 'RESP 2695') {
      setPage('stage');
    } else {
      setPage('mcq');
    }
  };

  const handleStageSelect = (stage) => {
    setSimulation(stage);
    setPage('mcq');
  };

  const handleMCQComplete = (s) => {
    setScore(s);
    setPage('sliders');
  };

  const handleSlidersComplete = (vals) => {
    setStudents([...students, { ...currentStudent, program, simulation, score, ...vals }]);
    setPage('summary');
  };

  // Add this function to handle breathing exercise navigation
  const handleStartBreathingExercise = () => {
    setPage('breathing');
  };

  // Add this function to handle back from breathing exercise
  const handleBackFromBreathing = () => {
    setPage('summary');
  };

  const handleHome = () => {
    setPage('start');
    setIsInstructor(false);
    setInstructorSimulation('');
  };

  // For instructors, show ALL students (no filtering)
  const instructorStudents = students;

  return (
    <div style={styles.app}>
      {page === 'start' && (
        <StartPage
          onStudentSubmit={handleStudentSubmit}
          onInstructorLogin={handleInstructorLogin}
        />
      )}

      {page === 'program' && (
        <ProgramSelection
          onSelect={handleProgramSelect}
          onBack={handleHome}
        />
      )}

      {page === 'simulation' && (
        <SimulationSelection
          program={program}
          onSelect={handleSimulationSelect}
          onBack={() => setPage('program')}
        />
      )}

      {page === 'stage' && (
        <StageSelection
          onSelect={handleStageSelect}
          onBack={() => setPage('simulation')}
        />
      )}

      {page === 'mcq' && (
        <MCQPage
          program={program}
          onComplete={handleMCQComplete}
          onBack={() => setPage('simulation')}
        />
      )}

      {page === 'sliders' && (
        <SlidersPage
          onComplete={handleSlidersComplete}
          onBack={() => setPage('mcq')}
        />
      )}

      {page === 'summary' && (
        <SummaryPage
          simulation={simulation}
          score={score}
          onStartBreathingExercise={handleStartBreathingExercise}
        />
      )}

      {page === 'instructor' && (
        <InstructorDashboard
          students={instructorStudents} // Show all students for instructors
          onHome={handleHome}
        />
      )}

      {page === 'breathing' && (
        <BreathingExercise onBack={handleBackFromBreathing} />
      )}
    </div>
  );
}

export default App;