import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from 'axios'
import { baseApi } from '../../../environment.js'

const localizer = momentLocalizer(moment);

export default function ScheduleStudent() {
  const [selectedClass, setSelectedClass] = useState("");
  const myEventsList = []
  const [events, setEvents] = useState(myEventsList);

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(`${baseApi}/student/fetch-single`);
      // console.log(response)
      setSelectedClass(response.data.student.student_class);
    } catch (error) {
      console.error(
        `%c[ERROR in Fetch Student]:- ${error.name || "Unknown Error"} `,
        "color: red; font-weight: bold; font-size: 14px;", error
      );
    }
  }

  useEffect(() => {
    fetchStudentDetails();
  }, [])

  const fetchSchedule = () => {
    if (selectedClass) {
      axios.get(`${baseApi}/schedule/fetch-with-class/${selectedClass._id}`)
        .then(res => {
          const resData = res.data.data.map(x => {
            return ({
              id: x._id,
              title: `Subject: ${x.subject.subject_name}, Teacher: ${x.teacher.name}`,
              start: new Date(x.startTime),
              end: new Date(x.endTime)
            })
          })
          setEvents(resData);
        }).catch(error => {
          console.error(
            `%c[ERROR in Fetch Schedule]:- ${error.name || "Unknown Error"} `,
            "color: red; font-weight: bold; font-size: 14px;", error
          );
        })
    }
  }

  useEffect(() => {
    fetchSchedule();
  }, [selectedClass])

  return (
    <>
      <h1>Schedule of Your Class [{selectedClass && selectedClass.class_text}]</h1>

      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        views={['week', 'day', 'agenda']}
        step={30}
        timeslots={2}
        min={new Date(1970, 1, 1, 10, 0, 0)}
        startAccessor="start"
        endAccessor="end"
        max={new Date(1970, 1, 1, 17, 0, 0)}
        defaultDate={new Date()}
        showMultiDayTimes
        style={{ height: '100%', width: '100%', marginTop: '10px' }}
      />
    </>
  )
}
