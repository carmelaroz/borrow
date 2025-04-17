// src/Home.js
import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import './Home.css';
// import logo from '../logoGiveIt.jpg'; // Adjust path based on where you place it in src
import Navbar from '../components/Navbar';

// Placeholder images for the items (you can replace these with actual image URLs)
const bicycleImg = '/images/bicycle.jpg';
const drillImg = '/images/Drill.jpg';
const cameraImg = '/images/camera.jpg';
const guitarImg = '/images/guitar.jpg'; 

// Sample items data with actual coordinates and icons
const availableItems = [
  { 
    id: 1, 
    name: 'Bicycle', 
    price: 15, 
    image: bicycleImg, 
    position: { lat: 32.0428, lng: 34.760 },

    description: 'Mountain bike in good condition. Perfect for city rides and trails.'
  },
  { 
    id: 2, 
    name: 'Drill', 
    price: 20, 
    image: drillImg, 
    position: { lat: 32.0445, lng: 34.7680 },
    icon: '🔧',
    description: 'Powerful cordless drill with multiple attachments.'
  },
  { 
    id: 3, 
    name: 'Camera', 
    price: 40, 
    image: cameraImg, 
    position: { lat: 32.0435, lng: 34.7670 },
    icon: '📷',
    description: 'Professional DSLR camera with lens kit.'
  },
  { 
    id: 4, 
    name: 'Guitar', 
    price: 25, 
    image: guitarImg, 
    position: { lat: 32.0415, lng: 34.7650 },
    icon: '🎸',
    description: 'Acoustic guitar, great for beginners and intermediate players.'
  },
];

const neededItems = [
  { 
    id: 5, 
    name: 'Ladder', 
    price: 30, 
    image: 'https://via.placeholder.com/100?text=Ladder', 
    position: { lat: 32.0430, lng: 34.7620 },
    icon: '🪜',
    description: 'Need a 6-foot ladder for home renovation project. Willing to pay $30 per day.'
  },
  { 
    id: 6, 
    name: 'Car', 
    price: 50, 
    image: 'https://via.placeholder.com/100?text=Car', 
    position: { lat: 32.0420, lng: 34.7640 },
    icon: '🚗',
    description: 'Looking to rent a car for weekend trip. Budget: $50 per day.'
  },
  { 
    id: 7, 
    name: 'Tent', 
    price: 35, 
    image: 'https://via.placeholder.com/100?text=Tent', 
    position: { lat: 32.0440, lng: 34.7660 },
    icon: '⛺',
    description: 'Need a 4-person tent for camping trip. Willing to pay $35 per day.'
  },
];

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 32.0428,
  lng: 34.7660
};

function Home() {
  const navigate = useNavigate();
  const [view, setView] = useState('map');
  const [viewType, setViewType] = useState('available'); // 'available' or 'needed'
  const [selectedItem, setSelectedItem] = useState(null);
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

  const onLoad = useCallback(function callback(map) {
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

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const currentItems = viewType === 'available' ? availableItems : neededItems;

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

  const filteredItems = currentItems.filter(item => {
    if (filters.minPrice && item.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && item.price > Number(filters.maxPrice)) return false;
    if (filters.category && !item.name.toLowerCase().includes(filters.category.toLowerCase())) return false;
    return true;
  });

  const handleSortClick = () => {
    setShowSortModal(true);
  };

  const handleSortApply = (option) => {
    setSortOption(option);
    setShowSortModal(false);
  };

  const sortedItems = useMemo(() => {
    if (!sortOption) return filteredItems;
    
    return [...filteredItems].sort((a, b) => {
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
  }, [filteredItems, sortOption]);

  // const handleNavigation = (path) => {
  //   navigate(path);
  // };

  return (
    <div className="app-container">
      {/* Header */}
      {/* <header className="header">
      <img src={logo} alt="GiveIt Logo" className="header-logo" />
      <h1>RENT ANYTHING</h1>
      </header> */}

      {/* Search and Filter Section */}
      <div className="search-filter">
        <div className="search-bar">
          <input type="text" placeholder="Search items like: bicycle, camera, tools..." />
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
              {sortedItems.map((item) => (
                <Marker
                  key={item.id}
                  position={item.position}
                  title={item.name}
                  onClick={() => handleItemClick(item)}
                  label={item.icon}
                />
              ))}
              {selectedItem && (
                <InfoWindow
                  position={selectedItem.position}
                  onCloseClick={() => setSelectedItem(null)}
                >
                  <div className="info-window">
                    <h3>{selectedItem.name}</h3>
                    <p>${selectedItem.price}/day</p>
                    <button onClick={() => handleItemClick(selectedItem)}>View Details</button>
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
          {sortedItems.map((item) => (
            <div 
              key={item.id} 
              className="list-item"
              onClick={() => handleItemClick(item)}
            >
              <div className="list-item-icon">{item.icon}</div>
              <img src={item.image} alt={item.name} className="list-item-image" />
              <div className="list-item-details">
                <h3>{item.name}</h3>
                <p>${item.price}/day</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for item details */}
      {showModal && selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="item-icon">{selectedItem.icon}</span>
              <h2>{selectedItem.name}</h2>
            </div>
            <img src={selectedItem.image} alt={selectedItem.name} className="modal-image" />
            <div className="modal-details">
              <p className="price">${selectedItem.price}/day</p>
              <p className="description">{selectedItem.description}</p>
              <button className="rent-button">
                {viewType === 'available' ? 'Rent Now' : 'Offer to Rent'}
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
            <h2>Filter Items</h2>
            <div className="filter-form">
              <div className="filter-group">
                <label>Min Price ($)</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min price"
                />
              </div>
              <div className="filter-group">
                <label>Max Price ($)</label>
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
            <h2>Sort Items</h2>
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

      <div className="toggle-type-button-container">
        <button className="toggle-type-button" onClick={toggleViewType}>
          {viewType === 'available' ? 'Show Needed Items' : 'Show Available Items'}
        </button>
      </div>

      {/* Bottom Navigation
      <nav className="bottom-nav">
        <div className="nav-item active" onClick={() => handleNavigation('/')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-text">Home</span>
        </div>
        <div className="nav-item" onClick={() => handleNavigation('/services')}>
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

export default Home;