import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import '../styles/components/UploadForm.css'

const UploadForm = () => {
const { user } = useAuthContext();
const navigate = useNavigate();

const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    pricePerDay: '',
    images: '',
    phone: '',
});

const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
};

const handleSubmit = async e => {
    e.preventDefault();

    try {
    const res = await fetch('http://localhost:5000/api/rentals', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    alert('Upload successful!');
    navigate('/dashboard');
    } catch (err) {
    console.error(err);
    alert(err.message);
    }
};

return (
    <div className="upload-form-container">
    <h2 className="text-xl font-bold mb-4">Upload Item for Rent</h2>
    <form onSubmit={handleSubmit} className="upload-form space-y-4">
        <input name="title" placeholder="Title" onChange={handleChange} className="input input-bordered w-full" />
        
        <textarea name="description" placeholder="Description" onChange={handleChange} className="textarea textarea-bordered w-full" />
        
        <select name="category" onChange={handleChange} className="select select-bordered w-full">
        <option value="">Select category</option>
        <option value="tools">Tools</option>
        <option value="clothes">Clothes</option>
        <option value="technology">Technology</option>
        <option value="furniture">Furniture</option>
        <option value="books">Books</option>
        <option value="sports">Sports</option>
        <option value="kitchen">Kitchen</option>
        </select>

        <input name="pricePerDay" placeholder="Price per day" onChange={handleChange} className="input input-bordered w-full" />
        <input name="images" placeholder="Image URL" onChange={handleChange} className="input input-bordered w-full" />
        <input name="phone" placeholder="Phone" onChange={handleChange} className="input input-bordered w-full" />

        <div className="button-group">
        <button type="submit" className="btn btn-primary">Upload</button>
        <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
        </div>
    </form>
    </div>
);
};

export default UploadForm;