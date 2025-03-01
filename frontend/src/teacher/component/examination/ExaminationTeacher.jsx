import * as React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import { baseApi } from '../../../environment';

export default function ExaminationTeacher() {
  const [examinations, setExaminations] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState("");

  const dateFormat = (dateData) => {
    const date = new Date(dateData);
    return date.getDate() + "-" + (+ date.getMonth() + 1) + "-" + date.getFullYear();
  }

  const [classes, setClasses] = React.useState([]);
  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${baseApi}/class/all`);
      setClasses(response.data.data);
      setSelectedClass(response.data.data[0]._id);
    } catch (error) {
      console.log("Error in fetching Subject from examination component", error);
    }
  }

  const fetchExamination = async () => {
    try {
      if (selectedClass) {
        const response = await axios.get(`${baseApi}/examination/class/${selectedClass}`);
        setExaminations(response.data.examinations);
      }
    } catch (error) {
      console.log("Error in fetching Examination from examination component", error);
    }
  }

  React.useEffect(() => {
    fetchClasses();
  }, [])

  React.useEffect(() => {
    fetchExamination();
  }, [selectedClass])

  return (
    <>
      <Paper sx={{ mb: '20px' }}>
        <Box>
          <FormControl sx={{ mt: '10px', minWidth: '210px' }} >
            <InputLabel id="demo-simple-select-label">Subject</InputLabel>
            <Select
              label="Subject"
              value={selectedClass}
              onChange={(e) => { setSelectedClass(e.target.value) }}
            >
              <MenuItem value="">Select Class</MenuItem>
              {classes && classes.map(x => {
                return (<MenuItem key={x._id} value={x._id}>{x.class_text} [{x.class_num}]</MenuItem>)
              })}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><b>Exam Date</b></TableCell>
              <TableCell align="right"><b>Subject</b></TableCell>
              <TableCell align="right"><b>Exam Type</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examinations.map((examination) => (
              <TableRow
                key={examination._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {dateFormat(examination.examDate)}
                </TableCell>
                <TableCell align="right">{examination.subject.subject_name}</TableCell>
                <TableCell align="right">{examination.examType}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
