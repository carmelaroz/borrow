import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import './Services.css';
import logo from '../assets/logoGiveIt.jpg'; // Adjust path based on where you place it in src

// Placeholder images for services
const cleaningImg = 'https://via.placeholder.com/100?text=Cleaning';
const tutoringImg = 'https://via.placeholder.com/100?text=Tutoring';
const repairImg = 'https://via.placeholder.com/100?text=Repair';
const photographyImg = 'https://via.placeholder.com/100?text=Photography';

// Sample available services
const availableServices = [
  { 
    id: 1, 
    name: 'House Cleaning', 
    price: 30, 
    image: cleaningImg, 
    position: { lat: 32.0428, lng: 34.760 },
    icon: '🧹',
    description: 'Professional house cleaning service. Includes dusting, vacuuming, and bathroom cleaning. 3 hours minimum.',
    category: 'Cleaning'
  },
  { 
    id: 2, 
    name: 'Math Tutoring', 
    price: 40, 
    image: tutoringImg, 
    position: { lat: 32.0445, lng: 34.7680 },
    icon: '📚',
    description: 'Experienced math tutor for high school and college students. Specializes in calculus and algebra.',
    category: 'Education'
  },
  { 
    id: 3, 
    name: 'Computer Repair', 
    price: 50, 
    image: repairImg, 
    position: { lat: 32.0435, lng: 34.7670 },
    icon: '💻',
    description: 'Professional computer repair service. Hardware and software troubleshooting, virus removal, and upgrades.',
    category: 'Repair'
  },
  { 
    id: 4, 
    name: 'Event Photography', 
    price: 100, 
    image: photographyImg, 
    position: { lat: 32.0415, lng: 34.7650 },
    icon: '📸',
    description: 'Professional event photography. Includes 2 hours of shooting and edited digital photos.',
    category: 'Photography'
  },
];

// Sample needed services
const neededServices = [
  { 
    id: 5, 
    name: 'Moving Help', 
    price: 25, 
    image: 'https://via.placeholder.com/100?text=Moving', 
    position: { lat: 32.0430, lng: 34.7620 },
    icon: '🚚',
    description: 'Looking for help moving furniture this weekend. Need 2-3 people for 4 hours.',
    category: 'Moving'
  },
  { 
    id: 6, 
    name: 'Guitar Lessons', 
    price: 35, 
    image: 'https://via.placeholder.com/100?text=Guitar', 
    position: { lat: 32.0420, lng: 34.7640 },
    icon: '🎸',
    description: 'Looking for beginner guitar lessons. Prefer someone who can teach at my home.',
    category: 'Music'
  },
  { 
    id: 7, 
    name: 'Dog Walking', 
    price: 20, 
    image: 'https://via.placeholder.com/100?text=Dog', 
    position: { lat: 32.0440, lng: 34.7660 },
    icon: '🐕',
    description: 'Need someone to walk my dog twice a day while I\'m at work. Must be experienced with large dogs.',
    category: 'Pet Care'
  },
];

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 32.0428,
  lng: 34.760
};

