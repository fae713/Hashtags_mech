import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ButterflyHoodie from '../Components/Assets/butterfly hoodie.png';
import ButterflyJacket from '../Components/Assets/butterfly jacket.png';
import ButterflyShirt from '../Components/Assets/butterfly shirt.png';
import WildThoughtJacket from '../Components/Assets/wild thought jacket.png';
import WildThoughtHoodie from '../Components/Assets/wildthought hoodie.png';
import Button from '../Components/button';
import { FaStar } from "react-icons/fa";
import { useCart } from '../Components/cartcontext';
import { Link } from 'react-router-dom';

const ProductPage = () => {
  const [csrfToken, setCsrfToken] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const { setCartItemCount } = useCart(); // Get the cart update function from the context

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/get-csrf-token/');
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

    axios.post(`/users/cart/add/${productId}/`, 
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

        axios.get('/users/cart/item-count/') 
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
          <img src={ButterflyHoodie} alt="Butterfly Hoodie" className="w-full h-auto object-cover" />
        </div>

        {/* Text Part */}
        <div className='w-full md:w-1/2 p-5 md:p-10'>
          <h1 className="text-black mb-4" style={{ fontFamily: "'Irish Grover', sans-serif", fontSize: 'clamp(30px, 4vw, 50px)' }}>
            Butterfly Hoodie
          </h1>

          <p className="text-black mb-8" style={{ fontSize: 'clamp(14px, 3vw, 20px)', lineHeight: '1.5' }}>
            ₦187,340
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
      id: 1,
      name: "Butterfly T-shirt",
      price: "₦187,340",
      image: ButterflyHoodie
    },
    {
      id: 2,
      name: "Butterfly Jacket",
      price: "₦150,000",
      image: ButterflyJacket
    },
    {
      id: 3,
      name: "Butterfly Shirt",
      price: "₦120,000",
      image: ButterflyShirt
    },
    {
      id: 4,
      name: "Wild Thought Jacket",
      price: "₦200,000",
      image: WildThoughtJacket
    },
    {
      id: 6,
      name: "Wild Thought Hoodie",
      price: "₦180,000",
      image: WildThoughtHoodie
    },
  ];

  return (
    <div className='flex flex-col items-center mt-12 px-5 md:px-10'> 
      <h1 className='text-2xl md:text-3xl font-semibold text-black-700 mb-5'>Related Products</h1>
      <div className='grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {products.map((product) => (
          <div key={product.id} className="bg-white overflow-hidden shadow-md rounded-lg">
            <div className='bg-[#F2F2F2] p-5 flex flex-col items-center'>
              <img className="w-full h-40 object-cover" src={product.image} alt={product.name} />
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
