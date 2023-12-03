import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = ({ trainings }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const formattedEvents = trainings.map(training => ({
      title: training.activity,
      start: moment(training.date).toDate(),
      end: moment(training.date).add(training.duration, 'minutes').toDate(),
      allDay: false
    }));
    setEvents(formattedEvents);
  }, [trainings]);

  return (
    <div style={{ height: '700px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default MyCalendar;