function Services() {
  const navigate = useNavigate();
  const [view, setView] = useState('map');
  const [viewType, setViewType] = useState('available');
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    category: ''
  });
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback() {
    setMap(null);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const toggleView = () => {
    setView(view === 'map' ? 'list' : 'map');
  };

  const toggleViewType = () => {
    setViewType(viewType === 'available' ? 'needed' : 'available');
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const currentServices = viewType === 'available' ? availableServices : neededServices;

  const handleFilterClick = () => {
    setShowFilterModal(true);
  };

  const handleFilterApply = () => {
    setShowFilterModal(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredServices = currentServices.filter(service => {
    if (filters.minPrice && service.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && service.price > Number(filters.maxPrice)) return false;
    if (filters.category && !service.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
    return true;
  });

  const handleSortClick = () => {
    setShowSortModal(true);
  };

  const handleSortApply = (option) => {
    setSortOption(option);
    setShowSortModal(false);
  };

  const sortedServices = useMemo(() => {
    if (!sortOption) return filteredServices;
    
    return [...filteredServices].sort((a, b) => {
      switch (sortOption) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'name-a-z':
          return a.name.localeCompare(b.name);
        case 'name-z-a':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [filteredServices, sortOption]);

  // const handleNavigation = (path) => {
  //   navigate(path);
  // };

  return (
    <div className="app-container">
      {/* Header */}
      {/* <header className="header">
        <img src={logo} alt="GiveIt Logo" className="header-logo" />
        <h1>SERVICES</h1>
      </header> */}

      {/* Search and Filter Section */}
      <div className="search-filter">
        <div className="search-bar">
          <input type="text" placeholder="Search services like: cleaning, tutoring, repair..." />
        </div>
        <div className="sort-filter-buttons">
          {view === 'list' && (
            <button className="sort-button" onClick={handleSortClick}>
              ⟐ Sort {sortOption && `(${sortOption.split('-').join(' ')})`}
            </button>
          )}
          <button className="filter-button" onClick={handleFilterClick}>⧩ Filter</button>
          <div className="view-switch-container">
            <span className={`view-label ${view === 'list' ? 'active' : ''}`}>List</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={view === 'map'} 
                onChange={() => setView(view === 'map' ? 'list' : 'map')}
              />
              <span className="slider round"></span>
            </label>
            <span className={`view-label ${view === 'map' ? 'active' : ''}`}>Map</span>
          </div>
        </div>
      </div>

      {/* Map or List View */}
      {view === 'map' ? (
        <div className="map-container">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={15}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {sortedServices.map((service) => (
                <Marker
                  key={service.id}
                  position={service.position}
                  title={service.name}
                  onClick={() => handleServiceClick(service)}
                  label={service.icon}
                />
              ))}
              {selectedService && (
                <InfoWindow
                  position={selectedService.position}
                  onCloseClick={() => setSelectedService(null)}
                >
                  <div className="info-window">
                    <h3>{selectedService.name}</h3>
                    <p>${selectedService.price}/hour</p>
                    <button onClick={() => handleServiceClick(selectedService)}>View Details</button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      ) : (
        <div className="list-container">
          {sortedServices.map((service) => (
            <div 
              key={service.id} 
              className="list-item"
              onClick={() => handleServiceClick(service)}
            >
              <div className="list-item-icon">{service.icon}</div>
              <img src={service.image} alt={service.name} className="list-item-image" />
              <div className="list-item-details">
                <h3>{service.name}</h3>
                <p>${service.price}/hour</p>
                <span className="service-category">{service.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="toggle-type-button-container">
        <button className="toggle-type-button" onClick={toggleViewType}>
          {viewType === 'available' ? 'Show Needed Services' : 'Show Available Services'}
        </button>
      </div>
      {/* Modal for service details */}
      {showModal && selectedService && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="service-icon">{selectedService.icon}</span>
              <h2>{selectedService.name}</h2>
            </div>
            <img src={selectedService.image} alt={selectedService.name} className="modal-image" />
            <div className="modal-details">
              <p className="price">${selectedService.price}/hour</p>
              <p className="category">Category: {selectedService.category}</p>
              <p className="description">{selectedService.description}</p>
              <button className="rent-button">
                {viewType === 'available' ? 'Book Now' : 'Offer Service'}
              </button>
            </div>
            <button className="close-button bottom-close" onClick={closeModal}>×</button>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="modal-content filter-modal" onClick={e => e.stopPropagation()}>
            <h2>Filter Services</h2>
            <div className="filter-form">
              <div className="filter-group">
                <label>Min Price ($/hour)</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min price"
                />
              </div>
              <div className="filter-group">
                <label>Max Price ($/hour)</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max price"
                />
              </div>
              <div className="filter-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  placeholder="Search by category"
                />
              </div>
              <button className="apply-filter-button" onClick={handleFilterApply}>
                Apply Filters
              </button>
            </div>
            <button className="close-button bottom-close" onClick={() => setShowFilterModal(false)}>×</button>
          </div>
        </div>
      )}

      {/* Sort Modal */}
      {showSortModal && (
        <div className="modal-overlay" onClick={() => setShowSortModal(false)}>
          <div className="modal-content sort-modal" onClick={e => e.stopPropagation()}>
            <h2>Sort Services</h2>
            <div className="sort-options">
              <button 
                className={`sort-option ${sortOption === 'price-low-high' ? 'active' : ''}`}
                onClick={() => handleSortApply('price-low-high')}
              >
                Price: Low to High
              </button>
              <button 
                className={`sort-option ${sortOption === 'price-high-low' ? 'active' : ''}`}
                onClick={() => handleSortApply('price-high-low')}
              >
                Price: High to Low
              </button>
              <button 
                className={`sort-option ${sortOption === 'name-a-z' ? 'active' : ''}`}
                onClick={() => handleSortApply('name-a-z')}
              >
                Name: A to Z
              </button>
              <button 
                className={`sort-option ${sortOption === 'name-z-a' ? 'active' : ''}`}
                onClick={() => handleSortApply('name-z-a')}
              >
                Name: Z to A
              </button>
            </div>
            <button className="close-button bottom-close" onClick={() => setShowSortModal(false)}>×</button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {/* <nav className="bottom-nav">
        <div className="nav-item" onClick={() => handleNavigation('/')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-text">Home</span>
        </div>
        <div className="nav-item active" onClick={() => handleNavigation('/services')}>
          <span className="nav-icon">🔧</span>
          <span className="nav-text">Services</span>
        </div>
        <div className="nav-item" onClick={() => handleNavigation('/messages')}>
          <span className="nav-icon">💬</span>
          <span className="nav-text">Messages</span>
        </div>
        <div className="nav-item" onClick={() => handleNavigation('/my-items')}>
          <span className="nav-icon">📋</span>
          <span className="nav-text">My Items</span>
        </div>
        <div className="nav-item" onClick={() => handleNavigation('/account')}>
          <span className="nav-icon">👤</span>
          <span className="nav-text">Account</span>
        </div>
      </nav> */}
    </div>
  );
}

export default Services;