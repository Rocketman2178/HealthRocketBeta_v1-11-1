/*
  # Add Oura Sleep Challenge

  1. Changes
    - Add Oura Sleep Challenge with April 15th start date
    - Set entry fee and prize pool configuration
    - Configure player limits and registration window
*/

-- Delete existing tc1 contest if it exists
DELETE FROM public.contests 
WHERE challenge_id = 'tc1';

-- Insert Oura Sleep Challenge
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
  'tc1',
  75.00,
  8,
  null,
  '2024-04-15 04:00:00+00', -- 12:00 AM EDT = 4:00 AM UTC
  '2024-04-14 03:59:59+00', -- 11:59 PM EDT = 3:59 AM UTC
  0.00, -- Will be calculated based on registrations
  'pending',
  false,
  'Sleep'
);