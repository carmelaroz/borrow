import React from "react";
import GenericMapPage from "./GenericMapPage";

const RentalsMapPage = () => {
return (
    <GenericMapPage
    apiUrl="http://localhost:5000/api/rentals"
    title="Explore Rentals"
    />
);
};

export default RentalsMapPage;