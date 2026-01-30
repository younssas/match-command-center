import "https://deno.land/std@0.168.0/dotenv/load.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  matchData: {
    teamA: string;
    teamB: string;
    score: { home: number; away: number };
    matchTime: number;
    possession: { home: number; away: number };
    recentEvents: string[];
  };
}

interface IntensityScore {
  intensity: number;
  motionScore: number;
  playerDensity: number;
  ballActivity: number;
  tacticalZone: string;
  tempo: number;
  momentum: 'home' | 'away' | 'neutral';
  pressure: number;
  analysis: string;
  predictions: string[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { matchData } = await req.json() as AnalysisRequest;

    // Use Lovable AI to analyze match intensity
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are a football match intensity analyzer. Analyze the provided match data and return a JSON object with the following structure:
{
  "intensity": 0.0-1.0 (overall match intensity based on score difference, time, events),
  "motionScore": 0.0-1.0 (estimated player movement activity),
  "playerDensity": 0.0-1.0 (tactical compactness),
  "ballActivity": 0.0-1.0 (based on recent events),
  "tacticalZone": "left_penalty" | "left_attack" | "midfield" | "right_attack" | "right_penalty",
  "tempo": 0.0-1.0 (pace of the game),
  "momentum": "home" | "away" | "neutral",
  "pressure": 0.0-1.0 (which team is dominating),
  "analysis": "Brief 1-2 sentence analysis of current match state",
  "predictions": ["3 short predictions about what might happen next"]
}

Consider: score difference, match time (late goals are more intense), possession balance, recent events.
Return ONLY valid JSON, no markdown.`
          },
          {
            role: 'user',
            content: `Analyze this match:
${matchData.teamA} ${matchData.score.home} - ${matchData.score.away} ${matchData.teamB}
Match time: ${matchData.matchTime}'
Possession: ${matchData.teamA} ${matchData.possession.home}% - ${matchData.possession.away}% ${matchData.teamB}
Recent events: ${matchData.recentEvents.join(', ') || 'None'}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON response
    let analysisResult: IntensityScore;
    try {
      // Clean up any markdown formatting
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Return default values if parsing fails
      analysisResult = {
        intensity: 0.5,
        motionScore: 0.5,
        playerDensity: 0.5,
        ballActivity: 0.5,
        tacticalZone: 'midfield',
        tempo: 0.5,
        momentum: 'neutral',
        pressure: 0.5,
        analysis: 'Unable to analyze match data.',
        predictions: ['Continue watching for updates'],
      };
    }

    return new Response(
      JSON.stringify(analysisResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in analyze-match function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
