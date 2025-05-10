import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TablePagination, Typography, Skeleton, Switch } from '@mui/material';

export default function ExaminationList({ examinations, loading, handleEdit, handleDelete }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const dateFormat = (dateData) => {
        const date = new Date(dateData);
        return date.getDate() + "-" + (+ date.getMonth() + 1) + "-" + date.getFullYear();
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                        {/* Loading State */}
                        {loading ? (
                            Array.from(new Array(5)).map((_, index) => (
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
                        ) : examinations && examinations.length > 0 ? (
                            examinations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((examination) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={examination._id}>
                                    <TableCell component="th" scope="row">
                                        {dateFormat(examination.examDate)}
                                    </TableCell>
                                    <TableCell align="center">{examination.subject.subject_name}</TableCell>
                                    <TableCell align="center">{examination.examType}</TableCell>
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
                                            onClick={() => handleEdit(examination._id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ background: 'red' }}
                                            onClick={() => handleDelete(examination._id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    <Typography variant="h6">No examinations available for this class</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
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
    );
};
