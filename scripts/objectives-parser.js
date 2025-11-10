/**
 * scripts/objectives-parser.js
 *
 * Purpose:
 * - Parse `scenarios.md` and `objectives.md` (split files) to extract simulation scenarios
 *   and their learning objectives.
 * - Use OpenAI to generate multiple-choice questions for each simulation based on those
 *   learning objectives and insert them into the Supabase database.
 * - Update the frontend questions file `src/data/mcqQuestions.js` with questions grouped by program and simulation.
 *
 * Associated files / resources:
 * - `scenarios.md`            : source list of scenario names (project root)
 * - `objectives.md`           : learning objectives per scenario (project root)
 * - `.env.local`              : environment variables (Supabase and OpenAI keys)
 * - `src/data/mcqQuestions.js`: generated frontend data file produced by this script
 * - Database tables: `simulations`, `questions` (used by Supabase inserts/queries)
 *
 * Usage:
 * - Run with Node (ensure `.env.local` is configured):
 *     node scripts/objectives-parser.js
 */
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get current directory (ES modules fix)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from correct path
const envPath = path.join(__dirname, '..', '.env.local');
dotenv.config({ path: envPath });

console.log('Loading env from:', envPath);

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

console.log('Supabase URL:', supabaseUrl ? '✓ Found' : '✗ Missing');
console.log('Supabase Key:', supabaseKey ? '✓ Found' : '✗ Missing');
console.log('OpenAI Key:', openaiKey ? '✓ Found' : '✗ Missing');

if (!supabaseUrl || !supabaseKey || !openaiKey) {
  console.error('Missing required environment variables!');
  process.exit(1);
}

// Initialize clients
const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

// Read scenarios from scenarios.md
function readScenariosFile() {
  try {
    const scenariosPath = path.join(__dirname, '..', 'scenarios.md');
    console.log('Looking for scenarios.md at:', scenariosPath);
    
    if (!fs.existsSync(scenariosPath)) {
      console.error('scenarios.md file not found at:', scenariosPath);
      console.log('Please make sure scenarios.md is in your project root');
      return [];
    }
    
    const content = fs.readFileSync(scenariosPath, 'utf8');
    console.log('Successfully read scenarios.md');
    
    const scenarios = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines, headers, and section markers
      if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('##')) {
        continue;
      }
      
      // Look for bullet points
      if (trimmedLine.startsWith('-')) {
        const scenarioName = trimmedLine.substring(1).trim();
        if (scenarioName) {
          scenarios.push({
            name: scenarioName,
            program: determineProgram(scenarioName)
          });
        }
      }
    }
    
    console.log(`Found ${scenarios.length} scenarios in scenarios.md`);
    return scenarios;
    
  } catch (error) {
    console.error('Error reading scenarios.md:', error);
    return [];
  }
}

// Read objectives from objectives.md and match with scenarios
function parseObjectivesWithScenarios(scenarios) {
  try {
    const objectivesPath = path.join(__dirname, '..', 'objectives.md');
    console.log('Looking for objectives.md at:', objectivesPath);
    
    if (!fs.existsSync(objectivesPath)) {
      console.error('objectives.md file not found at:', objectivesPath);
      return [];
    }
    
    const content = fs.readFileSync(objectivesPath, 'utf8');
    console.log('Successfully read objectives.md');
    
    const simulations = [];
    const lines = content.split('\n');
    
    let currentSim = null;
    let currentScenarioName = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Look for simulation headers - match with scenario names
      const matchedScenario = scenarios.find(scenario => {
        // Flexible matching for headers like "## Scenario Name" vs "Scenario Name"
        const cleanLine = line.replace(/^#+\s*/, '').trim();
        return cleanLine.includes(scenario.name) || scenario.name.includes(cleanLine);
      });
      
      if (matchedScenario) {
        // Save previous simulation if exists
        if (currentSim && currentScenarioName) {
          simulations.push(currentSim);
        }
        
        // Create new simulation
        currentSim = {
          name: matchedScenario.name,
          program: matchedScenario.program,
          learning_objectives: []
        };
        currentScenarioName = matchedScenario.name;
        console.log(`Found objectives for: ${currentSim.name}`);
      }
      
      // Look for objectives (numbered items)
      else if (currentSim && line.match(/^\d+\./)) {
        currentSim.learning_objectives.push(line);
      }
      
      // Look for sub-objectives (lettered items like a., b., etc.)
      else if (currentSim && line.match(/^[a-z]\./)) {
        // Add as sub-item to the last objective
        if (currentSim.learning_objectives.length > 0) {
          const lastObj = currentSim.learning_objectives[currentSim.learning_objectives.length - 1];
          currentSim.learning_objectives[currentSim.learning_objectives.length - 1] = 
            lastObj + '\n' + line;
        }
      }
    }
    
    // Add the last simulation
    if (currentSim) {
      simulations.push(currentSim);
    }
    
    console.log(`\nParsed ${simulations.length} simulations with objectives:`);
    simulations.forEach(sim => {
      console.log(`- ${sim.name}: ${sim.learning_objectives.length} objectives`);
    });
    
    return simulations;
    
  } catch (error) {
    console.error('Error parsing objectives with scenarios:', error);
    return [];
  }
}

