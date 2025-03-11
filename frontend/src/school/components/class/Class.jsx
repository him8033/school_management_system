import { Box, Button, Paper, Skeleton, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { classSchema } from '../../../yupSchema/classSchema.js'
import axios from 'axios'
import { baseApi } from '../../../environment.js'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar.jsx'

export default function Class() {

  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [classes, setClasses] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleMessageClose = () => {
    setMessage('');
  }

  const formRef = useRef(null);
  const InputRef = useRef(null);

  const handleEdit = (x) => {
    setEdit(true);
    setEditId(x._id);
    formik.setFieldValue("class_text", x.class_text);
    formik.setFieldValue("class_num", x.class_num);

    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      InputRef.current?.focus();
    }, 500);
  }

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    formik.setFieldValue("class_text", "");
    formik.setFieldValue("class_num", "");
  }

  const handleDelete = (x) => {
    if (confirm("Are you sure! You want to Delete.")) {
      axios.delete(`${baseApi}/class/delete/${x._id}`)
        .then(res => {
          setMessage(res.data.message);
          setMessageType("success");
        }).catch(error => {
          console.error(
            `%c[ERROR in Deleting Class]:- ${error.name || "Unknown Error"} `,
            "color: red; font-weight: bold; font-size: 14px;", error
          );
          setMessage("Error in Delete");
          setMessageType("error");
        })
    }
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
          }).catch(error => {
            console.error(
              `%c[ERROR in Updating Class]:- ${error.name || "Unknown Error"} `,
              "color: red; font-weight: bold; font-size: 14px;", error
            );
            setMessage("Error in update.");
            setMessageType("error");
          })
      } else {
        axios.post(`${baseApi}/class/create`, { ...values })
          .then(res => {
            // console.log("Class add response:- ", res);
            setMessage(res.data.message);
            setMessageType("success");
          }).catch(error => {
            console.error(
              `%c[ERROR in Add Class]:- ${error.name || "Unknown Error"} `,
              "color: red; font-weight: bold; font-size: 14px;", error
            );
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
        setLoading(false);
        // console.log(res)
      }).catch(error => {
        console.error(
          `%c[ERROR in Fetching Class]:- ${error.name || "Unknown Error"} `,
          "color: red; font-weight: bold; font-size: 14px;", error
        );
        setLoading(false);
      })
  }
  useEffect(() => {
    fetchAllClasses();
  }, [message])

  return (
    <>
      <Typography variant='h4' sx={{ fontWeight: '700' }}>Class</Typography>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}
      <Paper sx={{ marginBottom: 3 }} ref={formRef}>
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1 }, display: 'flex', flexDirection: 'column', width: '50vw', minWidth: '230px', margin: 'auto', padding: 3 }}
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
            inputRef={InputRef}
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

          <Button type='submit' variant='contained'>Submit</Button>
          {edit && <Button onClick={() => { cancelEdit() }} type='button' variant='outlined'>Cancel</Button>}

        </Box>
      </Paper>

      <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {loading ? (
          Array.from(new Array(7)).map((_, index) => (
            <Paper key={index} sx={{ m: 2, p: 2, width: '300px', height: '100px' }}>
              <Skeleton variant='text' width={200} height={40} />
              <Skeleton variant='rectangular' width={100} height={30} sx={{ mt: 1 }} />
            </Paper>
          ))
        ) : classes && classes.length > 0 ?
          (classes.map(x => {
            return (<Paper key={x._id} sx={{ m: 2, p: 2 }}>
              <Box component={'div'}>
                <Typography variant='h4'> Class: {x.class_text} [{x.class_num}]</Typography>
              </Box>
              <Box component={'div'}>
                <Button onClick={() => { handleEdit(x) }}><EditIcon /></Button>
                <Button onClick={() => { handleDelete(x) }} sx={{ color: 'red' }}><DeleteIcon /></Button>
              </Box>
            </Paper>)
          })) : (
            <Typography variant='h4' sx={{ m: 'auto' }}>No classes available.</Typography>
          )}
      </Box>
    </>
  )
}
