import React from 'react';
import Navbar from './Components/navbar';
import Footer from './Components/footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Mainpages/homepage';
import UserReg from './Mainpages/registerform';
import MarketplacePage from './Mainpages/marketplace';
import LoginForm from './Mainpages/loginform';
import UserProfile from './Mainpages/userprofile';
import ProductPage from './Mainpages/productpage';
import CartPage from './Mainpages/usercart';
//import ContactUs from './Mainpages/ContactUs';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/Home" element={<HomePage />} />
        <Route path="" element={<HomePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/register" element={<UserReg />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/products/1" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;