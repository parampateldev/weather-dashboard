import { useEffect, useState, useRef } from 'react'
import './App.css'

function WeatherIcon({ code, size = '2rem' }) {
  const icons = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌦️', 55: '🌦️', 61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '❄️', 73: '❄️', 75: '❄️', 77: '❄️', 80: '🌦️', 81: '🌧️', 82: '🌧️',
    85: '❄️', 86: '❄️', 95: '⛈️', 96: '⛈️', 99: '⛈️'
  }
  return <span style={{ fontSize: size }}>{icons[code] || '🌤️'}</span>
}

function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  }
  return descriptions[code] || 'Unknown'
}

function DetailedDayView({ day, onClose, unit }) {
  const [hourlyData, setHourlyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeFormat, setTimeFormat] = useState('12') // '12' or '24'

  useEffect(() => {
    // Simulate hourly data for demonstration
    const generateHourlyData = () => {
      const hours = []
      for (let i = 0; i < 24; i++) {
        hours.push({
          time: `${i.toString().padStart(2, '0')}:00`,
          temp: Math.round(day.max - (Math.random() * 10)),
          humidity: Math.round(40 + Math.random() * 40),
          precipitation: Math.round(Math.random() * 5),
          windSpeed: Math.round(Math.random() * 20),
          feelsLike: Math.round(day.max - (Math.random() * 8)),
          weatherCode: day.code
        })
      }
      return hours
    }

    setTimeout(() => {
      setHourlyData(generateHourlyData())
      setLoading(false)
    }, 500)
  }, [day])

  function displayTemp(temp) {
    return unit === 'celsius' ? `${temp}°C` : `${Math.round((temp * 9/5) + 32)}°F`
  }

  function formatTime(hour) {
    const hourNum = parseInt(hour)
    if (timeFormat === '24') {
      return `${hourNum.toString().padStart(2, '0')}:00`
    } else {
      const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum
      const ampm = hourNum < 12 ? 'AM' : 'PM'
      return `${displayHour}:00 ${ampm}`
    }
  }

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <div>Loading detailed forecast...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '2rem',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingRight: '3rem' }}>
            <h2 style={{ margin: '0', fontSize: '2rem' }}>
              {new Date(day.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '0.5rem', 
              borderRadius: '0.75rem',
              display: 'flex',
              gap: '0.25rem',
              marginLeft: '3rem'
            }}>
              <button
                onClick={() => setTimeFormat('12')}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  background: timeFormat === '12' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  color: 'white',
                  fontWeight: timeFormat === '12' ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                12H
              </button>
              <button
                onClick={() => setTimeFormat('24')}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  background: timeFormat === '24' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  color: 'white',
                  fontWeight: timeFormat === '24' ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                24H
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <WeatherIcon code={day.code} size="3rem" />
            <div>
              <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                {getWeatherDescription(day.code)}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                {displayTemp(day.max)} / {displayTemp(day.min)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>🌡️ Temperature</h4>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              High: {displayTemp(day.max)}<br/>
              Low: {displayTemp(day.min)}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>💧 Humidity</h4>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              Average: {Math.round(hourlyData.reduce((sum, h) => sum + h.humidity, 0) / hourlyData.length)}%
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>🌧️ Precipitation</h4>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              Max: {Math.max(...hourlyData.map(h => h.precipitation))}mm
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>💨 Wind</h4>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              Max: {Math.max(...hourlyData.map(h => h.windSpeed))} km/h
            </div>
          </div>
        </div>


        <h3 style={{ marginBottom: '1rem' }}>24-Hour Forecast</h3>
        
        {/* Group hours into 6-hour periods */}
        {[0, 6, 12, 18].map((startHour, groupIndex) => {
          const groupHours = hourlyData.slice(startHour, startHour + 6)
          const periodNames = ['Early Morning', 'Morning', 'Afternoon', 'Evening']
          
          return (
            <div key={groupIndex} style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                marginBottom: '0.75rem', 
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center'
              }}>
                {periodNames[groupIndex]} ({formatTime(startHour)} - {formatTime(startHour + 5)})
              </h4>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(6, 1fr)', 
                gap: '0.5rem',
                background: 'rgba(255,255,255,0.05)',
                padding: '1rem',
                borderRadius: '1rem'
              }}>
                {groupHours.map((hour, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '0.75rem 0.5rem',
                    borderRadius: '0.75rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.7rem' }}>
                      {formatTime(hour.time.split(':')[0])}
                    </div>
                    <WeatherIcon code={hour.weatherCode} size="1.2rem" />
                    <div style={{ marginTop: '0.25rem', fontWeight: '600' }}>{displayTemp(hour.temp)}</div>
                    <div style={{ opacity: 0.7, fontSize: '0.6rem', marginTop: '0.25rem' }}>
                      <div>💧{hour.humidity}%</div>
                      <div>🌧️{hour.precipitation}mm</div>
                      <div>💨{hour.windSpeed}km/h</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function App() {
  const [location, setLocation] = useState('')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [unit, setUnit] = useState('celsius')
  const [searchHistory, setSearchHistory] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  function formatLocation(geoResult) {
    const { name, admin1, admin2, country } = geoResult
    if (admin1 && country === 'United States') {
      return `${name}, ${admin1}, ${country}`
    }
    if (admin1 && admin2) {
      return `${name}, ${admin1}, ${country}`
    }
    if (admin1) {
      return `${name}, ${admin1}, ${country}`
    }
    return `${name}, ${country}`
  }

  function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32)
  }

  function displayTemp(temp) {
    return unit === 'celsius' ? `${temp}°C` : `${celsiusToFahrenheit(temp)}°F`
  }

  async function fetchSuggestions(query) {
    if (query.length < 2) {
      setSuggestions([])
      return
    }
    
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`)
      const data = await res.json()
      setSuggestions(data.results || [])
    } catch (err) {
      console.error('Error fetching suggestions:', err)
    }
  }

  async function fetchWeather(query) {
    setLoading(true)
    setError('')
    try {
      // Clean the query
      const cleanQuery = query.trim()
      console.log('Searching for:', cleanQuery)
      
      // Try multiple search strategies
      let geoData = null
      let searchQuery = cleanQuery
      
      // Strategy 1: Try the full query
      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=50&language=en&format=json`)
        geoData = await geoRes.json()
        console.log('Strategy 1 - Full query results:', geoData.results?.length || 0)
      } catch (err) {
        console.log('Strategy 1 failed:', err)
      }
      
      // Strategy 2: If no results or we want to be more specific, try just the city name
      if (!geoData?.results || geoData.results.length === 0) {
        const cityName = cleanQuery.split(',')[0].trim()
        if (cityName !== searchQuery) {
          try {
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=50&language=en&format=json`)
            geoData = await geoRes.json()
            console.log('Strategy 2 - City name results:', geoData.results?.length || 0)
          } catch (err) {
            console.log('Strategy 2 failed:', err)
          }
        }
      }
      
      console.log('Final API Response:', geoData)
      console.log('Number of results:', geoData?.results?.length || 0)
      
      if (!geoData?.results || geoData.results.length === 0) {
        throw new Error(`Location "${query}" not found. Please try "City, State, Country" format (e.g., "Canton, Michigan, United States").`)
      }
      
      // Log first few results for debugging
      console.log('First 5 results:', geoData.results.slice(0, 5).map(r => ({
        name: r.name,
        admin1: r.admin1,
        country: r.country,
        formatted: formatLocation(r)
      })))
      
      // Try to find a better match if we have multiple results
      let bestMatch = geoData.results[0]
      
      // If the query contains state/country info, try to find a better match
      if (cleanQuery.includes(',')) {
        const queryLower = cleanQuery.toLowerCase()
        const betterMatch = geoData.results.find(result => {
          const locationName = formatLocation(result).toLowerCase()
          return locationName.includes(queryLower) || queryLower.includes(locationName)
        })
        if (betterMatch) {
          bestMatch = betterMatch
          console.log('Found better match:', formatLocation(bestMatch))
        }
      }
      
      console.log('Using result from API:', formatLocation(bestMatch))
      
      const { latitude, longitude, timezone } = bestMatch
      const locationName = formatLocation(bestMatch)
      console.log('Selected location:', locationName)
      
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        throw new Error(`Invalid coordinates for location: ${locationName}`)
      }
      
      // Get current weather and forecast with timezone
      console.log('Fetching weather for:', latitude, longitude, timezone)
      
      // Use a simplified weather API request without the problematic time parameter
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      console.log('Weather API URL:', weatherUrl)
      
      const weatherRes = await fetch(weatherUrl)
      
      if (!weatherRes.ok) {
        const errorText = await weatherRes.text()
        console.error('Weather API error response:', errorText)
        throw new Error(`Weather API error: ${weatherRes.status} ${weatherRes.statusText}. ${errorText}`)
      }
      
      const weatherData = await weatherRes.json()
      console.log('Weather data received:', weatherData)
      
      setWeather({
        location: locationName,
        temp: Math.round(weatherData.current.temperature_2m),
        humidity: weatherData.current.relative_humidity_2m,
        code: weatherData.current.weather_code,
        timezone: timezone,
        currentTime: new Date().toISOString()
      })
      
      setForecast(weatherData.daily.time.slice(1, 6).map((date, i) => ({
        date,
        code: weatherData.daily.weather_code[i + 1],
        max: Math.round(weatherData.daily.temperature_2m_max[i + 1]),
        min: Math.round(weatherData.daily.temperature_2m_min[i + 1])
      })))

      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [locationName, ...prev.filter(item => item !== locationName)].slice(0, 5)
        localStorage.setItem('weatherSearchHistory', JSON.stringify(newHistory))
        return newHistory
      })
    } catch (err) {
      console.error('Weather fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (location.trim()) {
      fetchWeather(location.trim())
      setShowSuggestions(false)
    }
  }

  function handleSuggestionClick(suggestion) {
    const locationName = formatLocation(suggestion)
    setLocation(locationName)
    fetchWeather(locationName)
    setShowSuggestions(false)
  }

  function handleInputChange(e) {
    const value = e.target.value
    setLocation(value)
    fetchSuggestions(value)
    setShowSuggestions(true)
  }

  function getDayName(date, index) {
    const today = new Date()
    const targetDate = new Date(date)
    
    // Reset time to start of day for accurate comparison
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const targetStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
    
    const diffTime = targetStart - todayStart
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    
    return targetDate.toLocaleDateString('en-US', { weekday: 'long' })
  }

  useEffect(() => {
    const savedHistory = localStorage.getItem('weatherSearchHistory')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div style={{ 
      height: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 25%, #00b894 50%, #00cec9 75%, #6c5ce7 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        
        #root {
          height: 100vh;
          width: 100vw;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        
        input::placeholder {
          color: #636e72 !important;
          opacity: 0.8;
        }
        
        /* Custom scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.5);
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .weather-container {
            padding: 1rem !important;
          }
          
          .weather-header h1 {
            font-size: 2.5rem !important;
          }
          
          .weather-search {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          
          .weather-search input {
            font-size: 1rem !important;
            padding: 1rem 1.5rem !important;
          }
          
          .weather-search button {
            width: 100% !important;
            padding: 1rem 2rem !important;
          }
          
          .weather-current {
            padding: 2rem !important;
          }
          
          .weather-current h2 {
            font-size: 1.8rem !important;
          }
          
          .weather-current .temp-display {
            font-size: 4rem !important;
          }
          
          .weather-forecast {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          
          .weather-forecast-card {
            padding: 1.5rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .weather-header h1 {
            font-size: 2rem !important;
          }
          
          .weather-current {
            padding: 1.5rem !important;
          }
          
          .weather-current h2 {
            font-size: 1.5rem !important;
          }
          
          .weather-current .temp-display {
            font-size: 3.5rem !important;
          }
        }
      `}</style>
      
      <div style={{ 
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        <div className="weather-container" style={{ 
          maxWidth: 1000, 
          margin: '0 auto', 
          padding: '2rem 1rem',
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
        <div className="weather-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            position: 'relative',
            display: 'inline-block',
            marginBottom: '1rem'
          }}>
            <h1 className="weather-header h1" style={{ 
              fontSize: '3.5rem', 
              fontWeight: '900', 
              margin: '0',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 8px 16px rgba(0,0,0,0.2)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              🌤️ Weather Dashboard
            </h1>
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              right: '-10px',
              bottom: '-10px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              borderRadius: '2rem',
              filter: 'blur(20px)',
              zIndex: -1
            }} />
          </div>
          <p style={{ 
            color: 'rgba(255,255,255,0.95)', 
            fontSize: '1.3rem', 
            fontWeight: '400',
            margin: '0',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '0.01em'
          }}>
            Discover weather conditions anywhere in the world ✨
          </p>
        </div>
        
        <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
          <form className="weather-search" onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
            <div style={{ flex: 1, position: 'relative' }}>
                  <div style={{
                    position: 'relative',
                    background: 'white',
                    borderRadius: '1.5rem',
                    padding: '0.5rem',
                    border: '1px solid rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                  }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={location}
                  onChange={handleInputChange}
                  placeholder="Search for any city worldwide..."
                  style={{ 
                    width: '100%',
                    padding: '1.5rem 2rem', 
                    border: 'none', 
                    borderRadius: '1rem',
                    fontSize: '1.2rem',
                    outline: 'none',
                    background: 'white',
                    color: '#2d3436',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    fontWeight: '500'
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                <div style={{
                  position: 'absolute',
                  right: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.2rem',
                  opacity: 0.7,
                  color: '#636e72'
                }}>
                  🔍
                </div>
              </div>
              
              {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
                <div 
                  ref={suggestionsRef}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    borderRadius: '1rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    maxHeight: '300px',
                    overflowY: 'auto',
                    marginTop: '0.5rem',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {suggestions.length > 0 && (
                    <>
                      <div style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#6c757d', borderBottom: '1px solid rgba(0,0,0,0.1)', fontWeight: '600' }}>
                        🔍 Suggestions
                      </div>
                      {suggestions.map((suggestion, i) => (
                        <div
                          key={i}
                          onClick={() => handleSuggestionClick(suggestion)}
                          style={{
                            padding: '1.25rem 1.5rem',
                            cursor: 'pointer',
                            borderBottom: i < suggestions.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(0,0,0,0.05)'
                            e.target.style.transform = 'translateX(4px)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent'
                            e.target.style.transform = 'translateX(0)'
                          }}
                        >
                          <span style={{ fontSize: '1.3rem', marginTop: '0.25rem' }}>📍</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontWeight: '700', 
                              color: '#2d3436',
                              fontSize: '1.1rem',
                              marginBottom: '0.25rem'
                            }}>
                              {suggestion.name}
                            </div>
                            <div style={{ 
                              fontSize: '0.95rem', 
                              color: '#636e72',
                              fontWeight: '500'
                            }}>
                              {formatLocation(suggestion)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  
                  {searchHistory.length > 0 && suggestions.length === 0 && (
                    <>
                      <div style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#6c757d', borderBottom: '1px solid rgba(0,0,0,0.1)', fontWeight: '600' }}>
                        🕒 Recent searches
                      </div>
                      {searchHistory.map((item, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setLocation(item)
                            fetchWeather(item)
                            setShowSuggestions(false)
                          }}
                          style={{
                            padding: '1rem 1.25rem',
                            cursor: 'pointer',
                            borderBottom: i < searchHistory.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(116, 185, 255, 0.1)'
                            e.target.style.transform = 'translateX(4px)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent'
                            e.target.style.transform = 'translateX(0)'
                          }}
                        >
                          <span style={{ fontSize: '1.2rem' }}>🕒</span>
                          <div style={{ fontWeight: '600', color: '#2d3436' }}>{item}</div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              style={{ 
                padding: '1.5rem 2.5rem', 
                background: loading 
                  ? 'rgba(255,255,255,0.5)' 
                  : 'white', 
                color: '#2d3436', 
                border: '1px solid rgba(0,0,0,0.1)', 
                borderRadius: '1.5rem',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '160px',
                boxShadow: loading 
                  ? '0 4px 16px rgba(0,0,0,0.1)' 
                  : '0 12px 40px rgba(0,0,0,0.15)',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)'
                  e.target.style.boxShadow = '0 16px 50px rgba(0,0,0,0.2)'
                  e.target.style.background = 'rgba(248,249,250,1)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0) scale(1)'
                  e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)'
                  e.target.style.background = 'white'
                }
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Loading...
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🔍 Search
                </div>
              )}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.15)', 
            padding: '0.75rem', 
            borderRadius: '1rem',
            display: 'flex',
            gap: '0.5rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <button
              onClick={() => setUnit('celsius')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.75rem',
                background: unit === 'celsius' 
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))' 
                  : 'transparent',
                color: 'white',
                fontWeight: unit === 'celsius' ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: unit === 'celsius' ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                fontSize: '1.1rem',
                minWidth: '60px'
              }}
              onMouseEnter={(e) => {
                if (unit !== 'celsius') {
                  e.target.style.background = 'rgba(255,255,255,0.1)'
                  e.target.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={(e) => {
                if (unit !== 'celsius') {
                  e.target.style.background = 'transparent'
                  e.target.style.transform = 'translateY(0)'
                }
              }}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('fahrenheit')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.75rem',
                background: unit === 'fahrenheit' 
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))' 
                  : 'transparent',
                color: 'white',
                fontWeight: unit === 'fahrenheit' ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: unit === 'fahrenheit' ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                fontSize: '1.1rem',
                minWidth: '60px'
              }}
              onMouseEnter={(e) => {
                if (unit !== 'fahrenheit') {
                  e.target.style.background = 'rgba(255,255,255,0.1)'
                  e.target.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={(e) => {
                if (unit !== 'fahrenheit') {
                  e.target.style.background = 'transparent'
                  e.target.style.transform = 'translateY(0)'
                }
              }}
            >
              °F
            </button>
          </div>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(255,255,255,0.9)', 
            border: 'none', 
            color: '#e74c3c', 
            padding: '1.5rem', 
            borderRadius: '1rem',
            marginBottom: '2rem',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            ⚠️ {error}
          </div>
        )}

        {weather && (
          <div style={{ flex: 1 }}>
            <div className="weather-current" style={{ 
              background: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              padding: '3.5rem', 
              borderRadius: '2.5rem', 
              marginBottom: '3rem',
              boxShadow: '0 32px 64px rgba(0,0,0,0.25)',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.3)',
              animation: 'fadeInUp 0.8s ease-out'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '300px',
                height: '300px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                filter: 'blur(60px)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-30%',
                left: '-10%',
                width: '200px',
                height: '200px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '50%',
                filter: 'blur(40px)'
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <h2 className="weather-current h2" style={{ 
                      margin: '0 0 1rem 0', 
                      fontSize: '2.5rem', 
                      fontWeight: '800',
                      textShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      letterSpacing: '-0.02em'
                    }}>
                      {weather.location}
                    </h2>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      opacity: 0.95, 
                      marginBottom: '1.5rem',
                      fontWeight: '500',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {new Date(weather.currentTime).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      opacity: 0.95,
                      background: 'rgba(255,255,255,0.15)',
                      padding: '1rem 1.5rem',
                      borderRadius: '1.5rem',
                      display: 'inline-block',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      fontWeight: '600',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {getWeatherDescription(weather.code)}
                    </div>
                  </div>
                  <div style={{ 
                    textAlign: 'right',
                    background: 'rgba(255,255,255,0.1)',
                    padding: '1.5rem',
                    borderRadius: '1.5rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    minWidth: '180px'
                  }}>
                    <div style={{ 
                      fontSize: '1.1rem', 
                      opacity: 0.9, 
                      marginBottom: '0.75rem',
                      fontWeight: '600'
                    }}>
                      Feels like {displayTemp(weather.temp)}
                    </div>
                    <div style={{ 
                      fontSize: '1rem', 
                      opacity: 0.8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '0.5rem'
                    }}>
                      💧 {weather.humidity}% humidity
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '3rem',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '2rem',
                  borderRadius: '2rem',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <div style={{ 
                    background: 'rgba(255,255,255,0.15)',
                    padding: '2rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <WeatherIcon code={weather.code} size="6rem" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="temp-display" style={{ 
                      fontSize: '7rem', 
                      fontWeight: '200', 
                      lineHeight: 1, 
                      marginBottom: '1rem',
                      textShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      letterSpacing: '-0.05em'
                    }}>
                      {displayTemp(weather.temp)}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: '2.5rem', 
                      fontSize: '1.2rem', 
                      opacity: 0.95,
                      fontWeight: '500'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(255,255,255,0.1)',
                        padding: '0.75rem 1rem',
                        borderRadius: '1rem',
                        backdropFilter: 'blur(10px)'
                      }}>
                        💧 {weather.humidity}%
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(255,255,255,0.1)',
                        padding: '0.75rem 1rem',
                        borderRadius: '1rem',
                        backdropFilter: 'blur(10px)'
                      }}>
                        🌡️ {displayTemp(weather.temp)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h3 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800', 
              marginBottom: '2.5rem', 
              textAlign: 'center', 
              color: 'white',
              textShadow: '0 4px 8px rgba(0,0,0,0.2)',
              letterSpacing: '-0.02em'
            }}>
              5-Day Forecast
            </h3>
            <div className="weather-forecast" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              {forecast?.map((day, i) => {
                const dayName = getDayName(day.date, i)
                const isToday = dayName === 'Today'
                
                return (
                  <div 
                    key={i} 
                    className="weather-forecast-card"
                    onClick={() => setSelectedDay(day)}
                    style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      padding: '2.5rem 2rem', 
                      borderRadius: '2rem', 
                      textAlign: 'center',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      backdropFilter: 'blur(30px)',
                      color: 'white',
                      animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-12px) scale(1.03)'
                      e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.25)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.3)'
                      e.currentTarget.style.border = '1px solid rgba(255,255,255,0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)'
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                      e.currentTarget.style.border = '1px solid rgba(255,255,255,0.3)'
                    }}
                  >
                    <div style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '6px',
                      background: isToday 
                        ? 'linear-gradient(90deg, #74b9ff, #0984e3, #6c5ce7)' 
                        : 'linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.2))',
                      borderRadius: '2rem 2rem 0 0'
                    }} />
                    
                    <div style={{ 
                      fontWeight: '800', 
                      marginBottom: '1.5rem', 
                      fontSize: '1.4rem',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      letterSpacing: '-0.01em'
                    }}>
                      {dayName}
                    </div>
                    <div style={{ 
                      marginBottom: '1.5rem',
                      background: 'rgba(255,255,255,0.1)',
                      padding: '1rem',
                      borderRadius: '50%',
                      display: 'inline-block',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <WeatherIcon code={day.code} size="3.5rem" />
                    </div>
                    <div style={{ 
                      fontSize: '1.1rem', 
                      marginBottom: '1.5rem', 
                      minHeight: '3rem', 
                      opacity: 0.95,
                      fontWeight: '600',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                      {getWeatherDescription(day.code)}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.1)',
                      padding: '1rem',
                      borderRadius: '1rem',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      <div style={{ 
                        fontWeight: '800', 
                        fontSize: '1.5rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}>
                        {displayTemp(day.max)}
                      </div>
                      <div style={{ 
                        opacity: 0.9, 
                        fontSize: '1.2rem',
                        fontWeight: '600'
                      }}>
                        {displayTemp(day.min)}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      opacity: 0.8, 
                      marginTop: '1rem',
                      fontWeight: '500',
                      background: 'rgba(255,255,255,0.1)',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.75rem',
                      display: 'inline-block',
                      backdropFilter: 'blur(10px)'
                    }}>
                      Click for details
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

          {/* Footer */}
          <footer style={{
            textAlign: 'center',
            padding: '3rem 0',
            color: '#2d3436',
            fontSize: '1.1rem',
            marginTop: 'auto'
          }}>
            <div style={{ 
              marginBottom: '1rem',
              fontWeight: '800',
              color: '#2d3436',
              textShadow: '0 2px 4px rgba(255,255,255,0.5)'
            }}>
              Powered by <strong style={{ 
                color: '#2d3436',
                fontWeight: '900'
              }}>Param Patel © {new Date().getFullYear()}</strong>
            </div>
      <div>
              <a 
                href="https://github.com/parampateldev" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: '#2d3436',
                  textDecoration: 'none',
                  fontWeight: '800',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '1rem',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  fontSize: '1rem',
                  textShadow: '0 1px 2px rgba(255,255,255,0.5)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#2d3436'
                  e.target.style.transform = 'translateY(-3px) scale(1.05)'
                  e.target.style.background = 'rgba(255,255,255,0.3)'
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#2d3436'
                  e.target.style.transform = 'translateY(0) scale(1)'
                  e.target.style.background = 'rgba(255,255,255,0.2)'
                  e.target.style.boxShadow = 'none'
                }}
              >
                <span>🔗</span> GitHub
        </a>
      </div>
          </footer>
        </div>
      </div>

      {selectedDay && (
        <DetailedDayView 
          day={selectedDay} 
          onClose={() => setSelectedDay(null)} 
          unit={unit}
        />
      )}
    </div>
  )
}

export default App
