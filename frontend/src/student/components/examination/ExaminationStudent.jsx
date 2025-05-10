import * as React from 'react';
import { Button, Paper, Skeleton, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import { baseApi } from '../../../environment.js';
import { Link } from 'react-router-dom';

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
                <TableCell>Exam Date</TableCell>
                <TableCell align="center">Subject</TableCell>
                <TableCell align="center">Exam Type</TableCell>
                <TableCell align="center">Duration (minutes)</TableCell>
                <TableCell align="center">Total Marks</TableCell>
                <TableCell align="center">Passing Marks</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell align="center">Questions</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell align="center"><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell align="center"><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell align="center"><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell align="center"><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell align="center"><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell align="center"><Skeleton variant="rectangular" width={40} height={30} /></TableCell>
                    <TableCell align="center"><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell align="center"><Skeleton variant="rectangular" width={150} height={30} /></TableCell>
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
                    <TableCell align="center">{examination.duration} Minutes</TableCell>
                    <TableCell align="center">{examination.totalMarks}</TableCell>
                    <TableCell align="center">{examination.passingMarks}</TableCell>
                    <TableCell align="center">
                      <Switch checked={examination.isActive} disabled />
                    </TableCell>
                    <TableCell align="center">
                      {examination.questions.length} Questions
                    </TableCell>
                    
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          sx={{ background: 'green', mr: '5px' }}
                          // onClick={() => handleEdit(examination._id)}
                          disabled={!examination.isActive}
                        >
                          <Link to={`/student/examination/${examination._id}`}>Take Exam</Link>
                        </Button>
                      </TableCell>
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