function determineProgram(scenarioName) {
  const name = scenarioName.toLowerCase();
  if (name.includes('dog') || name.includes('euthanasia') || name.includes('terrier') || name.includes('cat')) {
    return 'animal_health';
  } else if (name.includes('peds') || name.includes('pediatric') || name.includes('pool')) {
    return 'paramedicine';
  } else {
    return 'respiratory_therapy';
  }
}

// Generate questions using OpenAI
async function generateQuestionsWithOpenAI(simulation) {
  const objectivesText = simulation.learning_objectives.join('\n');
  
  const prompt = `
You are an expert medical educator and test developer creating multiple-choice questions for healthcare simulation training. Your task is to generate high-quality, clinically relevant questions that assess application of knowledge and clinical reasoning.

SIMULATION: ${simulation.name}
PROGRAM: ${simulation.program}

LEARNING OBJECTIVES:
${objectivesText}

Generate 5 multiple-choice questions following these evidence-based guidelines:

CRITICAL REQUIREMENTS - DO NOT GENERATE QUESTIONS IF YOU CANNOT MEET THESE:
- Each question MUST have exactly 4 complete, meaningful options (A, B, C, D)
- EVERY option must be a plausible clinical choice - no placeholder text
- NO null, undefined, or incomplete options allowed
- NO "None of the above" or "All of the above" options
- All options must be distinct from each other and clinically relevant

QUESTION FORMAT REQUIREMENTS:
- Create single-best-answer questions with exactly 4 options (A, B, C, D)
- Each question must include a clinical vignette (3-5 sentences) that presents a realistic patient scenario
- Ensure answer options do not contain directly opposite statements
- Vary the position of correct answers randomly

CONTENT QUALITY REQUIREMENTS:
- Questions must directly test knowledge and application of the learning objectives
- Focus on clinical reasoning and problem-solving, not simple recall
- Ensure questions are at the appropriate difficulty level for healthcare students
- All content must be medically accurate and evidence-based
- Include realistic clinical details (vital signs, lab values, exam findings when relevant)

STRUCTURE REQUIREMENTS:
- Provide clear correct answer (A, B, C, or D)
- Include brief explanation referencing the specific learning objectives
- Ensure questions cover different aspects of the learning objectives
- Make sure the stem presents a complete clinical problem
- Options should be parallel in structure and length

FORMAT: Return as JSON array with these exact fields for each question:
- question_text (string with clinical vignette)
- option_a (string - complete clinical option)
- option_b (string - complete clinical option)
- option_c (string - complete clinical option)
- option_d (string - complete clinical option)
- correct_answer (string: 'a', 'b', 'c', or 'd')
- explanation (string referencing learning objectives)

Return ONLY the JSON array, no other text. If you cannot create 5 questions that meet all requirements, return an empty array.
`;

  try {
    console.log(`\nGenerating questions for: ${simulation.name}`);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are a medical education expert. Create questions that directly test learning objectives. Return ONLY valid JSON arrays." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const response = completion.choices[0].message.content;
    console.log(`✅ OpenAI response received for ${simulation.name}`);
    
    const questions = JSON.parse(response);
    
    // Add simulation name to each question
    return questions.map(q => ({
      ...q,
      simulation_name: simulation.name
    }));
    
  } catch (error) {
    console.error(`Error generating questions for ${simulation.name}:`, error);
    return [];
  }
}

