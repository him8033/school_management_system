import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { FormControl, MenuItem, Select, Typography } from '@mui/material'
import axios from 'axios'
import { baseApi } from '../../../environment.js'

const localizer = momentLocalizer(moment);

export default function ScheduleTeacher() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const date = new Date();
  const myEventsList = []

  const [events, setEvents] = useState(myEventsList);

  useEffect(() => {
    axios.get(`${baseApi}/class/all`)
      .then(res => {
        setClasses(res.data.data);
        setSelectedClass(res.data.data[0]._id)
      }).catch(err => {
        console.log("Fetch Class Error:", err);
      })
  }, [])

  useEffect(() => {
    if (selectedClass) {
      axios.get(`${baseApi}/schedule/fetch-with-class/${selectedClass}`)
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
        }).catch(err => {
          console.log("Fetch Schedule Error:", err);
        })
    }
  }, [selectedClass])

  return (
    <>
      <div>Schedule</div>

      <FormControl fullWidth>
        <Typography variant='h5'>Class</Typography>
        <Select
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value)
          }}
        >
          <MenuItem>Select Class</MenuItem>
          {classes && classes.map(x => {
            return (<MenuItem key={x._id} value={x._id}>{x.class_text} [{x.class_num}]</MenuItem>)
          })}
        </Select>
      </FormControl>

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
