import React from 'react';
import ButterflyHoodie from '../Components/Assets/butterfly hoodie.png';
import ButterflyJacket from '../Components/Assets/butterfly jacket.png';
import ButterflyShirt from '../Components/Assets/butterfly shirt.png';
import WildThoughtJacket from '../Components/Assets/wild thought jacket.png';
import WildThoughtHoodie from '../Components/Assets/wildthought hoodie.png';
import Button from '../Components/button';
import { FaStar } from "react-icons/fa";


const Productsection = () => {
  return (
    <div className="w-full h-[600px] md:h-[800px] bg-white">
        <div className='flex flex-row justify-center items-center h-full mx-5 md:mx-10'>
            {/* Image Part */}
            <div className=' h-[70%] mr-10'>
                <img src={ButterflyHoodie} alt="Butterfly Hoodie" className="p-10 mx-auto h-full object-cover" />
            </div>

            {/* Text Part */}
            <div className='flex-1 pl-10'>
                    <h1 className="text-black mb-4" style={{ fontFamily: "'Irish Grover', sans-serif", fontSize: 'clamp(50px, 3vw, 70px)' }}>
                        Butterfly Hoodie
                    </h1>

                    <p className="text-black mb-8" style={{ fontSize: 'clamp(14px, 2vw, 20px)', lineHeight: '28px' }}>
                        ₦187,340
                    </p>

                    <div className='flex items-center mb-8'>
                        {[1, 2, 3, 4].map((_, starIndex) => (
                        <FaStar key={starIndex} color='#FFD700' fontSize={18}/>
                        ))}
                    </div>

                    <p className="text-black" style={{ fontSize: 'clamp(14px, 2vw, 20px)', lineHeight: '28px' }}>
                        Dummy description goes here. Explore our latest arrivals and discover the perfect outfit that speaks to your individuality.
                    </p>

                    <div className="flex flex-colr">
                        <Button 
                            className="my-10 text-sm py-[7px] px-4 border-2 text-center border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white rounded-lg w-[50%]"
                            onClick={() => alert('Added to Cart!')}>
                            Add to Cart
                        </Button>
                    </div>
            </div>
        </div>
    </div>
  );
}

const RelatedProducts = () => {
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
      <h1 className='mt-7 text-2xl md:text-3xl lg:text-3xl font-semibold text-black-700'>Related Products</h1>
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
    </div>
  )
}



function HomePage() {
  return (
    <div>
      <Productsection />
      <RelatedProducts />
    </div>
  );
}

export default HomePage;
