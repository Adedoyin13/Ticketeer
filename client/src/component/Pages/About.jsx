import React from "react";
import ticket from "./../../assets/About-Ticket.png";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Easy online",
    highlight: "booking",
    description: "Search, book, and attend with ease — all from your device.",
  },
  {
    title: "Secure digital",
    highlight: "tickets",
    description: "Receive unique, scannable QR codes for smooth event access.",
  },
  {
    title: "Event analytics for",
    highlight: "organizers",
    description: "Track ticket sales, attendance, and engagement in real-time.",
  },
];

const About = () => {
  return (
    <div>
      <div className="mx-auto px-4 pt-32 pb-12 bg-gradient-to-b from-orange-50 to-white dark:from-zinc-800 dark:to-zinc-700">
        {/* Hero Section */}
        <section className="w-full pb-16 md:pb-24 px-6 pt-8 md:px-16 lg:px-32">
          <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
            {/* Left Text Content */}
            <div className="w-full md:w-7/12 text-center md:text-left flex flex-col gap-6 animate-fadeIn">
              <h1 className="font-merriweather text-3xl sm:text-4xl lg:text-5xl font-bold leading-snug text-zinc-900 dark:text-white">
                Your Ultimate Event{" "}
                <span className="text-orange-500">Ticketing Solution</span>
              </h1>
              <p className="font-inter text-lg sm:text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto md:mx-0">
                Seamlessly discover, book, and manage tickets for events you
                love — all in one place.
              </p>
              <div className="mt-4">
                <Link to="/event-list">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base sm:text-lg px-8 py-3 rounded-full shadow-md transition-all duration-300">
                    Browse Events
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="w-full md:w-5/12 flex justify-center animate-fadeIn">
              <img
                src={ticket}
                alt="Ticket Illustration"
                className="w-9/12 sm:w-8/12 md:w-full max-w-sm md:max-w-full"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <div
          id="howItWorks"
          className="flex flex-col gap-6 sm:gap-10 items-center pb-20"
        >
          <h1 className="font-montserrat font-semibold text-2xl sm:text-3xl text-zinc-900 dark:text-white">
            How It Works
          </h1>
          <div className="flex flex-col md:flex-row gap-6 w-11/12 lg:w-10/12">
            {/* Box 1 */}
            <div className="bg-aboutShow bg-cover bg-center text-white rounded-2xl p-10 sm:p-16 flex flex-col gap-4 justify-center items-center w-full">
              <p className="font-montserrat font-semibold text-lg sm:text-2xl text-center">
                Search, book, and attend with digital tickets.
              </p>
              <button className="font-inter bg-zinc-500 py-2 px-8 sm:px-20 text-lg text-white rounded-lg hover:bg-zinc-600 transition-colors w-full sm:w-auto">
                Book Ticket
              </button>
            </div>

            {/* Box 2 */}
            <div className="bg-aboutConference bg-cover bg-center text-white rounded-2xl p-10 sm:p-16 flex flex-col gap-4 justify-center items-center w-full">
              <p className="font-montserrat font-semibold text-lg sm:text-2xl text-center">
                Create, manage, and sell event tickets effortlessly.
              </p>
              <button className="font-inter bg-zinc-500 py-2 px-8 sm:px-20 text-lg text-white rounded-lg hover:bg-zinc-600 transition-colors w-full sm:w-auto">
                Create Event
              </button>
            </div>
          </div>
        </div>

        {/* Our Features */}
        <div
          id="features"
          className="flex flex-col gap-6 sm:gap-10 items-center p-4 sm:p-10"
        >
          <h1 className="font-montserrat font-semibold text-2xl sm:text-3xl text-zinc-900 dark:text-white">
            Our Features
          </h1>

          <div className="bg-aboutCheer bg-cover bg-center flex flex-col gap-10 items-center w-11/12 lg:w-10/12 p-10 sm:p-20 rounded-xl">
            <div className="flex flex-col gap-4 sm:gap-10">
              <p className="font-inter font-semibold text-lg sm:text-3xl text-white">
                We connect people to unforgettable experiences with
                <span className="font-cormorant font-medium text-2xl sm:text-6xl">
                  {" "}
                  seamless ticketing solutions.
                </span>
              </p>
              <button className="px-4 sm:px-12 py-2.5 bg-orange-400 w-2/3 sm:w-1/3 text-white font-medium rounded-full text-sm transition-colors duration-500 hover:bg-orange-500">
                Check it out
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 sm:gap-3 bg-white dark:bg-zinc-800 rounded-lg p-4 text-center sm:text-left"
                >
                  <p className="font-inter font-semibold text-lg sm:text-xl text-zinc-900 dark:text-white">
                    {feature.title}{" "}
                    <span className="font-cormorant font-medium text-xl sm:text-3xl">
                      {feature.highlight}
                    </span>
                  </p>
                  <p className="font-montserrat font-normal text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
