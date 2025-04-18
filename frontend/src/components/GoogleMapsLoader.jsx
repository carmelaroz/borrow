import { LoadScript } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// 👇 Move this outside so it's not re-created on each render
const LIBRARIES = ['places'];

const GoogleMapsLoader = ({ children }) => {
    return (
        <LoadScript
            googleMapsApiKey={GOOGLE_MAPS_API_KEY}
            libraries={LIBRARIES}
            loadingElement={<div>Loading Google Maps... Please wait.</div>}
        >
            {children}
        </LoadScript>
    );
};

export default GoogleMapsLoader;