import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [formData, setFormData] = useState({
    street_address: '',
    town: '',
    zipcode: '',
    county: '',
    phone_number_1: '',
    phone_number_2: '',
    additional_details: ''
  });
  const [errors, setErrors] = useState({});
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch CSRF token
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('https://hashtags-mech.onrender.com/get-csrf-token/');
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();

    // Fetch cart details
    axios.get('https://hashtags-mech.onrender.com/checkout/')
      .then(response => {
        const cartItems = response.data.cart_items.map(item => ({
          ...item,
          price: parseFloat(item.price),  // Convert price to a number
          total_price: parseFloat(item.total_price)  // Convert total_price to a number
        }));
        setCartItems(cartItems);
        setTotalAmount(parseFloat(response.data.total_amount));  // Convert total_amount to a number
      })
      .catch(error => {
        console.error('Error fetching cart details:', error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple form validation
    const requiredFields = ['street_address', 'town', 'zipcode', 'county', 'phone_number_1'];
    const newErrors = {};
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Place order and clear cart
      const response = await axios.post('https://hashtags-mech.onrender.com/place_order/', formData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        }
      });

      if (response.status === 200) {
        // Clear cart
        await axios.post('https://hashtags-mech.onrender.com/users/cart/clear/', {}, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          }
        });

        // Redirect to confirmation page
        navigate('/order_confirmed');
      } else {
        setErrors({ general: 'An unexpected error occurred.' });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setErrors({ general: 'An unexpected error occurred.' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-4xl font-bold mt-20 mb-4 text-center">Checkout</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">Cart Items</h3>
          <ul>
            {cartItems.map(item => (
              <li key={item.id} className="flex justify-between py-2">
                <span>{item.product_name}</span>
                <span>{item.quantity} x {item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="font-bold mt-2">Total Amount: {totalAmount.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="street_address">Street Address</label>
            <input
              type="text"
              name="street_address"
              value={formData.street_address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            {errors.street_address && <p className="text-red-500 text-xs italic">{errors.street_address}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="town">Town</label>
            <input
              type="text"
              name="town"
              value={formData.town}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            {errors.town && <p className="text-red-500 text-xs italic">{errors.town}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zipcode">Zip Code</label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            {errors.zipcode && <p className="text-red-500 text-xs italic">{errors.zipcode}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="county">County</label>
            <input
              type="text"
              name="county"
              value={formData.county}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            {errors.county && <p className="text-red-500 text-xs italic">{errors.county}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone_number_1">Phone Number 1</label>
            <input
              type="text"
              name="phone_number_1"
              value={formData.phone_number_1}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            {errors.phone_number_1 && <p className="text-red-500 text-xs italic">{errors.phone_number_1}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone_number_2">Phone Number 2</label>
            <input
              type="text"
              name="phone_number_2"
              value={formData.phone_number_2}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="additional_details">Additional Details</label>
            <textarea
              name="additional_details"
              value={formData.additional_details}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Place Order
            </button>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mt-4">
              {Object.entries(errors).map(([key, value]) => (
                <p key={key} className="text-center text-red-500 text-xs italic">{value}</p>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Checkout;
