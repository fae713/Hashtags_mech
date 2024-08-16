import React, { useEffect, useState } from 'react';
import { HiOutlineUser } from "react-icons/hi";

const UserProfile = () => {
  const [user, setUser] = useState({
    id: '',
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfAndUserProfile = async () => {
      try {
        const csrfResponse = await fetch('/get-csrf-token/');
        const csrfData = await csrfResponse.json();
        setCsrfToken(csrfData.csrfToken);

        const userResponse = await fetch('/profile/', {
          headers: {
            'Accept': 'application/json',
            'X-CSRFToken': csrfData.csrfToken,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.user);
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching CSRF token and user profile:', error);
      }
    };

    fetchCsrfAndUserProfile();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('/orders/', {
        headers: {
          'Accept': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setShowOrders(true);
      } else {
        console.error('Failed to fetch user orders');
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
      if (response.ok) {
        window.location.href = '/';  // Refresh page and navigate to home
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="profile-page" style={{ display: 'flex', padding: '20px' }}>
      <div style={{ flex: 1, paddingRight: '20px' }}>
        <div className='flex mt-20 justify-between'>
          <div>
            <h1 className='text-2xl font-semibold'>User Profile</h1>
            <HiOutlineUser className='text-[180px]' />
            <div className='mt-5'>
              <div>
                <label className='font-semibold'>Username:</label>
                <span className='ml-2 font-serif'>{user.username}</span>
              </div>

              <div className='mt-5'>
                <label className='font-semibold'>Email:</label>
                <span className='ml-2 font-serif'>{user.email}</span>
              </div>

              <div className='mt-5'>
                <label className='font-semibold'>First Name:</label>
                <span className='ml-2 font-serif'>{user.first_name}</span>
              </div>

              <div className='mt-5'>
                <label className='font-semibold'>Last Name:</label>
                <span className='ml-2 font-serif'>{user.last_name}</span>
              </div>
            </div>
          </div>

          <div>
            <button 
              onClick={fetchUserOrders} 
              className='mt-[20px] bg-purple-700 text-white px-[5px] text-s md:text[xl] md:px-[10px] py-[10px] md:py-[20px] cursor-pointer'
            >
              View My Orders
            </button>

            {showOrders && (
              <div className='mt-[20]'>
                <h2>Order History</h2>
                {orders.length === 0 ? (
                  <p>No orders found.</p>
                ) : (
                  <ul>
                    {orders.map(order => (
                      <li key={order.id}>{order.details}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          className='mt-[20px] bg-red-600 text-white px-[5] md:px-[10px]  py-[10] md:py-[20px] cursor-pointer'
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
