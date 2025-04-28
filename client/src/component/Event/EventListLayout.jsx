import React from "react";
import EventListView from "../Event/EventTabs/EventListView";

const EventListLayout = () => {
  return (
    <>
      <section className="fixed inset-0 bg-orange-50 dark:bg-zinc-900 bg-fixed font-inter z-0"></section>

      <div className="relative z-10 py-28">
        <div className="flex justify-between lg:px-20 md:px-10 px-2 gap-16">
          <div className="w-full">
            <EventListView />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventListLayout;
