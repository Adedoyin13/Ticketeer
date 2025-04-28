import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BsQuote } from "react-icons/bs";
import { FaStar, FaRegStar, FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";

import review from "./../../assets/organizer-review.png";
import designer from "./../../assets/Designer-image.png";
import pricing from "./../../assets/pricing.png";
import setEvent from "./../../assets/set-event.png";
import customizeTicket from "./../../assets/customize-ticket.png";

const howItWorks = [
  {
    image: setEvent,
    text: "Set Up Your Event",
    about: "Enter key details like event name, date, time, and venue.",
  },
  {
    image: customizeTicket,
    text: "Customize Your Tickets",
    about:
      "Create multiple ticket types (General Admission, VIP, Early Bird, etc.), set pricing, and availability.",
  },
  {
    image: customizeTicket,
    text: "Publish & Promote",
    about:
      "Go live and share your event through social media, email, and marketing tools.",
  },
  {
    image: customizeTicket,
    text: "Sell & Manage Attendees",
    about:
      "Track ticket sales, manage guest lists, and access event analytics in real-time.",
  },
];

const choice = [
  {
    strong: "✅ Easy Event Setup",
    normal: "Create and launch your event in minutes.",
  },
  {
    strong: "✅ Flexible Ticketing",
    normal: "Offer multiple ticket tiers, discounts, and group pricing.",
  },
  {
    strong: "✅ Secure Transactions",
    normal: "Ensure safe and smooth ticket purchases for attendees.",
  },
  {
    strong: "✅ Powerful Analytics",
    normal: "Monitor sales, attendance, and engagement with real-time data.",
  },
  {
    strong: "✅ 24/7 Support",
    normal: "Get help anytime from our dedicated support team.",
  },
];

const faq = [
  {
    question: "What types of events can I create?",
    answer:
      "Our platform supports concerts, conferences, sports events, festivals, workshops, and more.",
  },
  {
    question: "How do I create and publish an event on Ticketeer?",
    answer:
      "Just log in and click on “Create Event.” Fill in your event details (title, date, venue, ticket types, etc.), upload images, and publish. It’s that easy — your event will instantly go live on the platform!",
  },
  {
    question: "Can I offer discounts or promo codes?",
    answer:
      "Yes! You can create discount codes and special promotions to boost sales",
  },
];

const Organizer = () => {
  const [openStates, setOpenStates] = useState(
    new Array(faq.length).fill(false)
  );

  const toggleOpen = (index) => {
    setOpenStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };
  return (
    <div>
      {/* Here's a revised version of your landing page with better responsive design */}
      <div className="bg-orange-50 pb-10 sm:pb-16 md:pb-20 flex flex-col gap-10 sm:gap-16 md:gap-20 overflow-x-hidden">
        {/* Hero Section - More consistent padding */}
        <div className="bg-heroBg bg-cover bg-center h-screen text-white flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-12 px-4 sm:px-8 md:px-12 lg:px-20">
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 text-center max-w-4xl mx-auto">
            <h1 className="font-merriweather font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              Bring Your Event to Life – Start Selling Tickets Today!
            </h1>
            <p className="font-quicksand font-semibold text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
              Easily create your event, set ticket prices, and start selling to
              your audience in minutes. Whether it's a concert, conference, or
              festival, our platform makes event management seamless.
            </p>
          </div>
          <div className="flex items-center justify-center w-full sm:w-auto">
            <Link to="/register">
              <button className="font-inter bg-slate-500 py-2 sm:py-3 px-6 sm:px-8 md:px-12 lg:px-20 text-base sm:text-lg text-white rounded-lg hover:bg-slate-600 transition-colors w-full sm:w-auto sm:min-w-[200px] md:min-w-[280px] lg:min-w-[320px]">
                Create my event
              </button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6 sm:gap-10 items-center text-center">
          <h1 className="font-montserrat font-semibold text-2xl sm:text-3xl">
            Who are we?
          </h1>
          <div className="flex flex-col gap-2 w-11/12 sm:w-10/12 font-poppins font-normal text-sm sm:text-base">
            <p>
              Ticketeer is the best choice among online ticketing platforms that
              are equipped with innovative features and capabilities to make
              your event a success. With the intuitive ticketing widget, this
              one of the best event ticketing platforms, and your ticket-selling
              task will no longer be challenging.
            </p>
            <p>
              <strong>Mission:</strong> "We connect people to unforgettable
              experiences with seamless ticketing solutions."
            </p>
            <p>
              <strong>Problem Solved:</strong> "No more long queues, lost
              tickets, or hidden fees."
            </p>
          </div>
        </div>

        {/* How it works - Better padding for small screens */}
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-10 px-4 sm:px-8 md:px-16 lg:px-32">
          <p className="font-montserrat font-semibold text-xl sm:text-2xl md:text-3xl pl-0 sm:pl-2 md:pl-5">
            How it works
          </p>
          <div className="flex flex-col gap-4 sm:gap-5">
            {howItWorks.map(({ text, about, image }, index) => (
              <div key={index} className="flex gap-2 sm:gap-3 items-center">
                <div className="w-16 sm:w-20 flex-shrink-0">
                  <img src={image} alt="" className="w-full" />
                </div>
                <div className="flex flex-col gap-1 sm:gap-2">
                  <p className="font-lora font-semibold text-lg sm:text-xl md:text-2xl">
                    {text}
                  </p>
                  <p className="font-montserrat font-medium text-base sm:text-lg">
                    {about}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why choose us - Better padding for small screens */}
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-10 px-4 sm:px-8 md:px-16 lg:px-40">
          <p className="font-montserrat font-semibold text-xl sm:text-2xl md:text-3xl">
            Why choose us?
          </p>
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
            {choice.map(({ strong, normal }, index) => (
              <p
                key={index}
                className="font-montserrat font-medium text-base sm:text-lg md:text-xl"
              >
                <strong>{strong}</strong>
                {" - "}
                {normal}
              </p>
            ))}
          </div>
        </div>

        {/* Testimonial section - More responsive on mobile */}
        {/* <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-24 flex flex-col-reverse md:flex-row gap-6 sm:gap-8 items-center">
          <div className="flex flex-col gap-6 sm:gap-10 md:gap-16 lg:gap-20 w-full md:w-1/2">
            <div className="bg-slate-300 rounded-full shadow-md p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center">
              <BsQuote className="text-orange-600 text-xl sm:text-2xl md:text-3xl" />
            </div>
            <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
              <p className="font-quicksand font-medium text-sm sm:text-base md:text-lg leading-relaxed">
                We've used many ticketing platforms in the past, but this one
                stands out. The intuitive interface, real-time analytics, and
                secure payment options make event planning stress-free. Highly
                recommend!
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={designer}
                  alt="Olajide Rodiyat"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover"
                />
                <div className="flex flex-col font-poppins">
                  <p className="font-semibold text-sm sm:text-base">
                    Farhaz Khan
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Designer</p>
                </div>
              </div>
              <div className="flex gap-1 text-orange-400 text-base sm:text-lg md:text-xl">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalfAlt />
                <FaRegStar />
              </div>
              <Link to="/organizer-reviews">
                <button className="font-inter bg-slate-500 py-1.5 sm:py-2 px-4 sm:px-6 text-sm sm:text-base md:text-lg text-white rounded-lg hover:bg-slate-600 transition-colors w-32 sm:w-36 md:w-44 md:max-w-[180px]">
                  See all...
                </button>
              </Link>
            </div>
          </div>
          <img
            src={review}
            alt="Review illustration"
            className="w-full md:w-1/2 h-auto md:h-[400px] lg:h-[500px] object-contain"
          />
        </div> */}

        {/* Pricing section - More responsive on mobile */}
        <div className="flex items-center bg-slate-400 px-4 sm:px-8 md:px-16 lg:px-32 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row gap-5 items-center w-full">
            <div className="flex flex-col gap-4 sm:gap-6 font-quicksand w-full md:w-3/5">
              <p className="font-bold text-2xl sm:text-3xl md:text-4xl">
                Pricing and fees
              </p>
              <p className="font-medium text-base sm:text-lg md:text-xl w-full sm:w-10/12 md:w-9/12">
                We offer competitive pricing with no hidden fees. View your
                earnings upfront before publishing your event.
              </p>
              <button className="px-4 sm:px-8 md:px-12 py-2 sm:py-3 font-inter bg-orange-400 w-full sm:w-2/3 md:w-1/3 text-white font-medium rounded-full text-sm transition-colors duration-500 hover:bg-orange-500">
                Check it out
              </button>
            </div>
            <div className="w-full md:w-2/5 mt-6 md:mt-0">
              <img src={pricing} alt="pricing" className="w-full h-auto" />
            </div>
          </div>
        </div>

        {/* FAQ section - Better padding for small screens */}
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-10 px-4 sm:px-8 md:px-16 lg:px-40">
          <p className="font-montserrat font-semibold text-xl sm:text-2xl md:text-3xl pl-0 sm:pl-2">
            FAQs
          </p>
          <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
            {faq?.map(({ question, answer }, index) => {
              const isOpen = openStates[index];

              return (
                <div key={index} className="mb-3 sm:mb-4 md:mb-6">
                  <div
                    className={`bg-orange-100 rounded-2xl ${
                      !isOpen && "rounded-2xl"
                    } shadow-orange-200 shadow-md transition-all duration-300`}
                  >
                    <div
                      className="flex justify-between items-center px-3 sm:px-4 md:px-8 lg:px-12 py-2 sm:py-3 md:py-5 cursor-pointer"
                      onClick={() => toggleOpen(index)}
                    >
                      <p className="font-poppins font-semibold text-sm sm:text-base md:text-lg lg:text-xl pr-2 sm:pr-4">
                        {question}
                      </p>
                      <span className="flex-shrink-0">
                        {isOpen ? (
                          <FaAngleUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                        ) : (
                          <FaAngleDown className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                        )}
                      </span>
                    </div>

                    {isOpen && (
                      <div className="px-3 sm:px-4 md:px-8 lg:px-12 pb-3 sm:pb-4 md:pb-5 lg:pb-6">
                        <p className="font-poppins font-normal text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
                          {answer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA section - Better padding for small screens */}
        {/* <div className="flex items-center px-4 sm:px-8 md:px-12 lg:px-20">
          <div className="w-full bg-eventLove flex items-center bg-cover bg-no-repeat rounded-xl sm:rounded-2xl md:rounded-3xl">
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 items-center justify-center text-white text-center py-10 sm:py-16 md:py-24 lg:py-40 px-4 sm:px-10 md:px-20 lg:px-40">
              <p className="font-montserrat font-semibold text-xl sm:text-2xl md:text-3xl lg:text-5xl">
                Get started today!
              </p>
              <p className="font-semibold font-montserrat text-base sm:text-lg md:text-xl lg:text-2xl">
                Join thousands of event organizers who trust our platform for
                ticket sales and event management.
              </p>
              <Link to="/register">
                <button className="font-inter bg-slate-500 py-2 sm:py-3 px-6 sm:px-8 md:px-12 lg:px-20 text-base sm:text-lg text-white rounded-lg hover:bg-slate-600 transition-colors w-full sm:w-auto sm:min-w-[200px] md:min-w-[280px] lg:min-w-[320px]">
                  Create an event
                </button>
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Organizer;