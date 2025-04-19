import React, { useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
width: "100%",
height: "100%",
};

const defaultCenter = {
lat: 32.0853,
lng: 34.7818,
};

const MapView = ({ locations }) => {
const [selected, setSelected] = useState(null);

return (
    <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={10}>
    {locations.map((item, index) => (
        <Marker
        key={index}
        position={{ lat: item.lat, lng: item.lng }}
        onClick={() => setSelected(item)}
        />
    ))}

    {selected && (
        <InfoWindow
        position={{ lat: selected.lat, lng: selected.lng }}
        onCloseClick={() => setSelected(null)}
        >
        <div className="max-w-[250px]">
            <img
            src={selected.photo}
            alt={selected.title}
            className="w-full h-32 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-semibold">{selected.title}</h3>
            <p className="text-sm text-gray-600">{selected.description}</p>
            <p className="text-sm">👤 {selected.firstName} {selected.lastName}</p>
            <p className="text-sm">📞 {selected.phone}</p>
            {selected.priceLabel && <p className="text-sm">💸 {selected.priceLabel}</p>}
            <p className="text-sm">🏷️ {selected.category}</p>
        </div>
        </InfoWindow>
    )}
    </GoogleMap>
);
};

export default MapView;