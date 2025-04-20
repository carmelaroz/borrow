import React, { useEffect, useState } from "react";
import MapView from "./MapView";
import ListView from "./ListView";
import FilterButton from './FilterButton';
import ToggleViewButton from "./ToggleViewButton";
import { geocodeAddress } from "./geocode";
import SearchBar from "./SearchBar";
import '../../styles/HomePage/GenericMapPage.css'
import { handleSearch as searchItems } from "./searchHelpers";

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

const handleSearch = () => {
    searchItems({ apiUrl, searchQuery, setAllItems, setLocations });
};

return (
    <div className="p-4 flex flex-col gap-4 items-center">
    <h2 className="text-2xl font-bold text-center">{title || "Explore"}</h2>

    <div className="search-filter-container">
        <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        />
    </div>

    <div className="button-group">
        <div className="flex gap-2 mb-4">
        <FilterButton />
        <ToggleViewButton view={view} setView={setView} />
        </div>
    </div>

    <div className="map-wrapper w-full">
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