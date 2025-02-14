import React from 'react'

const PrivacyPolicy = () => {
  return (
    <section className="bg-bgColor">
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32">
      {/* Header Section */}
      <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 mx-auto w-full sm:w-11/12 md:w-10/12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-merriweather text-center">Privacy Policy</h1>
        <p className="text-sm sm:text-sm md:text-base lg:text-lg font-medium mt-3 sm:mt-4 md:mt-5 lg:mt-6 font-inter">
          Welcome to Ticketeer! We are committed to providing you with a seamless and secure expense tracking
          experience. Our platform is designed to help you manage your finances efficiently, track your spending habits,
          and gain valuable insights into your financial health. By using our platform, you agree to comply with and be
          bound by the following privacy policy.
        </p>
      </div>

      {/* Terms Content */}
      <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
        {/* Subheading */}
        <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl font-merriweather font-semibold px-2 sm:px-4 md:px-8 lg:px-16 xl:px-24">
          Please, read the privacy policy carefully
        </h2>

        {/* Terms Paragraphs */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
            <p className="font-bodyFont text-xs sm:text-sm md:text-base lg:text-lg">
              <span className="font-headerFont font-bold text-sm sm:text-base md:text-lg lg:text-xl">
                1. Acceptance of Terms:
              </span>{" "}
              By accessing or using our expense tracker application, you agree to these terms. If you do not agree,
              please do not use the service.
            </p>

            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <p className="font-headerFont font-bold text-sm sm:text-base md:text-lg lg:text-xl">
                2. Account Registration
              </p>
              <ul className="font-bodyFont text-xs sm:text-sm md:text-base lg:text-lg space-y-1 sm:space-y-2 list-disc pl-4 sm:pl-5 md:pl-6">
                <li>You must provide accurate, complete, and up-to-date information when creating an account.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>We reserve the right to suspend or terminate accounts that provide false information.</li>
              </ul>
            </div>

            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <p className="font-headerFont font-bold text-sm sm:text-base md:text-lg lg:text-xl">
                3. Use of the Service
              </p>
              <ul className="font-bodyFont text-xs sm:text-sm md:text-base lg:text-lg space-y-1 sm:space-y-2 list-disc pl-4 sm:pl-5 md:pl-6">
                <li>The platform is provided for personal and business expense tracking purposes only.</li>
                <li>
                  You agree not to misuse the service by attempting to hack, reverse engineer, or disrupt operations.
                </li>
                <li>Unauthorized commercial use of the platform is strictly prohibited.</li>
              </ul>
            </div>

            <p className="font-bodyFont text-xs sm:text-sm md:text-base lg:text-lg">
              <span className="font-headerFont font-bold text-sm sm:text-base md:text-lg lg:text-xl">
                4. Privacy Policy:{" "}
              </span>
              Your use of the service is also governed by our Privacy Policy, which outlines how we collect, use, and
              protect your personal information.
            </p>

            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <p className="font-headerFont font-bold text-sm sm:text-base md:text-lg lg:text-xl">
                5. User Responsibilities
              </p>
              <ul className="font-bodyFont text-xs sm:text-sm md:text-base lg:text-lg space-y-1 sm:space-y-2 list-disc pl-4 sm:pl-5 md:pl-6">
                <li>You are responsible for the accuracy of the data you enter.</li>
                <li>You must comply with all applicable financial laws and regulations.</li>
                <li>
                  We are not liable for any financial decisions made based on the information provided by our platform.
                </li>
              </ul>
            </div>

            <p className="font-bodyFont text-xs sm:text-sm md:text-base lg:text-lg">
              <span className="font-headerFont font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                6. Limitation of Liability:{" "}
              </span>
              We are not liable for any direct, indirect, incidental, or consequential damages resulting from your use
              of the service.
            </p>

            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <p className="font-headerFont font-bold text-sm sm:text-base md:text-lg lg:text-xl">
                7. Intellectual Property
              </p>
              <ul className="font-bodyFont text-xs sm:text-sm md:text-base lg:text-lg space-y-1 sm:space-y-2 list-disc pl-4 sm:pl-5 md:pl-6">
                <li>All content, including trademarks, logos, and software, belongs to SpendSmart or its licensors.</li>
                <li>You may not copy, distribute, or use any content without prior written permission.</li>
              </ul>
            </div>

            <p className="font-bodyFont text-xs sm:text-sm md:text-base lg:text-lg">
              <span className="font-headerFont font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                8. Termination of Service:{" "}
              </span>
              We reserve the right to terminate or suspend your account and access to the service at our sole
              discretion, without prior notice, for any reason, including a breach of these terms.
            </p>

            <p className="font-bodyFont text-xs sm:text-sm md:text-base lg:text-lg">
              <span className="font-headerFont font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                9. Changes to Terms:{" "}
              </span>
              We may update these terms periodically. Continued use of the platform after updates constitutes acceptance
              of the revised terms.
            </p>

            <p className="font-bodyFont text-xs sm:text-sm md:text-base lg:text-lg">
              <span className="font-headerFont font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                10. Contact Us:{" "}
              </span>
              If you have any questions regarding these terms, please contact us at{" "}
              <span className="hover:text-indigo-300 transition-colors duration-300 cursor-pointer">
                spendsmart@gmail.com
              </span>
              .
            </p>

            <p className="font-bodyFont text-xs sm:text-sm md:text-base lg:text-lg">
              By using our service, you acknowledge that you have read, understood, and agreed to these privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default PrivacyPolicy