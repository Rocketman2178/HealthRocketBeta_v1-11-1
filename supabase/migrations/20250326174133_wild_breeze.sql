/*
  # Add Completed Recommendations Tracking

  1. New Table
    - completed_recommendations: Track which recommendations users have completed
    
  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Create completed recommendations table
CREATE TABLE IF NOT EXISTS public.completed_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_id text NOT NULL,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recommendation_id)
);

-- Enable RLS
ALTER TABLE public.completed_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own completed recommendations"
  ON public.completed_recommendations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completed recommendations"
  ON public.completed_recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);