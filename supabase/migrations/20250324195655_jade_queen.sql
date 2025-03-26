/*
  # Add Contest Credits System
  
  1. New Fields
    - Add contest_credits to users table
    - Default 2 credits for Preview Access users
    
  2. Changes
    - Add function to handle credit usage
    - Add function to check credit availability
*/

-- Add contest_credits column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS contest_credits INTEGER DEFAULT 2;

-- Update existing Preview Access users to have 2 credits
UPDATE public.users
SET contest_credits = 2
WHERE plan = 'Preview Access'
AND contest_credits IS NULL;

-- Create function to check credit availability
CREATE OR REPLACE FUNCTION check_contest_credits(
  p_user_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_credits integer;
  v_plan text;
BEGIN
  -- Get user's credits and plan
  SELECT contest_credits, plan INTO v_credits, v_plan
  FROM users
  WHERE id = p_user_id;

  RETURN jsonb_build_object(
    'has_credits', v_credits > 0,
    'credits_remaining', v_credits,
    'is_preview', v_plan = 'Preview Access'
  );
END;
$$;

-- Create function to use contest credit
CREATE OR REPLACE FUNCTION use_contest_credit(
  p_user_id uuid,
  p_contest_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_credits integer;
  v_plan text;
BEGIN
  -- Get user's current credits and plan
  SELECT contest_credits, plan INTO v_credits, v_plan
  FROM users
  WHERE id = p_user_id;

  -- Verify credits available
  IF v_plan = 'Preview Access' AND v_credits <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No contest credits remaining'
    );
  END IF;

  -- Use credit for Preview Access users
  IF v_plan = 'Preview Access' THEN
    UPDATE users
    SET contest_credits = contest_credits - 1
    WHERE id = p_user_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'credits_remaining', v_credits - 1
  );
END;
$$;