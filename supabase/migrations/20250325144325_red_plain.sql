/*
  # Update Community Name

  1. Changes
    - Update community name from "Business Network 1" to "Business Network International"
*/

-- Update community name
UPDATE public.communities 
SET name = 'Business Network International',
    updated_at = now()
WHERE name = 'Business Network 1';