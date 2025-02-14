import React from 'react'
import { IoIosSearch } from 'react-icons/io'

const eventBtn = [
    {event: 'Business and networking'},
    {event: 'Music and concerts'},
    {event: 'Sports and fitness'},
    {event: 'Festival and fairs'},
    {event: 'Theater and arts'},
]

const Events = () => {
  return (
    <div className='bg-orange-50 pb-20 flex flex-col gap-16 items-center'>
    <div className='bg-heroBg bg-cover bg-center h-screen text-white flex flex-col items-center justify-center gap-12 px-20'>
         <div className='flex flex-col gap-6 text-center'>
             <h1 className='font-merriweather font-bold text-6xl'>Find Your Next Unforgettable Experience</h1>
             <p className='font-quicksand font-semibold text-2xl'>Discover concerts, festivals, sports, and more—get your tickets now</p>
         </div>

         {/* <div className='flex items-center justify-center'>
             <button className="font-inter bg-slate-400 py-4 px-24 text-lg rounded hover:bg-slate-500 active:bg-sky-600">Browse Events</button>
         </div> */}

<div className="bg-customGradient p-1 rounded-xl flex items-center w-full sm:w-9/12">
  <div className="flex flex-col sm:flex-row items-center justify-between w-full py-3 px-4 bg-orange-100 rounded-xl text-slate-500">
    <form className="flex gap-2 w-full">
      <button className=""><IoIosSearch /></button>
      <input type="text" className="bg-transparent w-full outline-none" placeholder="Search by event name, location, date, or category" name="search"/>
    </form>
    {/* <div className="w-full sm:w-auto mt-2 sm:mt-0">
      <button className="font-inter px-4 py-2 bg-orange-400 text-white font-medium rounded-xl text-sm transition-colors duration-500 ease-in-out hover:bg-orange-500 w-full sm:w-auto min-w-max whitespace-nowrap">
        Search Events
      </button>
    </div> */}
  </div>
</div>


    </div>
    <div>
  <div className="flex flex-col gap-8 sm:gap-16 text-center items-center w-full">
    <p className="font-montserrat font-semibold text-3xl sm:text-4xl lg:text-5xl">
      Discover <span className="font-lora font-semibold text-4xl sm:text-5xl lg:text-6xl text-orange-600">events you love</span>
    </p>
    <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-6 justify-center sm:justify-start">
      {eventBtn.map(({ event }, index) => (
        <button key={index} className="border border-green-700 text-green-700 py-2 px-6 rounded-3xl hover:border-none hover:bg-green-200 active:bg-green-300 transition-colors duration-500 ease-in-out">
          {event}
        </button>
      ))}
    </div>
  </div>
</div>

 </div>
  )
}

export default Events