// Add this function to create simulations if they don't exist
async function createOrGetSimulation(simulation) {
  try {
    // Check if simulation exists
    const { data: existingSim, error: findError } = await supabase
      .from('simulations')
      .select('id')
      .eq('name', simulation.name)
      .single();

    if (existingSim && !findError) {
      return existingSim.id;
    }

    // Create new simulation
    const { data: newSim, error: createError } = await supabase
      .from('simulations')
      .insert({
        name: simulation.name,
        program: simulation.program
      })
      .select('id')
      .single();

    if (createError) {
      console.error(`Error creating simulation ${simulation.name}:`, createError);
      return null;
    }

    console.log(`✓ Created simulation: ${simulation.name}`);
    return newSim.id;

  } catch (error) {
    console.error(`Error with simulation ${simulation.name}:`, error);
    return null;
  }
}

// Add this validation function
function validateQuestion(question) {
  const options = [question.option_a, question.option_b, question.option_c, question.option_d];
  
  // Check for null/empty options
  const hasNullOptions = options.some(opt => 
    opt === null || opt === undefined || opt.trim() === ''
  );
  
  // Check if correct answer is valid
  const isValidCorrectAnswer = ['a', 'b', 'c', 'd'].includes(question.correct_answer?.toLowerCase());
  
  // Check if we have at least 2 valid options
  const validOptions = options.filter(opt => 
    opt !== null && opt !== undefined && opt.trim().length > 0
  );
  
  return !hasNullOptions && isValidCorrectAnswer && validOptions.length >= 2;
}

