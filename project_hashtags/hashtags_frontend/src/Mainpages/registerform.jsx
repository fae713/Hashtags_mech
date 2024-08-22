import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: ''
  });

  const [errors, setErrors] = useState({});
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('https://hashtags-mech.onrender.com/get-csrf-token/');
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setErrors({ password2: "Passwords don't match." });
      return;
    }
  
    try {
      const response = await fetch('https://hashtags-mech.onrender.com/register/submit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const loginResponse = await fetch('https://hashtags-mech.onrender.com/ajax_login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });
  
        if (loginResponse.ok) {
          navigate('/');
          window.location.reload();
        } else {
          setErrors({ general: "Login failed after registration." });
        }
      } else {
        const errorData = await response.json();
        setErrors(errorData);
      }
    } catch (error) {
      console.error("Error registering:", error);
      setErrors({ general: "An unexpected error occurred." });
    }
  };
  

  return (
    <div className="min-h-screen pb-14 flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white mt-28 p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 leading-relaxed text-center">Create an Account</h1>
        <p className="text-lg text-center mb-8">It takes less than a minute.</p>
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.first_name && <p className="text-red-500 text-xs italic">{errors.first_name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.last_name && <p className="text-red-500 text-xs italic">{errors.last_name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
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

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.password2 && <p className="text-red-500 text-xs italic">{errors.password2}</p>}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Sign Up
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
        <p className="text-center mt-4">When You Click the Register Button, You Agree to our <a href="/terms-and-conditions" className="text-blue-500 hover:text-blue-700">Terms and Conditions</a>.</p>
      </div>
    </div>
  );
};

export default RegisterForm;
