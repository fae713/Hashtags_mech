import React from 'react'
import Button from './button';
import Logo from '../Components/Assets/logo.png';
import { ImFacebook2 } from "react-icons/im";
import { FaSquareTwitter, FaSquareInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className='bg-black h-auto'>

            <div className='px-5 md:px-10 h-auto'>
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 pt-7 md:py-10 pb-10 md:pb-14'>

                <div className='w-[100%] md:w-full h-14'>
                    <img className="max-w-full max-h-full object-cover object-center" src={Logo} alt="Logo" />
                </div>

                <div className='text-white'>
                            <p className='text-xl md:text-2xl font-semibold'>Links</p>
                            <ul>
                                <li className='py-3'>Home</li>
                                <li className='py-3'>Store</li>
                                <li className='py-3'>Contact Us</li>
                            </ul>
                        </div>
                        
                        
                        
                        <div className='w-[100%] items-center h-auto col-span-2 md:col-span-1'>
                            <h2 className='font-semibold text-white text-2xl md:text-2xl'>Newsletter</h2>
                            <div className='flex mt-3'>
                                <div className='w-[440px]'>
                                    <input 
                                    type="email" 
                                    placeholder='Enter your email address' 
                                    className='bg-white w-[95%] md:-[80%] h-full py-4 px-4 rounded text-sm '/> 
                                </div>

                                <div>
                                    <Button className="text-sm items-center h-full w-[103px] md:w-[127px] bg-purple-700 text-white hover:bg-purple-800" 
                                    onClick={() => alert('Subscribed!')}>
                                    Subscribe 
                                    </Button>
                                </div>
                            </div>

                            <div className='mt-5'>
                                <p className='font-semibold text-white text-lg md:text-xl py-2'>Social Links</p>
                                <div className='flex items-center h-[48px]'>
                                    <ImFacebook2 className='text-white text-3xl md:text-4xl pr-2' />
                                    <FaSquareTwitter className='text-white text-3xl md:text-4xl pr-2' />
                                    <FaSquareInstagram className='text-white text-3xl md:text-4xl pr-2' />
                                </div>
                            </div>
                        </div>

                </div>

            </div>



            <div className='mt-7 py-2 text-white items-center text-xs md:text-sm text-center border-t-[1px] border-solid'>
                <p>@HashtagsMech <sup>TM</sup></p>
            </div>
    </div>
  )
}

export default Footer