    import React from "react";

    const SearchBar = ({ searchQuery, setSearchQuery, onSearch }) => {
    const handleKeyPress = (e) => {
        if (e.key === "Enter") onSearch();
    };

    return (
        <div className="relative w-full max-w-md">
        <input
            type="text"
            placeholder="Search rentals or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* <button
            onClick={onSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xl"
        >
            🔍
        </button> */}
        </div>
    );
    };

    export default SearchBar;