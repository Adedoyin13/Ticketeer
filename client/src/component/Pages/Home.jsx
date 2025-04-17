import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsQuote } from "react-icons/bs";
import { FaStar, FaRegStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";

import business from './../../assets/Business.png'
import music from './../../assets/Music.png'
import arts from './../../assets/Arts.png'
import review from './../../assets/Client-Reviews.png'
import designer from './../../assets/Designer-image.png'
import SplashScreen from "../Spinners/SplashScreen";
import { TfiTicket } from "react-icons/tfi";

const cards = [
  {
    text: "Business and networking",
    about:
      "Learn, connect, and grow at professional conferences and networking events.",
    image: business,
  },
  {
    text: "Music",
    about: "Find live concerts, festivals, and intimate gigs for every genre.",
    image: music,
  },
  {
    text: "Arts and culture",
    about:
      "Celebrate creativity with exhibitions, performances, and cultural events.",
    image: arts,
  }
];

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // duration of splash

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen onComplete={() => {}} />;

  return (
    <div className="bg-orange-50 pb-20 flex flex-col gap-20 items-center">
      {/* Hero Section */}
      <div className="bg-heroBg bg-cover bg-center h-screen text-white flex flex-col items-center justify-center gap-12 px-6 lg:px-20">
        <div className="flex flex-col gap-6 text-center">
          <h1 className="font-merriweather font-bold text-4xl md:text-5xl lg:text-6xl">
            Your Ticket to Unforgettable Experiences!
          </h1>
          <p className="font-inter font-medium text-lg md:text-xl px-24">
            Find and book the best events near you - concerts, sports,
            festivals, and more — now with NFT integration for exclusive perks!
          </p>
        </div>
        <div className="flex items-center justify-center gap-5">
          <Link to="/events">
            <button className="font-inter bg-slate-500 py-3 px-8 md:px-10 text-lg text-white rounded-lg hover:bg-slate-600 transition-colors w-full md:w-auto md:max-w-[250px]">
              Browse Events
            </button>
          </Link>
          <Link to="/create">
            <button className="font-inter bg-slate-500 py-3 px-8 md:px-10 text-lg text-white rounded-lg hover:bg-slate-600 transition-colors w-full md:w-auto md:max-w-[250px]">
            Create events
            </button>
          </Link>
        </div>
      </div>

      <div>
     <div className="">
     <TfiTicket />
     </div>
      </div>

      {/* Card Slider Section */}
      <div className="flex flex-col gap-12 items-center">
        <p className="font-montserrat font-semibold text-3xl md:text-5xl text-center">
          What's your{" "}
          <span className="font-lora font-semibold text-orange-600">
            Passion
          </span>
          ?
        </p>
        <div className="relative w-full pb-5">
          <div className="flex items-center justify-center">
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 w-10/12 px-10">
              {cards.map(({ text, about, image }, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 bg-slate-400 rounded-2xl shadow-md hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
                >
                  <div className="text-white flex flex-col gap-2 p-4">
                    <p className="font-lora font-semibold text-lg">{text}</p>
                    <p className="font-inter text-sm">{about}</p>
                  </div>
                  <img
                    src={image}
                    alt=""
                    className="w-auto h-[200px] rounded-b-2xl"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 lg:px-20 flex flex-col-reverse md:flex-row gap-8 md:gap-12 items-center">
          <div className="flex flex-col gap-10 md:gap-32 md:w-1/2">
            <div className="bg-slate-300 rounded-full shadow-md p-4 w-16 md:w-20 h-16 md:h-20 flex items-center justify-center">
              <BsQuote className="text-orange-600 text-2xl md:text-3xl" />
            </div>
            <div className="flex flex-col gap-8">
              <p className="font-inter font-medium text-base md:text-lg leading-relaxed">
                We've used many ticketing platforms in the past, but this one
                stands out. The intuitive interface, real-time analytics, and
                secure payment options make event planning stress-free. Highly
                recommend!
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={designer}
                  alt="Olajide Rodiyat"
                  className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover"
                />
                <div className="flex flex-col font-poppins">
                  <p className="font-semibold text-base">Farhaz Khan</p>
                  <p className="text-sm text-gray-600">Designer</p>
                </div>
              </div>
              <div className="flex gap-1 text-orange-400 text-xl">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalfAlt />
                <FaRegStar />
              </div>
              <Link to="/user-reviews">
                <button className="font-inter bg-slate-500 py-2 px-6 text-lg text-white rounded-lg hover:bg-slate-600 transition-colors md:max-w-[180px]">
                  See all...
                </button>
              </Link>
            </div>
          </div>
          <img
            src={review}
            alt="Review illustration"
            className="md:w-1/2 w-full h-auto md:h-[500px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
