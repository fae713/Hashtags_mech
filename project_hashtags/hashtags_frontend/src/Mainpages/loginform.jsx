import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [csrfToken, setCsrfToken] = useState(''); // Initialize CSRF token state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the CSRF token from a Django endpoint
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/get-csrf-token/'); // Adjust the URL to match your Django endpoint
        const data = await response.json();
        setCsrfToken(data.csrfToken); // Assuming the endpoint returns { csrfToken: 'token_value' }
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCsrfToken(); // Call the function here
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/ajax_login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Include the CSRF token in the request headers
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/home'); // Adjust the path as needed
      } else {
        const errorData = await response.json();
        setErrors(errorData);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrors({ general: "An unexpected error occurred." });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.username && <p className="text-red-500 text-xs italic">{errors.username}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          </div>
        </form>
        {Object.keys(errors).length > 0 && (
          <div>
            {Object.entries(errors).map(([key, value]) => (
              <p key={key} className="text-center text-red-500 text-xs italic">{value}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;