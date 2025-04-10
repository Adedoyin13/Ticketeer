import React, { useState } from "react";
import Calendar from "react-calendar";

const EventCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <>
      <Calendar onChange={setDate} value={date} className="custom-calendar" />
    </>
  );
};

export default EventCalendar;
