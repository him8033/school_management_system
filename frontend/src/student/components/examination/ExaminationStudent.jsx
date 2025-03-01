import * as React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import { baseApi } from '../../../environment.js';

export default function ExaminationStudent() {
  const [examinations, setExaminations] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState("");
  const [className, setClassName] = React.useState("");

  const dateFormat = (dateData) => {
    const date = new Date(dateData);
    return date.getDate() + "-" + (+ date.getMonth() + 1) + "-" + date.getFullYear();
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

  const fetchStudentDetails = async() => {
    try {
      const response = await axios.get(`${baseApi}/student/fetch-single`);
      // console.log(response)
      setSelectedClass(response.data.student.student_class._id);
      setClassName(response.data.student.student_class.class_text);
    } catch (error) {
      console.log("Error in fetching Single Student Details.", error);
    }
  }

  React.useEffect(() => {
    fetchStudentDetails();
  }, [])

  React.useEffect(() => {
    fetchExamination();
  }, [selectedClass])

  return (
    <>
      <Typography variant='h4'>Examination of Your Class[{className}]</Typography>

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
