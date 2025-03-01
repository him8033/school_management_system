import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios'
import { baseApi } from '../../../environment.js'
import { CardMedia } from '@mui/material';

export default function TeacherDetails() {
  const [teacherDetails, setTeacherDetails] = React.useState(null);

  const fetchTeacherDetails = async() => {
    try {
      const response = await axios.get(`${baseApi}/teacher/fetch-single`);
      setTeacherDetails(response.data.teacher);
    } catch (error) {
      console.log("Error in fetching Single Teacher Details.", error);
    }
  }

  React.useEffect(() => {
    fetchTeacherDetails();
  }, [])

  return (
    <>
      {teacherDetails && <>
        <CardMedia
          component="img"
          sx={{height: '310px', width: '310px', margin: 'auto', borderRadius: '50%'}}
          image={`${teacherDetails.teacher_image}`}
          alt={teacherDetails.name}
        />
        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              <TableRow>
                <TableCell><b>Name :</b></TableCell>
                <TableCell align="right">{teacherDetails.name}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell><b>E-mail :</b></TableCell>
                <TableCell align="right">{teacherDetails.email}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell><b>Age :</b></TableCell>
                <TableCell align="right">{teacherDetails.age}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell><b>Gender :</b></TableCell>
                <TableCell align="right">{teacherDetails.gender}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell><b>Qualification :</b></TableCell>
                <TableCell align="right">{teacherDetails.qualification}</TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </TableContainer>
      </>}
    </>
  );
}
