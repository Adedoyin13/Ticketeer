import React from 'react'
import designer from './../../assets/Designer-image.png'
import { FaRegStar, FaStar } from 'react-icons/fa6'
import { FaStarHalfAlt } from "react-icons/fa";
import { BsQuote } from 'react-icons/bs';

const review = [
    {name: 'Olajide Rodiyat', review: 'We’ve used many ticketing platforms in the past, but this one stands out. The intuitive interface, real-time analytics, and secure payment options make event planning stress-free. Highly recommend!', image: designer},
    {name: 'Olajide Rodiyat', review: 'We’ve used many ticketing platforms in the past, but this one stands out. The intuitive interface, real-time analytics, and secure payment options make event planning stress-free. Highly recommend!', image: designer},
    {name: 'Olajide Rodiyat', review: 'We’ve used many ticketing platforms in the past, but this one stands out. The intuitive interface, real-time analytics, and secure payment options make event planning stress-free. Highly recommend!', image: designer},
    {name: 'Olajide Rodiyat', review: 'We’ve used many ticketing platforms in the past, but this one stands out. The intuitive interface, real-time analytics, and secure payment options make event planning stress-free. Highly recommend!', image: designer},
    {name: 'Olajide Rodiyat', review: 'We’ve used many ticketing platforms in the past, but this one stands out. The intuitive interface, real-time analytics, and secure payment options make event planning stress-free. Highly recommend!', image: designer},
    {name: 'Olajide Rodiyat', review: 'We’ve used many ticketing platforms in the past, but this one stands out. The intuitive interface, real-time analytics, and secure payment options make event planning stress-free. Highly recommend!', image: designer},
]

const Reviews = () => {
  return (
    <section className="bg-bgColor flex flex-col gap-20 items-center pb-10">
      <div className="container mx-auto px-4 pt-32 flex flex-col gap-5 md:gap-10">
        {/* Header Section */}
        <div className="mx-auto w-full sm:w-11/12 md:w-10/12">
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-merriweather">Ratings and reviews</h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium mt-3 sm:mt-4 md:mt-5 lg:mt-6 font-inter px-2 sm:px-4 md:px-6 lg:px-0 text-center">These are some of our clients thoughts and reviews about our app and their experience</p>
        </div>

        {/* Review Section */}
        <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 md:gap-8 w-full px-10'>
            {review.map(({ name, review, image }, index) => (
                  <div key={index} className='flex flex-col gap-2 bg-orange-200 rounded-2xl shadow-md hover:-translate-y-2 transition-transform duration-300 cursor-pointer p-4'>
                    <div className='flex gap-12'>
                    <div className='bg-slate-300 rounded-full shadow-md p-2 w-8 md:w-12 h-8 md:h-12 flex items-center justify-center'>
                      <BsQuote className='text-orange-600 text-xl md:text-2xl' />
                    </div>
                    <div className='flex flex-col gap-2 p-4'>
                    <img src={image} alt='' className='' />
                    <p className='font-lora font-semibold text-lg'>{name}</p>
                    <div className='flex gap-1 text-orange-400 text-xl'>
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStarHalfAlt />
                      <FaRegStar />
                    </div>
                    </div>
                    </div>
                    <div>
                        <p className='font-inter text-sm'>{review}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  )
}

export default Reviews