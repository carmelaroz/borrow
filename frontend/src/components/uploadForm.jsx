import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import '../styles/components/UploadForm.css';
import { Autocomplete } from '@react-google-maps/api';

const UploadForm = () => {

    const { user } = useAuthContext();
    const navigate = useNavigate();
    const cityRef = useRef(null);
    const streetRef = useRef(null);

    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        pricePerDay: '',
        images: '',
        phone: user.user.phone || '',
        city: user.user.city || '', 
        street: user.user.street || '' 
    });

    const [success, setSuccess] = useState(false); // state to show message

    // const handlePlaceChange = (type) => {
    //     const place = type === 'city' ? cityRef.current?.getPlace() : streetRef.current?.getPlace();
    //     if (!place) return;
    
    //     const address = place.formatted_address;
    
    //     setForm(prev => ({
    //     ...prev,
    //     [type]: address
    //     }));
    // };
    
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

        setSuccess(true); // show success message
        } catch (err) {
        console.error(err);
        alert(err.message);
        }
    };

    return (
        <div className="upload-form-container">
        {success ? (
            <div className="alert alert-success shadow-lg flex flex-col items-center">
            <span className="text-lg font-semibold"> You successfully uploaded a new rental! </span>
            <button className="btn btn-primary mt-4" onClick={() => navigate('/dashboard')}>Close</button>
            </div>
        ) : (
            <>
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
                <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="input input-bordered w-full" />

                <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="input input-bordered w-full" />
                <input name="street" placeholder="Street" value={form.street} onChange={handleChange} className="input input-bordered w-full" />
                {/* <label>City:</label>
                <Autocomplete onLoad={ref => (cityRef.current = ref)} onPlaceChanged={() => handlePlaceChange('city')}>
                <input type="text" placeholder="Enter city" defaultValue={form.city}/>
                </Autocomplete>

                <label>Street:</label>
                <Autocomplete onLoad={ref => (streetRef.current = ref)} onPlaceChanged={() => handlePlaceChange('street')}>
                <input type="text" placeholder="Enter street" defaultValue={form.street}/>
                </Autocomplete> */}

                <div className="button-group flex gap-2">
                <button type="submit" className="btn btn-primary">Upload</button>
                <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
                </div>
            </form>
            </>
        )}
        </div>
    );
};

export default UploadForm;