import React from 'react'
import { Link } from "react-router-dom";
import { BsQuote } from "react-icons/bs";
import business from './../../assets/Business.png'
import music from './../../assets/Music.png'
import conference from './../../assets/Conference.png'
import nightlife from './../../assets/Nightlife.png'
import sports from './../../assets/Sports.png'
import arts from './../../assets/Arts.png'
import ticket from './../../assets/Hand-Ticket.png'
import event from './../../assets/Empower-Event.png'
import review from './../../assets/Client-Reviews.png'
import designer from './../../assets/Designer-image.png'
import { FaStarHalfAlt } from 'react-icons/fa';
import { FaStar, FaRegStar } from 'react-icons/fa6';

const card = [
    {text : 'Business and networking', about : 'Learn, connect, and grow at professional conferences and networking events.', image : business},
    {text : 'Music', about : 'Find live concerts, festivals, and intimate gigs for every genre.', image : music},
    {text : 'Arts and culture', about : 'Celebrate creativity with exhibitions, performances, and cultural events.', image : arts},
    {text : 'Sports', about : 'Catch live matches, marathons, and sports tournaments near you', image : sports},
    {text : 'Conference', about : 'Celebrate creativity with exhibitions, performances, and cultural events.', image : conference},
    {text : 'Nightlife', about : 'Fun-filled events for kids, parents, and the whole family.', image : nightlife},
]

const Home = () => {
  return (
    <div className='bg-orange-50 pb-20 flex flex-col gap-20 items-center'>
    <div className='bg-heroBg bg-cover bg-center h-screen text-white flex flex-col items-center justify-center gap-12 px-6 lg:px-20'>
        <div className='flex flex-col gap-6 text-center'>
            <h1 className='font-merriweather font-bold text-4xl md:text-5xl lg:text-6xl'>Your Ticket to Unforgettable Experiences!</h1>
            <p className='font-quicksand font-semibold text-xl md:text-2xl'>Find and book the best events near you - concerts, sports, festivals, and more.</p>
        </div>
        <div className='flex items-center justify-center'>
            <button className='font-inter bg-slate-500 py-3 px-8 md:px-20 text-lg text-white rounded-lg hover:bg-slate-600 transition-colors w-full md:w-auto md:max-w-[320px]'>Browse Events</button>
        </div>
    </div>
    
    <div className='flex flex-col gap-12 items-center px-6 md:px-20'>
        <p className='font-montserrat font-semibold text-3xl md:text-5xl text-center'>What's your <span className='font-lora font-semibold text-orange-600'>Passion</span>?</p>
        <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-full'>
            {card.map(({ text, about, image }, index) => (
                <div key={index} className='flex flex-col gap-4 bg-slate-400 rounded-2xl shadow-md hover:-translate-y-2 transition-transform duration-300 cursor-pointer'>
                    <div className='text-white flex flex-col gap-2 p-4'>
                        <p className='font-lora font-semibold text-xl'>{text}</p>
                        <p className='font-inter text-base'>{about}</p>
                    </div>
                    <img src={image} alt='' className='w-full h-auto rounded-b-2xl' />
                </div>
            ))}
        </div>
        <button className='px-8 md:px-16 py-2 md:py-3 font-inter font-medium rounded-full text-sm transition-all duration-700 border-2 border-orange-500 text-orange-600 hover:bg-orange-200'>See more...</button>
    </div>

    <div className='container mx-auto px-6 lg:px-16 flex flex-col md:flex-row gap-8 items-center'>
        <div className='flex flex-col gap-6 md:w-1/2'>
            <h1 className='font-poppins font-bold text-3xl md:text-4xl leading-tight'>Your Next Great Experience Awaits</h1>
            <p className='font-poppins text-xl md:text-2xl leading-relaxed'>Discover events, register with ease, stay informed, and engage with like-minded individuals—all in one place.</p>
            <button className='font-inter bg-slate-500 py-3 px-6 text-lg text-white rounded-lg hover:bg-slate-600 transition-colors w-full md:w-auto md:max-w-[320px]'>Discover and register now</button>
        </div>
        <img src={ticket} alt='Event ticket illustration' className='md:w-1/2 w-full h-auto md:h-[400px] object-contain' />
    </div>
    
    <div className='container mx-auto px-6 lg:px-14 flex flex-col-reverse md:flex-row gap-8 items-center'>
        <img src={event} alt='Event ticket illustration' className='md:w-1/2 w-full h-auto md:h-[400px] object-contain' />
        <div className='flex flex-col gap-6 md:w-1/2'>
            <h1 className='font-poppins font-bold text-3xl md:text-4xl leading-tight'>Empower Your Event with Ease</h1>
            <p className='font-poppins text-xl md:text-2xl leading-relaxed'>Seamlessly manage registrations, schedules, and attendee engagement—all in one powerful platform.</p>
            <button className='font-inter bg-slate-500 py-3 px-6 text-lg text-white rounded-lg hover:bg-slate-600 transition-colors w-full md:w-auto md:max-w-[320px]'>Streamline your events now</button>
        </div>
    </div>
    
    <div className='container mx-auto px-6 lg:px-20 flex flex-col-reverse md:flex-row gap-8 md:gap-12 items-center'>
        <div className='flex flex-col gap-10 md:gap-32 md:w-1/2'>
            <div className='bg-slate-300 rounded-full shadow-md p-4 w-16 md:w-20 h-16 md:h-20 flex items-center justify-center'>
                <BsQuote className='text-orange-600 text-2xl md:text-3xl' />
            </div>
            <div className='flex flex-col gap-8'>
                <p className='font-quicksand font-medium text-lg md:text-xl leading-relaxed'>We've used many ticketing platforms in the past, but this one stands out. The intuitive interface, real-time analytics, and secure payment options make event planning stress-free. Highly recommend!</p>
                <div className='flex items-center gap-4'>
                    <img src={designer} alt='Olajide Rodiyat' className='w-10 md:w-12 h-10 md:h-12 rounded-full object-cover' />
                    <div className='flex flex-col font-poppins'>
                        <p className='font-semibold text-base'>Farhaz Khan</p>
                        <p className='text-sm text-gray-600'>Designer</p>
                    </div>
                </div>
                <div className='flex gap-1 text-orange-400 text-xl'>
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStarHalfAlt />
                      <FaRegStar />
                    </div>
                <Link to='/reviews'><button className='font-inter bg-slate-500 py-2 px-6 text-lg text-white rounded-lg hover:bg-slate-600 transition-colors md:max-w-[180px]'>See all...</button></Link>
            </div>
        </div>
        <img src={review} alt='Review illustration' className='md:w-1/2 w-full h-auto md:h-[500px] object-contain' />
    </div>
    
    <div className='w-11/12 md:w-10/12 bg-eventLove flex items-center bg-cover bg-no-repeat rounded-3xl'>
        <div className='flex flex-col gap-12 items-center justify-center text-white text-center py-20 md:py-40 px-6 md:px-40'>
            <p className='font-montserrat font-semibold text-4xl md:text-6xl'>Your go-to platform for all types of event booking and ticket purchase</p>
            <button className='font-inter bg-slate-500 py-3 px-8 md:px-20 text-lg text-white rounded-lg hover:bg-slate-600 transition-colors w-full md:w-auto md:max-w-[320px]'>EXPLORE NOW</button>
        </div>
    </div>
</div>

  )
}

export default Home