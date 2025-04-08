import { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import axios from 'axios';
import logo from './logo5.png';
import './Rentals.css';

function Rentals() {
  const [userLocation, setUserLocation] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [viewMode, setViewMode] = useState('map');
  const [radius, setRadius] = useState(10);
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [language, setLanguage] = useState('he');
  const [quickView, setQuickView] = useState(null);
  const mapRef = useRef(null);
  const clustererRef = useRef(null);

  const userName = "משתמש";
  const categories = [
    { id: 'all', name: language === 'he' ? 'הכל' : 'All', icon: '🌐' },
    { id: 'tools', name: language === 'he' ? 'כלי עבודה' : 'Tools', icon: '🔧' },
    { id: 'electronics', name: language === 'he' ? 'אלקטרוניקה' : 'Electronics', icon: '📱' },
    { id: 'apartments', name: language === 'he' ? 'ספורט ונגינה' : 'Sports & Music', icon: '🏆' },
    { id: 'misc', name: language === 'he' ? 'שונות' : 'Miscellaneous', icon: '📦' },
  ];

  const center = userLocation || { lat: 32.0853, lng: 34.7818 };

  // Existing useEffect hooks remain unchanged
  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/rentals');
        setRentals(response.data);
        if (!response.data || response.data.length === 0) {
          setError(language === 'he' ? 'אין נתונים זמינים מהשרת' : 'No data available from server');
        }
      } catch (err) {
        setError(
          language === 'he'
            ? 'שגיאה בטעינת ההשכרות: ' + (err.message || 'לא ניתן להתחבר לשרת')
            : 'Error loading rentals: ' + (err.message || 'Unable to connect to server')
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  const handleSearch = () => {
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches([searchQuery, ...recentSearches.slice(0, 4)]);
    }
  };

  const saveSearch = () => {
    const currentSearch = { query: searchQuery, categories: selectedCategories, radius };
    if (!savedSearches.some(s => JSON.stringify(s) === JSON.stringify(currentSearch))) {
      setSavedSearches([currentSearch, ...savedSearches]);
    }
  };

  const getDistance = (loc1, loc2) => {
    const R = 6371;
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filteredRentals = rentals && Array.isArray(rentals)
    ? rentals
        .map(rental => ({
          _id: rental._id,
          title: rental.title || rental.name || 'Unknown',
          lat: rental.lat || rental.latitude,
          lng: rental.lng || rental.longitude,
          category: rental.category || 'unknown',
          rating: rental.rating || 0,
        }))
        .filter(rental => {
          const matchesQuery = rental.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
          const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(rental.category);
          const distance = userLocation && rental.lat && rental.lng
            ? getDistance(userLocation, { lat: rental.lat, lng: rental.lng })
            : true;
          return matchesQuery && matchesCategory && distance <= radius;
        })
    : [];

  const onMapLoad = (map) => {
    mapRef.current = map;
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }
    const markers = filteredRentals
      .filter(rental => typeof rental.lat === 'number' && typeof rental.lng === 'number')
      .map((rental) => {
        const marker = new window.google.maps.Marker({
          position: { lat: rental.lat, lng: rental.lng },
          label: rental.title,
          map: mapRef.current,
        });
        marker.addListener('click', () => setQuickView(rental));
        return marker;
      });
    clustererRef.current = new MarkerClusterer({ map, markers });
  };

  useEffect(() => {
    if (mapRef.current && filteredRentals) {
      onMapLoad(mapRef.current);
    }
  }, [filteredRentals]);

  return (
    <div className="page-wrapper">
      <nav className="top-navbar">
        <img src={logo} alt="Borrow Logo" className="brand-logo" />
        <h2 className="welcome-message">
          {language === 'he' ? `ברוך הבא, ${userName}` : `Welcome, ${userName}`}
        </h2>
        <select className="language-selector" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="he">עברית</option>
          <option value="en">English</option>
        </select>
      </nav>

      <div className="content-wrapper">
        <header className="header">

          {showTutorial && (
            <div className="tutorial">
              <p>{language === 'he' ? 'לחץ על מפה או רשימה כדי להתחיל!' : 'Click Map or List to start!'}</p>
              <button className="dismiss-tutorial" onClick={() => setShowTutorial(false)}>
                {language === 'he' ? 'סגור' : 'Close'}
              </button>
            </div>
          )}
        </header>

        <div className="search-section">
          <input
            type="text"
            placeholder={language === 'he' ? 'חיפוש השכרות...' : 'Search rentals...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-bar"
          />
          <button className="search-button" onClick={handleSearch}>
            {language === 'he' ? 'חפש' : 'Search'}
          </button>

        </div>

        <div className="controls">
        <div className="category-filter">
        {categories.map((category) => (
        <button
        key={category.id}
        className={`category-button ${selectedCategories.includes(category.id) ? 'active' : ''}`}
        onClick={() => {
        setSelectedCategories(prev =>
          prev.includes(category.id)
            ? prev.filter(c => c !== category.id)
            : [...prev, category.id]
        );
      }}
    >
      <span className="category-icon large">{category.icon}</span>
      {category.name}
    </button>
  ))}
</div>

          <div className="view-toggle">
            <button
              className="toggle-button single"
              onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
            >
              {language === 'he' 
                ? (viewMode === 'map' ? 'הצג רשימה' : 'הצג מפה')
                : (viewMode === 'map' ? 'Show List' : 'Show Map')}
            </button>
          </div>

          <div className="radius-selector">
            <label style={{ color: 'black' }}>
              {language === 'he' ? 'רדיוס (ק"מ):' : 'Radius (km):'}
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="radius-slider"
            />
            <span style={{ color: 'black' }}>{radius} ק"מ</span>
          </div>
        </div>

        <div className="content">
          {loading ? (
            <p className="loading-text">{language === 'he' ? 'טוען...' : 'Loading...'}</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : viewMode === 'map' ? (
            <div className="map-container">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={center}
                zoom={10}
                options={{ zoomControl: true, streetViewControl: false }}
                onLoad={onMapLoad}
              >
                <button className="locate-me" onClick={() => userLocation && setUserLocation(userLocation)}>
                  📍
                </button>
                {userLocation && (
                  <Marker
                    position={userLocation}
                    label={language === 'he' ? 'אתה כאן' : 'You are here'}
                    icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
                  />
                )}
              </GoogleMap>
              {quickView && (
                <div className="quick-view">
                  <h3>{quickView.title}</h3>
                  <p>{language === 'he' ? 'מיקום:' : 'Location:'} {quickView.lat.toFixed(4)}, {quickView.lng.toFixed(4)}</p>
                  <p>{language === 'he' ? 'קטגוריה:' : 'Category:'} {quickView.category}</p>
                  <p>{language === 'he' ? 'דירוג:' : 'Rating:'} {'★'.repeat(quickView.rating || 0)}</p>
                  <button onClick={() => setQuickView(null)}>{language === 'he' ? 'סגור' : 'Close'}</button>
                </div>
              )}
            </div>
          ) : (
            <div className="list-view">
              <div className="featured-listings">
                <h3>{language === 'he' ? 'השכרות מומלצות' : 'Featured Listings'}</h3>
                {filteredRentals.slice(0, 3).map((rental) => (
                  <div key={rental._id} className="rental-item featured">
                    <h4>{rental.title}</h4>
                    <p>{language === 'he' ? 'מיקום:' : 'Location:'} {rental.lat.toFixed(4)}, {rental.lng.toFixed(4)}</p>
                    <p>{language === 'he' ? 'דירוג:' : 'Rating:'} {'★'.repeat(rental.rating || 0)}</p>
                  </div>
                ))}
              </div>
              <h3>{language === 'he' ? 'כל ההשכרות' : 'All Rentals'}</h3>
              {filteredRentals.length > 0 ? (
                filteredRentals.map((rental) => (
                  <div key={rental._id} className="rental-item">
                    <h4>{rental.title}</h4>
                    <p>{language === 'he' ? 'מיקום:' : 'Location:'} {rental.lat.toFixed(4)}, {rental.lng.toFixed(4)}</p>
                    <p>{language === 'he' ? 'קטגוריה:' : 'Category:'} {rental.category}</p>
                    <p>{language === 'he' ? 'דירוג:' : 'Rating:'} {'★'.repeat(rental.rating || 0)}</p>
                  </div>
                ))
              ) : (
                <p>{language === 'he' ? 'לא נמצאו השכרות' : 'No rentals found'}</p>
              )}
            </div>
          )}
        </div>

        {(recentSearches.length > 0 || savedSearches.length > 0) && (
          <div className="search-history">
            {recentSearches.length > 0 && (
              <div className="recent-searches">
                <h3>{language === 'he' ? 'חיפושים אחרונים' : 'Recent Searches'}</h3>
                {recentSearches.map((search, index) => (
                  <p key={index} onClick={() => setSearchQuery(search)} className="search-item">{search}</p>
                ))}
              </div>
            )}
            {savedSearches.length > 0 && (
              <div className="saved-searches">
                <h3>{language === 'he' ? 'חיפושים שמורים' : 'Saved Searches'}</h3>
                {savedSearches.map((search, index) => (
                  <p key={index} onClick={() => {
                    setSearchQuery(search.query);
                    setSelectedCategories(search.categories);
                    setRadius(search.radius);
                  }} className="search-item">
                    {search.query || 'Unnamed Search'}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <nav className="bottom-navbar">
  <ul className="nav-links">
    <li className="nav-item home">{language === 'he' ? 'צור קשר' : 'contact'}</li>
    <li className="nav-item rentals">{language === 'he' ? 'השכרות' : 'Rentals'}</li>
    <li className="nav-item services">{language === 'he' ? 'שירותים' : 'Services'}</li>
    
  </ul>
</nav>
    </div>
  );
}

export default Rentals;