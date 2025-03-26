/*
  # Fix Contest Credit Registration

  1. Changes
    - Add function to check contest eligibility
    - Add function to register with credits
    - Add function to validate device requirements
    - Add proper error handling
*/

-- Create function to check contest eligibility
CREATE OR REPLACE FUNCTION check_contest_eligibility(
  p_user_id uuid,
  p_challenge_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_contest record;
  v_credits integer;
  v_plan text;
  v_device_connected boolean;
BEGIN
  -- Get contest details
  SELECT * INTO v_contest
  FROM contests
  WHERE challenge_id = p_challenge_id
  AND status = 'pending'
  AND registration_end_date > now()
  ORDER BY start_date ASC
  LIMIT 1;

  IF v_contest IS NULL THEN
    RETURN jsonb_build_object(
      'eligible', false,
      'error', 'Contest not found or registration closed'
    );
  END IF;

  -- Get user's credits and plan
  SELECT contest_credits, plan INTO v_credits, v_plan
  FROM users
  WHERE id = p_user_id;

  -- Check if required device is connected
  SELECT EXISTS (
    SELECT 1 
    FROM user_devices 
    WHERE user_id = p_user_id 
    AND status = 'active'
    AND provider = CASE 
      WHEN p_challenge_id = 'tc1' THEN 'oura'
      WHEN p_challenge_id = 'tc2' THEN 'strava'
      ELSE NULL
    END
  ) INTO v_device_connected;

  -- Build response
  RETURN jsonb_build_object(
    'eligible', true,
    'contest_id', v_contest.id,
    'entry_fee', v_contest.entry_fee,
    'has_credits', v_plan = 'Preview Access' AND v_credits > 0,
    'credits_remaining', v_credits,
    'is_preview', v_plan = 'Preview Access',
    'device_connected', v_device_connected,
    'required_device', CASE 
      WHEN p_challenge_id = 'tc1' THEN 'Oura Ring'
      WHEN p_challenge_id = 'tc2' THEN 'Strava'
      ELSE NULL
    END
  );
END;
$$;

-- Update register_contest_with_credits to check device requirements
CREATE OR REPLACE FUNCTION register_contest_with_credits(
  p_user_id uuid,
  p_challenge_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_eligibility jsonb;
  v_registration_id uuid;
BEGIN
  -- Check eligibility first
  SELECT check_contest_eligibility(p_user_id, p_challenge_id) INTO v_eligibility;

  -- Validate eligibility
  IF NOT (v_eligibility->>'eligible')::boolean THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', v_eligibility->>'error'
    );
  END IF;

  -- Verify credits and device
  IF NOT (v_eligibility->>'has_credits')::boolean THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No contest credits available'
    );
  END IF;

  IF NOT (v_eligibility->>'device_connected')::boolean THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Required device not connected: ' || (v_eligibility->>'required_device')
    );
  END IF;

  -- Use credit and create registration
  UPDATE users
  SET contest_credits = contest_credits - 1
  WHERE id = p_user_id;

  -- Create registration with paid status
  INSERT INTO contest_registrations (
    contest_id,
    user_id,
    payment_status,
    registered_at,
    paid_at
  ) VALUES (
    (v_eligibility->>'contest_id')::uuid,
    p_user_id,
    'paid',
    now(),
    now()
  )
  RETURNING id INTO v_registration_id;

  -- Create challenge entry
  INSERT INTO challenges (
    user_id,
    challenge_id,
    status,
    progress,
    started_at,
    verification_requirements
  ) VALUES (
    p_user_id,
    p_challenge_id,
    'registered',
    0,
    NULL,
    jsonb_build_object(
      'week1', jsonb_build_object('required', 1, 'completed', 0, 'deadline', NULL),
      'week2', jsonb_build_object('required', 1, 'completed', 0, 'deadline', NULL),
      'week3', jsonb_build_object('required', 1, 'completed', 0, 'deadline', NULL),
      'week4', jsonb_build_object('required', 1, 'completed', 0, 'deadline', NULL)
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'registration_id', v_registration_id,
    'credits_used', true,
    'credits_remaining', (v_eligibility->>'credits_remaining')::integer - 1
  );
END;
$$;