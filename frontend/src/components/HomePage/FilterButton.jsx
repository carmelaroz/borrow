import React from "react";

const FilterButton = () => {
const handleFilterClick = () => {
    alert("Filter UI coming soon!");
};

return (
    <button
    onClick={handleFilterClick}
    className="bg-gray-100 hover:bg-gray-200 border px-4 py-2 rounded"
    >
    Filter
    </button>
);
};

export default FilterButton;