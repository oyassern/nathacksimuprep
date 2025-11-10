import React, { useEffect, useState } from 'react';
import styles from '../styles/styles';
import SIMULATION_BRIEFS from '../data/simulationBriefs';
import objectivesRaw from '../../objectives.md?raw';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// parse objectives.md (expects headings like "## Simulation Title" followed by content)
function parseObjectives(raw) {
  const map = {};
  const sections = raw.split(/^##\s+/m).slice(1);
  sections.forEach(sec => {
    const [titleLine, ...rest] = sec.split('\n');
    const title = titleLine.trim();
    const body = rest.join('\n').trim();
    if (title) map[title] = body;
  });
  return map;
}

const OBJECTIVES = parseObjectives(objectivesRaw);

async function getFeedback(simulation, score) {
  console.log('Using Supabase Edge Function for feedback...');
  console.log('Simulation:', simulation);
  console.log('Score:', score);

  // Check if simulation exists in OBJECTIVES
  if (!OBJECTIVES[simulation]) {
    console.error('Simulation not found in OBJECTIVES:', simulation);
    console.log('Available simulations:', Object.keys(OBJECTIVES));
    return getFallbackFeedback(score);
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-feedback', {
      body: {
        simulation,
        score,
        objectives: OBJECTIVES[simulation]
      }
    });

    if (error) {
      console.error('Supabase Edge Function error:', error);
      throw error;
    }

    console.log('Feedback generated successfully:', data.feedback);
    return data.feedback;

  } catch (error) {
    console.error('Error calling Supabase Edge Function:', error);
    return getFallbackFeedback(score);
  }
}

function getFallbackFeedback(score) {
  if (score >= 4) {
    return "• Excellent preparation and clinical knowledge\n• Strong critical thinking skills demonstrated\n• Ready to handle complex simulation scenarios";
  } else if (score >= 3) {
    return "• Good foundational knowledge base\n• Continue developing clinical reasoning skills\n• Practice communication with healthcare team";
  } else {
    return "• Focus on core clinical concepts\n• Practice systematic assessment approaches\n• Review simulation learning objectives";
  }
}

function SummaryPage({ simulation, score, onStartBreathingExercise }) {
  const [feedback, setFeedback] = useState("Loading feedback...");
  const [loading, setLoading] = useState(true);
  const brief = SIMULATION_BRIEFS[simulation] || { description: "Scenario information unavailable." };

  useEffect(() => {
    async function fetchFeedback() {
      try {
        setLoading(true);
        const text = await getFeedback(simulation, score);
        setFeedback(text);
      } catch (err) {
        console.error(err);
        setFeedback("Unable to generate feedback. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchFeedback();
  }, [simulation, score]);

  const formatFeedback = (text) => {
    if (!text) return text;
    
    return text.split('\n').map((line, index) => {
      const cleanLine = line.trim();
      if (!cleanLine) return null;
      
      return (
        <div key={index} style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          marginBottom: '12px',
          fontSize: '15px',
          lineHeight: '1.4',
          padding: '2px',
          borderRadius: '8px'
        }}>
          <span style={{ color: '#333' }}>{cleanLine.replace(/^•\s*/, '')}</span>
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <div style={styles.gradientBg}>
      <div style={styles.card}>
        {/* Scenario Title */}
        <h1 style={{ 
          color: '#002D72', 
          fontSize: '24px', 
          fontWeight: '600', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {simulation}
        </h1>

        {/* Pre-Briefing Description */}
        <div style={{ 
          backgroundColor: '#FFF3E0', 
          padding: '20px', 
          borderRadius: '15px',
          border: '2px solid #FF8C00',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            color: '#002D72', 
            margin: '0 0 12px 0', 
            fontSize: '18px',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            Pre-Briefing Description
          </h3>
          <p style={{ 
            margin: '0', 
            fontSize: '14px', 
            color: '#333',
            lineHeight: '1.5',
            textAlign: 'left'
          }}>
            {brief.description}
          </p>
        </div>

        {/* Feedback Section */}
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          padding: '20px', 
          borderRadius: '15px',
          border: '2px solid #E8F4FD',
          marginBottom: '25px'
        }}>
          <h3 style={{ 
            color: '#002D72', 
            margin: '0 0 15px 0', 
            fontSize: '20px',
            textAlign: 'center',
            fontWeight: '600'
          }}>
             Personalized Feedback
          </h3>
          
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '30px',
              color: '#666'
            }}>
              <p style={{ margin: '0 0 10px 0' }}>
                Generating personalized feedback...
              </p>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #002D72',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
            </div>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {formatFeedback(feedback)}
            </div>
          )}
        </div>

        {/* Centered Breathing Exercise Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
          <button 
            onClick={onStartBreathingExercise}
            style={{
              backgroundColor: '#002D72',
              color: 'white',
              border: '3px solid #002D72',
              borderRadius: '50px',
              padding: '18px 35px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              minWidth: '280px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#001A4D';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#002D72';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <span>🌬️</span>
            Start Breathing Exercise
          </button>
        </div>

        {/* CSS for loading animation */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default SummaryPage;