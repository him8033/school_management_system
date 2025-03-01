import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { subjectSchema } from '../../../yupSchema/subjectSchema.js'
import axios from 'axios'
import { baseApi } from '../../../environment.js'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar.jsx'

export default function Subjects() {

  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');
  const handleMessageClose = () => {
    setMessage('');
  }

  const [subjects, setSubjects] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleEdit = (x) => {
    setEdit(true);
    setEditId(x._id);
    formik.setFieldValue("subject_name", x.subject_name);
    formik.setFieldValue("subject_codename", x.subject_codename);
  }

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    formik.setFieldValue("subject_name", "");
    formik.setFieldValue("subject_codename", "");
  }

  const handleDelete = (x) => {
    axios.delete(`${baseApi}/subject/delete/${x._id}`)
      .then(res => {
        setMessage(res.data.message);
        setMessageType("success");
      }).catch(err => {
        console.log("Error in delete Subjects", err)
        setMessage("Error in Delete");
        setMessageType("error");
      })
  }

  const formik = useFormik({
    initialValues: { subject_name: "", subject_codename: "" },
    validationSchema: subjectSchema,
    onSubmit: (values) => {
      // console.log(values);

      if (edit) {
        axios.patch(`${baseApi}/subject/update/${editId}`, { ...values })
          .then(res => {
            setMessage(res.data.message);
            setMessageType("success");
            cancelEdit();
          }).catch(err => {
            console.log("Error in Subject Updating:- ", err);
            setMessage("Error in update.");
            setMessageType("error");
          })
      } else {
        axios.post(`${baseApi}/subject/create`, { ...values })
          .then(res => {
            // console.log("Subject add response:- ", res);
            setMessage(res.data.message);
            setMessageType("success");
          }).catch(err => {
            console.log("Error in Subject:- ", err);
            setMessage("Error in saving Subject.");
            setMessageType("error");
          })
      }
      formik.resetForm();
    }
  })

  const fetchAllSubjects = () => {
    axios.get(`${baseApi}/subject/all`)
      .then(res => {
        setSubjects(res.data.data);
        // console.log(res)
      }).catch(err => {
        console.log("Error in fetching all Subjects", err)
      })
  }
  useEffect(() => {
    fetchAllSubjects();
  }, [message])

  return (
    <>
      <Typography variant='h3' sx={{textAlign: 'center', fontWeight: '700'}}>Subject</Typography>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}
      <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1 }, display: 'flex', flexDirection: 'column', width: '100%', minWidth: '230px', margin: 'auto', background: '#fff' }}
        noValidate
        autoComplete="off"
        onSubmit={formik.handleSubmit}
      >

        {edit ? <Typography variant='h4' sx={{ textAlign: "center", paddingBottom: "25px", fontWeight: 700 }}>Edit Subject</Typography>
          : <Typography variant='h4' sx={{ textAlign: "center", paddingBottom: "25px", fontWeight: 700 }}>Add New Subject</Typography>
        }
        <TextField
          name="subject_name"
          label="Subject Name"
          value={formik.values.subject_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.subject_name && formik.errors.subject_name && <p style={{ color: 'red', textTransform: 'capitalize' }}>
          {formik.errors.subject_name}
        </p>}

        <TextField
          name="subject_codename"
          label="Subject Codename"
          value={formik.values.subject_codename}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.subject_codename && formik.errors.subject_codename && <p style={{ color: 'red', textTransform: 'capitalize' }}>
          {formik.errors.subject_codename}
        </p>}

        <Button sx={{width: '120px'}} type='submit' variant='contained'>Submit</Button>
        {edit && <Button sx={{width: '120px'}} onClick={() => { cancelEdit() }} type='button' variant='outlined'>Cancel Edit</Button>}

      </Box>

      <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {subjects && subjects.map(x => {
          return (<Paper key={x._id} sx={{ m: 2, p: 2 }}>
            <Box component={'div'}>
              <Typography variant='h4'> Subject: {x.subject_name} [{x.subject_codename}]</Typography>
            </Box>
            <Box component={'div'}>
              <Button onClick={() => { handleEdit(x) }}><EditIcon /></Button>
              <Button onClick={() => { handleDelete(x) }} sx={{ color: 'red' }}><DeleteIcon /></Button>
            </Box>
          </Paper>)
        })}
      </Box>
    </>
  )
}
