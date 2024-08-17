import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('/get-csrf-token/');
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  useEffect(() => {
    axios.get('/users/cart/')
      .then(response => {
        console.log('Cart items response:', response.data);
        if (response.data && Array.isArray(response.data.cart_items)) {
          setCartItems(response.data.cart_items);
        } else {
          console.warn('Unexpected cart items response:', response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
        setLoading(false);
      });
  }, []);

  const removeFromCart = (productId) => {
    axios.delete(`/users/cart/remove/${productId}/`, {
      headers: {
        'X-CSRFToken': csrfToken,
      }
    })
    .then(response => {
      console.log('Item removed from cart:', response.data);
      setCartItems(cartItems.filter(item => item.product.product_id !== productId));
    })
    .catch(error => {
      console.error('Error removing item from cart:', error.response ? error.response.data : error);
    });
  };

  const addToCart = (productId, addQuantity = 1) => {
    axios.post(`/users/cart/add/${productId}/`, 
      { quantity: addQuantity }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        }
      }
    )
    .then(response => {
      console.log('Item added to cart:', response.data);
      setCartItems(cartItems.map(item =>
        item.product.product_id === productId
          ? { ...item, quantity: item.quantity + addQuantity }
          : item
      ));
    })
    .catch(error => {
      console.error('Error adding item to cart:', error.response ? error.response.data : error);
    });
  };

  const reduceQuantity = (productId) => {
    const item = cartItems.find(item => item.product.product_id === productId);
    if (item && item.quantity > 1) {
      addToCart(productId, -1);
    } else {
      removeFromCart(productId);
    }
  };

  const clearCart = () => {
    axios.delete('/users/cart/clear/', {
      headers: {
        'X-CSRFToken': csrfToken,
      }
    })
    .then(response => {
      console.log('Cart cleared:', response.data);
      setCartItems([]);
    })
    .catch(error => {
      console.error('Error clearing cart:', error.response ? error.response.data : error);
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-cart p-4">
      <h1 className="text-xl sm:text-2xl font-bold mt-12 sm:mt-20 mb-4">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart text-center">Your cart is empty</div>
      ) : (
        <div className="overflow-x-auto">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mb-4 w-full sm:w-auto"
            onClick={clearCart}
          >
            Clear Cart
          </button>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-xs sm:text-sm">Product Name</th>
                <th className="text-left py-3 px-4 font-semibold text-xs sm:text-sm">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-xs sm:text-sm">Quantity</th>
                <th className="text-left py-3 px-4 font-semibold text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product.product_id} className="border-t">
                  <td className="text-left py-2 px-2 sm:py-3 sm:px-4">{item.product.name}</td>
                  <td className="text-left py-2 px-2 sm:py-3 sm:px-4">${item.product.price}</td>
                  <td className="text-left py-2 px-2 sm:py-3 sm:px-4">{item.quantity}</td>
                  <td className="text-left py-2 px-2 sm:py-3 sm:px-4">
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 w-full sm:w-auto"
                        onClick={() => addToCart(item.product.product_id)}
                      >
                        Add More
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 w-full sm:w-auto"
                        onClick={() => reduceQuantity(item.product.product_id)}
                      >
                        Reduce
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full sm:w-auto"
                        onClick={() => removeFromCart(item.product.product_id)}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="bg-green-500 text-white px-3 py-1 mt-4 rounded hover:bg-green-600 w-full sm:w-auto"
            onClick={() => navigate('/checkout')}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCart;
