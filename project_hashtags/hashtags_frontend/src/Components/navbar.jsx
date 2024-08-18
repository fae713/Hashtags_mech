import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../Components/Assets/logo.png';
import { FiSearch } from "react-icons/fi";
import { HiOutlineX, HiOutlineMenuAlt3, HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi";
import { useCart } from '../Components/cartcontext';  // Import useCart from cartcontext

const Navbar = () => {
  const location = useLocation();
  const [nav, setNav] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { cartItemCount, setCartItemCount } = useCart();  // Use cart context

  // Fetch user authentication status
  useEffect(() => {
    fetch('user/status/', {
      credentials: 'include'  // Ensure the session cookie is sent
    })
      .then(response => response.json())
      .then(data => {
        console.log('User Status:', data);  // Log the response data
        setIsAuthenticated(!!data.id);
      })
      .catch(error => {
        console.error('Error fetching user status:', error);
        setIsAuthenticated(false);
      });
  }, []);

  // Fetch the cart item count with polling
  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        const response = await fetch('users/cart/item-count/', {
          credentials: 'include'  // Ensure the session cookie is sent
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Cart Item Count:', data);  // Log the cart item count
        setCartItemCount(data.cart_item_count);
      } catch (error) {
        console.error('Error fetching cart item count:', error);
        setCartItemCount(0);  // Ensure count is set to 0 on error
      }
    };

    fetchCartItemCount();
    const intervalId = setInterval(fetchCartItemCount, 3000); // Poll every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [setCartItemCount]);

  const handleNav = () => {
    setNav(!nav);
  };

  const [searchOpen, setSearchOpen] = useState(false);
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  return (
    <header>
      <nav className='fixed flex justify-between items-center h-20 w-full px-5 md:px-10 bg-[#000000] shadow-lg'>
        <div>
          <div className='w-[100%] md:w-full h-10'>
            <img className="max-w-full max-h-full object-cover object-center" src={Logo} alt="Logo" />
          </div>
        </div>

        <ul className='h-16 hidden md:flex text-[16px] text-white'>
          <li className={`p-5 ${location.pathname === '/home' ? 'text-purple-500' : ''}`}>
            <Link to="/home">Home</Link>
          </li>
          <li className={`p-5 ${location.pathname === '/marketplace' ? 'text-purple-500' : ''}`}>
            <Link to="/marketplace">Marketplace</Link>
          </li>
          <li className={`p-5 ${location.pathname === '/contact' ? 'text-purple-500' : ''}`}>
            <Link to="/contact">Contact Us</Link>
          </li>
        </ul>
        {/* navigation icons start here */}
        <div className='flex justify-between h-16 items-center px-0 text-white'>
          {/* Shopping cart icon wrapped with Link component */}
          <div className='relative mx-1 p-1 text-2xl md:text-xl stroke-2'>
            <Link to="/cart">
              <HiOutlineShoppingBag />
              {cartItemCount > 0 && (
                <span className='absolute top-[-5px] right-[-10px] bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1'>
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
          <div className='mx-1 p-1 text-2xl md:text-xl stroke-2'>
            <FiSearch onClick={toggleSearch} />
          </div>

          {searchOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex">
              <div className='w-[100%]'>
                <div className="flex bg-[#000000] py-4 px-5 md:px-10 w-[100%] items-center" onClick={(e) => e.stopPropagation()}>
                  <div className='w-[70%] md:w-[50%] mx-auto px-5 flex items-center bg-white rounded-lg border border-gray-300'>
                    <input type="text" placeholder="Search..." className='w-[100%] p-3 focus:outline-none focus:border-transparent focus:text-black'/>
                    <FiSearch className='text-2xl text-gray-600 mx-1' />
                  </div>
                  <HiOutlineX className='text-2xl mx-5' onClick={closeSearch}/>
                </div> 
              </div>
            </div>
          )}

          {/* Conditional rendering based on authentication status */}
          {isAuthenticated ? (
            <div className={`mx-1 p-1 text-2xl md:text-xl stroke-2 ${location.pathname === '/profile' ? 'text-purple-500' : ''}`}>
              <Link to="/profile"><HiOutlineUser /></Link>
            </div>
          ) : (
            <>
              <div className={`p-5 text-[16px] ${location.pathname === '/login' ? 'text-purple-500' : ''}`}>
                <Link to="/login">Login</Link>
              </div>
              <div className={`p-5 text-[16px] ${location.pathname === '/register' ? 'text-purple-500' : ''}`}>
                <Link to="/register">Sign Up</Link>
              </div>
            </>
          )}

          <div className='flex text-2xl items-center px-0 md:hidden' onClick={handleNav}>
            {nav ? <div className='text-[26px] stroke-2'><HiOutlineX /></div> : <div className='text-[26px] stroke-2'><HiOutlineMenuAlt3 /></div>}
          </div>
        </div>

        <div className={nav ? 'fixed top-20 w-[100%] h-[30%] bg-white p-4 shadow-xl ease-in-out duration-800 md:hidden' : 'fixed left-[-100%]'}>
          <ul className='pt-4 bg-[#f2f2f2]'>
            <li className={`p-5 ${location.pathname === '/home' ? 'text-purple-500' : ''}`}>
              <Link to="/home" onClick={handleNav}>HOME</Link>
            </li>
            <li className={`p-5 ${location.pathname === '/marketplace' ? 'text-purple-500' : ''}`}>
              <Link to="/marketplace" onClick={handleNav}>MARKETPLACE</Link>
            </li>
            <li className={`p-5 ${location.pathname === '/contact' ? 'text-purple-500' : ''}`}>
              <Link to="/contact" onClick={handleNav}>CONTACT US</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
