import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button, FormControl, MenuItem, Select, Typography } from '@mui/material'
import ScheduleEvent from './ScheduleEvent.jsx'
import axios from 'axios'
import { baseApi } from '../../../environment.js'
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar.jsx'

const localizer = momentLocalizer(moment);

export default function Schedule() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [newPeriod, setNewPeriod] = useState(false);
  const date = new Date();
  const myEventsList = [
    {
      id: 1,
      title: "Subject: FCET, Teacher: Rajiv",
      start: new Date(date.setHours(11, 30)),
      end: new Date(date.setHours(12, 30))
    },

    {
      id: 2,
      title: "Subject: POM, Teacher: Rajesh",
      start: new Date(date.setHours(13, 30)),
      end: new Date(date.setHours(14, 30))
    },
  ]

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const handleMessageClose = () => {
    setMessage('');
  }
  
  const handleMessageNew = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  }

  const [events, setEvents] = useState(myEventsList);
  const handleEventClose = () => {
    setNewPeriod(false);
    setEdit(false);
    setSelectedEventId(null);
  }

  const [edit, setEdit] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const handleSelectEvent = (event) => {
    setEdit(true);
    setSelectedEventId(event.id);
  }

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
  }, [selectedClass, message])

  return (
    <>
      <div>Schedule</div>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}

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

      <Button onClick={() => { setNewPeriod(true) }}>Add New Period</Button>
      {(newPeriod || edit) && <ScheduleEvent 
        selectedClass={selectedClass} 
        handleEventClose={handleEventClose} 
        handleMessageNew={handleMessageNew}
        edit={edit}
        selectedEventId={selectedEventId}
     />}
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
        onSelectEvent={handleSelectEvent}
        max={new Date(1970, 1, 1, 17, 0, 0)}
        defaultDate={new Date()}
        showMultiDayTimes
        style={{ height: '100%', width: '100%' }}
      />
    </>
  )
}
