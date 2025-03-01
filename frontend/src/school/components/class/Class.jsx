import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { classSchema } from '../../../yupSchema/classSchema'
import axios from 'axios'
import { baseApi } from '../../../environment'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar'

export default function Class() {

  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');
  const handleMessageClose = () => {
    setMessage('');
  }

  const [classes, setClasses] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleEdit = (x) => {
    setEdit(true);
    setEditId(x._id);
    formik.setFieldValue("class_text", x.class_text);
    formik.setFieldValue("class_num", x.class_num);
  }

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    formik.setFieldValue("class_text", "");
    formik.setFieldValue("class_num", "");
  }

  const handleDelete = (x) => {
    axios.delete(`${baseApi}/class/delete/${x._id}`)
      .then(res => {
        setMessage(res.data.message);
        setMessageType("success");
      }).catch(err => {
        console.log("Error in delete Classes", err)
        setMessage("Error in Delete");
        setMessageType("error");
      })
  }

  const formik = useFormik({
    initialValues: { class_text: "", class_num: "" },
    validationSchema: classSchema,
    onSubmit: (values) => {
      // console.log(values);

      if (edit) {
        axios.patch(`${baseApi}/class/update/${editId}`, { ...values })
          .then(res => {
            setMessage(res.data.message);
            setMessageType("success");
            cancelEdit();
          }).catch(err => {
            console.log("Error in Class Updating:- ", err);
            setMessage("Error in update.");
            setMessageType("error");
          })
      } else {
        axios.post(`${baseApi}/class/create`, { ...values })
          .then(res => {
            // console.log("Class add response:- ", res);
            setMessage(res.data.message);
            setMessageType("success");
          }).catch(err => {
            console.log("Error in Class:- ", err);
            setMessage("Error in saving Class.");
            setMessageType("error");
          })
      }
      formik.resetForm();
    }
  })

  const fetchAllClasses = () => {
    axios.get(`${baseApi}/class/all`)
      .then(res => {
        setClasses(res.data.data);
        // console.log(res)
      }).catch(err => {
        console.log("Error in fetching all Classes", err)
      })
  }
  useEffect(() => {
    fetchAllClasses();
  }, [message])

  return (
    <>
      <Typography variant='h3' sx={{textAlign: 'center', fontWeight: '700'}}>Class</Typography>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}
      <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1 }, display: 'flex', flexDirection: 'column', width: '50vw', minWidth: '230px', margin: 'auto', background: '#fff' }}
        noValidate
        autoComplete="off"
        onSubmit={formik.handleSubmit}
      >

        {edit ? <Typography variant='h4' sx={{ textAlign: "center", paddingBottom: "25px", fontWeight: 700 }}>Edit Class</Typography>
          : <Typography variant='h4' sx={{ textAlign: "center", paddingBottom: "25px", fontWeight: 700 }}>Add New Class</Typography>
        }
        <TextField
          name="class_text"
          label="Class Text"
          value={formik.values.class_text}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.class_text && formik.errors.class_text && <p style={{ color: 'red', textTransform: 'capitalize' }}>
          {formik.errors.class_text}
        </p>}

        <TextField
          name="class_num"
          label="Class Number"
          value={formik.values.class_num}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.class_num && formik.errors.class_num && <p style={{ color: 'red', textTransform: 'capitalize' }}>
          {formik.errors.class_num}
        </p>}

        <Button sx={{width: '120px'}} type='submit' variant='contained'>Submit</Button>
        {edit && <Button sx={{width: '120px'}} onClick={() => { cancelEdit() }} type='button' variant='outlined'>Cancel</Button>}

      </Box>

      <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {classes && classes.map(x => {
          return (<Paper key={x._id} sx={{ m: 2, p: 2 }}>
            <Box component={'div'}>
              <Typography variant='h4'> Class: {x.class_text} [{x.class_num}]</Typography>
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
