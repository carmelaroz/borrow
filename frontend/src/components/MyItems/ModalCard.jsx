import { useState } from 'react';
import '../../styles/components/MyItems.css';
import '../../styles/components/ModalCard.css';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditModal from './EditModal';
import { useAuthContext } from '../../context/AuthContext';

const ModalCard = ({ item, onDeleteSuccess, onEditSuccess, type = 'rental' }) => {
    const [active, setActive] = useState(item.status === 'available');
    const [showDetails, setShowDetails] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const { user } = useAuthContext();

    const endpoint = type === 'rental' ? 'rentals' : 'services';

    const handleToggleStatus = () => {
        setActive(!active);
        // Optional: Add toggle backend logic here if needed
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/${endpoint}/${item._id}`, {
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
            const res = await fetch(`http://localhost:5000/api/${endpoint}/${item._id}`, {
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
                <p>{item.price}₪ / {type === 'rental' ? 'day' : 'hour'}</p>
                <p>Status: {active ? 'Available' : 'Not Available'}</p>
                <div className="card-actions">
                    <button className="toggle-view-btn" onClick={(e) => { e.stopPropagation(); setShowEditModal(true); }}>Edit</button>
                    <button className="toggle-view-btn" onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}>Delete</button>
                    <button className="toggle-view-btn" onClick={(e) => { e.stopPropagation(); handleToggleStatus(); }}>
                        {active ? 'Mark as Not Available' : 'Mark as Available'}
                    </button>
                </div>
            </div>

            {showDetails && (
            <div className="rental-card-modal" onClick={() => setShowDetails(false)}>
                <div className="rental-card-modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>{item.title}</h2>
                    <img src={item.images} alt={item.title} />
                    <p><strong>Description:</strong> {item.description}</p>
                    <p><strong>Category:</strong> {item.category}</p>
                    <p><strong>Phone:</strong> {item.phone}</p>
                    <p><strong>Price:</strong> {item.price}₪ / {type === 'rental' ? 'day' : 'hour'}</p>
                    <p><strong>City:</strong> {item.city}</p>
                    <p><strong>Street:</strong> {item.street}</p>
                    <button className="rental-close-btn" onClick={() => setShowDetails(false)}>Close</button>
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
                <EditModal
                    item={item}
                    type={type}
                    onSave={handleEditSave}
                    onCancel={() => setShowEditModal(false)}
                />
            )}
        </>
    );
};

export default ModalCard;