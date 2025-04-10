import React from "react";
import EventListView from "../Event/EventTabs/EventListView";

const EventListLayout = () => {
  return (
    <section className="bg-orange-100 py-28 font-inter">
      <div className="flex justify-between lg:px-20 md:px-10 px-2 gap-16">
        <div className="w-full">
          <EventListView />
        </div>
      </div>
    </section>
  );
};

export default EventListLayout;