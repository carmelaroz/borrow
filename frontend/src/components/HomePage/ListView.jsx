import React from "react";

const ListView = ({ rentals }) => {
return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {rentals.map((rental) => (
        <div key={rental._id} className="border rounded-lg p-4 shadow">
        {rental.photo && (
            <img
            src={rental.photo}
            alt={rental.title}
            className="w-full h-48 object-cover rounded mb-2"
            />
        )}
        <h3 className="text-lg font-semibold">{rental.title}</h3>
        <p className="text-sm text-gray-600 mb-1">{rental.description}</p>
        <p className="text-sm">
            <strong>Category:</strong> {rental.category}
        </p>
        <p className="text-sm">
            <strong>Price/Hour:</strong> ${rental.pricePerHour}
        </p>
        <p className="text-sm">
            <strong>Contact:</strong> {rental.firstName} {rental.lastName} ({rental.phone})
        </p>
        </div>
    ))}
    </div>
);
};

export default ListView;