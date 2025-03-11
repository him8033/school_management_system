import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseApi } from '../../../environment.js';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
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
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const studentId = useParams().id;
    const navigate = useNavigate();

    const convertDate = (dateData) => {
        return new Date(dateData).toLocaleDateString('en-GB'); // Outputs in DD/MM/YYYY format
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
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
            console.error(
                `%c[ERROR in Fetching Attendance Data]:- ${error.name || "Unknown Error"} `,
                "color: red; font-weight: bold; font-size: 14px;", error
            );
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
                <Grid size={8}>
                    <Item>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
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
                                        (attendanceData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((attendance) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={attendance._id}>
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
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={attendanceData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Item>
                </Grid>
            </Grid>
        </>

    )
}
