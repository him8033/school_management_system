import * as React from 'react';
import { Typography, FormControl, InputLabel, Select, MenuItem, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Box, Skeleton } from '@mui/material';
import TextField from '@mui/material/TextField';
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar.jsx';
import axios from 'axios';
import { baseApi } from '../../../environment.js'
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Attendee from './Attendee.jsx';
import { Link } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function AttendanceStudentList() {
  const [classes, setClasses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');
  const handleMessageClose = () => {
    setMessage('');
  }

  const handleMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const fetchClasses = () => {
    axios.get(`${baseApi}/class/all`)
      .then(res => {
        setClasses(res.data.data);
      }).catch(err => {
        console.log("Error in fetchig Classes");
      })
  }

  const [params, setParams] = React.useState({});
  const [selectedClass, setSelectedClass] = React.useState(null);

  const handleClass = (e) => {
    setSelectedClass(e.target.value);
    setLoading(true)
    setParams((prevParams) => ({
      ...prevParams,
      student_class: e.target.value || undefined,
    }))
  }

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }))
  }

  const [students, setStudents] = React.useState([]);
  const fetchStudents = () => {
    axios.get(`${baseApi}/student/fetch-with-query`, { params })
      .then(res => {
        setStudents(res.data.students);
        fetchAttendanceForStudents(res.data.students);
        setLoading(false);
        // console.log("Response Students:", res);
      }).catch(err => {
        console.log("Error in fetchig Students");
        setLoading(false);
      })
  }

  const [attendanceData, setAttendanceData] = React.useState({});
  const fetchAttendanceForStudents = async (studentsList) => {
    const attendancePromises = studentsList.map((student) =>
      fetchAttendanceForStudent(student._id)
    );
    const results = await Promise.all(attendancePromises);
    const updatedAttendanceData = {};
    results.forEach(({ studentId, attendancePercentage }) => {
      updatedAttendanceData[studentId] = attendancePercentage;
    })
    setAttendanceData(updatedAttendanceData);
  }

  const fetchAttendanceForStudent = async (studentId) => {
    try {
      const response = await axios.get(`${baseApi}/attendance/${studentId}`);
      const attendanceRecords = response.data;
      const totalClasses = attendanceRecords.length;
      const presentCount = attendanceRecords.filter(
        (record) => record.status === "present"
      ).length;
      const attendancePercentage = totalClasses > 0 ? (presentCount / totalClasses * 100) : 0;
      return { studentId, attendancePercentage }
    } catch (error) {
      console.error(`Error fetching attendance for student ${studentId}:`, error);
      return { studentId, attendancePercentage: 0 };
    }
  }

  React.useEffect(() => {
    fetchClasses();
  }, [])

  React.useEffect(() => {
    fetchStudents();
  }, [message, params])

  return (
    <Box component={'div'} sx={{
      height: "100%",
      paddingTop: "50px",
      paddingBottom: "50px"
    }}>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}
      <Typography variant='h2' sx={{ textAlign: "center", paddingBottom: "25px" }}>Student Attendance</Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 4 }}>
          <Item>
            <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mt: '40px' }}>
              <TextField
                label="Search"
                value={params.search ? params.search : ""}
                onChange={(e) => { handleSearch(e) }}
              />

              <FormControl sx={{ width: '180px', ml: '10px' }}>
                <InputLabel id="demo-simple-select-label">Student Class</InputLabel>
                <Select
                  label="Student Class"
                  value={params.student_class ? params.student_class : ""}
                  onChange={(e) => { handleClass(e) }}
                >
                  <MenuItem>Select Class</MenuItem>
                  {classes && classes.map(x => {
                    return (<MenuItem key={x._id} value={x._id}>{x.class_text} [{x.class_num}]</MenuItem>)
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box>
              {selectedClass && <Attendee classId={selectedClass} handleMessage={handleMessage} message={message} />}
            </Box>
          </Item>
        </Grid>
        <Grid size={{ xs: 6, md: 8 }}>
          <Item>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Gender</TableCell>
                    <TableCell align="right">Guardian Phone</TableCell>
                    <TableCell align="right">Class</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                    <TableCell align="right">View</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    Array.from(new Array(5)).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton variant="text" width={200} /></TableCell>
                        <TableCell align="right"><Skeleton variant="text" width={80} /></TableCell>
                        <TableCell align="right"><Skeleton variant="text" width={120} /></TableCell>
                        <TableCell align="right"><Skeleton variant="text" width={80} /></TableCell>
                        <TableCell align="right"><Skeleton variant="text" width={60} /></TableCell>
                        <TableCell align="right"><Skeleton variant="text" width={80} /></TableCell>
                      </TableRow>
                    ))
                  ) : students && students.length > 0 ?
                    students.map((student) => (
                      <TableRow
                        key={student._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {student.name}
                        </TableCell>
                        <TableCell align="right">{student.gender}</TableCell>
                        <TableCell align="right">{student.guardian_phone}</TableCell>
                        <TableCell align="right">{student.student_class.class_text}</TableCell>
                        <TableCell align="right">{attendanceData[student._id] !== undefined ? `${attendanceData[student._id].toFixed(2)}%` : "No Data"}</TableCell>
                        <TableCell align="right"><Link to={`/school/attendance/${student._id}`}>Details</Link></TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="h6">No students available</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
