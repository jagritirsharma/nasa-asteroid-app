import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './App.css';

const App = () => {
  const [asteroidId, setAsteroidId] = useState('');
  const [asteroidData, setAsteroidData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY;

  const fetchAsteroidById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${NASA_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch asteroid data');
      const data = await response.json();
      setAsteroidData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomAsteroid = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${NASA_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch asteroid list');
      const data = await response.json();
      const randomAsteroid = data.near_earth_objects[
        Math.floor(Math.random() * data.near_earth_objects.length)
      ];
      await fetchAsteroidById(randomAsteroid.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (asteroidId) {
      fetchAsteroidById(asteroidId);
    }
  };

  return (
    <div className="app-container">
      <div className="stars-container">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i} 
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="content-wrapper"
      >
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="main-title"
        >
          Asteroid Explorer
        </motion.h1>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                value={asteroidId}
                onChange={(e) => setAsteroidId(e.target.value)}
                placeholder="Enter Asteroid ID"
                className="search-input"
              />
              <button
                type="submit"
                disabled={!asteroidId || loading}
                className="submit-button"
              >
                {loading ? <div className="loader"></div> : 'Search'}
              </button>
            </div>

            <button
              type="button"
              onClick={fetchRandomAsteroid}
              disabled={loading}
              className="random-button"
            >
              Get Random Asteroid
            </button>
          </form>

          {error && (
            <div className="error-message">{error}</div>
          )}

          {asteroidData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="asteroid-info"
            >
              <div className="info-grid">
                <div className="info-label">Name:</div>
                <div>{asteroidData.name}</div>
                
                <div className="info-label">NASA JPL URL:</div>
                <div className="url-cell">
                  <a 
                    href={asteroidData.nasa_jpl_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="info-link"
                  >
                    {asteroidData.nasa_jpl_url}
                  </a>
                </div>
                
                <div className="info-label">Potentially Hazardous:</div>
                <div>
                  {asteroidData.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default App;