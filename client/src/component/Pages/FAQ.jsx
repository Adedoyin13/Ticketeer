import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

export const faq = [
  {
    question: "Do I need an account to buy tickets?",
    answer:
      "Yes, having an account ensures you can track your purchases, access your tickets, and receive event updates. Yes, having an account ensures you can track your purchases, access your tickets, and receive event updates.",
  },
  {
    question: "Will I receive a physical ticket?",
    answer:
      "Most tickets are digital (e-tickets or QR codes). Some events may offer physical ticket pickup—check the event details for options. Most tickets are digital (e-tickets or QR codes). Some events may offer physical ticket pickup—check the event details for options.",
  },
  {
    question: "What if I lose my ticket?",
    answer:
      "No worries! Your tickets are always stored in your account under My Tickets. No worries! Your tickets are always stored in your account under My Tickets. No worries! Your tickets are always stored in your account under My Tickets.",
  },
  {
    question: "Can I get a refund if I can't attend?",
    answer:
      "Refund policies vary by event. If the event allows refunds, you can request one through your account. Refund policies vary by event. If the event allows refunds, you can request one through your account."
  },
  {
    question: "Are there age restrictions for events?",
    answer:
      "Some events have age limits (e.g., 18+ or 21+). Check the event page before purchasing. Some events have age limits (e.g., 18+ or 21+). Check the event page before purchasing."
  },
  {
    question: "My payment failed. What should I do?",
    answer:
      "Double-check your payment details and try again. If the issue persists, try another payment method or contact your bank. Double-check your payment details and try again. If the issue persists, try another payment method or contact your bank."
  },
  {
    question: "How do I sell tickets through Ticketeer?",
    answer:
      "Sign up as an organizer, create your event, set ticket prices, and start selling instantly. Sign up as an organizer, create your event, set ticket prices, and start selling instantly."
  },
];

const FAQ = () => {
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
    <section className="bg-bgColor">
      <div className="container mx-auto px-4 pt-32 pb-12">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 mx-auto w-full sm:w-11/12 md:w-10/12">
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-merriweather">Frequently Asked Questions</h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium mt-3 sm:mt-4 md:mt-5 lg:mt-6 font-inter px-2 sm:px-4 md:px-6 lg:px-0 text-center sm:text-left">Ticketeer is an event ticketing platform helps with selling, distributing, and managing tickets for events such as concerts, sports games, theater performances, conferences, and festivals. It involves various methods and technologies to ensure a smooth entry and experience for attendees while helping organizers manage attendance and revenue.</p>
        </div>

        {/* FAQ Section */}
        <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 px-2 sm:px-6 md:px-12 lg:px-16 xl:px-20">
          {faq?.map(({ question, answer }, index) => {
            const isOpen = openStates[index];

            return (
              <div key={index} className="mb-4 sm:mb-6">
                <div className={`bg-orange-100 rounded-2xl ${!isOpen && "rounded-2xl"} shadow-orange-200 shadow-md transition-all duration-300`}>
                  <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-4 md:py-5 cursor-pointer" onClick={() => toggleOpen(index)}>
                    <p className="font-poppins font-semibold text-base sm:text-lg md:text-xl pr-4">{question}</p>
                    <span className="flex-shrink-0">{isOpen ? (<FaAngleUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"/>) : (<FaAngleDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"/>)}</span>
                  </div>

                  {isOpen && (
                    <div className="px-4 sm:px-6 md:px-8 lg:px-12 pb-4 sm:pb-5 md:pb-6">
                      <p className="font-poppins font-normal text-sm sm:text-base md:text-lg leading-relaxed">{answer}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
