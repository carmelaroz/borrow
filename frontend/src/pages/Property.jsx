import { useParams } from 'react-router-dom';

function Property() {
  const { id } = useParams();

  // דוגמה לנתונים זמניים
  const property = {
    id: id,
    title: `נכס מספר ${id}`,
    location: 'תל אביב',
    price: 5000,
    description: 'דירה נעימה במרכז העיר, קרובה לתחבורה ציבורית.',
  };

  return (
    <div className="property">
      <h2>{property.title}</h2>
      <p>מיקום: {property.location}</p>
      <p>מחיר: {property.price} ₪</p>
      <p>תיאור: {property.description}</p>
      <button>צור קשר עם המשכיר</button>
    </div>
  );
}

export default Property;