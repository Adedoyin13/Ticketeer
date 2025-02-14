import React from 'react';
import { FaPhoneVolume } from 'react-icons/fa6';
import { IoLocationOutline } from 'react-icons/io5';
import { MdMailOutline } from "react-icons/md";

const Contact = () => {
  return (
    <section className="bg-bgColor flex flex-col gap-20 items-center px-4">
    <div className="container mx-auto px-4 pt-32 flex flex-col gap-12 pb-10">
      {/* Header Section */}
      <div className="mx-auto w-full sm:w-11/12 md:w-10/12 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-merriweather">
          Contact Us
        </h1>
      </div>

      {/* Contact Section */}
      <div className="flex flex-col md:flex-row gap-10 bg-orange-200 p-6 sm:p-10 mx-auto w-full sm:w-11/12 md:w-10/12 rounded-lg shadow-md">
        {/* Contact Info */}
        <div className="flex flex-col gap-10 md:w-1/2 w-full">
          <p className="font-montserrat font-semibold text-3xl sm:text-4xl w-full lg:w-8/12">
            Let's discuss something{" "}
            <span className="font-lora font-bold text-orange-600">cool</span>{" "}
            together
          </p>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <MdMailOutline className="text-orange-500 text-2xl" />
              <p className="font-inter font-medium text-lg sm:text-xl">
                info@ticketeer.com
              </p>
            </div>

            <div className="flex items-center gap-4">
              <FaPhoneVolume className="text-orange-500 text-2xl" />
              <p className="font-inter font-medium text-lg sm:text-xl">
                08080910750
              </p>
            </div>

            <div className="flex items-center gap-4">
              <IoLocationOutline className="text-orange-500 text-2xl" />
              <p className="font-inter font-medium text-lg sm:text-xl">
                Nigeria
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 sm:p-10 rounded-xl shadow-md w-full md:w-1/2">
          <form className="flex flex-col gap-5 font-inter">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Please fill your email"
                className="bg-orange-50 p-3 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-300"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="font-medium">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Subject"
                className="bg-orange-50 p-3 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-300"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Type your message"
                className="bg-orange-50 p-3 rounded-lg border-b-2 border-orange-200 focus:outline-none focus:border-orange-300"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="font-inter px-4 py-3 bg-orange-400 text-white font-medium rounded-full text-sm transition-colors duration-500 ease-in-out hover:bg-orange-500 w-full sm:w-auto min-w-max whitespace-nowrap"
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);
}

export default Contact