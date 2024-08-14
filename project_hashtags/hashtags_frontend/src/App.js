import React from 'react';
import Navbar from './Components/navbar';
import Footer from './Components/footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Mainpages/homepage';
import MarketplacePage from './Mainpages/marketplace';
//import ContactUs from './Mainpages/ContactUs';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/Home" element={<HomePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;