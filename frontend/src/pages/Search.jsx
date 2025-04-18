import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import './Search.css';

function Search() {
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search filters
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [propertyType, setPropertyType] = useState('all');
  const [sortBy, setSortBy] = useState('distance');

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  // פונקציה לחישוב מרחק
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // קבלת מיקום המשתמש
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
          console.error('שגיאה בקבלת מיקום:', error);
          setError('לא ניתן לקבל את המיקום שלך. אנא בדוק את הגדרות המיקום בדפדפן.');
          setLoading(false);
        }
      );
    }
  }, []);

  // טעינת נכסים מה-API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://borrow-backend.onrender.com/api/properties');
        setProperties(response.data);
        setLoading(false);
      } catch (err) {
        console.error('שגיאה בטעינת נכסים:', err);
        setError('שגיאה בטעינת הנכסים. אנא נסה שוב מאוחר יותר.');
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // סינון נכסים לפי החיפוש והפילטרים
  useEffect(() => {
    let filtered = [...properties];

    // סינון לפי מיקום
    if (location) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // סינון לפי טווח מחירים
    filtered = filtered.filter(property => 
      property.price >= priceRange.min && property.price <= priceRange.max
    );

    // סינון לפי סוג נכס
    if (propertyType !== 'all') {
      filtered = filtered.filter(property => property.type === propertyType);
    }

    // הוספת מרחק וחישוב
    filtered = filtered.map(property => {
      if (userLocation) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          property.lat,
          property.lng
        );
        return { ...property, distance: distance.toFixed(2) };
      }
      return property;
    });

    // מיון
    filtered.sort((a, b) => {
      if (sortBy === 'distance') {
        return (a.distance || 0) - (b.distance || 0);
      } else if (sortBy === 'price') {
        return a.price - b.price;
      }
      return 0;
    });

    setFilteredProperties(filtered);
  }, [properties, location, priceRange, propertyType, sortBy, userLocation]);

  const center = userLocation || { lat: 32.0853, lng: 34.7818 };

  return (
    <div className="search-container">
      <h2>חיפוש נכסים</h2>
      
      <div className="search-filters">
        <div className="search-input">
          <input
            type="text"
            placeholder="הזן מיקום (למשל: תל אביב)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>טווח מחירים:</label>
          <div className="price-range">
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
              placeholder="מ-"
            />
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
              placeholder="עד-"
            />
          </div>
        </div>

        <div className="filter-group">
          <label>סוג נכס:</label>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
            <option value="all">הכל</option>
            <option value="apartment">דירה</option>
            <option value="house">בית</option>
            <option value="room">חדר</option>
          </select>
        </div>

        <div className="filter-group">
          <label>מיין לפי:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="distance">מרחק</option>
            <option value="price">מחיר</option>
          </select>
        </div>
      </div>

      {loading && <div className="loading">טוען...</div>}
      {error && <div className="error">{error}</div>}

      <div className="map-container">
        {/* <LoadScript googleMapsApiKey="AIzaSyAJFC3lneX3m6lWIhsGanx1SCSTbOi4luA"> */}
          {/* <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}> */}
            {userLocation && (
              <Marker
                position={userLocation}
                label="אתה כאן"
                icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
              />
            )}
            {filteredProperties.map((property) => (
              <Marker
                key={property._id}
                position={{ lat: property.lat, lng: property.lng }}
                label={property.title}
              />
            ))}
          {/* </GoogleMap> */}
        {/* </LoadScript> */}
      </div>

      <div className="property-list">
        {filteredProperties.length === 0 ? (
          <div className="no-results">לא נמצאו נכסים התואמים את החיפוש שלך</div>
        ) : (
          filteredProperties.map((property) => (
            <div key={property._id} className="property-card">
              <img src={property.image} alt={property.title} className="property-image" />
              <div className="property-details">
                <h3>{property.title}</h3>
                <p className="location">מיקום: {property.location}</p>
                <p className="price">מחיר: {property.price} ₪</p>
                {property.distance && <p className="distance">מרחק: {property.distance} ק"מ ממך</p>}
                <p className="type">סוג: {property.type}</p>
                <Link to={`/property/${property._id}`} className="details-link">
                  לפרטים נוספים
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Search;