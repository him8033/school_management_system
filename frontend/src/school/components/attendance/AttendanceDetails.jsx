import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseApi } from '../../../environment.js';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

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

export default function AttendanceDetails() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = React.useState(true);
    const [present, setPresent] = useState(0);
    const [absent, setAbsent] = useState(0);
    const studentId = useParams().id;
    const navigate = useNavigate();

    const convertDate = (dateData) => {
        return new Date(dateData).toLocaleDateString('en-GB'); // Outputs in DD/MM/YYYY format
    };


    const fetchAttendanceData = async () => {
        try {
            const response = await axios.get(`${baseApi}/attendance/${studentId}`);
            // console.log("Response Attendance Details", response);
            setAttendanceData(response.data)

            let presentCount = 0;
            let absentCount = 0;
            response.data.forEach(attendance => {
                if (attendance.status === "present") presentCount++;
                else if (attendance.status === "absent") absentCount++;
            });
            setPresent(presentCount);
            setAbsent(absentCount);
            setLoading(false);
        } catch (error) {
            console.log("Error in fetching student Attendance.", error);
            navigate('/school/attendance');
        }
    }

    useEffect(() => {
        fetchAttendanceData();
    }, [studentId, navigate])
    return (
        <>
            <Typography variant='h4'>Attendance Details</Typography>
            <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                    <Item>
                        <PieChart
                            series={[
                                {
                                    data: [
                                        { id: 0, value: present, label: `Present = ${present}` },
                                        { id: 1, value: absent, label: `Absent = ${absent}` },
                                    ],
                                },
                            ]}
                            width={400}
                            height={200}
                        />
                    </Item>
                </Grid>
                <Grid xs={12} sm={6}>
                    <Item>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell align="right">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell><Skeleton variant="text" width={120} /></TableCell>
                                            <TableCell align="right"><Skeleton variant="text" width={120} /></TableCell>
                                        </TableRow>
                                    ) : attendanceData.length > 0 ?
                                        (attendanceData.map((attendance) => (
                                            <TableRow
                                                key={attendance._id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">{convertDate(attendance.date)}</TableCell>
                                                <TableCell align="right">{attendance.status}</TableCell>
                                            </TableRow>
                                        ))) : (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center">
                                                    <Typography variant="h6">There is no Examination Available</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Item>
                </Grid>
            </Grid>
        </>

    )
}
