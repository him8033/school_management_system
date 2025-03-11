import { Box, Button, Paper, Skeleton, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { subjectSchema } from '../../../yupSchema/subjectSchema.js'
import axios from 'axios'
import { baseApi } from '../../../environment.js'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar.jsx'

export default function Subjects() {

  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [subjects, setSubjects] = useState([]);
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
    formik.setFieldValue("subject_name", x.subject_name);
    formik.setFieldValue("subject_codename", x.subject_codename);

    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      InputRef.current?.focus();
    }, 500);
  }

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    formik.setFieldValue("subject_name", "");
    formik.setFieldValue("subject_codename", "");
  }

  const handleDelete = (x) => {
    if (confirm("Are you sure! You want to Delete.")) {
      axios.delete(`${baseApi}/subject/delete/${x._id}`)
        .then(res => {
          setMessage(res.data.message);
          setMessageType("success");
        }).catch((error) => {
          console.error(
            `%c[ERROR in Deleting Subject]:- ${error.name || "Unknown Error"} `,
            "color: red; font-weight: bold; font-size: 14px;", error
          );
          setMessage("Error in Delete");
          setMessageType("error");
        })
    }
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
          }).catch((error) => {
            console.error(
              `%c[ERROR in Updating Subject]:- ${error.name || "Unknown Error"} `,
              "color: red; font-weight: bold; font-size: 14px;", error
            );
            setMessage("Error in update.");
            setMessageType("error");
          })
      } else {
        axios.post(`${baseApi}/subject/create`, { ...values })
          .then(res => {
            // console.log("Subject add response:- ", res);
            setMessage(res.data.message);
            setMessageType("success");
          }).catch((error) => {
            console.error(
              `%c[ERROR in Adding Subject]:- ${error.name || "Unknown Error"} `,
              "color: red; font-weight: bold; font-size: 14px;", error
            );
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
        setLoading(false);
        // console.log(res)
      }).catch((error) => {
        console.error(
          `%c[ERROR in Fetching Subject]:- ${error.name || "Unknown Error"} `,
          "color: red; font-weight: bold; font-size: 14px;", error
        );
        setLoading(false);
      })
  }
  useEffect(() => {
    fetchAllSubjects();
  }, [message])

  return (
    <>
      <Typography variant='h4' sx={{ fontWeight: '700' }}>Subject</Typography>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}
      <Paper sx={{ marginBottom: 3 }} ref={ formRef }>
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1 }, display: 'flex', flexDirection: 'column', width: '50vw', minWidth: '230px', margin: 'auto', padding: 3 }}
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
            inputRef={InputRef}
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

          <Button type='submit' variant='contained'>Submit</Button>
          {edit && <Button onClick={() => { cancelEdit() }} type='button' variant='outlined'>Cancel</Button>}

        </Box>
      </Paper>

      <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {loading ? (
          Array.from(new Array(5)).map((_, index) => (
            <Paper key={index} sx={{ m: 2, p: 2, width: '400px', height: '100px' }}>
              <Skeleton variant='text' width={250} height={40} />
              <Skeleton variant='rectangular' width={150} height={30} sx={{ mt: 1 }} />
            </Paper>
          ))
        ) : subjects && subjects.length > 0 ?
          (subjects.map(x => {
            return (<Paper key={x._id} sx={{ m: 2, p: 2 }}>
              <Box component={'div'}>
                <Typography variant='h4'> Subject: {x.subject_name} [{x.subject_codename}]</Typography>
              </Box>
              <Box component={'div'}>
                <Button onClick={() => { handleEdit(x) }}><EditIcon /></Button>
                <Button onClick={() => { handleDelete(x) }} sx={{ color: 'red' }}><DeleteIcon /></Button>
              </Box>
            </Paper>)
          })) : (
            <Typography variant='h4' sx={{ m: 'auto' }}>No subjects available.</Typography>
          )}
      </Box>
    </>
  )
}
