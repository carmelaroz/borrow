import React from 'react';
import { GoogleMap } from '@react-google-maps/api';

const MapContainer = ({ center, zoom = 12, children, height = '400px', width = '100%' }) => {
const containerStyle = {
    width,
    height,
};

return (
    <GoogleMap
    center={center}
    zoom={zoom}
    mapContainerStyle={containerStyle}
    >
    {children}
    </GoogleMap>
);
};

export default MapContainer;