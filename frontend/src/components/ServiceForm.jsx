import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import '../styles/components/ServiceForm.css';

const ServiceForm = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        pricePerHour: '',
        phone: ''
    });
    const [success, setSuccess] = useState(false);

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/api/services', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSuccess(true);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    return (
        <div className="service-form-container">
            {success ? (
                <div className="alert alert-success shadow-lg flex flex-col items-center">
                    <span className="text-lg font-semibold">You successfully offered a new service!</span>
                    <button className="btn btn-primary mt-4" onClick={() => navigate('/my-items')}>Close</button>
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-bold mb-4">Offer a New Service</h2>
                    <form onSubmit={handleSubmit} className="service-form space-y-4">
                        <input 
                            name="title" 
                            placeholder="Title" 
                            onChange={handleChange} 
                            className="input input-bordered w-full" 
                        />
                        <textarea 
                            name="description" 
                            placeholder="Description" 
                            onChange={handleChange} 
                            className="textarea textarea-bordered w-full" 
                        />
                        <select 
                            name="category" 
                            onChange={handleChange} 
                            className="select select-bordered w-full"
                        >
                            <option value="">Select category</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Moving">Moving</option>
                            <option value="Gardening">Gardening</option>
                            <option value="Repair">Repair</option>
                            <option value="Teaching">Teaching</option>
                            <option value="Other">Other</option>
                        </select>
                        <input 
                            name="pricePerHour" 
                            type="number"
                            placeholder="Price per hour" 
                            onChange={handleChange} 
                            className="input input-bordered w-full" 
                        />
                        <input 
                            name="phone" 
                            placeholder="Phone" 
                            onChange={handleChange} 
                            className="input input-bordered w-full" 
                        />

                        <div className="button-group flex gap-2">
                            <button type="submit" className="btn btn-primary">Create Service</button>
                            <button type="button" className="btn btn-outline" onClick={() => navigate('/my-items')}>Cancel</button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default ServiceForm; 