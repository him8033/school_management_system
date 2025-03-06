import * as React from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { examinationSchema } from '../../../yupSchema/examinationSchema.js'
import axios from 'axios';
import { baseApi } from '../../../environment.js';
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar.jsx';

export default function Examination() {
  const [examinations, setExaminations] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');
  const handleMessageClose = () => {
    setMessage('');
  }

  const dateFormat = (dateData) => {
    const date = new Date(dateData);
    return date.getDate() + "-" + (+ date.getMonth() + 1) + "-" + date.getFullYear();
  }

  const [editId, setEditId] = React.useState(null);
  const handleEdit = (id) => {
    setEditId(id);
    const selectedExamination = examinations.filter(x => x._id === id);
    formik.setFieldValue("date", selectedExamination[0].examDate);
    formik.setFieldValue("subject", selectedExamination[0].subject._id);
    formik.setFieldValue("examType", selectedExamination[0].examType);
  }

  const handleEditCancel = () => {
    setEditId(null);
    formik.resetForm();
  }

  const handleDelete = async (id) => {
    if (confirm("Are you sure! You want to Delete?")) {
      try {
        const response = await axios.delete(`${baseApi}/examination/delete/${id}`);
        // console.log("Delete Examination", response);
        setMessage(response.data.message);
        setMessageType("success");
      } catch (error) {
        setMessage("Error in Deleting Examination.");
        setMessageType("error");
        console.log("Error in Deleting Examination from examination component", error)
      }
    }
  }

  const initialValues = {
    date: "",
    subject: "",
    examType: "",
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: examinationSchema,
    onSubmit: async (values) => {
      if (editId) {
        try {
          const response = await axios.patch(`${baseApi}/examination/update/${editId}`, {
            date: values.date,
            subjectId: values.subject,
            examType: values.examType,
            classId: selectedClass
          });
          setMessage(response.data.message);
          setMessageType("success");
          formik.resetForm();
          // console.log("Response Update Examination: ", response);
        } catch (error) {
          setMessage("Error in Updating Examination");
          setMessageType("error");
          console.log("Error in Updating Examination from examination component", error)
        }
      } else {
        try {
          const response = await axios.post(`${baseApi}/examination/create`, {
            date: values.date,
            subjectId: values.subject,
            examType: values.examType,
            classId: selectedClass
          });
          setMessage(response.data.message);
          setMessageType("success");
          formik.resetForm();
          // console.log("Response New Examination: ", response);
        } catch (error) {
          setMessage("Error in saving New Examination");
          setMessageType("error");
          console.log("Error in Creating Examination from examination component", error)
        }
      }
    }
  })

  const [subjects, setSubjects] = React.useState([]);
  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${baseApi}/subject/all`);
      setSubjects(response.data.data);
    } catch (error) {
      console.log("Error in fetching Subject from examination component", error);
    }
  }

  const [classes, setClasses] = React.useState([]);
  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${baseApi}/class/all`);
      setClasses(response.data.data);
      if(response.data.data.length > 0){
        setSelectedClass(response.data.data[0]._id);
      }else{
        setSelectedClass("");
        setExaminations([]);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error in fetching Classes from examination component", error);
    }
  }

  const fetchExamination = async () => {
    try {
      if (selectedClass) {
        const response = await axios.get(`${baseApi}/examination/class/${selectedClass}`);
        setExaminations(response.data.examinations);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error in fetching Examination from examination component", error);
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchClasses();
  }, [])

  React.useEffect(() => {
    fetchSubjects();
    fetchExamination();
  }, [message, selectedClass])

  return (
    <>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}
      <Paper sx={{ mb: '20px' }}>
        <Box>
          <FormControl sx={{ mt: '10px', minWidth: '210px' }} >
            <InputLabel id="demo-simple-select-label">Class</InputLabel>
            <Select
              label="Class"
              value={selectedClass}
              onChange={(e) => { setSelectedClass(e.target.value) }}
            >
              <MenuItem value="">Select Class</MenuItem>
              {classes && classes.map(x => {
                return (<MenuItem key={x._id} value={x._id}>{x.class_text} [{x.class_num}]</MenuItem>)
              })}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper sx={{ mb: '20px' }}>
        <Box
          component="form"
          sx={{ width: '24vw', minWidth: '310px', margin: 'auto' }}
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          {editId ? <Typography variant='h4' gutterBottom>Edit Exam</Typography>
            : <Typography variant='h4' gutterBottom>Add New Exam</Typography>}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker label="Basic Date Picker"
                value={formik.values.date ? dayjs(formik.values.date) : null}
                onChange={(newValue) => {
                  formik.setFieldValue("date", newValue);
                }} />
            </DemoContainer>
          </LocalizationProvider>
          {formik.touched.date && formik.errors.date && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.date}
          </p>}

          <FormControl sx={{ mt: '10px' }} fullWidth>
            <InputLabel id="demo-simple-select-label">Subject</InputLabel>
            <Select
              label="Subject"
              name='subject'
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="">Select Subject</MenuItem>
              {subjects && subjects.map(x => {
                return (<MenuItem key={x._id} value={x._id}>{x.subject_name}</MenuItem>)
              })}
            </Select>
          </FormControl>
          {formik.touched.subject && formik.errors.subject && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.subject}
          </p>}

          <TextField
            label="Exam Type"
            name='examType'
            sx={{ mt: '10px' }}
            value={formik.values.examType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            variant="filled"
            fullWidth />
          {formik.touched.examType && formik.errors.examType && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.examType}
          </p>}

          <Button type='submit' sx={{ my: '10px' }} variant='contained'>Submit</Button>
          {editId && <Button type='button' onClick={handleEditCancel} sx={{ my: '10px', ml: '10px' }} variant='outlined'>Cancel</Button>}
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Exam Date</TableCell>
              <TableCell align="right">Subject</TableCell>
              <TableCell align="right">Exam Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width={120} /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width={100} /></TableCell>
                  <TableCell align="right"><Skeleton variant="rectangular" width={150} height={30} /></TableCell>
                </TableRow>
              ))
            ) : examinations && examinations.length > 0 ? (
              examinations.map((examination) => (
                <TableRow
                  key={examination._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {dateFormat(examination.examDate)}
                  </TableCell>
                  <TableCell align="right">{examination.subject.subject_name}</TableCell>
                  <TableCell align="right">{examination.examType}</TableCell>
                  <TableCell align="right">
                    <Button variant='contained' sx={{ background: 'green', mr: '5px' }} onClick={() => { handleEdit(examination._id) }}>Edit</Button>
                    <Button variant='contained' sx={{ background: 'red' }} onClick={() => { handleDelete(examination._id) }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="h6">No examinations available for this Class</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
