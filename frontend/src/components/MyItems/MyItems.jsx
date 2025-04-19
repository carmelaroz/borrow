import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RentalCard from './RentalCard';
import '../../styles/components/MyItems.css';

const MyItems = () => {
const { user } = useAuthContext();
const navigate = useNavigate();
const [items, setItems] = useState([]);
const [services, setServices] = useState([]);
const [loading, setLoading] = useState(true);
const [view, setView] = useState('items'); // 'items' or 'services'

useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    }
    const fetchData = async () => {
        try {
            // Fetch items
            const itemsRes = await fetch('http://localhost:5000/api/rentals/user', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const itemsData = await itemsRes.json();
            if (!itemsRes.ok) throw new Error(itemsData.error);
            setItems(itemsData);

            // Fetch services
            const servicesRes = await fetch('http://localhost:5000/api/services/user', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const servicesData = await servicesRes.json();
            if (!servicesRes.ok) throw new Error(servicesData.error);
            setServices(servicesData);
        } catch (err) {
            console.error('Failed to fetch data:', err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, [user]);

const handleDeleteSuccess = (deletedId, type) => {
    if (type === 'item') {
        setItems(prev => prev.filter(item => item._id !== deletedId));
    } else {
        setServices(prev => prev.filter(service => service._id !== deletedId));
    }
};

const handleEditSuccess = (updatedItem, type) => {
    if (type === 'item') {
        setItems(prev =>
            prev.map(item => (item._id === updatedItem._id ? updatedItem : item))
        );
    } else {
        setServices(prev =>
            prev.map(service => (service._id === updatedItem._id ? updatedItem : service))
        );
    }
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
    <h2>My {view === 'items' ? 'Items' : 'Services'}</h2>
    
    {/* View Toggle Switch */}
    <div className="view-switch-container">
        <span className={`view-label ${view === 'items' ? 'active' : ''}`}>Items</span>
        <label className="switch">
            <input 
                type="checkbox" 
                checked={view === 'services'} 
                onChange={() => setView(view === 'items' ? 'services' : 'items')}
            />
            <span className="slider round"></span>
        </label>
        <span className={`view-label ${view === 'services' ? 'active' : ''}`}>Services</span>
    </div>

    {loading ? (
        <p>Loading...</p>
    ) : (
        <div className="items-list">
        {view === 'items' ? (
            items.map(item => (
                <RentalCard 
                    key={item._id} 
                    item={item} 
                    onDeleteSuccess={(id) => handleDeleteSuccess(id, 'item')}
                    onEditSuccess={(updatedItem) => handleEditSuccess(updatedItem, 'item')}
                />
            ))
        ) : (
            <>
                {services.length > 0 ? (
                    services.map(service => (
                        <RentalCard 
                        key={service._id} 
                        item={service} 
                        isService={true}
                        // Edit/Delete handlers will be implemented later
                        onDeleteSuccess={() => {/* TODO: Implement delete service */}}
                        onEditSuccess={() => {/* TODO: Implement edit service */}}
                    />
                    ))
                ) : (
                    <div className="services-placeholder">
                        <p>You haven't offered any services yet</p>
                    </div>
                )}
            </>
        )}
        </div>
    )}
    {!loading && view === 'items' && items.length === 0 && <p>No items found.</p>}

    </div>
);
};

export default MyItems;