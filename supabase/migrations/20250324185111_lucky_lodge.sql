/*
  # Update User Plans to Preview Access

  1. Changes
    - Set default plan for new users to Preview Access
    - Update all existing users to Preview Access plan
    
  2. Security
    - Maintain existing RLS policies
*/

-- Update all existing users to Preview Access
UPDATE public.users
SET plan = 'Preview Access'
WHERE plan != 'Preview Access';

-- Set default value for plan column to Preview Access
ALTER TABLE public.users 
ALTER COLUMN plan SET DEFAULT 'Preview Access';

-- Add trigger to ensure new users get Preview Access plan
CREATE OR REPLACE FUNCTION set_default_plan()
RETURNS trigger AS $$
BEGIN
  NEW.plan := 'Preview Access';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_default_plan ON public.users;
CREATE TRIGGER ensure_default_plan
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION set_default_plan();