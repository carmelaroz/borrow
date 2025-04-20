import React from "react";
import { CiMap, CiCircleList } from "react-icons/ci";

const ToggleViewButton = ({ view, setView }) => {
return (
    <button
    onClick={() => setView(view === "map" ? "list" : "map")}
    className="toggle-view-btn flex items-center gap-2 px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
    >
    {view === "map" ? (
        <CiCircleList style={{ fontSize: "24px", color: "gray" }} />
    ) : (
        <CiMap style={{ fontSize: "24px", color: "gray" }} />
    )}
    <span>{view === "map" ? "List View" : "Map View"}</span>
    </button>
);
};

export default ToggleViewButton;