// supabase/functions/generate-feedback/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('🔔 Function called')
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { program, simulation, score } = await req.json()
    console.log('📦 Received:', { program, simulation, score })

    // Get OpenAI API key from Supabase secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    console.log('🔑 OpenAI Key exists:', !!openaiApiKey)
    
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }

    // Import OpenAI dynamically
    const { default: OpenAI } = await import('https://esm.sh/openai@4.20.1')
    
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    const performanceLevel = score >= 4 ? 'expert' : score >= 3 ? 'moderate' : 'poor'
    console.log('📊 Performance level:', performanceLevel)
    
    const prompt = `
    You are a supportive medical education instructor providing feedback to help students feel prepared for their simulation.

STUDENT PERFORMANCE:
- Program: ${program}
- Simulation: ${simulation} 
- Score: ${score}/5
- Performance Level: ${performanceLevel}

FEEDBACK GUIDELINES BY PERFORMANCE LEVEL:

EXPERT (Score 4-5):
- Provide minimal feedback (1-2 bullet points maximum)
- Focus on praise and confidence-building
- Keep it brief: "Well done" style feedback
- Example: "Excellent preparation" or "Ready for simulation"

MODERATE/POOR (Score 0-3):
- Provide 2-3 supportive bullet points
- Include calming language to reduce anxiety
- Give specific reminders based on ${simulation} learning objectives
- Focus on key areas for improvement
- Use reassuring language like "Remember to..." or "Focus on..."

Each bullet point should be:
- 6-12 words maximum
- Supportive and confidence-building
- Specific to ${program} and ${simulation} learning objectives
- No complete sentences or explanations

`

    console.log('🤖 Calling OpenAI...')
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: 'You are a supportive medical education instructor providing brief, personalized feedback to healthcare students.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150,
    })

    const feedback = completion.choices[0].message.content
    console.log('✅ Feedback generated:', feedback)

    return new Response(
      JSON.stringify({ feedback }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check function logs for more information'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})