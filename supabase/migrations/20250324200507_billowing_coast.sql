/*
  # Fix Contest Registration System

  1. Changes
    - Add function to handle contest registration with credits
    - Add better validation for contest registration
    - Fix credit usage tracking
*/

-- Create function to handle contest registration with credits
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
  v_contest record;
  v_credits integer;
  v_plan text;
  v_registration_id uuid;
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
      'success', false,
      'error', 'Contest not found or registration closed'
    );
  END IF;

  -- Get user's credits and plan
  SELECT contest_credits, plan INTO v_credits, v_plan
  FROM users
  WHERE id = p_user_id;

  -- Check if user can use credits
  IF v_plan = 'Preview Access' AND v_credits > 0 THEN
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
      v_contest.id,
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
      'active',
      0,
      v_contest.start_date,
      jsonb_build_object(
        'week1', jsonb_build_object('required', 1, 'completed', 0, 'deadline', v_contest.start_date + interval '7 days'),
        'week2', jsonb_build_object('required', 1, 'completed', 0, 'deadline', v_contest.start_date + interval '14 days'),
        'week3', jsonb_build_object('required', 1, 'completed', 0, 'deadline', v_contest.start_date + interval '21 days'),
        'week4', jsonb_build_object('required', 1, 'completed', 0, 'deadline', v_contest.start_date + interval '28 days')
      )
    );

    RETURN jsonb_build_object(
      'success', true,
      'registration_id', v_registration_id,
      'credits_used', true,
      'credits_remaining', v_credits - 1
    );
  END IF;

  -- If no credits available or not Preview Access, return error
  RETURN jsonb_build_object(
    'success', false,
    'error', 'No contest credits available'
  );
END;
$$;