import React, { useEffect, useState } from "react";
import MapView from "./MapView";
import ListView from "./ListView";
import { geocodeAddress } from "./geocode";
import SearchFilter from "./SearchFilter";
import '../../styles/HomePage/GenericMapPage.css'

const GenericMapPage = ({ apiUrl, title }) => {
const [allItems, setAllItems] = useState([]);
const [locations, setLocations] = useState([]);
const [view, setView] = useState("map");
const [searchQuery, setSearchQuery] = useState("");

useEffect(() => {
    const fetchAndMap = async () => {
    const res = await fetch(apiUrl);
    const items = await res.json();
    setAllItems(items);

    const withCoords = await Promise.all(
        items.map(async (item) => {
        const { street, city } = item;
        if (!street || !city || street.length < 3 || city.length < 2) {
            return null;
        }

        let priceLabel = null;
        if (item.pricePerHour) priceLabel = `${item.pricePerHour}₪ / hour`;
        if (item.pricePerDay) priceLabel = `${item.pricePerDay}₪ / day`;

        const coords = await geocodeAddress(street, city);
        if (coords) {
            return {
            id: item._id,
            title: item.title,
            description: item.description,
            category: item.category,
            priceLabel,
            photo: item.photo,
            firstName: item.firstName,
            lastName: item.lastName,
            phone: item.phone,
            ...coords,
            };
        } else {
            return null;
        }
        })
    );

    setLocations(withCoords.filter(Boolean));
    };

    fetchAndMap();
}, [apiUrl]);

const filteredItems = allItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
);

return (
    <div className="p-4 flex flex-col gap-4 items-center">
    <h2 className="text-2xl font-bold text-center">{title || "Explore"}</h2>

    <div className="search-filter-container">
    <SearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
    
    <div className="button-group">
    {/* Buttons: Filter + View Toggle */}
    <div className="flex gap-2 mb-4">
        {/* Filter Button */}
        <button
        className="toggle-view-btn"
        onClick={() => console.log("Filter clicked")}
        >
        <span>Filter</span>
        <i className="bi bi-funnel"></i>
        </button>
        
        {/* Map/List Toggle Button */}
        <button
        onClick={() => setView(view === "map" ? "list" : "map")}
        className="toggle-view-btn"
        >
        <span>{view === "map" ? "List View" : "Map View"}</span>
        <i className="bi bi-layout-three-columns"></i>
        </button>
    </div>
    </div>

    <div className="map-wrapper w-full max-w-md">
        {view === "map" ? (
        <MapView locations={locations} />
        ) : (
        <ListView rentals={filteredItems} />
        )}
    </div>
    </div>
);
};

export default GenericMapPage;