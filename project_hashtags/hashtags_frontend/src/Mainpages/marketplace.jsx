import React, { useState, useEffect } from 'react';
import ButterflyShirt from '../Components/Assets/butterfly hoodie.png';
import { FaStar } from "react-icons/fa";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import Button from '../Components/button';
import axios from 'axios';
import Navbar from '../Components/navbar'; 
import { useCart } from '../Components/cartcontext';
import { Link } from 'react-router-dom';

const MarketplacePage = () => {
  const [csrfToken, setCsrfToken] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const { setCartItemCount } = useCart();  // Use Cart Context

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

  const addToCart = (productId) => {
    const quantity = 1;

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
        setTimeout(() => setShowPopup(false), 3000);

        // Fetch the updated cart item count
        axios.get('/users/cart/item-count/')
          .then(response => {
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

  return (
    <div>
      <Navbar /> 
      <Navigationhistory />
      <div className='flex'>
        <SideNavbar />
        <Productcards addToCart={addToCart} />
      </div>
      {showPopup && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Successfully added to cart!
        </div>
      )}
    </div>
  );
}

const Navigationhistory = () => {
  return (
    <div className='bg-[#ffff]'>
      <div className='mb-5 pt-20 flex px-5 md:px-10 pb-3 text-sm md:text-lg font-medium items-center border-b-[3px] border-solid border-gray-400'>
        <h3 className='pl-0 pr-3 pt-2 text-gray-600'>Marketplace</h3>
        <div className='px-1 pt-2 text-gray-600 text-lg md:text-xl'><MdOutlineArrowForwardIos /></div>
        <h3 className='px-3 pt-2 text-gray-900'>All</h3>
      </div>
    </div>
  )
}

const SideNavbar = () => {
  return (
    <div className='hidden md:block ml-5 md:ml-10 mr-5 pt-5 md:mt-10 w-[20%]'>
      <ul className='text-xl font-semibold'>
        <li className='py-4'>Men</li>
        <li className='py-4'>Women</li>
      </ul>

      <div className='font-medium'>
        <label className="flex items-center mt-5">
          <input type="checkbox" className="hidden peer" />
          <div className="w-6 h-6 bg-[#f2f2f2] rounded-sm peer-checked:bg-blue-600 
            peer-checked:after:content-['✓'] peer-checked:after:text-white peer-checked:after:font-bold 
            peer-checked:after:flex peer-checked:after:justify-center peer-checked:after:items-center">
          </div>
          <span className="ml-3 text-xl text-gray-700">T-Shirts</span>
        </label>

        <label className="flex items-center mt-5">
          <input type="checkbox" className="hidden peer" />
          <div className="w-6 h-6 bg-[#f2f2f2] rounded-sm peer-checked:bg-blue-600 
            peer-checked:after:content-['✓'] peer-checked:after:text-white peer-checked:after:font-bold 
            peer-checked:after:flex peer-checked:after:justify-center peer-checked:after:items-center">
          </div>
          <span className="ml-3 text-xl text-gray-700">Sweatshirts</span>
        </label>

        <label className="flex items-center mt-5">
          <input type="checkbox" className="hidden peer" />
          <div className="w-6 h-6 bg-[#f2f2f2] rounded-sm peer-checked:bg-blue-600 
            peer-checked:after:content-['✓'] peer-checked:after:text-white peer-checked:after:font-bold 
            peer-checked:after:flex peer-checked:after:justify-center peer-checked:after:items-center">
          </div>
          <span className="ml-3 text-xl text-gray-700">Hoodies</span>
        </label>

        <label className="flex items-center mt-5">
          <input type="checkbox" className="hidden peer" />
          <div className="w-6 h-6 bg-[#f2f2f2] rounded-sm peer-checked:bg-blue-600 
            peer-checked:after:content-['✓'] peer-checked:after:text-white peer-checked:after:font-bold 
            peer-checked:after:flex peer-checked:after:justify-center peer-checked:after:items-center">
          </div>
          <span className="ml-3 text-xl text-gray-700">Jackets</span>
        </label>
      </div>
    </div>
  )
}

const Productcard = ({ image, title, price, id, addToCart }) => {
  return (
    <div className="max-w-96 mx-auto md:max-w-sm bg-white overflow-hidden">
      <div className='bg-[#F2F2F2] p-5 md:p-10 w-full flex flex-col items-center'>
        <img className="w-full object-cover object-center" src={image} alt={title} />
      </div>  
      <div className="py-5 max-w-full">
        <Link to={`/products/${id}`}>  {/* Linking the product */}
          <h3 className="text-[14px] md:text-[16px] font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
            {title}
          </h3>
        </Link>
        <p className="text-[14px] md:text-[16px] font-semibold text-blue-700 pt-2">{price}</p>
        <div className='flex pt-2'>
          <FaStar color='#FFD700' fontSize={18} />
          <FaStar color='#FFD700' fontSize={18} />
          <FaStar color='#FFD700' fontSize={18} />
          <FaStar color='#FFD700' fontSize={18} />
        </div>
        <Button 
          className="mt-3 text-sm py-[7px] px-4 border-2 border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white rounded-lg w-full"
          onClick={() => addToCart(id)}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

const Productcards = ({ addToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState('Collection');

  const Products = [
    { id: 1, image: ButterflyShirt, title: 'Butterfly T-shirt', price: '₦187,340', category: 'Butterfly' },
    { id: 2, image: ButterflyShirt, title: 'Wildthought Sweatshirt', price: '₦187,340', category: 'Wildthought' },
    { id: 3, image: ButterflyShirt, title: 'Butterfly Sweatshirt', price: '₦187,340', category: 'Butterfly' },
    { id: 4, image: ButterflyShirt, title: 'Wildthought T-shirt', price: '₦20,000', category: 'Wildthought' },
    { id: 5, image: ButterflyShirt, title: 'Wildthought T-shirt', price: '₦20,000', category: 'Butterfly' },
    { id: 6, image: ButterflyShirt, title: 'Wildthought T-shirt', price: '₦20,000', category: 'Wildthought' },
    { id: 7, image: ButterflyShirt, title: 'Wildthought T-shirt', price: '₦20,000', category: 'Wildthought' },
    { id: 8, image: ButterflyShirt, title: 'Wildthought T-shirt', price: '₦20,000', category: 'Wildthought' },
    { id: 9, image: ButterflyShirt, title: 'Wildthought T-shirt', price: '₦20,000', category: 'Butterfly' },
  ];

  const filteredProducts = Products.filter(
    product => selectedCategory === 'Collection' || product.category === selectedCategory
  );

  return (
    <div>
      <select 
        className='mt-5 mb-5'
        onChange={(e) => setSelectedCategory(e.target.value)}
        value={selectedCategory}
      >
        <option value="Collection">Collection</option>
        <option value="Butterfly">Butterfly</option>
        <option value="Wildthought">Wildthought</option>
      </select>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-5 md:px-10'>
        {filteredProducts.map((product) => (
          <Productcard 
            key={product.id} 
            id={product.id}  // Pass the product ID here
            image={product.image} 
            title={product.title} 
            price={product.price} 
            addToCart={addToCart} 
          />
        ))}
      </div>
    </div>
  );
}

export default MarketplacePage;