// Insert questions to database
async function insertQuestionsToDatabase(questions) {
  let successCount = 0;
  
  // Filter out invalid questions first
  const validQuestions = questions.filter(q => {
    const isValid = validateQuestion(q);
    if (!isValid) {
      console.warn(`❌ Skipping invalid question: "${q.question_text.substring(0, 50)}..."`);
    }
    return isValid;
  });
  
  console.log(`📊 ${validQuestions.length}/${questions.length} questions passed validation`);
  
  if (validQuestions.length === 0) {
    return 0;
  }
  
  // Get or create simulation ONCE for all questions in this batch
  const firstQuestion = validQuestions[0];
  const simulationId = await createOrGetSimulation({
    name: firstQuestion.simulation_name,
    program: determineProgram(firstQuestion.simulation_name)
  });

  if (!simulationId) {
    console.error('Error finding/creating simulation:', firstQuestion.simulation_name);
    return 0;
  }
  
  // Now insert all questions for this simulation
  for (const question of validQuestions) {
    try {
      // Insert question
      const { error } = await supabase
        .from('questions')
        .insert({
          simulation_id: simulationId,
          question_text: question.question_text,
          option_a: question.option_a,
          option_b: question.option_b,
          option_c: question.option_c,
          option_d: question.option_d,
          correct_answer: question.correct_answer,
          explanation: question.explanation
        });

      if (error) {
        console.error('Error inserting question:', error);
      } else {
        successCount++;
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }
  
  return successCount;
}

// Add this function to clear existing data
async function clearDatabase() {
  try {
    console.log('🗑️  Clearing existing questions and simulations...');
    
    // Delete all questions first (due to foreign key constraint)
    const { error: questionsError } = await supabase
      .from('questions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (questionsError) {
      console.error('Error clearing questions:', questionsError);
    } else {
      console.log('✓ Cleared all questions');
    }
    
    // Delete all simulations
    const { error: simsError } = await supabase
      .from('simulations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (simsError) {
      console.error('Error clearing simulations:', simsError);
    } else {
      console.log('✓ Cleared all simulations');
    }
    
    console.log('✅ Database cleared successfully');
    return true;
    
  } catch (error) {
    console.error('Error clearing database:', error);
    return false;
  }
}

/**
 * updateFrontendQuestions
 *
 * Purpose:
 * - Select a deterministic set of daily questions per program and write them to
 *   `src/data/mcqQuestions.js` so all students in a cohort see the same set for the day.
 */
async function updateFrontendQuestions() {
  try {
    console.log('\n🔄 Updating frontend questions file...');

    // DELETE existing file first
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'mcqQuestions.js');
    
    try {
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
        console.log('🗑️  Deleted existing mcqQuestions.js');
      }
    } catch (deleteError) {
      console.log('⚠️  Could not delete existing file (may not exist yet)');
    }

    // Get all simulations with their questions
    const { data: simulations, error } = await supabase
      .from('simulations')
      .select(`
        id,
        name,
        program,
        questions (
          id,
          question_text,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          explanation
        )
      `);

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    // Use today's date as a seed for consistent daily selection
    const today = new Date();
    const dateSeed = today.toISOString().split('T')[0]; // YYYY-MM-DD

    // NEW: Nested structure - program → simulation → questions
    const mcqData = {
      paramedic: {},
      'animal health': {},
      'respiratory therapist': {}
    };

    // Group simulations by program first
    const simulationsByProgram = {
      paramedicine: [],
      animal_health: [],
      respiratory_therapy: []
    };

    simulations.forEach(sim => {
      const programKey = sim.program;
      if (simulationsByProgram[programKey]) {
        simulationsByProgram[programKey].push(sim);
      }
    });

    // For each program, process each simulation
    Object.keys(simulationsByProgram).forEach(programKey => {
      const frontendProgramKey = mapProgramToKey(programKey);
      const programSimulations = simulationsByProgram[programKey] || [];

      programSimulations.forEach(sim => {
        if (!Array.isArray(sim.questions) || sim.questions.length === 0) {
          mcqData[frontendProgramKey][sim.name] = [];
          return;
        }

        // Deterministic shuffle for this specific simulation
        const simSeedRng = createSeededRandom(dateSeed + '|' + sim.name);
        const shuffledQuestions = [...sim.questions].sort(() => simSeedRng() - 0.5);

        const selected = shuffledQuestions
          .slice(0, Math.min(5, shuffledQuestions.length))
          .map(q => {
            const optionSeed = `${dateSeed}|${sim.name}|${q.id || q.question_text}`;
            const optionRng = createSeededRandom(optionSeed);

            const shuffledOptions = shuffleOptions(q, optionRng);

            const originalOptions = [
              q.option_a,
              q.option_b,
              q.option_c,
              q.option_d
            ];
            const originalCorrectIndex = mapCorrectAnswer(q.correct_answer);
            const correctText = originalOptions[originalCorrectIndex];
            const correctIndex = shuffledOptions.indexOf(correctText);

            return {
              q: q.question_text,
              options: shuffledOptions,
              correct: correctIndex >= 0 ? correctIndex : 0,
              explanation: q.explanation
            };
          })
          .filter(question => {
            const hasNullOptions = question.options.some(opt => 
              opt === null || opt === undefined || opt.trim() === ''
            );
            const validOptions = question.options.filter(opt => 
              opt !== null && opt !== undefined && opt.trim().length > 0
            );
            const isValid = !hasNullOptions && validOptions.length >= 2;
            
            if (!isValid) {
              console.warn(`❌ Filtering out invalid question: "${question.q.substring(0, 50)}..."`);
            }
            return isValid;
          });

        // Ensure we initialize the simulation object
        if (!mcqData[frontendProgramKey][sim.name]) {
          mcqData[frontendProgramKey][sim.name] = [];
        }
        
        mcqData[frontendProgramKey][sim.name] = selected.slice(0, 5);
      });
    });

    console.log(`✅ Selected daily questions (Date: ${dateSeed}):`);
    
    // Log detailed breakdown
    Object.keys(mcqData).forEach(program => {
      console.log(`\n${program.toUpperCase()}:`);
      Object.keys(mcqData[program]).forEach(simulation => {
        console.log(`  - ${simulation}: ${mcqData[program][simulation].length} questions`);
      });
    });

    // Save as JavaScript file
    const fileContent = `// Daily questions for ${dateSeed}\nconst MCQ_QUESTIONS = ${JSON.stringify(mcqData, null, 2)};\n\nexport default MCQ_QUESTIONS;\n`;

    fs.writeFileSync(outputPath, fileContent);
    console.log(`💾 Saved NEW daily questions to: ${outputPath}`);

  } catch (error) {
    console.error('Error updating frontend questions:', error);
  }
}

