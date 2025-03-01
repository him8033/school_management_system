import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios'
import { baseApi } from '../../../environment'
import { CardMedia } from '@mui/material';

export default function StudentDetails() {
  const [studentDetails, setStudentDetails] = React.useState(null);

  const fetchStudentDetails = async() => {
    try {
      const response = await axios.get(`${baseApi}/student/fetch-single`);
      // console.log(response)
      setStudentDetails(response.data.student);
    } catch (error) {
      console.log("Error in fetching Single Student Details.", error);
    }
  }

  React.useEffect(() => {
    fetchStudentDetails();
  }, [])

  return (
    <>
      {studentDetails && <>
        <CardMedia
          component="img"
          sx={{height: '310px', width: '310px', margin: 'auto', borderRadius: '50%'}}
          image={`${studentDetails.student_image}`}
          alt={studentDetails.name}
        />
        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell><b>Name :</b></TableCell>
                <TableCell align="right">{studentDetails.name}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell><b>E-mail :</b></TableCell>
                <TableCell align="right">{studentDetails.email}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell><b>Class :</b></TableCell>
                <TableCell align="right">{studentDetails.student_class.class_text}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell><b>Age :</b></TableCell>
                <TableCell align="right">{studentDetails.age}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell><b>Gender :</b></TableCell>
                <TableCell align="right">{studentDetails.gender}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell><b>Guardian :</b></TableCell>
                <TableCell align="right">{studentDetails.guardian}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell><b>Guardian Phone :</b></TableCell>
                <TableCell align="right">{studentDetails.guardian_phone}</TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </TableContainer>
      </>}
    </>
  );
}
