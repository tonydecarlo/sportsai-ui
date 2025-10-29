import React from 'react';
import './StatsOverview.css';

const StatsOverview = ({ predictions }) => {
  const calculateStats = () => {
    if (!predictions || predictions.length === 0) {
      return {
        total: 0,
        avgConfidence: null,
        highConfidence: 0,
        lowRisk: 0
      };
    }

    const total = predictions.length;
    
    // Filter and parse confidence scores, handling null/undefined/string values
    const validConfidenceScores = predictions
      .map(p => {
        const score = p.confidence_score;
        // Handle null, undefined, empty string, or NaN
        if (score === null || score === undefined || score === '' || isNaN(score)) {
          return null;
        }
        // Parse string to number if needed
        const numScore = typeof score === 'string' ? parseFloat(score) : Number(score);
        return isNaN(numScore) ? null : numScore;
      })
      .filter(score => score !== null && score !== undefined && !isNaN(score));
    
    // Calculate average confidence
    let avgConfidence = null; // Use null to indicate "no data"
    if (validConfidenceScores.length > 0) {
      const sum = validConfidenceScores.reduce((acc, score) => acc + score, 0);
      avgConfidence = Math.round(sum / validConfidenceScores.length);
    }
    
    // Count high confidence (>= 75)
    const highConfidence = predictions.filter(p => {
      const score = parseFloat(p.confidence_score);
      return !isNaN(score) && score >= 75;
    }).length;
    
    // Count low risk
    const lowRisk = predictions.filter(p => p.risk_level === 'low').length;

    return { total, avgConfidence, highConfidence, lowRisk };
  };

  const stats = calculateStats();

  return (
    <div className="stats-overview">
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Predictions</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🎯</div>
        <div className="stat-content">
          <div className="stat-value">
            {stats.avgConfidence === null || isNaN(stats.avgConfidence) ? 'N/A' : `${stats.avgConfidence}%`}
          </div>
          <div className="stat-label">Avg Confidence</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">⭐</div>
        <div className="stat-content">
          <div className="stat-value">{stats.highConfidence}</div>
          <div className="stat-label">High Confidence</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🛡️</div>
        <div className="stat-content">
          <div className="stat-value">{stats.lowRisk}</div>
          <div className="stat-label">Low Risk Picks</div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;


