import React, { useEffect, useState } from 'react';
import styles from '../styles/styles';
import OpenAI from "openai";
import SIMULATION_BRIEFS from '../data/simulationBriefs';

async function getFeedback(simulation, score) {
  const OPENAI_API_KEY = import.meta.env.VITE_OpenAI_KEY;
  const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // allows running in browser (Next.js client side)
  });

  const objectives = {'NAIT Pool: Pediatric Choking/Arrest': `Demonstrate effective leadership and management of a team (CRM principles) in a pediatric choking child in cardiopulmonary arrest
Perform the BLS and ALS treatment of an unconscious FBAO/choking child in cardiac arrest, including the use of Magill forceps
Perform the PALS guidelines for a pediatric cardiac arrest including asystole and VF
Perform a successful IO including the proper set up of the equipment
Discuss the benefit for peer‐support and CISM in pediatric population critical events`,
'Peds ER: Cardiac Emergency': `Rapid management of decompensated cardiac patient in ER
Rapid patient assessment
Initiation and Optimization of appropriate Oxygen Therapy
Utilize optimization techniques considering PVR when managing cardiac patients`,
'Euthanasia: Cat': `Attend to client’s needs. Ensure client is aware of procedure and details
Demonstrate sympathy/empathy for client and patient
Ensure euthanasia agreement form is signed
Ask if the client wishes to be present
Ensure disclosure of cost is discussed and payment take prior to procedure`,
'Euthanasia: Terrier': `Attend to client’s needs. Ensure client is aware of procedure and details. Demonstrate sympathy/empathy for client and patient
Ensure euthanasia agreement form is signed
Ask if the client wishes to be present
Ensure disclosure of cost is discussed and payment take prior to procedure`,
'Dog Fight': `Gather the information from the client with the critical dog “Bella”
Communicate with the veterinary team members to manage concurrent tasks
Practice conflict resolution
Gather informed consent
Triage and handle routine client inquiries
Manage client records and appointments using Cornerstone
Administer first aid, assess and begin treatment of critical patient
Update/report patient status to client as appropriate`,
'Stage 1 - OR Induction & Emergence': `1. Ensure closed-loop communication between team members
2. Induce anesthesia
3. Ventilation with self-inflating bagger with mask and troubleshooting.
4. Pediatric Intubation
5. Pediatric Extubation
6. CBO submissions:
a. S4.1 Intubation (person intubating only)
b. S4.3 Secure ETT (both participants in scenario, all if variants run)
c. S4.4 Extubation (both participants in scenario, all if variants run)
d. S4.5 Intubation assist (both participants in scenario, all if variants run)
e. S5.1 Assist Anesthetic Administration (both participants in scenario, all if variants run)
f. S5.2 Assist Emergence (both participants in scenario, all if variants run)
g. S5.3 Position Patient (both participants in scenario, all if variants run)`,
'Stage 2 - Post-Op Cardiac Arrest (PALS)': `7. Perform hand hygiene/ ensure appropriate PPE
8. Use NOD (name, occupation, duty) when first introducing self to patients and family members/Confirm patient identity
9. Principles of PALS
10. Ensure closed-loop communication between team members
11. CBO submissions:
a. S4.1 Intubation (participant performing intubation only)
b. S7.4 PALS (all participants)
c. S9.4 Transport of an intubated patient (have all students participate for sign off)`,
'Stage 3 - Withdrawal of Care': `12. Perform hand hygiene/ ensure appropriate PPE
13. Use NOD (name, occupation, duty) when first introducing self to patients and family members/Confirm patient identity
14. Compassionate care for the patient and family
15. Extubation
16. Critical incident stress management and debriefing
17. Ensure closed-loop communication between team members`,
'Stage 4 - Compassionate Extubation': `1. Perform hand hygiene/ ensure appropriate PPE
2. Use NOD (name, occupation, duty) when first introducing self to patients and family members/Confirm patient identity
3. Compassionate care for the patient and family
4. Extubation
5. Critical incident stress management and debriefing
6. Ensure closed‐loop communication between team members`,
}

  const prompt = `
You are an expert medical educator. A student just completed a simulation pre-test. 
These are are the learning objectives for this simulation: ${objectives[simulation]}
They scored ${score} out of 5.
Give 3 short bullet points of feedback on the objectives without giving away too much.
Expand feedback if student did bad and shorten if they did well depending on student performance.
Keep it encouraging and clear for students in healthcare training. 
Return only plain text with clear line breaks (no JSON or markdown formatting).
Based on stage one scenario objectives, the feedback should be based on those BUT VAGUELY in the sense that, 
`;

  const response = await client.responses.create({
    model: "gpt-5-nano",
    input: prompt,
  });

  return response.output_text;
  // const response = await fetch("/api/feedback");
  // console.log(await response.json());
  // return "test";
}

function SummaryPage({ simulation, score, onContinue }) {
  const [feedback, setFeedback] = useState("Loading feedback...");
  const brief = SIMULATION_BRIEFS[simulation] || { description: "Scenario information unavailable." };

    // 🧠 Fetch feedback when component mounts or score/simulation changes
  useEffect(() => {
    async function fetchFeedback() {
      try {
        const text = await getFeedback(simulation, score);
        setFeedback(text);
      } catch (err) {
        console.error(err);
        setFeedback("Unable to generate feedback. Please try again later.");
      }
    }
    fetchFeedback();
  }, [simulation, score]);

  // ✅ Fixed navigation: use onContinue instead of window.location
  const handleNext = () => {
    if (typeof onContinue === "function") onContinue();
  };

  return (
    <div style={styles.gradientBg}>
      <div style={styles.card}>
        {/* Scenario Title */}
        <h1 style={{ color: '#002D72', fontSize: '28px', fontWeight: '600', marginBottom: '20px' }}>
          {simulation}
        </h1>

        {/* Pre-Briefing Description */}
        <h3 style={{ color: '#002D72', marginBottom: '8px' }}>Pre-Briefing Description</h3>
        <p style={{ marginBottom: '24px', lineHeight: '1.6', color: '#333' }}>
          {brief.description}
        </p>

        {/* Pre-Briefing Feedback */}
        <h3 style={{ color: '#002D72', marginBottom: '8px' }}>Pre-Briefing Feedback</h3>
        <p style={{ whiteSpace: 'pre-line', color: '#333', marginBottom: '40px' }}>
          {feedback}
        </p>

        {/* Centered Continue Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleNext}
            style={{
              backgroundColor: '#002D72',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: '0.3s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#003c9b')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#002D72')}
          >
            Continue to Breathing Exercise
          </button>
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;