// Helper function for consistent random based on date
function createSeededRandom(seed) {
  let value = 0;
  for (let i = 0; i < seed.length; i++) {
    value = ((value << 5) - value) + seed.charCodeAt(i);
    value = value & value;
  }
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

// Shuffle options but track the correct answer
function shuffleOptions(question, seededRandom) {
  const options = [
    question.option_a,
    question.option_b, 
    question.option_c,
    question.option_d
  ];
  
  // Shuffle using seeded random
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return options;
}

// Add these helper functions
function mapProgramToKey(program) {
  const programMap = {
    'paramedicine': 'paramedic',
    'animal_health': 'animal health', 
    'respiratory_therapy': 'respiratory therapist'
  };
  return programMap[program] || 'paramedic';
}

// Update the correct answer mapping for 4 options
function mapCorrectAnswer(correctAnswer) {
  const answerMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
  return answerMap[correctAnswer.toLowerCase()] || 0;
}

// Main execution
async function main() {
  try {
    console.log('Starting parser with database reset...');
    console.log('================================');
    
    // DELETE frontend file at start
    const frontendPath = path.join(__dirname, '..', 'src', 'data', 'mcqQuestions.js');
    try {
      if (fs.existsSync(frontendPath)) {
        fs.unlinkSync(frontendPath);
        console.log('🗑️  Deleted existing mcqQuestions.js');
      }
    } catch (deleteError) {
      console.log('⚠️  Could not delete existing frontend file');
    }
    
    // Clear the database first
    const cleared = await clearDatabase();
    if (!cleared) {
      console.log('Failed to clear database. Exiting.');
      return;
    }
    
    // Step 1: Read scenarios from scenarios.md
    const scenarios = readScenariosFile();
    
    if (scenarios.length === 0) {
      console.log('No scenarios found. Exiting.');
      return;
    }
    
    // Step 2: Read objectives and match with scenarios
    const simulations = parseObjectivesWithScenarios(scenarios);
    
    if (simulations.length === 0) {
      console.log('No simulations with objectives found. Exiting.');
      return;
    }
    
    let totalQuestions = 0;
    
    // Step 3: Generate and insert questions for each simulation
    for (const sim of simulations) {
      // Generate questions with OpenAI
      const questions = await generateQuestionsWithOpenAI(sim);
      
      if (questions.length > 0) {
        // Insert to database
        const insertedCount = await insertQuestionsToDatabase(questions);
        console.log(`✓ Generated: ${questions.length} questions`);
        console.log(`✓ Inserted: ${insertedCount} questions`);
        totalQuestions += insertedCount;
        
        // Delay to avoid rate limits
        console.log('Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log('✗ No questions generated for', sim.name);
      }
    }
    
    console.log('\n================================');
    console.log(`🎉 COMPLETED: ${totalQuestions} total questions inserted`);

    // Brief delay to ensure all database operations are complete
    console.log('Finalizing database operations...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // UPDATE frontend file with NEW data
    console.log('\n🔄 Creating NEW frontend questions file...');
    await updateFrontendQuestions();
    console.log('✅ Frontend questions updated successfully!');
    
  } catch (error) {
    console.error('Process failed:', error);
  }
}

// Run the automation
main();