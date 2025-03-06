import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { baseApi } from '../../../environment.js'
import axios from 'axios'

export default function Attendee({ classId, handleMessage, message }) {

    const handleSubmit = async () => {
        try {
            if(selectedTeacher){
                const response = await axios.patch(`${baseApi}/class/update/${classId}`, { attendee: selectedTeacher })
                // console.log('Submit Attende', response);
                handleMessage("Success in Attendee Save/Update", "success");
            }else{
                alert("Please Select Teacher First");
            }
        } catch (error) {
            console.log("Attendee Error", error);
        }
    }

    const [teachers, setTeachers] = React.useState([]);
    const [selectedTeacher, setSelectedTeacher] = React.useState("");
    const fetchTeachers = () => {
        axios.get(`${baseApi}/teacher/fetch-with-query`, { params: {} })
            .then(res => {
                setTeachers(res.data.teachers);
            }).catch(err => {
                console.log("Error in fetchig Teachers");
            })
    }

    const [attendee, setAttendee] = useState(null);
    const fetchClassDetails = async () => {
        if (classId) {
            try {
                const response = await axios.get(`${baseApi}/class/single/${classId}`)
                setAttendee(response.data.data.attendee ? response.data.data.attendee : null)
                // console.log("Single Class", response);
            } catch (error) {
                console.log("Single Class Error", error);
            }
        }
    }

    useEffect(() => {
        fetchClassDetails();
        fetchTeachers();
    }, [classId, message])
    return (
        <>
            <Box>
                {attendee &&
                    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}} component={'div'}>
                        <Typography variant='h5'>Attendee Teacher :</Typography>
                        <Typography variant='h5'>{attendee.name}</Typography>
                    </Box>}
                <FormControl sx={{ width: '180px', ml: '10px' }}>
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
                <Button onClick={handleSubmit} variant='contained'>{attendee ? "Change Attendee" : "Select Attendee"}</Button>
            </Box>
        </>
    )
}
