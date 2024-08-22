import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import herosectionImage from '../Components/Assets/hero.png';
import ButterflyHoodie from '../Components/Assets/butterfly hoodie.png';
import ButterflyShirt from '../Components/Assets/butterfly shirt.png';
import WildThoughtJacket from '../Components/Assets/wild thought jacket.png';
import WildThoughtHoodie from '../Components/Assets/wildthought hoodie.png';
import butter122 from '../Components/Assets/butterfly jacket.png';
import Button from '../Components/button';
import { FaStar } from "react-icons/fa";
import axios from 'axios';
import { useCart } from '../Components/cartcontext';

const HomePage = () => {
  const [csrfToken, setCsrfToken] = useState('');
  const [showPopup, setShowPopup] = useState(false);  // State for popup visibility
  const [showWelcomePopup, setShowWelcomePopup] = useState(false); // State for welcome popup
  const quantity = 1; // Set default quantity to 1
  const { setCartItemCount } = useCart();  // Use the setCartItemCount from the CartContext

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomePopup(true);
      setTimeout(() => setShowWelcomePopup(false), 10000);
    }, 5000); // Show popup after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const addToCart = (productId) => {
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
        setTimeout(() => setShowPopup(false), 3000);  
  
        axios.get('https://hashtags-mech.onrender.com/users/cart/item-count/')
          .then(response => {
            console.log('Fetched cart item count:', response.data.count);
            setCartItemCount(response.data.count);  
          })
          .catch(error => {
            console.error('Error fetching cart item count:', error);
          });
      } else {
        console.error('Error adding item to cart:', response.data.error);
      }
    })
    .catch(error => {
      console.error('Error adding item to cart:', error.response ? error.response.data : error);
    });
  };  
  
  const Herosection = () => {
    return (
      <div 
        className="w-full h-[600px] md:h-[800px] bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: `url(${herosectionImage})` }}
      >
        <div className='flex flex-col items-start justify-center h-full mx-5 md:mx-10'>
          <h1 
            className="text-white"
            style={{
              fontFamily: "'Irish Grover', sans-serif",
              fontSize: 'clamp(100px, 20vw, 280px)', 
              lineHeight: '1',
              marginTop: '10px', 
            }}
          >
            Hashtags
          </h1>

          <p 
            className="text-white mt-8"
            style={{
              fontSize: 'clamp(10px, 3.5vw, 18px)', 
              lineHeight: '32px',
              whiteSpace: 'pre-line', 
            }}
          >
            Explore our latest arrivals and discover the perfect outfit{'\n'}
            that speaks to your individuality.{'\n'}
          </p>
        </div>
      </div>
    );
  };

  const Bestsellers = () => {
    const products = [
      {
        id: 10,
        name: "Butterfly Sweat-shirt",
        price: "$250",
        image: ButterflyHoodie
      },
      {
        id: 2,
        name: "Butterfly Jacket",
        price: "$130",
        image: butter122
      },
      {
        id: 3,
        name: "Butterfly Shirt",
        price: "$421",
        image: ButterflyShirt
      },
      {
        id: 4,
        name: "Wild Thought Jacket",
        price: "$100",
        image: WildThoughtJacket
      },
      {
        id: 5,
        name: "Wild Thought Hoodie",
        price: "$75",
        image: WildThoughtHoodie
      },
    ];

    return (
      <div className='flex flex-col items-center h-auto mx-auto mt-12 md:mt-20 px-5 md:px-10'> 
        <h1 className='mt-7 text-2xl md:text-3xl lg:text-3xl font-semibold text-black-700'>Best Sellers</h1>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-10 mt-5 md:mt-10'>
          {products.map((product) => (
            <div key={product.id} className="bg-white overflow-hidden">
              <div className='bg-[#F2F2F2] p-5 w-full flex flex-col items-center'>
                <Link to={`/products/${product.id}`}>  {/* Linking the product */}
                  <img className="w-[250px] h-[250px] object-cover object-center" src={product.image} alt={product.name} 
                />
                </Link>
              </div>  
              <div className="py-5 px-4">
                <Link to={`/products/${product.id}`} className="block">
                  <h3 className="text-[16px] md:text-[20px] font-semibold text-gray-800 hover:text-blue-600 hover:underline transition-all duration-300">{product.name}</h3>
                </Link>
                <p className="text-[16px] md:text-[20px] font-semibold text-blue-700 pt-2">{product.price}</p>
                <div className='flex pt-2'>
                  {[1, 2, 3, 4].map((_, starIndex) => (
                    <FaStar key={starIndex} color='#FFD700' fontSize={18}/>
                  ))}
                </div>
                <Button 
                  className="mt-3 text-sm py-[7px] px-4 border-2 text-center border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white rounded-lg w-full"
                  onClick={() => addToCart(product.id)}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Link to="/store">
        <Button className="mt-5 md:mt-10 text-lg items-center h-full w-80 bg-purple-700 text-white hover:bg-purple-800">
          View Store
        </Button>
      </Link>
      </div>
    )
  }

  const Gallery = () => {
    return (
      <div className='flex flex-col justify-between items-center mt-24 px-5 md:px-10'>
        <h1 className='mt-7 text-2xl md:text-3xl lg:text-3xl font-semibold text-purple-700'>Our Gallery</h1>
        <p className='mt-5 md:mt-10 text-center text-lg md:text-xl font-semibold'>
          To feature on our gallery, take the best pictures with our wears, upload it on any social media with the hashtag 
          <span className='font-bold text-purple-700'> #TrendwithHashtagsMech</span>
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 p-10'>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Herosection />
      <Bestsellers />
      <Gallery />
      {showPopup && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Successfully added to cart!
        </div>
      )}
      {showWelcomePopup && (
        <div className="fixed bottom-5 right-5 bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg">
          Hello, kindly register or login to shop for products.
          Ignore if logged in. Enjoy your shopping!
        </div>
      )}
    </div>
  );
}

export default HomePage;
