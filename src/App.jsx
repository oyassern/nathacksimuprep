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
    setPage('program');
  };

  const handleProgramSelect = (p) => {
    setProgram(p);
    setPage('simulation');
  };

  const handleSimulationSelect = (sim) => {
    setSimulation(sim);

    // Instructor flow
    if (isInstructor) {
      setInstructorSimulation(sim);
      setPage('instructor');
      return;
    }

    setPage('mcq');
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

  const handleHome = () => {
    setPage('start');
    setIsInstructor(false);
    setInstructorSimulation('');
  };

  // Filter student data if instructor is viewing specific simulation
  const filteredStudents = isInstructor
    ? students.filter((s) => s.simulation === instructorSimulation)
    : [];

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
          simulation={simulation}  // ← ADD THIS LINE - pass the simulation prop!
          onComplete={handleMCQComplete}
          onBack={() => setPage('simulation')}
        />
      )}
      {page === 'sliders' && (
        <SlidersPage
          program={program}  // ← Also add program to SlidersPage for consistency
          simulation={simulation}  // ← And simulation to SlidersPage
          onComplete={handleSlidersComplete}
          onBack={() => setPage('mcq')}
        />
      )}
      {page === 'summary' && (
        <SummaryPage 
          program={program}  // ← Add program to SummaryPage
          simulation={simulation} 
          score={score} 
        />
      )}
      {page === 'instructor' && (
        <InstructorDashboard
          students={filteredStudents}
          onHome={handleHome}
        />
      )}
    </div>
  );
}

export default App;