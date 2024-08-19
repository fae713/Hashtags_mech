import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineCheckCircle } from 'react-icons/hi'; // You can use any other icon or customize as needed

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10 px-5">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
        <HiOutlineCheckCircle className="text-green-500 text-6xl mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Confirmed</h1>
        <p className="text-lg mb-4">Thank you for your purchase!</p>
        <p className="text-sm text-gray-600 mb-6">You will receive an email confirmation shortly with the details of your order.</p>
        <Link to="/home">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
