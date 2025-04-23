import React, { useEffect, useState } from "react";
import MapView from "./MapView";
import ListView from "./ListView";
import FilterButton from './FilterButton';
import ToggleViewButton from "./ToggleViewButton";
import { geocodeAddress } from "./geocode";
import SearchBar from "./SearchBar";
import '../../styles/HomePage/GenericMapPage.css';
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
    const withCoords = await mapItemsToCoords(items);
    setLocations(withCoords);
    };

    fetchAndMap();
}, [apiUrl]);

const mapItemsToCoords = async (items) => {
    const mapped = await Promise.all(
    items.map(async (item) => {
        const { street, city } = item;
        if (!street || !city || street.length < 3 || city.length < 2) return null;

        const coords = await geocodeAddress(street, city);
        return coords
        ? {
            ...item,
            ...coords,
            id: item._id,
            }
        : null;
    })
    );

    return mapped.filter(Boolean);
};

const handleSearch = () => {
    searchItems({ apiUrl, searchQuery, setAllItems, setLocations });
};

// const addPriceLabel = (items) => {
//     return items.map(item => ({
//     ...item,
//     priceLabel: item.price ? `${item.price}₪` : null,
//     }));
// };

const handleFilter = ({ categories, maxPrice }) => {
    let url = `${apiUrl}/filter?`;

    if (categories.length > 0) {
    const encodedCategories = categories.map(encodeURIComponent).join(",");
    url += `category=${encodedCategories}&`;
    }

    url += `maxPrice=${maxPrice}`;

    fetch(url)
    .then((res) => res.json())
    .then(async (data) => {
        // const dataWithPriceLabel = addPriceLabel(data);
        // setAllItems(dataWithPriceLabel);
        // const withCoords = await mapItemsToCoords(dataWithPriceLabel);
        setAllItems(data);
        const withCoords = await mapItemsToCoords(data);
        setLocations(withCoords);
    });
};

return (
    <div className="p-4 flex flex-col gap-4 items-center">
    <h2 className="text-2xl font-bold text-center">{title || "Explore"}</h2>

    <div className="search-filter-row">
        <div className="search-filter-container">
        <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
        />
        </div>
        <FilterButton
        onApplyFilters={handleFilter}
        categoryType={apiUrl.includes("rentals") ? "rental" : "service"}
        />
    </div>

    <div className="map-wrapper w-full">
        <ToggleViewButton view={view} setView={setView} />
        {view === "map" ? (
        <MapView locations={locations} />
        ) : (
        <ListView rentals={allItems} />
        )}
    </div>
    </div>
);
};

export default GenericMapPage;