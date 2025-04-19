import React from "react";
import SearchBar from "./SearchBar";

const SearchFilter = ({ searchQuery, setSearchQuery, onSearch, onListView }) => {
return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
    <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={onSearch}
    />
    {/* <div className="flex gap-2">
        <button className="toggle-view-btn">
        Filter
        </button>
    </div> */}
    </div>
    
);
};

export default SearchFilter;