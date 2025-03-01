import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { noticeSchema } from '../../../yupSchema/noticeSchema'
import axios from 'axios'
import { baseApi } from '../../../environment'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar'

export default function Notice() {

  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');
  const handleMessageClose = () => {
    setMessage('');
  }

  const [noticees, setNotices] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleEdit = (x) => {
    setEdit(true);
    setEditId(x._id);
    formik.setFieldValue("title", x.title);
    formik.setFieldValue("message", x.message);
    formik.setFieldValue("audience", x.audience);
  }

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    formik.resetForm();
  }

  const handleDelete = (x) => {
    axios.delete(`${baseApi}/notice/delete/${x._id}`)
      .then(res => {
        setMessage(res.data.message);
        setMessageType("success");
      }).catch(err => {
        console.log("Error in delete Notices", err)
        setMessage("Error in Delete");
        setMessageType("error");
      })
  }

  const formik = useFormik({
    initialValues: { title: "", message: "", audience: "" },
    validationSchema: noticeSchema,
    onSubmit: (values) => {
      // console.log(values);

      if (edit) {
        axios.patch(`${baseApi}/notice/update/${editId}`, { ...values })
          .then(res => {
            setMessage(res.data.message);
            setMessageType("success");
            cancelEdit();
          }).catch(err => {
            console.log("Error in Notice Updating:- ", err);
            setMessage("Error in update.");
            setMessageType("error");
          })
      } else {
        axios.post(`${baseApi}/notice/create`, { ...values })
          .then(res => {
            // console.log("Notice add response:- ", res);
            setMessage(res.data.message);
            setMessageType("success");
          }).catch(err => {
            console.log("Error in Notice:- ", err);
            setMessage("Error in saving Notice.");
            setMessageType("error");
          })
      }
      formik.resetForm();
    }
  })

  const fetchAllNotices = () => {
    axios.get(`${baseApi}/notice/all`)
      .then(res => {
        setNotices(res.data.data);
        // console.log(res)
      }).catch(err => {
        console.log("Error in fetching all Notices", err)
      })
  }
  useEffect(() => {
    fetchAllNotices();
  }, [message])

  return (
    <>
      <Typography variant='h3' sx={{ textAlign: 'center', fontWeight: '700' }}>Notice</Typography>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}
      <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1 }, display: 'flex', flexDirection: 'column', width: '50vw', minWidth: '230px', margin: 'auto', background: '#fff' }}
        noValidate
        autoComplete="off"
        onSubmit={formik.handleSubmit}
      >

        {edit ? <Typography variant='h4' sx={{ textAlign: "center", paddingBottom: "25px", fontWeight: 700 }}>Edit Notice</Typography>
          : <Typography variant='h4' sx={{ textAlign: "center", paddingBottom: "25px", fontWeight: 700 }}>Add New Notice</Typography>
        }
        <TextField
          name="title"
          label="Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.title && formik.errors.title && <p style={{ color: 'red', textTransform: 'capitalize' }}>
          {formik.errors.title}
        </p>}

        <TextField
          multiline
          rows={4}
          name="message"
          label="Message"
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.message && formik.errors.message && <p style={{ color: 'red', textTransform: 'capitalize' }}>
          {formik.errors.message}
        </p>}

        <FormControl sx={{ mt: '10px' }}>
          <InputLabel id="demo-simple-select-label">Audience</InputLabel>
          <Select
            label="Audience"
            name='audience'
            value={formik.values.audience}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <MenuItem value="">Select Audience</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="student">Student</MenuItem>
          </Select>
        </FormControl>
        {formik.touched.audience && formik.errors.audience && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.audience}
          </p>}

        <Button sx={{ width: '120px' }} type='submit' variant='contained'>Submit</Button>
        {edit && <Button sx={{ width: '120px' }} onClick={() => { cancelEdit() }} type='button' variant='outlined'>Cancel</Button>}

      </Box>

      <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {noticees && noticees.map(x => {
          return (<Paper key={x._id} sx={{ m: 2, p: 2 }}>
            <Box component={'div'}>
              <Typography variant='h4'><b>Title: </b>{x.title}</Typography>
              <Typography variant='h4'><b>Message: </b>{x.message}</Typography>
              <Typography variant='h4'><b>Audience: </b>{x.audience}</Typography>
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
