import React from "react";
import { Link } from "react-router-dom";
const keyPoints = [
  {
    title: "Blockchain & NFT Ticketing",
    content:
      "More events will use blockchain for secure, fraud-proof ticketing and NFTs for collectible tickets.",
  },
  {
    title: "Hybrid & Virtual Events Growth",
    content:
      "Even as in-person events return, hybrid experiences will continue to thrive.",
  },
  {
    title: "Sustainable Ticketing Solutions",
    content:
      "Eco-friendly ticketing (paperless, carbon offset options) will become the norm.",
  },
  {
    title: "Dynamic Pricing & Demand-Based Ticketing",
    content:
      "Organizers will adopt real-time pricing strategies similar to airlines.",
  },
];

const Blog = () => {
  const currentYear = new Date().getFullYear();
  const getCurrentYear = () => {
    return currentYear;
  };

  const nextYear = currentYear + 1;
  return (
    <section className="bg-bgColor dark:bg-zinc-800 scroll-smooth px-4 pt-32 pb-12">
      <div className="flex flex-col items-center gap-20">
        {/* Title and Overview */}
        <div className="max-w-6xl text-center px-6">
          <h1 className="font-merriweather text-2xl md:text-4xl font-bold leading-relaxed text-zinc-900 dark:text-white">
            The Future of Event Ticketing: Trends to Watch in {getCurrentYear()}
          </h1>
          <div className="mt-12 space-y-4">
            <p className="font-inter font-medium text-3xl text-zinc-800 dark:text-zinc-200">
              Overview
            </p>
            <p className="font-inter text-lg text-zinc-600 dark:text-zinc-300">
              The event ticketing industry is evolving rapidly, driven by
              advancements in technology, changing consumer expectations, and
              new market demands. As we move into {nextYear}, event organizers
              and attendees alike must stay ahead of these shifts to create
              seamless, engaging, and secure event experiences. Here are the top
              trends shaping the future of event ticketing.
            </p>
          </div>
        </div>

        {/* Key Points */}
        <div id="points" className="max-w-5xl w-full space-y-6 px-6">
          <h2 className="font-inter font-semibold text-3xl text-center sm:text-left text-zinc-900 dark:text-white">
            Key Points
          </h2>
          <ul className="list-disc space-y-4 pl-6">
            {keyPoints.map((point, index) => (
              <li
                key={index}
                className="font-inter font-semibold text-xl leading-relaxed text-zinc-800 dark:text-zinc-300"
              >
                <span className="font-lora text-2xl font-semibold block mb-1">
                  {point.title}:
                </span>
                <span className="font-normal text-lg">{point.content}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Final Thoughts */}
        <div id="thought" className="max-w-5xl space-y-6 text-center px-6">
          <h2 className="font-inter font-semibold text-3xl text-zinc-900 dark:text-white">
            Final Thoughts
          </h2>
          <p className="font-inter font-normal text-lg text-zinc-600 dark:text-zinc-300">
            The future of event ticketing is being shaped by technology,
            innovation, and changing consumer behavior. Whether you're an event
            organizer looking to optimize sales or an attendee seeking a
            seamless booking experience, staying ahead of these trends will
            ensure you get the most out of the evolving event landscape.
          </p>
          <p className="font-inter font-normal text-lg text-zinc-600 dark:text-zinc-300">
            At{" "}
            <span className="font-bold text-zinc-900 dark:text-white">
              Ticketeer
            </span>
            , we are committed to delivering cutting-edge ticketing solutions
            that enhance both organizer and attendee experiences. Stay tuned for
            more updates as we continue to shape the future of event ticketing!
          </p>
        </div>

        {/* CTA Banner */}
        <div className="w-11/12 md:w-10/12 bg-eventLove bg-cover bg-no-repeat rounded-3xl flex items-center justify-center">
          <div className="text-white text-center py-20 md:py-36 px-6 md:px-40 flex flex-col gap-12">
            <p className="font-inter font-semibold text-3xl md:text-5xl leading-snug">
              Your go-to platform for all types of event booking and ticket
              purchase
            </p>
            <Link to="/event-list">
              <button className="font-inter bg-slate-500 hover:bg-slate-600 transition-colors text-lg py-3 px-8 rounded-lg w-full md:w-auto max-w-xs mx-auto">
                EXPLORE NOW
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
