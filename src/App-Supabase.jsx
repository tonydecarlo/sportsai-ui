import React, { useState, useEffect } from 'react';
import { fetchPredictions, fetchFilteredPredictions } from './services/supabase';
import PredictionCard from './components/PredictionCard';
import FilterBar from './components/FilterBar';
import StatsOverview from './components/StatsOverview';
import './App.css';

function App() {
  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    confidence: 'all',
    risk: 'all',
    search: ''
  });

  useEffect(() => {
    loadPredictions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [predictions, filters]);

  const loadPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPredictions();
      setPredictions(data || []);
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setError('Failed to load predictions. Please check your database connection.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...predictions];

    // Confidence filter
    if (filters.confidence !== 'all') {
      const minConfidence = parseInt(filters.confidence);
      filtered = filtered.filter(p => p.confidence_score >= minConfidence);
    }

    // Risk filter
    if (filters.risk !== 'all') {
      filtered = filtered.filter(p => p.risk_level === filters.risk);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.winner_prediction?.toLowerCase().includes(searchLower) ||
        p.reasoning?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredPredictions(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading NFL Predictions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={loadPredictions} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">🏈</div>
            <div>
              <h1>NFL Betting Predictions</h1>
              <p className="tagline">AI-Powered Analysis & Insights</p>
            </div>
          </div>
          <button onClick={loadPredictions} className="refresh-button">
            🔄 Refresh
          </button>
        </div>
      </header>

      <main className="main-content">
        <StatsOverview predictions={predictions} />
        
        <FilterBar 
          filters={filters} 
          onFilterChange={handleFilterChange}
          totalCount={predictions.length}
          filteredCount={filteredPredictions.length}
        />

        {filteredPredictions.length === 0 ? (
          <div className="no-results">
            <p>No predictions match your filters</p>
          </div>
        ) : (
          <div className="predictions-grid">
            {filteredPredictions.map((prediction, index) => (
              <PredictionCard key={prediction.id || index} prediction={prediction} />
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 NFL Betting Predictions | AI-Powered Insights</p>
        <p className="disclaimer">⚠️ Gambling disclaimer: Please bet responsibly. Predictions are for informational purposes only.</p>
      </footer>
    </div>
  );
}

export default App;

