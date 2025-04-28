import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsBell } from "react-icons/bs";
import { FaCube, FaMobileAlt } from "react-icons/fa";

import hero from './../../assets/Hero-Bg.png'
import business from "./../../assets/Business.png";
import music from "./../../assets/Music.png";
import arts from "./../../assets/Arts.png";
import SplashScreen from "../Spinners/SplashScreen";
import { MdAnalytics, MdOutlineDashboardCustomize } from "react-icons/md";
import { SiStripe } from "react-icons/si";

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
  },
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
    <div className="bg-gradient-to-b from-orange-50 to-white dark:from-zinc-900 dark:to-zinc-950 min-h-screen flex flex-col gap-24 items-center pb-32">
      {/* Hero Section */}
      <section
        style={{
          backgroundImage: `url(${hero
          })`,
        }}
        className="text-white brightness-75 h-screen w-full bg-no-repeat bg-cover flex flex-col items-center justify-center gap-8 text-center px-6"
      >
        <h1 className="text-5xl md:text-6xl font-bold font-merriweather">
          Experience Events Like Never Before
        </h1>
        <p className="text-lg md:text-xl font-inter max-w-xl">
          Discover and host unforgettable moments. Your next concert, festival,
          or show starts here.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/events">
            <button className="bg-white text-orange-600 hover:bg-orange-100 px-6 py-3 rounded-full text-lg font-medium transition">
              Browse Events
            </button>
          </Link>
          <Link to="/create">
            <button className="bg-orange-500 hover:bg-orange-700 px-6 py-3 rounded-full text-white text-lg font-medium transition">
              Create Event
            </button>
          </Link>
        </div>
      </section>

      {/* Category Card Grid */}
      <section className="w-full max-w-7xl px-6 text-center flex flex-col items-center gap-12">
        <h2 className="text-3xl md:text-5xl font-bold font-lora">
          What’s your <span className="text-orange-500">Vibe</span>?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map(({ text, about, image }, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <img
                src={image}
                alt={text}
                className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-5 text-left flex flex-col gap-2">
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {text}
                </p>
                <p className="text-sm text-gray-600 dark:text-zinc-300">
                  {about}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-zinc-950 pt-12 px-6 md:px-16">
  <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-6">
    <h2 className="text-3xl md:text-5xl font-semibold text-zinc-900 dark:text-white font-merriweather">
      Powering Seamless Events
    </h2>
    <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl">
      From secure payments to smart check-ins, Ticketeer gives you the tools to create unforgettable experiences with ease.
    </p>
  </div>

  <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
    {[
      {
        title: "NFT Ticket Integration",
        desc: "Offer exclusive digital perks and secure ownership with NFT-powered tickets.",
        icon: <FaCube className="text-orange-500 text-3xl" />,
      },
      {
        title: "Real-time Analytics",
        desc: "Track ticket sales, revenue, and attendee insights in real time.",
        icon: <MdAnalytics className="text-orange-500 text-3xl" />,
      },
      {
        title: "Mobile Check-in",
        desc: "Speed up entry with fast QR code scanning and instant validation.",
        icon: <FaMobileAlt className="text-orange-500 text-3xl" />,
      },
      {
        title: "Stripe Payments",
        desc: "Accept global payments securely with Stripe integration.",
        icon: <SiStripe className="text-orange-500 text-3xl" />,
      },
      {
        title: "Event Dashboard",
        desc: "Manage events, attendees, and ticket types all in one place.",
        icon: <MdOutlineDashboardCustomize className="text-orange-500 text-3xl" />,
      },
      {
        title: "Auto Reminders",
        desc: "Send automated reminders and updates to your attendees.",
        icon: <BsBell className="text-orange-500 text-3xl" />,
      },
    ].map(({ title, desc, icon }, i) => (
      <div
        key={i}
        className="bg-orange-50 dark:bg-zinc-800 rounded-2xl p-6 flex flex-col gap-4 shadow-md hover:shadow-xl transition-all"
      >
        <div className="w-12 h-12 bg-orange-100 dark:bg-zinc-700 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
      </div>
    ))}
  </div>
</section>

      {/* Testimonial Section */}
      {/* <section className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-12 px-6">
        <div className="md:w-1/2 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <BsQuote className="text-3xl text-orange-500" />
            <p className="text-lg italic dark:text-zinc-300">
              “The real-time analytics and smooth payment integration made
              organizing our festival seamless. Best platform we’ve used!”
            </p>
          </div>
          <div className="flex items-center gap-4">
            <img
              src={designer}
              alt="user"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-semibold text-gray-800 dark:text-white">
                Farhaz Khan
              </p>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Event Designer
              </p>
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
            <button className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded-lg mt-2">
              See all reviews
            </button>
          </Link>
        </div>
        <div className="md:w-1/2">
          <img
            src={review}
            alt="Review Visual"
            className="rounded-xl shadow-md w-full"
          />
        </div>
      </section> */}
    </div>
  );
};

export default Home;
