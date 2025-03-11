import * as React from 'react';
import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import { baseApi } from '../../../environment.js';

export default function ExaminationStudent() {
  const [examinations, setExaminations] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState("");
  const [className, setClassName] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const dateFormat = (dateData) => {
    const date = new Date(dateData);
    return date.getDate() + "-" + (+ date.getMonth() + 1) + "-" + date.getFullYear();
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchExamination = async () => {
    try {
      if (selectedClass) {
        const response = await axios.get(`${baseApi}/examination/class/${selectedClass}`);
        setExaminations(response.data.examinations);
        setLoading(false);
      }
    } catch (error) {
      console.error(
        `%c[ERROR in Fetching Examination]:- ${error.name || "Unknown Error"} `,
        "color: red; font-weight: bold; font-size: 14px;", error
      );
      setLoading(false);

    }
  }

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(`${baseApi}/student/fetch-single`);
      // console.log(response)
      setSelectedClass(response.data.student.student_class._id);
      setClassName(response.data.student.student_class.class_text);
    } catch (error) {
      console.error(
        `%c[ERROR in Fetching Student Details]:- ${error.name || "Unknown Error"} `,
        "color: red; font-weight: bold; font-size: 14px;", error
      );
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

      <Paper>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell><b>Exam Date</b></TableCell>
                <TableCell align="right"><b>Subject</b></TableCell>
                <TableCell align="right"><b>Exam Type</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row"><Skeleton width="120px" /></TableCell>
                    <TableCell align="right"><Skeleton width="100px" /></TableCell>
                    <TableCell align="right"><Skeleton width="120px" /></TableCell>
                  </TableRow>
                ))
              ) : examinations.length > 0 ?
                (examinations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((examination) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={examination._id}>
                    <TableCell component="th" scope="row">
                      {dateFormat(examination.examDate)}
                    </TableCell>
                    <TableCell align="right">{examination.subject.subject_name}</TableCell>
                    <TableCell align="right">{examination.examType}</TableCell>

                  </TableRow>
                ))) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="h6">There is no Examination Available</Typography>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={examinations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
