import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { baseApi } from '../../../environment.js'
import { Alert, Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check'
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar.jsx'

export default function AttendanceTeacher() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [attendanceChecked, setAttendanceChecked] = useState(false);
  const [students, setStudents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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
      console.error(
        `%c[ERROR in Sending Single Attendance]:- ${error.name || "Unknown Error"} `,
        "color: red; font-weight: bold; font-size: 14px;", error
      );
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
      console.error(
        `%c[ERROR in Submit Attendace]:- ${error.name || "Unknown Error"} `,
        "color: red; font-weight: bold; font-size: 14px;", error
      );
      setMessage("Failed Attendance Submiting");
      setMessageType("error");
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
      console.error(
        `%c[ERROR in Fetch Attendee of Class]:- ${error.name || "Unknown Error"} `,
        "color: red; font-weight: bold; font-size: 14px;", error
      );
    }
  }

  useEffect(() => {
    fetchAttendeeClass();
  }, [])

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
        setLoading(false);
      }
    } catch (error) {
      console.error(
        `%c[ERROR in Checking Attendance in Attendance Page]:- ${error.name || "Unknown Error"} `,
        "color: red; font-weight: bold; font-size: 14px;", error
      );
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAttendanceAndFetchStudent();
  }, [selectedClass])

  return (
    <>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}

      {classes.length > 0 ?
        <Paper sx={{ mb: '20px' }}>
          <Box sx={{ display: 'flex', padding: 2 }}>
            <FormControl sx={{ mt: '10px', minWidth: '210px' }} >
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                label="Class"
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setStudents([]);
                  setAttendanceStatus({});
                  setAttendanceChecked(false);
                  setLoading(true);
                }}
              >
                {classes && classes.map(x => {
                  return (<MenuItem key={x._id} value={x._id}>{x.class_text} [{x.class_num}]</MenuItem>)
                })}
              </Select>
            </FormControl>
            <Alert icon={<CheckIcon fontSize='inherit' />} severity='success' sx={{ width: '100%', ml: 2 }}>You are Attendee of {classes.length} Class</Alert>
          </Box>
        </Paper> : <Alert icon={<CheckIcon fontSize='inherit' />} severity='warning'>
          You are not Attendee of any Class
        </Alert>}

      {loading ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row"><Skeleton width="150px" /></TableCell>
                  <TableCell align="right"><Skeleton width="120px" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : students.length > 0 ?
        <Paper>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell align="right"><b>Action</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(students.map((student) => (
                  <TableRow hover key={student._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">{student.name}</TableCell>
                    <TableCell align="right">
                      <FormControl>
                        {/* <InputLabel id="demo-simple-select-label">Attendance</InputLabel>
                        <Select
                          label="Attendance"
                          value={attendanceStatus[student._id]}
                          onChange={(e) => { handleAttendance(student._id, e.target.value) }}
                        >
                          <MenuItem value="present">Present</MenuItem>
                          <MenuItem value="absent">Absent</MenuItem>
                        </Select> */}
                        <RadioGroup
                          row
                          aria-labelledby="demo-form-control-label-placement"
                          value={attendanceStatus[student._id]}
                          onChange={(e) => { handleAttendance(student._id, e.target.value) }}
                        >
                          <FormControlLabel value="present" control={<Radio />} label="Present" />
                          <FormControlLabel value="absent" control={<Radio />} label="Absent" />
                        </RadioGroup>
                      </FormControl>
                    </TableCell>

                  </TableRow>
                )))}
              </TableBody>
            </Table>
            <Button sx={{ margin: 2 }} variant='contained' onClick={submitAttendance}>Take Attendance</Button>
          </TableContainer>
        </Paper> : <>
          <Alert icon={<CheckIcon fontSize='inherit' />} severity='warning'>
            {attendanceChecked ? "Attendance Already Taken For this Class" : "There is no Students in this Class. Check Another Class"}
          </Alert>
        </>}
    </>
  )
}
