import React from "react";
import ticket from "./../../assets/About-Ticket.png";

const About = () => {
  return (
    <div>
    <div className="mx-auto px-4 pt-32 pb-12 bg-orange-50">
      
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between gap-10 px-8 md:px-16 lg:px-28 pb-16 lg:pb-32 items-center">
        <div className="flex flex-col md:items-start items-center gap-6 md:gap-8 w-full md:w-7/12 text-center md:text-left">
          <div className="flex flex-col gap-4">
            <h1 className="font-merriweather text-2xl md:text-3xl lg:text-5xl font-semibold md:font-bold lg:font-bold leading-tight">
              Your Ultimate Event Ticketing Solution
            </h1>
            <p className="font-quicksand md:font-semibold font-medium lg:text-2xl md:text-xl text-lg mx-auto md:mx-0 w-11/12 md:w-9/12">
              Seamlessly discover, book, and manage tickets for events you love.
            </p>
          </div>
  
          <button className="font-inter bg-slate-500 py-3 px-6 sm:px-20 text-lg text-white rounded-lg hover:bg-slate-600 transition-colors w-full md:w-auto md:max-w-[320px]">
            Browse Events
          </button>
        </div>
  
        <div className="w-full md:w-5/12 flex justify-center lg:justify-end">
          <img src={ticket} alt="Ticket Illustration" className="w-9/12 sm:w-8/12 md:w-full" />
        </div>
      </div>
  
      {/* Who We Are */}
      <div className="flex flex-col gap-6 sm:gap-10 items-center pb-20 text-center">
        <h1 className="font-montserrat font-semibold text-2xl sm:text-3xl">
          Who are we?
        </h1>
        <div className="flex flex-col gap-2 w-11/12 sm:w-10/12 font-poppins font-normal text-sm sm:text-base">
          <p>We are a team of finance and technology enthusiasts who believe that everyone deserves financial clarity. Our platform is designed to provide a stress-free way to manage expenses, track spending patterns, and make better financial decisions.</p>
          <p><strong>Mission:</strong> "We connect people to unforgettable experiences with seamless ticketing solutions."</p>
          <p><strong>Problem Solved:</strong> "No more long queues, lost tickets, or hidden fees."</p>
        </div>
      </div>
  
      {/* How It Works */}
      <div className="flex flex-col gap-6 sm:gap-10 items-center pb-20">
        <h1 className="font-montserrat font-semibold text-2xl sm:text-3xl">How It Works</h1>
        <div className="flex flex-col md:flex-row gap-6 w-11/12 lg:w-10/12">
          
          {/* Box 1 */}
          <div className="bg-aboutShow bg-cover bg-center text-white rounded-2xl p-10 sm:p-16 flex flex-col gap-4 justify-center items-center w-full">
            <p className="font-montserrat font-semibold text-lg sm:text-2xl text-center">
              Search, book, and attend with digital tickets.
            </p>
            <button className="font-inter bg-slate-500 py-2 px-8 sm:px-20 text-lg text-white rounded-lg hover:bg-slate-600 transition-colors w-full sm:w-auto">
              Book Ticket
            </button>
          </div>
  
          {/* Box 2 */}
          <div className="bg-aboutConference bg-cover bg-center text-white rounded-2xl p-10 sm:p-16 flex flex-col gap-4 justify-center items-center w-full">
            <p className="font-montserrat font-semibold text-lg sm:text-2xl text-center">
              Create, manage, and sell event tickets effortlessly.
            </p>
            <button className="font-inter bg-slate-500 py-2 px-8 sm:px-20 text-lg text-white rounded-lg hover:bg-slate-600 transition-colors w-full sm:w-auto">
              Create Event
            </button>
          </div>
        </div>
      </div>
  
      {/* Our Features */}
      <div className="flex flex-col gap-6 sm:gap-10 items-center p-4 sm:p-10">
        <h1 className="font-montserrat font-semibold text-2xl sm:text-3xl">Our Features</h1>
  
        <div className="bg-aboutCheer bg-cover bg-center flex flex-col gap-10 items-center w-11/12 lg:w-10/12 p-10 sm:p-20 rounded-xl">
          <div className="flex flex-col gap-4 sm:gap-10">
            <p className="font-inter font-semibold text-lg sm:text-3xl">
              We connect people to unforgettable experiences with 
              <span className="font-cormorant font-medium text-2xl sm:text-6xl"> seamless ticketing solutions.</span>
            </p>
            <button className="px-4 sm:px-12 py-2.5 bg-orange-400 w-2/3 sm:w-1/3 text-white font-medium rounded-full text-sm transition-colors duration-500 hover:bg-orange-500">
              Check it out
            </button>
          </div>
  
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Feature 1 */}
            <div className="flex flex-col gap-2 sm:gap-3 bg-white rounded-lg p-4 text-center sm:text-left">
              <p className="font-inter font-semibold text-lg sm:text-xl">
                Easy online <span className="font-cormorant font-medium text-xl sm:text-3xl">booking</span>
              </p>
              <p className="font-montserrat font-normal text-xs sm:text-sm">
                Search, book, and attend with digital tickets.
              </p>
            </div>
  
            {/* Feature 2 */}
            <div className="flex flex-col gap-2 sm:gap-3 bg-white rounded-lg p-4 text-center sm:text-left">
              <p className="font-inter font-semibold text-lg sm:text-xl">
                Secure digital <span className="font-cormorant font-medium text-xl sm:text-3xl">tickets</span>
              </p>
              <p className="font-montserrat font-normal text-xs sm:text-sm">
                Search, book, and attend with digital tickets.
              </p>
            </div>
  
            {/* Feature 3 */}
            <div className="flex flex-col gap-2 sm:gap-3 bg-white rounded-lg p-4 text-center sm:text-left">
              <p className="font-inter font-semibold text-lg sm:text-xl">
                Event analytics for <span className="font-cormorant font-medium text-xl sm:text-3xl">organizers</span>
              </p>
              <p className="font-montserrat font-normal text-xs sm:text-sm">
                Search, book, and attend with digital tickets.
              </p>
            </div>
          </div>
        </div>
      </div>
  
    </div>
  </div>
  
  );
};

export default About;
