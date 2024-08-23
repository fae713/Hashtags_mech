import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../Components/button';
import { FaStar } from "react-icons/fa";
import { useCart } from '../Components/cartcontext';
import { Link } from 'react-router-dom';

import product2 from '../Components/Assets/3shirt.png';
import product3 from '../Components/Assets/sample.jpg';
import product5 from '../Components/Assets/5shirt.png';
import product7 from '../Components/Assets/7hoodie.png';
import product8 from '../Components/Assets/8shirt.png';


const ProductPage = () => {
  const [csrfToken, setCsrfToken] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const { setCartItemCount } = useCart(); // Get the cart update function from the context

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

  const handleAddToCart = (productId) => {
    const quantity = 1; // Set default quantity to 1

    axios.post(`https://hashtags-mech.onrender.com/users/cart/add/${productId}/`, 
      { quantity }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        }
      }
    )
    .then(response => {
      if (response.data.success) {
        console.log('Item added to cart:', response.data);
        setShowPopup(true);

        axios.get('https://hashtags-mech.onrender.com/users/cart/item-count/') 
          .then(response => {
            console.log('Fetched cart item count:', response.data.count);
            setCartItemCount(response.data.count);  
          })
          .catch(error => {
            console.error('Error fetching cart item count:', error);
          });

        setTimeout(() => setShowPopup(false), 3000);
      } else {
        console.error('Error adding item to cart:', response.data.error);
      }
    })
    .catch(error => {
      console.error('Error adding item to cart:', error.response ? error.response.data : error);
    });
  };

  return (
    <div>
      <Productsection csrfToken={csrfToken} handleAddToCart={handleAddToCart} showPopup={showPopup} />
      <RelatedProducts csrfToken={csrfToken} handleAddToCart={handleAddToCart} showPopup={showPopup} />
    </div>
  );
};

const Productsection = ({ csrfToken, handleAddToCart, showPopup }) => {
  return (
    <div className="w-full bg-white py-10 md:py-20">
      <div className='flex flex-col md:flex-row justify-center items-center mx-5 md:mx-10'>
        {/* Image Part */}
        <div className='w-full md:w-1/2 p-5 md:p-10'>
          <img src={product5} alt="Butterfly Hoodie" className="w-full h-auto object-cover" />
        </div>

        {/* Text Part */}
        <div className='w-full md:w-1/2 p-5 md:p-10'>
          <h1 className="text-black mb-4" style={{ fontFamily: "'Irish Grover', sans-serif", fontSize: 'clamp(30px, 4vw, 50px)' }}>
            Wild Thought Hoodie
          </h1>

          <p className="text-black mb-8" style={{ fontSize: 'clamp(14px, 3vw, 20px)', lineHeight: '1.5' }}>
            $75
          </p>

          <div className='flex items-center mb-8'>
            {[1, 2, 3, 4].map((_, starIndex) => (
              <FaStar key={starIndex} color='#FFD700' fontSize={18}/>
            ))}
          </div>

          <p className="text-black" style={{ fontSize: 'clamp(14px, 3vw, 18px)', lineHeight: '1.5' }}>
            Dummy description goes here. Explore our latest arrivals and discover the perfect outfit that speaks to your individuality.
          </p>

          <div className="flex flex-col mt-10">
            <Button 
              className="text-sm py-2 px-4 border-2 text-center border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white rounded-lg w-full md:w-1/2"
              onClick={() => handleAddToCart(5)}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Successfully added to cart!
        </div>
      )}
    </div>
  );
};

const RelatedProducts = ({ csrfToken, handleAddToCart, showPopup }) => {
  const products = [
    {
        id: 2,
        name: "Butterfly Shirt",
        price: "$130",
        image: product2
      },
      {
        id: 3,
        name: "Butterfly Offwhite Shirt",
        price: "$421",
        image: product3
      },
      {
        id: 8,
        name: "Butterfly Alien T-shirt",
        price: "$300",
        image: product8
      },
      {
        id: 7,
        name: "Wild Thought Shirt",
        price: "$180",
        image: product7
      },
  ];

  return (
    <div className='flex flex-col items-center mt-12 px-5 md:px-10'> 
      <h1 className='text-2xl md:text-3xl font-semibold text-black-700 mb-5'>Related Products</h1>
      <div className='grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <div key={product.id} className="bg-white overflow-hidden shadow-md rounded-lg">
            <div className='bg-[#F2F2F2] p-5 w-full flex flex-col items-center'>
              <img className="w-[250px] h-[100%] object-cover object-center" src={product.image} alt={product.name} />
            </div>   
            <div className="py-5 px-4">
              <Link to={`/products/${product.id}`}>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
                  {product.name}
                </h3>
              </Link>
              <p className="text-lg md:text-xl font-semibold text-blue-700 pt-2">{product.price}</p>
              <div className='flex pt-2'>
                {[1, 2, 3, 4].map((_, starIndex) => (
                  <FaStar key={starIndex} color='#FFD700' fontSize={18}/>
                ))}
              </div>
              <Button 
                className="mt-3 text-sm py-2 px-4 border-2 text-center border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white rounded-lg w-full"
                onClick={() => handleAddToCart(product.id)}>
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
      {showPopup && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Successfully added to cart!
        </div>
      )}
    </div>
  );
};

export default ProductPage;
