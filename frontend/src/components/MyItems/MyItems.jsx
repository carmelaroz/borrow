import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import RentalCard from './RentalCard';
import '../../styles/components/MyItems.css';

const MyItems = () => {
const { user } = useAuthContext();
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    if (!user) {
        setLoading(false); // avoid loading spinner if not logged in
        return;
    }
    const fetchAllRentals = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/rentals/user', {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setItems(data);
    } catch (err) {
        console.error('Failed to fetch rentals:', err.message);
    } finally {
        setLoading(false);
    }
    };

    fetchAllRentals();
}, [user]);

const handleDeleteSuccess = (deletedId) => {
    setItems(prev => prev.filter(item => item._id !== deletedId));
};

const handleEditSuccess = (updatedItem) => {
    setItems(prev =>
    prev.map(item => (item._id === updatedItem._id ? updatedItem : item))
    );
};

// Show message if not logged in
if (!user) {
    return (
    <div className="my-items-container">
        <h2>My Items</h2>
        <p className="not-logged-in">You must be logged in to view your items.</p>
    </div>
    );
  }

return (
    <div className="my-items-container">
    <h2>My Items</h2>
    {loading ? (
        <p>Loading...</p>
    ) : (
        <div className="items-list">
        {items.map(item => (
            <RentalCard key={item._id} item={item} onDeleteSuccess={handleDeleteSuccess}
            onEditSuccess={handleEditSuccess}/>
        ))}
        </div>
    )}
    {!loading && items.length === 0 && <p>No items found.</p>}
    </div>
);
};

export default MyItems;