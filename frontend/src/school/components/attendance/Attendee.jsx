import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { baseApi } from '../../../environment.js'
import axios from 'axios'

export default function Attendee({ classId, handleMessage, message }) {
    const [attendee, setAttendee] = useState(null);
    const [teachers, setTeachers] = React.useState([]);
    const [selectedTeacher, setSelectedTeacher] = React.useState("");
    
    const handleSubmit = async () => {
        try {
            if (selectedTeacher) {
                const response = await axios.patch(`${baseApi}/class/update/${classId}`, { attendee: selectedTeacher })
                // console.log('Submit Attende', response);
                handleMessage("Success in Attendee Save/Update", "success");
            } else {
                alert("Please Select Teacher First");
            }
        } catch (error) {
            console.error(
                `%c[ERROR in Updating Attendee]:- ${error.name || "Unknown Error"} `,
                "color: red; font-weight: bold; font-size: 14px;", error
            );
        }
    }

    const fetchTeachers = () => {
        axios.get(`${baseApi}/teacher/fetch-with-query`, { params: {} })
            .then(res => {
                setTeachers(res.data.teachers);
            }).catch(error => {
                console.error(
                    `%c[ERROR in Fetching Teachers]:- ${error.name || "Unknown Error"} `,
                    "color: red; font-weight: bold; font-size: 14px;", error
                );
            })
    }

    const fetchClassDetails = async () => {
        if (classId) {
            try {
                const response = await axios.get(`${baseApi}/class/single/${classId}`)
                setAttendee(response.data.data.attendee ? response.data.data.attendee : null)
                // console.log("Single Class", response);
            } catch (error) {
                console.error(
                    `%c[ERROR in Fetching Class Details]:- ${error.name || "Unknown Error"} `,
                    "color: red; font-weight: bold; font-size: 14px;", error
                );
            }
        }
    }

    useEffect(() => {
        fetchClassDetails();
        fetchTeachers();
    }, [classId, message])
    return (
        <>
            <Box sx={{ padding: "20px"}}>
                {attendee &&
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mb: 2 }} component={'div'}>
                        <Typography variant='h5'>Attendee Teacher :&nbsp;</Typography>
                        <Typography variant='h5'>{attendee.name}</Typography>
                    </Box>}
                <FormControl sx={{ width: '180px', mb: 2, mr: 2 }}>
                    <InputLabel id="demo-simple-select-label">Select Teacher</InputLabel>
                    <Select
                        label="Select Teacher"
                        value={selectedTeacher}
                        onChange={(e) => { setSelectedTeacher(e.target.value) }}
                    >
                        <MenuItem value="">Select Teacher</MenuItem>
                        {teachers && teachers.map(x => {
                            return (<MenuItem key={x._id} value={x._id}>{x.name}</MenuItem>)
                        })}
                    </Select>
                </FormControl>
                <Button onClick={handleSubmit} variant='contained' sx={{mb: 2}}>{attendee ? "Change Attendee" : "Select Attendee"}</Button>
            </Box>
        </>
    )
}
