import React from 'react'
import logo from './../../assets/Ticketeer-Logo.png'
import { Link } from 'react-router-dom';

const footerLink = [
    {url: '/', title: 'Home'},
    {url: '/about', title: 'About'},
    {url: '/events', title: 'Events'},
    {url: '/blog', title: 'Blog'}
  ]

const Footer = () => {
    const getCurrentYear = () => {
        return new Date().getFullYear();
    };
    
  return (
    <div>
        <div className='bg-footerBg h-80 flex md:flex-row flex-col items-center justify-evenly text-white'>
            <div className='flex flex-col gap-6 items-start'>
                <div>
                    <img src={logo} alt="Ticketeer Logo" />
                </div>
                <p className='font-inter lg:font-medium font-normal lg:text-lg md:text-base text-sm'>&copy; {getCurrentYear()}. All Rights Reserved</p>
            </div>
            <div className='flex lg:gap-20 md:gap-10 gap-12'>
                <div className='flex flex-col gap-6'>
                    <div className='font-lora lg:font-semibold font-medium lg:text-lg md:text-base text-sm'>About</div>
                    <ul className='flex flex-col gap-4 font-inter md:font-medium font-normal md:text-sm text-xs'>
                        <Link to='/about'><li className='hover:text-orange-300'>About</li></Link>
                        <Link to='/terms-and-conditions'><li className='hover:text-orange-300'>Terms and conditions</li></Link>
                        <Link to='/privacy-policy'><li className='hover:text-orange-300'>Privacy Policy</li></Link>
                    </ul>
                </div>
                <div className='flex flex-col gap-6'>
                    <div className='font-lora lg:font-semibold font-medium lg:text-lg md:text-base text-sm'>Event</div>
                    <ul className='flex flex-col gap-4 font-inter md:font-medium font-normal md:text-sm text-xs'>
                        <Link to='/about'><li className='hover:text-orange-300'>Event</li></Link>
                        <Link to='/blog'><li className='hover:text-orange-300'>News</li></Link>
                        <Link to='/faq'><li className='hover:text-orange-300'>FAQs</li></Link>
                    </ul>
                </div>
                <div className='flex flex-col gap-6'>
                    <div className='font-lora lg:font-semibold font-medium lg:text-lg md:text-base text-sm'>Services</div>
                    <ul className='flex flex-col gap-4 font-inter md:font-medium font-normal md:text-sm text-xs'>
                        <Link to='/contact'><li className='hover:text-orange-300'>Contact Support</li></Link>
                        <Link to='/reviews'><li className='hover:text-orange-300'>Ratings and reviews</li></Link>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer