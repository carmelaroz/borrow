import { useState } from 'react';
import '../../styles/components/Modal.css';

const EditRentalModal = ({ rental, onSave, onCancel }) => {
const [form, setForm] = useState({ ...rental });

const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = () => {
    onSave(form);
};

return (
    <div className="modal">
    <div className="modal-content">
        <h3>Edit Rental</h3>

        <label htmlFor="title">Title</label>
        <input name="title" value={form.title} onChange={handleChange} />

        <label htmlFor="description">Description</label>
        <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        rows={4}
        />
        <label htmlFor="category">Category</label>
        <select name="category" value={form.category} onChange={handleChange}>
        <option value="">Select a category</option>
        <option value="Tools">Tools</option>
        <option value="Electronics">Electronics</option>
        <option value="Vehicles">Vehicles</option>
        <option value="Sports">Sports</option>
        <option value="Furniture">Furniture</option>
        <option value="Clothes">Clothes</option>
        <option value="Other">Other</option>
        </select>

        <label htmlFor="phone">Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} />

        <label htmlFor="pricePerDay">Price Per Day (₪)</label>
        <input
        name="pricePerDay"
        type="number"
        value={form.pricePerDay}
        onChange={handleChange}
        />

        <div className="modal-buttons">
        <button onClick={handleSubmit}>Save</button>
        <button className="danger" onClick={onCancel}>Cancel</button>
        </div>
    </div>
    </div>
);
};

export default EditRentalModal;