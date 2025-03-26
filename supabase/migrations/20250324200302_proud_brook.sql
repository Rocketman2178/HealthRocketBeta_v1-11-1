/*
  # Fix Contest Registration Flow

  1. Changes
    - Add function to get single contest by ID
    - Add function to register for contest
    - Add better error handling
    - Fix contest lookup queries
*/

-- Create function to get single contest
CREATE OR REPLACE FUNCTION get_contest_by_id(
  p_challenge_id text
)
RETURNS TABLE (
  id uuid,
  challenge_id text,
  entry_fee numeric,
  min_players integer,
  max_players integer,
  start_date timestamptz,
  registration_end_date timestamptz,
  prize_pool numeric,
  status text,
  is_free boolean,
  health_category text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM contests c
  WHERE c.challenge_id = p_challenge_id
  AND c.status = 'pending'
  AND c.registration_end_date > now()
  ORDER BY c.start_date ASC
  LIMIT 1;
END;
$$;

-- Create function to register for contest
CREATE OR REPLACE FUNCTION register_for_contest(
  p_user_id uuid,
  p_contest_id uuid,
  p_payment_status text DEFAULT 'pending'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_contest_id uuid;
  v_registration_id uuid;
BEGIN
  -- Verify contest exists and is open
  SELECT id INTO v_contest_id
  FROM contests
  WHERE id = p_contest_id
  AND status = 'pending'
  AND registration_end_date > now();

  IF v_contest_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Contest not found or registration closed'
    );
  END IF;

  -- Create registration
  INSERT INTO contest_registrations (
    contest_id,
    user_id,
    payment_status
  ) VALUES (
    v_contest_id,
    p_user_id,
    p_payment_status
  )
  RETURNING id INTO v_registration_id;

  RETURN jsonb_build_object(
    'success', true,
    'registration_id', v_registration_id
  );
END;
$$;