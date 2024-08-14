import React, { useState } from 'react';
import ButterflyShirt from '../Components/Assets/butterfly hoodie.png';
import { FaStar } from "react-icons/fa";
import { HiOutlineSortAscending } from "react-icons/hi";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import Button from '../Components/button';

const MarketplacePage = () => {
  return (
    <div>
      <Navigationhistory />
      <div className='flex'>
        <SideNavbar />
        <Productcards />
      </div>
    </div>
  )
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

const Productcard = ({ image, title, price }) => {
  return (
    <div className="max-w-96 mx-auto md:max-w-sm bg-white overflow-hidden">
      <div className='bg-[#F2F2F2] p-5 md:p-10 w-full flex flex-col items-center'>
        <img className="w-full object-cover object-center" src={image} alt={title} />
      </div>  
      <div className="py-5 max-w-full">
        <h3 className="text-[14px] md:text-[16px] font-semibold text-gray-800">{title}</h3>
        <p className="text-[14px] md:text-[16px] font-semibold text-blue-700 pt-2">{price}</p>
        <div className='flex pt-2'>
          <FaStar color='#FFD700' fontSize={18} />
          <FaStar color='#FFD700' fontSize={18} />
          <FaStar color='#FFD700' fontSize={18} />
          <FaStar color='#FFD700' fontSize={18} />
        </div>
        <Button 
          className="mt-3 text-sm py-[7px] px-4 border-2 border-purple-700 text-purple-700 hover:bg-purple-700 hover:text-white rounded-lg w-full"
          onClick={() => alert('Added to Cart!')}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

const Productcards = () => {
  const [selectedCategory, setSelectedCategory] = useState('Collection');

  const Products = [
    { image: ButterflyShirt, title: 'Butterfly T-shirt', price: '₦187,340', category: 'Butterfly' },
    { image: ButterflyShirt, title: 'Wildthought Sweatshirt', price: '₦187,340', category: 'Wildthought' },
    { image: ButterflyShirt, title: 'Butterfly Sweatshirt', price: '₦187,340', category: 'Butterfly' },
    { image: ButterflyShirt, title: 'Wildthought T-shirt', price: '₦20,000', category: 'Wildthought' },
    { image: ButterflyShirt, title: 'Wildthought T-shirt', price: '₦20,000', category: 'Wildthought' },
    { image: ButterflyShirt, title: 'Wildthought T-shirt', price: '₦20,000', category: 'Wildthought' },
    { image: ButterflyShirt, title: 'Wildthought T-shirt', price: '₦20,000', category: 'Wildthought' },
    { image: ButterflyShirt, title: 'Wildthought T-shirt', price: '₦20,000', category: 'Wildthought' },
    { image: ButterflyShirt, title: 'Wildthought T-shirt', price: '₦20,000', category: 'Wildthought' },
    { image: ButterflyShirt, title: 'Wildthought T-shirt', price: '₦20,000', category: 'Wildthought' },
  ];

  const filteredProducts = Products.filter(
    product => selectedCategory === 'Collection' || product.category === selectedCategory
  );

  return (
    <div>
      <select className='mt-5 ml-5'
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}>
        <option className='p-3' value="Collection">Collection</option>
        <option className='p-3' value="Wildthought">Wildthought</option>
        <option className='p-3' value="Butterfly">Butterfly</option>
        <option className='p-3' value="Holy">Holy</option>
      </select>

      <div>
        {<HiOutlineSortAscending />}
      </div>

      <div className='py-10 px-5 md:pr-10 mt-5 md:mt-10 mr-0 md:mr-10 min-w-auto w-full'>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-8'>
          {filteredProducts.map((product, index) => (
            <Productcard 
              image={product.image} 
              title={product.title} 
              price={product.price} 
              key={index} 
            />
          ))}
        </div>
        <p className='items-center text-center'>This is a nav button</p>
      </div>
    </div>
  );
};

export default MarketplacePage;
