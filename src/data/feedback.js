import { promises as fs } from 'fs';

async function getAPIKEY() {
  const file = await fs.readFile(process.cwd() + '/config.json', 'utf8');
  const data = JSON.parse(file);
  return data.Openrouter_KEY
}

const API_KEY = await getAPIKEY();

async function callAPI(){
  return fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        {
          role: 'user',
          content: 'What is the meaning of life?',
        },
      ],
    }),
  }).catch((error) => {console.error("Error fetching data:", error);});;

} 
