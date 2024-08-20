import React from 'react';
import Navbar from './Components/navbar';
import Footer from './Components/footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Mainpages/homepage';
import UserReg from './Mainpages/registerform';
import MarketplacePage from './Mainpages/marketplace';
import LoginForm from './Mainpages/loginform';
import UserProfile from './Mainpages/userprofile';
import CartPage from './Mainpages/usercart';
import SuccssPage from './Mainpages/success';
import Checkoutpage from './Mainpages/checkoutpage';
import ProductPage1 from './Mainpages/productpage1';
import ScrollToTop from './Components/scrolltoTop';
import Productpage2 from './Mainpages/2productpage2';
import Productpage3 from './Mainpages/3productpage3';
import Productpage4 from './Mainpages/4productpage4';
import Productpage5 from './Mainpages/5productpage5';
import Productpage6 from './Mainpages/6productpage6';
import Productpage7 from './Mainpages/7productpage7';
import Productpage8 from './Mainpages/8productpage8';
import Productpage9 from './Mainpages/9productpage';
import Productpage10 from './Mainpages/10productpage';
import ContactUs from './Mainpages/contactus';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="" element={<HomePage />} />
        <Route path="/store" element={<MarketplacePage />} />
        <Route path="/register" element={<UserReg />} />
        <Route path="/order_confirmed" element={<SuccssPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/checkout" element={<Checkoutpage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/products/1" element={<ProductPage1 />} />
        <Route path="/products/2" element={<Productpage2 />} />
        <Route path="/products/3" element={<Productpage3 />} />
        <Route path="/products/4" element={<Productpage4 />} />
        <Route path="/products/5" element={<Productpage5 />} />
        <Route path="/products/6" element={<Productpage6 />} />
        <Route path="/products/7" element={<Productpage7 />} />
        <Route path="/products/8" element={<Productpage8 />} />
        <Route path="/products/9" element={<Productpage9 />} />
        <Route path="/products/10" element={<Productpage10 />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
