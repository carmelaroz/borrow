import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

function Search() {
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

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
          setLoading(false);
        }
      );
    }
  }, []);

  // טעינת נכסים מה-API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('https://borrow-backend.onrender.com/api/properties');
                setProperties(response.data);
      } catch (err) {
        console.error('שגיאה בטעינת נכסים:', err);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.map((property) => {
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
  }).sort((a, b) => (a.distance || 0) - (b.distance || 0));

  const center = userLocation || { lat: 32.0853, lng: 34.7818 };

  return (
    <div className="search">
      <h2>חיפוש נכסים</h2>
      <input
        type="text"
        placeholder="הזן מיקום (למשל: תל אביב)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      {loading && <p>טוען מיקום...</p>}
      {userLocation && (
        <p>מיקום נוכחי: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
      )}

      <LoadScript googleMapsApiKey="AIzaSyAJFC3lneX3m6lWIhsGanx1SCSTbOi4luA">
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
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
        </GoogleMap>
      </LoadScript>

      <div className="property-list">
        {filteredProperties.map((property) => (
          <div key={property._id} className="property-card">
            <h3>{property.title}</h3>
            <p>מיקום: {property.location}</p>
            <p>מחיר: {property.price} ₪</p>
            {property.distance && <p>מרחק: {property.distance} ק"מ ממך</p>}
            <Link to={`/property/${property._id}`}>לפרטים נוספים</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;