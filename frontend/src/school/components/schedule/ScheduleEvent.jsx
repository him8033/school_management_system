import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { periodSchema } from '../../../yupSchema/periodSchema.js';
import axios from 'axios';
import { useFormik } from 'formik';
import { baseApi } from '../../../environment.js';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from 'dayjs';


export default function ScheduleEvent({ selectedClass, handleEventClose, handleMessageNew, edit, selectedEventId }) {

    const periods = [
        { id: 1, label: 'Period 1(10:00 AM to 11:00 AM)', startTime: '10:00', endTime: '11:00' },
        { id: 2, label: 'Period 2(11:00 AM to 12:00 PM)', startTime: '11:00', endTime: '12:00' },
        { id: 3, label: 'Period 3(12:00 PM to 1:00 PM)', startTime: '12:00', endTime: '13:00' },
        { id: 4, label: 'Lunch Break(1:00 PM to 2:00 PM)', startTime: '13:00', endTime: '14:00' },
        { id: 5, label: 'Period 4(2:00 PM to 3:00 PM)', startTime: '14:00', endTime: '15:00' },
        { id: 6, label: 'Period 5(3:00 PM to 4:00 PM)', startTime: '15:00', endTime: '16:00' },
        { id: 7, label: 'Period 6(4:00 PM to 5:00 PM)', startTime: '16:00', endTime: '17:00' },
    ]

    const handleDelete = () => {
        if (confirm("Are You Sure, You want to Delete Schedule?")) {
            axios.delete(`${baseApi}/schedule/delete/${selectedEventId}`)
                .then((res) => {
                    handleMessageNew(res.data.message, "success");
                    handleCancel();
                }).catch((err) => {
                    console.log("Schedule Deleting Error", err);
                    handleMessageNew("Error in Deleting Schedule", "error");
                })
        }
    }
    const handleCancel = () => {
        formik.resetForm();
        handleEventClose();
    }

    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const initialValues = {
        teacher: "",
        subject: "",
        period: "",
        date: new Date(),
    }

    const formik = useFormik({
        initialValues,
        validationSchema: periodSchema,
        onSubmit: (values) => {
            let date = new Date(values.date);
            let startTime = values.period.split(",")[0];
            let endTime = values.period.split(",")[1];
            // console.log(date, startTime, endTime)
            if (edit) {
                axios.patch(`${baseApi}/schedule/update/${selectedEventId}`, {
                    ...values,
                    selectedClass,
                    startTime: new Date(date.setHours(startTime.split(":")[0], startTime.split(":")[1])),
                    endTime: new Date(date.setHours(endTime.split(":")[0], endTime.split(":")[1])),
                }).then((res) => {
                    // console.log("Schedule Added Successfully", res);
                    handleMessageNew(res.data.message, "success");
                    formik.resetForm();
                    handleEventClose();
                }).catch((err) => {
                    console.log("Schedule Updating Error", err);
                    handleMessageNew("Error in Updating Schedule", "error");
                })
            } else {
                axios.post(`${baseApi}/schedule/create`, {
                    ...values,
                    selectedClass,
                    startTime: new Date(date.setHours(startTime.split(":")[0], startTime.split(":")[1])),
                    endTime: new Date(date.setHours(endTime.split(":")[0], endTime.split(":")[1])),
                }).then((res) => {
                    // console.log("Schedule Added Successfully", res);
                    handleMessageNew(res.data.message, "success");
                    formik.resetForm();
                    handleEventClose();
                }).catch((err) => {
                    console.log("Schedule Creation Error", err);
                    handleMessageNew("Error in Creating Schedule", "error");
                })
            }
        }
    })

    const fetchData = async () => {
        const teacherResponse = await axios.get(`${baseApi}/teacher/fetch-with-query`, { params: {} });
        const subjectResponse = await axios.get(`${baseApi}/subject/all`);
        setTeachers(teacherResponse.data.teachers);
        setSubjects(subjectResponse.data.data);
    }

    useEffect(() => {
        fetchData();
    }, [])

    const dateFormat = (date) => {
        const dateHours = date.getHours();
        const dateMinutes = date.getMinutes();
        return `${dateHours < 10 ? '0' : ''}${dateHours}:${dateMinutes < 10 ? '0' : ''}${dateMinutes}`
    }

    useEffect(() => {
        if (selectedEventId) {
            axios.get(`${baseApi}/schedule/fetch/${selectedEventId}`)
                .then((res) => {
                    let start = new Date(res.data.data.startTime);
                    let end = new Date(res.data.data.endTime);
                    formik.setFieldValue("teacher", res.data.data.teacher || "");
                    formik.setFieldValue("subject", res.data.data.subject || "");
                    formik.setFieldValue("date", start);
                    const finalFormattedTime = dateFormat(start) + ',' + dateFormat(end);
                    formik.setFieldValue("period", `${finalFormattedTime}`);
                }).catch((err) => {
                    console.log("Error", err);
                })
        }
    }, [selectedEventId])

    return (
        <>
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1 }, display: 'flex', flexDirection: 'column', width: '50vw', minWidth: '230px', margin: 'auto', background: '#fff' }}
                noValidate
                autoComplete="off"
                onSubmit={formik.handleSubmit}
            >
                {edit ? <Typography variant='h4' sx={{ textAlign: 'center' }}>Edit Period</Typography>
                    : <Typography variant='h4' sx={{ textAlign: 'center' }}>Add New Period</Typography>}
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Teacher</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="teacher"
                        label="Teacher"
                        value={teachers.some(x => x._id === formik.values.teacher) ? formik.values.teacher : ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <MenuItem value= "">Select Teacher</MenuItem>
                        {teachers && teachers.map(x => {
                            return (<MenuItem key={x._id} value={x._id}>{x.name}</MenuItem>)
                        })}
                    </Select>
                </FormControl>
                {formik.touched.teacher && formik.errors.teacher && <p style={{ color: 'red', textTransform: 'capitalize' }}>
                    {formik.errors.teacher}
                </p>}

                <FormControl>
                    <InputLabel id="demo-simple-select-label">Subject</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="subject"
                        label="Subject"
                        value={subjects.some(x => x._id === formik.values.subject) ? formik.values.subject : ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <MenuItem value= "">Select Subject</MenuItem>
                        {subjects && subjects.map(x => {
                            return (<MenuItem key={x._id} value={x._id}>{x.subject_name}</MenuItem>)
                        })}
                    </Select>
                </FormControl>
                {formik.touched.subject && formik.errors.subject && <p style={{ color: 'red', textTransform: 'capitalize' }}>
                    {formik.errors.subject}
                </p>}

                <FormControl>
                    <InputLabel id="demo-simple-select-label">Period</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="period"
                        label="Period"
                        value={formik.values.period}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <MenuItem value= "">Select Period</MenuItem>
                        {periods && periods.map(x => {
                            return (<MenuItem key={x.id} value={`${x.startTime},${x.endTime}`}>{x.label}</MenuItem>)
                        })}
                    </Select>
                </FormControl>
                {formik.touched.period && formik.errors.period && <p style={{ color: 'red', textTransform: 'capitalize' }}>
                    {formik.errors.period}
                </p>}

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                        <DatePicker label="Basic Date Picker"
                            value={formik.values.date ? dayjs(formik.values.date) : null}
                            onChange={(newValue) => {
                                formik.setFieldValue("date", newValue);
                            }} />
                    </DemoContainer>
                </LocalizationProvider>

                <Button type="submit" variant='contained'>Submit</Button>
                {edit && <Button type="button" variant='contained' sx={{ background: 'red' }} onClick={handleDelete}>Delete</Button>}

                <Button type="button" variant='outlined' onClick={handleCancel}>Cancel</Button>
            </Box>
        </>
    )
}
