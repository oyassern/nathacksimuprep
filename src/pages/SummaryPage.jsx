import React, { useState, useEffect } from 'react';
import styles from '../styles/styles';
import { createClient } from '@supabase/supabase-js';

// Use Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function SummaryPage({ program, simulation, score }) {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    generateFeedback();
  }, [score, program, simulation]);

  const generateFeedback = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase.functions.invoke('generate-feedback', {
        body: { 
          program, 
          simulation, 
          score 
        }
      });

      if (error) {
        throw error;
      }

      setFeedback(data.feedback);
      setLoading(false);

    } catch (err) {
      console.error('Error generating feedback:', err);
      setFeedback(getFallbackFeedback());
      setLoading(false);
    }
  };

  const getFallbackFeedback = () => {
    if (score >= 4) {
      return "• Excellent preparation\n• Ready for simulation";
    } else if (score >= 3) {
      return "• Good foundation to build on\n• Focus on clinical reasoning\n• Remember communication skills";
    } else {
      return "• This is a learning opportunity\n• Focus on core objectives\n• Ask questions during simulation";
    }
  };

  const getPerformanceColor = () => {
    if (score >= 4) return '#2E8B57';
    if (score >= 3) return '#FF8C00';
    return '#D32F2F';
  };

  // Convert feedback text to bullet points
  const formatFeedback = (text) => {
    // Split into non-empty lines
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // Clean each line: remove numbered prefixes (e.g., "1. ", "1) ", "1 - ") and bullet chars
    const cleaned = lines.map(line =>
      line
        .replace(/^[\d]+\s*[\.\)\-]\s*/, '') // "1. " or "1) " or "1- "
        .replace(/^[\d]+\s+-\s*/, '') // "1 - "
        .replace(/^[•\-\*]\s*/, '') // bullet chars
        .trim()
    );

    // If the first line is a "Feedback for ..." header or repeats the simulation name, drop it
    if (cleaned.length > 0) {
      const firstLower = cleaned[0].toLowerCase();
      const simLower = (simulation || '').toLowerCase();
      if (
        /^feedback\b/i.test(cleaned[0]) ||
        firstLower.includes('feedback for') ||
        (simLower && firstLower === simLower) ||
        firstLower.includes('resp')
      ) {
        cleaned.shift();
      }
    }

    // Keep up to 4 feedback items (3-4 as requested)
    const visible = cleaned.slice(0, 4);

    return visible.map((point, index) => {
      if (!point) return null;
      return (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'flex-start',
          marginBottom: '10px',
          fontSize: '16px',
          lineHeight: '1.4'
        }}>
          <span style={{
            color: getPerformanceColor(),
            marginRight: '12px',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>•</span>
          <span style={{ color: '#333' }}>{point}</span>
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <div style={styles.gradientBg}>
      <div style={styles.card}>
        <h2 style={{ color: '#002D72', marginBottom: '25px', textAlign: 'center' }}>
          Pre-Brief Summary
        </h2>

        {/* Ready for Simulation - Same for all simulations */}
        <div style={{ 
          backgroundColor: '#FFF3E0', 
          padding: '25px', 
          borderRadius: '10px',
          border: '2px solid #FF8C00',
          marginBottom: '25px',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            color: '#002D72', 
            margin: '0 0 8px 0', 
            fontSize: '20px',
            fontWeight: '600'
          }}>
            Ready for Simulation
          </h3>

          {/* Added: show simulation name under the Ready for Simulation heading */}
          <p style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            color: '#002D72',
            fontWeight: '600'
          }}>
            {simulation}
          </p>

          <p style={{ 
            margin: '0', 
            fontSize: '16px', 
            color: '#333',
            lineHeight: '1.5'
          }}>
            You are now prepared to begin the simulation scenario. Your instructor will guide you through the clinical case where you can apply your knowledge and clinical reasoning skills in a realistic healthcare environment.
          </p>
        </div>

        {/* Feedback Section - At the bottom */}
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          padding: '25px', 
          borderRadius: '10px',
          border: '2px solid #E8F4FD'
        }}>
          <h3 style={{ 
            color: '#002D72', 
            margin: '0 0 20px 0', 
            fontSize: '20px',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            Feedback
          </h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ margin: '0', color: '#666' }}>
                Generating feedback...
              </p>
            </div>
          ) : (
            <div style={{ 
              backgroundColor: 'transparent',
              padding: '20px', 
              borderRadius: '8px'
            }}>
              {formatFeedback(feedback)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;