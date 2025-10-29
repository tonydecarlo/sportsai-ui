import React from 'react';
import './PredictionCard.css';

const PredictionCard = ({ prediction }) => {
  const {
    game_id,
    winner_prediction,
    spread_pick,
    total_pick,
    confidence_score,
    risk_level,
    reasoning,
    recommended_bet,
    key_factors,
    created_at
  } = prediction;

  const getConfidenceColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getRiskBadgeClass = (risk) => {
    return `risk-badge risk-${risk?.toLowerCase() || 'medium'}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseKeyFactors = (factors) => {
    if (!factors) return [];
    if (Array.isArray(factors)) return factors;
    if (typeof factors === 'string') {
      return factors.split(';').map(f => f.trim()).filter(f => f);
    }
    return [];
  };

  const keyFactorsArray = parseKeyFactors(key_factors);

  return (
    <div className="prediction-card">
      <div className="card-header">
        <div className="winner-section">
          <h3 className="winner-name">{winner_prediction || 'TBD'}</h3>
          <span className="game-id">Game #{game_id}</span>
        </div>
        <div className="confidence-badge" style={{ backgroundColor: getConfidenceColor(confidence_score) }}>
          <span className="confidence-score">{confidence_score}%</span>
          <span className="confidence-label">Confidence</span>
        </div>
      </div>

      <div className="picks-row">
        <div className="pick-item">
          <span className="pick-label">Spread</span>
          <span className="pick-value">{spread_pick || 'N/A'}</span>
        </div>
        <div className="pick-item">
          <span className="pick-label">Total</span>
          <span className="pick-value">{total_pick || 'N/A'}</span>
        </div>
        <div className="pick-item">
          <span className={getRiskBadgeClass(risk_level)}>{risk_level || 'Medium'}</span>
        </div>
      </div>

      {reasoning && (
        <div className="reasoning-section">
          <h4>Analysis</h4>
          <p className="reasoning-text">{reasoning}</p>
        </div>
      )}

      {keyFactorsArray.length > 0 && (
        <div className="key-factors-section">
          <h4>Key Factors</h4>
          <ul className="key-factors-list">
            {keyFactorsArray.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>
      )}

      {recommended_bet && (
        <div className="recommended-bet-section">
          <h4>💰 Recommended Bet</h4>
          <p className="recommended-bet-text">{recommended_bet}</p>
        </div>
      )}

      <div className="card-footer">
        <span className="timestamp">Generated: {formatDate(created_at)}</span>
      </div>
    </div>
  );
};

export default PredictionCard;


