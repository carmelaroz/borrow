import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import '../styles/components/ServiceForm.css';
import { serviceCategories } from '../constants/categories';

const ServiceForm = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        price: '',
        phone: user?.user?.phone || '',
        city: user?.user?.city || '',
        street: user?.user?.street || ''
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
                    <button className="btn btn-primary mt-4" onClick={() => navigate('/dashboard')}>Close</button>
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-bold mb-4">Offer a New Service</h2>
                    <form onSubmit={handleSubmit} className="service-form space-y-4">
                        <input 
                            name="title" 
                            placeholder="Title" 
                            value={form.title}
                            onChange={handleChange} 
                            className="input input-bordered w-full" 
                        />
                        <textarea 
                            name="description" 
                            placeholder="Description" 
                            value={form.description}
                            onChange={handleChange} 
                            className="textarea textarea-bordered w-full" 
                        />
                        <select 
                            name="category" 
                            value={form.category}
                            onChange={handleChange} 
                            className="select select-bordered w-full"
                        >
                            <option value="">Select category</option>
                            {serviceCategories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                        <input 
                            name="price" 
                            type="number"
                            placeholder="Price" 
                            value={form.price}
                            onChange={handleChange} 
                            className="input input-bordered w-full" 
                        />
                        <input 
                            name="phone" 
                            placeholder="Phone" 
                            value={form.phone}
                            onChange={handleChange} 
                            className="input input-bordered w-full" 
                        />
                        <input 
                            name="city" 
                            placeholder="City" 
                            value={form.city}
                            onChange={handleChange} 
                            className="input input-bordered w-full" 
                        />
                        <input 
                            name="street" 
                            placeholder="Street" 
                            value={form.street}
                            onChange={handleChange} 
                            className="input input-bordered w-full" 
                        />

                        <div className="button-group flex gap-2">
                            <button type="submit" className="btn btn-primary">Create Service</button>
                            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default ServiceForm;