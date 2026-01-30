import { supabase } from '@/integrations/supabase/client';
import { MatchMetrics } from '@/stores/commandCenterStore';

interface AnalysisRequest {
  teamA: string;
  teamB: string;
  score: { home: number; away: number };
  matchTime: number;
  possession: { home: number; away: number };
  recentEvents: string[];
}

interface AnalysisResponse extends Partial<MatchMetrics> {
  analysis?: string;
  predictions?: string[];
}

export const analyzeMatch = async (matchData: AnalysisRequest): Promise<AnalysisResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-match', {
      body: { matchData },
    });

    if (error) {
      console.error('Error calling analyze-match:', error);
      throw error;
    }

    return data as AnalysisResponse;
  } catch (error) {
    console.error('Failed to analyze match:', error);
    // Return default values on error
    return {
      intensity: 0.5,
      motionScore: 0.5,
      playerDensity: 0.5,
      ballActivity: 0.5,
      tempo: 0.5,
      pressure: 0.5,
    };
  }
};
