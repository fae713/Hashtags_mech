import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUser, } from "react-icons/hi";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfAndUserProfile = async () => {
      try {
        const csrfResponse = await fetch('/get-csrf-token/');
        const csrfData = await csrfResponse.json();
        setCsrfToken(csrfData.csrfToken);

        const userResponse = await fetch('/profile/', {
          headers: {
            'Accept': 'application/json',
            'X-CSRFToken': csrfData.csrfToken, // Include CSRF token in the request headers
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
          'X-CSRFToken': csrfToken, // Include CSRF token in the request headers
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
          'X-CSRFToken': csrfToken, // Include CSRF token in the request headers
        },
      });
      if (response.ok) {
        navigate('/login');
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
        <div><h1 className='text-2xl font-semibold'>User Profile</h1>
        <HiOutlineUser className='text-[180px]' />
        <div>
        </div>
          
        {/* <img 
          src={user.profile_image_url} 
          alt="User Icon" 
          style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '20px' }} 
        /> */}
        <div className='mt-5'>
        <div>
          <label>Username:</label>
          <span className='ml-2'>{user.username}</span>
        </div>

        <div>
          <label>Email:</label>
          <p>{user.email}</p>
        </div>

        <div className='mt-5'>
          <label>First Name:</label>
          <p>{user.first_name}</p>
        </div>

        <div>
          <label>Last Name:</label>
          <p>{user.last_name}</p>
        </div>
        </div>
        </div>
        <div>
          <button 
          onClick={fetchUserOrders} 
          style={{ marginTop: '20px', backgroundColor: '#7e22ce', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
        >
          View My Orders
        </button>

        {showOrders && (
          <div style={{ marginTop: '20px' }}>
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
          style={{ marginTop: '20px', backgroundColor: 'red', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
