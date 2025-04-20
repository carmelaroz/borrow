import React from "react";
import { VscFilter } from "react-icons/vsc";

const FilterButton = () => {
return (
    <button
    className="toggle-view-btn flex items-center gap-2 px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
    onClick={() => console.log("Filter clicked")}
    >
    <VscFilter style={{ fontSize: "20px", color: "gray" }} />
    <span>Filter</span>
    </button>
);
};

export default FilterButton;