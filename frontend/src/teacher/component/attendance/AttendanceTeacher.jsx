import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { baseApi } from '../../../environment'
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check'
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar'

export default function AttendanceTeacher() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState({});

  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');
  const handleMessageClose = () => {
    setMessage('');
  }

  const handleAttendance = (studentId, status) => {
    setAttendanceStatus(prevStatus => ({
      ...prevStatus,
      [studentId]: status
    }));
  }

  const singleStudentAttendance = async (studentId, status) => {
    try {
      const response = await axios.post(`${baseApi}/attendance/mark`, {
        studentId,
        date: new Date(),
        classId: selectedClass,
        status
      });
      // console.log("Marking Attendance", response);
    } catch (error) {
      console.log("Error in Marking Attendance", error);
    }
  }

  const submitAttendance = async () => {
    try {
      await Promise.all(students.map((student) =>
        singleStudentAttendance(student._id, attendanceStatus[student._id])
      ))
      setMessage("Attendance Submitted Successfully");
      setMessageType("success");

      setStudents([]);
      setAttendanceStatus({});
      setAttendanceChecked(true);

    } catch (error) {
      setMessage("Failed Attendance Submitted");
      setMessageType("error");
      console.log("Error in Marking All Attendance", error);
    }
  }

  const fetchAttendeeClass = async () => {
    try {
      const response = await axios.get(`${baseApi}/class/attendee`);
      // console.log("Attendee Class ", response);
      setClasses(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedClass(response.data.data[0]._id);
      }
    } catch (error) {
      console.log("Error in fetching Attendee Class ", error);
    }
  }

  useEffect(() => {
    fetchAttendeeClass();
  }, [])

  const [attendanceChecked, setAttendanceChecked] = useState(false);
  const [students, setStudents] = React.useState([]);

  const checkAttendanceAndFetchStudent = async () => {
    try {
      if (selectedClass) {
        setStudents([]);
        setAttendanceStatus({});
        const responseStudent = await axios.get(`${baseApi}/student/fetch-with-query`, { params: { student_class: selectedClass } });
        const responseCheck = await axios.get(`${baseApi}/attendance/check/${selectedClass}`);
        if (!responseCheck.data.attendanceTaken) {
          setStudents(responseStudent.data.students);
          setAttendanceChecked(false);

          const newAttendanceStatus = {};
          responseStudent.data.students.forEach(student => {
            newAttendanceStatus[student._id] = 'present';
          });
          setAttendanceStatus(newAttendanceStatus);
        } else {
          setAttendanceChecked(true);
        }
      }
    } catch (error) {
      console.log("Error in checking Attendance", error);
    }
  }

  useEffect(() => {
    checkAttendanceAndFetchStudent();
  }, [selectedClass])

  return (
    <>
      <div>AttendanceTeacher</div>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}

      {classes.length > 0 ?
        <Paper sx={{ mb: '20px' }}>
          <Box>
            <Alert icon={<CheckIcon fontSize='inherit' />} severity='success'>You are Attendee of {classes.length} Class</Alert>
            <FormControl sx={{ mt: '10px', minWidth: '210px' }} >
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                label="Class"
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setStudents([]);
                  setAttendanceStatus({});
                  setAttendanceChecked(false)
                }}
              >
                <MenuItem value="">Select Class</MenuItem>
                {classes && classes.map(x => {
                  return (<MenuItem key={x._id} value={x._id}>{x.class_text} [{x.class_num}]</MenuItem>)
                })}
              </Select>
            </FormControl>
          </Box>
        </Paper> : <Alert icon={<CheckIcon fontSize='inherit' />} severity='warning'>
          You are not Attendee of any Class
        </Alert>}

      {students.length > 0 ? <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell align="right"><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow
                key={student._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">{student.name}</TableCell>
                <TableCell align="right">
                  <FormControl sx={{ mt: '10px' }} >
                    <InputLabel id="demo-simple-select-label">Attendance</InputLabel>
                    <Select
                      label="Attendance"
                      value={attendanceStatus[student._id]}
                      onChange={(e) => { handleAttendance(student._id, e.target.value) }}
                    >
                      <MenuItem value="present">Present</MenuItem>
                      <MenuItem value="absent">Absent</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant='contained' onClick={submitAttendance}>Take Attendance</Button>
      </TableContainer> : <>
        <Alert icon={<CheckIcon fontSize='inherit' />} severity='warning'>
          {attendanceChecked ? "Attendance Already Taken For this Class" : "There is no Students in this Class."}
        </Alert>
      </>}
    </>
  )
}
