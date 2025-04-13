import { useState } from 'react';
import '../../styles/components/MyItems.css';
import '../../styles/components/RentalCard.css';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditRentalModal from './EditRentalModal';
import { useAuthContext } from '../../context/AuthContext';

const RentalCard = ({ item, onDeleteSuccess, onEditSuccess }) => {
const [active, setActive] = useState(item.status === 'available');
const [showDetails, setShowDetails] = useState(false);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const { user } = useAuthContext();

const handleToggleStatus = () => {
    setActive(!active);
    // Optional: update backend for status change
};

const handleDelete = async () => {
    try {
    const res = await fetch(`http://localhost:5000/api/rentals/${item._id}`, {
        method: 'DELETE',
        headers: {
        Authorization: `Bearer ${user.token}`,
        },
    });
    if (res.ok) {
        onDeleteSuccess?.(item._id);
    }
    } catch (err) {
    console.error('Delete failed:', err);
    } finally {
    setShowDeleteConfirm(false);
    }
};

const handleEditSave = async (updatedItem) => {
    try {
    const res = await fetch(`http://localhost:5000/api/rentals/${item._id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedItem),
    });
    if (res.ok) {
        const data = await res.json();
        onEditSuccess?.(data);
    }
    } catch (err) {
    console.error('Edit failed:', err);
    } finally {
    setShowEditModal(false);
    }
};

return (
    <>
    <div className="rental-card" onClick={() => setShowDetails(true)}>
        <img src={item.images} alt={item.title} />
        <h3>{item.title}</h3>
        <p>{item.pricePerDay}₪ / day</p>
        <p>Status: {active ? 'Available' : 'Not Available'}</p>
        <div className="card-actions">
        <button onClick={(e) => { e.stopPropagation(); setShowEditModal(true); }}>Edit</button>
        <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}>Delete</button>
        <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(); }}>
            {active ? 'Mark as Not Available' : 'Mark as Available'}
        </button>
        </div>
    </div>

    {showDetails && (
        <div className="modal" onClick={() => setShowDetails(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{item.title}</h2>
            <img src={item.images} alt={item.title} />
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Phone:</strong> {item.phone}</p>
            <p><strong>Price:</strong> {item.pricePerDay}₪</p>
            <button onClick={() => setShowDetails(false)}>Close</button>
        </div>
        </div>
    )}

    {showDeleteConfirm && (
        <DeleteConfirmationModal
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        />
    )}

    {showEditModal && (
        <EditRentalModal
        rental={item}
        onSave={handleEditSave}
        onCancel={() => setShowEditModal(false)}
        />
    )}
    </>
);
};

export default RentalCard;