import { geocodeAddress } from "./geocode";


export const handleSearch = async ({ apiUrl, searchQuery, setAllItems, setLocations }) => {
    try {
    let fetchUrl = apiUrl;
    
    if (searchQuery.trim()) {
        // If search query is not empty, use the search endpoint
        fetchUrl = `${apiUrl}/search?query=${encodeURIComponent(searchQuery)}`;
    }

    const res = await fetch(fetchUrl);
    const results = await res.json();

    setAllItems(results);

    const withCoords = await Promise.all(
        results.map(async (item) => {
        const { street, city } = item;
        if (!street || !city || street.length < 3 || city.length < 2) return null;

        let priceLabel = null;
        if (item.pricePerHour) priceLabel = `${item.pricePerHour}₪ / hour`;
        if (item.pricePerDay) priceLabel = `${item.pricePerDay}₪ / day`;

        const coords = await geocodeAddress(street, city);
        if (coords) {
            return {
            id: item._id,
            title: item.title,
            description: item.description,
            category: item.category,
            priceLabel,
            photo: item.photo,
            firstName: item.firstName,
            lastName: item.lastName,
            phone: item.phone,
            ...coords,
            };
        } else {
            return null;
        }
        })
    );

    setLocations(withCoords.filter(Boolean));
    } catch (err) {
    console.error("Search failed:", err);
    }
};