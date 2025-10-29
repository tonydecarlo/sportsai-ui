import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// This uses Supabase's built-in API, so credentials are safe
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Public key, safe for client

const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch all predictions
export async function fetchPredictions() {
  const { data, error } = await supabase
    .from('predictions')
    .select(`
      *,
      games (
        home_team_name,
        away_team_name,
        game_date,
        week,
        season,
        venue
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

// Fetch single prediction
export async function fetchPrediction(id) {
  const { data, error } = await supabase
    .from('predictions')
    .select(`
      *,
      games (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Fetch predictions with filters
export async function fetchFilteredPredictions(filters) {
  let query = supabase
    .from('predictions')
    .select(`
      *,
      games (*)
    `);

  if (filters.confidence_min) {
    query = query.gte('confidence_score', filters.confidence_min);
  }

  if (filters.risk_level && filters.risk_level !== 'all') {
    query = query.eq('risk_level', filters.risk_level);
  }

  if (filters.game_id) {
    query = query.eq('game_id', filters.game_id);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

// Fetch statistics
export async function fetchStats() {
  const { data, error } = await supabase
    .from('predictions')
    .select('confidence_score, risk_level');

  if (error) {
    throw error;
  }

  const stats = {
    total_predictions: data.length,
    avg_confidence: data.length > 0 
      ? Math.round(data.reduce((sum, p) => sum + (p.confidence_score || 0), 0) / data.length)
      : 0,
    high_confidence_count: data.filter(p => p.confidence_score >= 75).length,
    low_risk_count: data.filter(p => p.risk_level === 'low').length
  };

  return stats;
}

export default supabase;

