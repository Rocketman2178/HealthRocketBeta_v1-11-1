/*
  # Update Clay's Plan to Preview Access

  1. Changes
    - Update plan for clay@healthrocket.life to Preview Access
*/

-- Update specific user's plan
UPDATE public.users
SET plan = 'Preview Access'
WHERE email = 'clay@healthrocket.life';