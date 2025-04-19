// import React from "react";
// import '../../styles/HomePage/ListView.css'


// const ListView = ({ rentals }) => {
//     return (
//     <div className="list-container-wrapper">
//         <div className="list-container">
//             {rentals.map((rental) => (
//             <div key={rental._id} className="rental-card">
//                 {rental.photo && (
//                 <img
//                     src={rental.photo}
//                     alt={rental.title}
//                     className="rental-image"
//                 />
//                 )}
//                 <h3 className="rental-title"> {rental.title}</h3>
//                 <p className="rental-description">📝 {rental.description}</p>
//                 <p className="rental-info">
//                 🏷️ <strong>Category:</strong> {rental.category}
//                 </p>
//                 <p className="rental-info">
//                 💸 <strong>Price/Hour:</strong> {rental.pricePerHour}₪
//                 </p>
//                 <p className="rental-info">
//                 📞 <strong>Contact:</strong> {rental.firstName} {rental.lastName} ({rental.phone})
//                 </p>
//             </div>
//             ))}
//         </div>
//     </div>
//     );
// };

// export default ListView;


import React, { useState } from "react";
import ImagePopup from "./ListImagePopup.jsx"; // Import the new ImagePopup component
import '../../styles/HomePage/ListView.css';

const ListView = ({ rentals }) => {
const [selectedRental, setSelectedRental] = useState(null);

const handleClick = (rental) => {
    setSelectedRental(rental);
};

const handleClosePopup = () => {
    setSelectedRental(null);
};

return (
    <div className="list-container-wrapper">
    <div className="list-container">
        {rentals.map((rental) => (
        <div
            key={rental._id}
            className="rental-card"
            onClick={() => handleClick(rental)} // Show pop-up when clicked
        >
            {rental.photo && (
            <img
                src={rental.photo}
                alt={rental.title}
                className="rental-image"
            />
            )}
            <h3 className="rental-title"> {rental.title}</h3>
            <p className="rental-description">📝 {rental.description}</p>
            <p className="rental-info">
            🏷️ <strong>Category:</strong> {rental.category}
            </p>
            <p className="rental-info">
            💸 <strong>Price/Hour:</strong> {rental.pricePerHour}₪
            </p>
            <p className="rental-info">
            📞 <strong>Contact:</strong> {rental.firstName} {rental.lastName} ({rental.phone})
            </p>
        </div>
        ))}
    </div>

    {/* Display the pop-up if a rental is selected */}
    {selectedRental && (
        <ImagePopup rental={selectedRental} onClose={handleClosePopup} />
    )}
    </div>
);
};

export default ListView;