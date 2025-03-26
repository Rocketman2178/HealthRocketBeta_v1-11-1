/*
  # Add Strava 100-Mile Contest

  1. New Contest
    - 100-mile running/walking challenge
    - 30-day duration
    - Strava integration required
    - $75 entry fee
    - Minimum 8 players
*/

-- Insert Strava 100-Mile Contest
INSERT INTO public.contests (
  challenge_id,
  entry_fee,
  min_players,
  max_players,
  start_date,
  registration_end_date,
  prize_pool,
  status,
  is_free,
  health_category
) VALUES (
  'tc2',
  75.00,
  8,
  null,
  '2025-04-15 04:00:00+00', -- 12:00 AM EDT = 4:00 AM UTC
  '2025-04-14 03:59:59+00', -- 11:59 PM EDT = 3:59 AM UTC
  0.00, -- Will be calculated based on registrations
  'pending',
  false,
  'Exercise'
);