import React from 'react'

const Blog = () => {
    const getCurrentYear = () => {
        return new Date().getFullYear();
    };
  return (
    <section>
        <div className='px-4 pt-32 pb-12 bg-bgColor flex flex-col items-center'>
            <div className='flex justify-between px-20 pb-20'>
                <div className='flex flex-col gap-12 items-center'>
                    <h1 className='font-merriweather text-2xl md:text-3xl lg:text-4xl font-semibold md:font-bold lg:font-bold leading-relaxed text-center'>The Future of Event Ticketing: Trends to Watch in {getCurrentYear()}</h1>
                    <div className='flex flex-col gap-4'>
                        <p className='font-quicksand font-bold text-3xl'>Overview</p>
                        <p className='font-quicksand font-semibold text-xl'>The event ticketing industry is evolving rapidly, driven by advancements in technology, changing consumer expectations, and new market demands. As we move into 2025, event organizers and attendees alike must stay ahead of these shifts to create seamless, engaging, and secure event experiences. Here are the top trends shaping the future of event ticketing.</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-8 pb-20 px-20'>
                <h1 className='font-montserrat font-semibold text-3xl'>Key Points</h1>
                <div className=''>
                    <ul className='flex flex-col gap-6 list-disc pl-6'>
                        <li className='font-quicksand font-semibold text-xl'><span className='font-lora font-semibold text-2xl'>Blockchain & NFT Ticketing: </span>More events will use blockchain for secure, fraud-proof ticketing and NFTs for collectible tickets.  More events will use blockchain for secure, fraud-proof ticketing and NFTs for collectible tickets.</li>
                        <li className='font-quicksand font-semibold text-xl'><span className='font-lora font-semibold text-2xl'>Hybrid & Virtual Events Growth: </span>Even as in-person events return, hybrid experiences will continue to thrive. Even as in-person events return, hybrid experiences will continue to thrive. Even as in-person events return, hybrid experiences will continue to thrive.</li>
                        <li className='font-quicksand font-semibold text-xl'><span className='font-lora font-semibold text-2xl'>Sustainable Ticketing Solutions: </span>Eco-friendly ticketing (paperless, carbon offset options) will become the norm. Eco-friendly ticketing (paperless, carbon offset options) will become the norm. Eco-friendly ticketing (paperless, carbon offset options) will become the norm.</li>
                        <li className='font-quicksand font-semibold text-xl'><span className='font-lora font-semibold text-2xl'>Dynamic Pricing & Demand-Based Ticketing: </span>Organizers will adopt real-time pricing strategies similar to airlines. Organizers will adopt real-time pricing strategies similar to airlines. Organizers will adopt real-time pricing strategies similar to airlines.</li>
                    </ul>
                </div>
            </div>

            <div className='flex flex-col gap-6 pb-20 px-20'>
                <h1 className='font-montserrat font-semibold text-3xl'>Final Thoughts</h1>
                <div className='flex flex-col gap-2 items-center'>
                    <p className='font-poppins font-normal text-xl'>The future of event ticketing is being shaped by technology, innovation, and changing consumer behavior. Whether you're an event organizer looking to optimize sales or an attendee seeking a seamless booking experience, staying ahead of these trends will ensure you get the most out of the evolving event landscape.</p>
                    <p className='font-poppins font-normal text-xl'>At Ticketeer, we are committed to delivering cutting-edge ticketing solutions that enhance both organizer and attendee experiences. Stay tuned for more updates as we continue to shape the future of event ticketing!</p>
                </div>
            </div>

            <div className="bg-eventLove flex items-center w-11/12 md:w-10/12 bg-cover bg-no-repeat rounded-3xl">
                <div className='flex flex-col gap-12 items-center justify-center text-white text-center py-20 md:py-40 px-6 md:px-40'>
                    <p className='font-montserrat font-semibold text-4xl md:text-6xl'>Your go-to platform for all types of event booking and ticket purchase </p>
                    <button className="font-inter bg-slate-500 py-3 px-8 md:px-20 text-lg text-white rounded-lg hover:bg-slate-600 transition-colors w-full md:w-auto md:max-w-[320px]">EXPLORE NOW</button>
                </div>
            </div>
        </div>
</section>
  )
}

export default Blog