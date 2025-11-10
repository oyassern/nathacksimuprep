# Simuprep

## Inspiration
We built Simuprep to help students enter clinical simulations with stronger knowledge and lower anxiety. Many students report uneven preparation and high stress before simulations, and instructors lack lightweight tools to quickly see knowledge gaps. This project was inspired by that gap: simple, focused practice with immediate feedback can improve performance and confidence.

## What it does
Simuprep is a lightweight web tool for program-specific practice and instructor insights:
- Student features: program flows (Paramedic, Animal Health, Respiratory Therapy), multiple-choice questions with instant feedback, sliders for Confidence / Preparedness / Anxiety, short paced-breathing exercises, and a performance summary with suggested review areas.
- Instructor features: dashboard with scores and emotional metrics, filters by program/simulation, knowledge-gap detection.

## How we built it
- Frontend: React with hooks, role-based routing, and modular components for questions, sliders, and dashboards. Deterministic seeds are used where reproducibility matters (e.g., deterministic question sampling).
- Data model: relational-style layout (Students → Programs → Simulations → Questions → Responses) to keep analytics straightforward.
- UX: immediate feedback for MCQs, simple sliders for emotional measures, and micro-interventions (paced breathing) to reduce anxiety during practice.

## Challenges we ran into
- State management across multiple views while preserving in-progress practice sessions.
- Coordinating team members expertise to align with our project requirements.
- Connecting with APIs and connecting to cloud databases.
- Balancing realistic clinical difficulty and fast tests for development.
- Designing student personalized feedbacks that are informative without being overwhelming.

## Accomplishments that we're proud of
- A compact UX that combines cognitive practice and emotional self-assessment.
- Lightweight instructor dashboard that surfaces knowledge gaps and simple trends.
- Integration of short breathing exercises as an evidence-informed micro-intervention.
- Deterministic sampling and reproducible practice flows for fair student comparisons.

## What we learned
- Small, focused feedback loops (immediate MCQ feedback + self-rating) improve perceived preparedness.
- Emotional metrics (confidence/anxiety) add valuable context to raw scores for instructors.
- Iterating UI with real user feedback uncovered many small but important workflow improvements.

## What's next for Simuprep
- Backend: Node.js + Express API with secure role-based auth, persistent progress, and export endpoints.
- Expand question banks and add AI-assisted question generation while preserving human review.
- Tighter LMS (LTI) integrations for larger adoption.
- More advanced instructor analytics (cohort tracking, item-level psychometrics, and automated remediation suggestions).

## Steps to run
- Clone repository.
- If you want there to be personalized feedback, create a .env.local file in the parent directory with an OpenAI API key under VITE_OpenAI_KEY.
- Run "npm install".
- Run "npm run dev".

## Members
| Name |
| ---- |
| Arhm |
| Dyna |
| Jaber |
| Mohammed |
| Omar |

## Contributing
Open issues or PRs with clear descriptions and focused changes. For collaboration, contact the project members listed above.
