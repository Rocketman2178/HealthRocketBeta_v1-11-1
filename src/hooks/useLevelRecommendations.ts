import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface LevelRecommendation {
  id: string;
  title: string;
  description: string;
  priority: number;
  category: string;
  scroll_target: string;
  action?: string;
}

export function useLevelRecommendations(level: number) {
  const [recommendations, setRecommendations] = useState<LevelRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add premium challenge recommendation for all levels
        const recommendations = [
          {
            id: 'connect_device',
            title: 'Connect Your Health Devices',
            description: 'Earn bonus FP by connecting your health tracking devices',
            priority: 1,
            category: 'Biohacking',
            scroll_target: 'connect-device',
            action: 'connectDevice'
          },
          {
            id: 'contest',
            title: 'Join a Contest',
            description: 'Compete for rewards and earn more FP',
            priority: 2,
            category: 'Contests',
            scroll_target: 'contests',
            action: 'openContestArena'
          },
          {
            id: 'daily_boost',
            title: 'Complete Daily Boosts',
            description: 'Earn FP and build your burn streak',
            priority: 3,
            category: 'Boosts',
            scroll_target: 'boosts',
            action: 'openBoosts'
          },
          {
            id: 'challenge',
            title: 'Start a Challenge',
            description: 'Take on a 21-day challenge to improve your health',
            priority: 4,
            category: 'Challenges',
            scroll_target: 'challenges',
            action: 'openChallengeLibrary'
          }
        ];

        // Get level-specific recommendations
        const { data: levelRecs, error: rpcError } = await supabase
          .rpc('get_level_recommendations', {
            p_level: level
          });

        if (rpcError) throw rpcError;

        // Combine device/contest recommendations with level-specific ones
        setRecommendations([...recommendations, ...(levelRecs || [])]);

      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch recommendations'));
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [level]);

  return { recommendations, loading, error };
}