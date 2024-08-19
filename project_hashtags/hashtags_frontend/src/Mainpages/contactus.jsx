import React from 'react';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10">
      <h1 
        className="text-4xl md:text-6xl text-purple-700 mb-8" 
        style={{
          fontFamily: "'Irish Grover', sans-serif",
          letterSpacing: '2px',
        }}
      >
        Contact Us
      </h1>
      <div 
        className="bg-white shadow-lg rounded-lg p-10 w-4/5 md:w-1/2"
        style={{
          fontFamily: "'Irish Grover', sans-serif",
          fontSize: '18px',
        }}
      >
        <p className="text-lg md:text-xl mb-6 text-gray-700">
          <span className="font-bold">Phone:</span> +2348171467612
        </p>
        <p className="text-lg md:text-xl mb-6 text-gray-700">
          <span className="font-bold">GitHub: </span> 
          <Link 
            to={{ pathname: "https://github.com/fae713/Hashtags_mech/tree/main" }} 
            target="_blank" 
            className="text-blue-600 hover:underline"
          >
                GITHUB
          </Link>
        </p>
        <p className="text-lg md:text-xl text-gray-700">
          <span className="font-bold">LinkedIn: </span> 
          <Link 
            to={{ pathname: "https://www.linkedin.com/in/favour-michael/" }} 
            target="_blank" 
            className="text-blue-600 hover:underline"
          >
                Michael Favour
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ContactUs;
