import React from 'react';
import herosectionImage from '../Components/Assets/hero.png';
import ButterflyHoodie from '../Components/Assets/butterfly hoodie.png';
import ButterflyJacket from '../Components/Assets/butterfly jacket.png';
import ButterflyShirt from '../Components/Assets/butterfly shirt.png';
import WildThoughtJacket from '../Components/Assets/wild thought jacket.png';
import WildThoughtHoodie from '../Components/Assets/wildthought hoodie.png';
import Button from '../Components/button';
import { FaStar } from "react-icons/fa";

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
}

const Bestsellers = () => {
  const products = [
    {
      name: "Butterfly T-shirt",
      price: "₦187,340",
      image: ButterflyHoodie
    },
    {
      name: "Butterfly Jacket",
      price: "₦150,000",
      image: ButterflyJacket
    },
    {
      name: "Butterfly Shirt",
      price: "₦120,000",
      image: ButterflyShirt
    },
    {
      name: "Wild Thought Jacket",
      price: "₦200,000",
      image: WildThoughtJacket
    },
    {
      name: "Wild Thought Hoodie",
      price: "₦180,000",
      image: WildThoughtHoodie
    },
  ];

  return (
    <div className='flex flex-col items-center h-auto mx-auto mt-12 md:mt-20 px-5 md:px-10'> 
      <h1 className='mt-7 text-2xl md:text-3xl lg:text-3xl font-semibold text-blue-700'>Best Sellers</h1>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-10 mt-5 md:mt-10'>
        {products.map((product, index) => (
          <div key={index} className="bg-white overflow-hidden">
            <div className='bg-[#F2F2F2] p-5 flex flex-col items-center'>
              <img className="w-full h-45 object-cover" src={product.image} alt={product.name} />
            </div>  
            <div className="py-5 px-4">
              <h3 className="text-[16px] md:text-[20px] font-semibold text-gray-800">{product.name}</h3>
              <p className="text-[16px] md:text-[20px] font-semibold text-blue-700 pt-2">{product.price}</p>
              <div className='flex pt-2'>
                {[1, 2, 3, 4].map((_, starIndex) => (
                  <FaStar key={starIndex} color='#FFD700' fontSize={18}/>
                ))}
              </div>
              <Button 
                className="mt-3 text-sm py-[7px] px-4 border-2 text-center border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white rounded-lg w-full"
                onClick={() => alert('Added to Cart!')}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button className="mt-5 md:mt-10 text-lg items-center h-full w-80 bg-purple-700 text-white hover:bg-purple-800" onClick={() => alert('View Marketplace clicked!')}>
        View Marketplace
      </Button>
    </div>
  )
}

const Gallery = () => {
  return (
    <div className='flex flex-col justify-between items-center mt-24 px-5 md:px-10'>
      <h1 className='mt-7 text-2xl md:text-3xl lg:text-3xl font-semibold text-blue-700'>Our Gallery</h1>
      <p className='mt-5 md:mt-10 text-center text-lg md:text-xl font-semibold'>
        To feature on our gallery, take the best pictures with our wears, upload it on any social media with the hashtag 
        <span className='font-bold text-blue-700'> #TrendwithHashtagsMech</span>
      </p>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 p-10'>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

function HomePage() {
  return (
    <div>
      <Herosection />
      <Bestsellers />
      <Gallery />
    </div>
  );
}

export default HomePage;
