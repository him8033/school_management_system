import * as React from 'react';
import { CardMedia, Button, Typography, Paper, Box, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { registerSchema } from '../../../yupSchema/registerSchema.js';
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar.jsx';
import axios from 'axios';
import { baseApi } from '../../../environment.js';

export default function Register() {
  const [file, setFile] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');
  const handleMessageClose = () => {
    setMessage('');
  }

  const addImage = (event) => {
    const file = event.target.files[0];
    setImageUrl(URL.createObjectURL(file));
    setFile(file);
  }

  const fileInputRef = React.useRef(null);
  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFile(null);
    setImageUrl(null);
  }

  const initialValues = {
    school_name: "",
    email: "",
    owner_name: "",
    password: "",
    confirm_password: ""
  }

  const formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: (values) => {
      // console.log("Register submit values: ", values);
      if (file) {
        const fd = new FormData();
        fd.append("image", file, file.name);
        fd.append("school_name", values.school_name);
        fd.append("email", values.email);
        fd.append("owner_name", values.owner_name);
        fd.append("password", values.password);

        axios.post(`${baseApi}/school/register`, fd)
          .then(res => {
            console.log(res);
            setMessage(res.data.message);
            setMessageType('success');
            formik.resetForm();
            handleClearFile();
          }).catch(error => {
            console.error(
              `%c[ERROR in School Registration Page]:- ${error.name || "Unknown Error"} `,
              "color: red; font-weight: bold; font-size: 14px;", error
            );
            setMessage(error.response.data.message);
            setMessageType('error');
          })
      } else {
        setMessage("Please add College Image.");
        setMessageType('error');
      }
    }
  })

  return (
    <Box component={'div'} sx={{
      background: "url(https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      height: "100%",
      paddingTop: "50px",
      paddingBottom: "50px"
    }}>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}
      <Paper sx={{ width: '55vw', minWidth: '230px', margin: 'auto', padding: '2.5vw', borderRadius: '1rem' }}>
        <Typography variant='h2' sx={{ textAlign: "center", paddingBottom: "25px" }}>Registration Form</Typography>
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1 }, display: 'flex', flexDirection: 'column', width: '50vw', minWidth: '230px', margin: 'auto' }}
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >

          <Typography>Add College Image</Typography>
          <TextField
            type='file'
            inputRef={fileInputRef}
            onChange={(event) => { addImage(event) }}
          />
          {imageUrl && <Box>
            <CardMedia component={'img'} height={'240px'} image={imageUrl} />
          </Box>}

          <TextField
            name="school_name"
            label="College Name"
            value={formik.values.school_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.school_name && formik.errors.school_name && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.school_name}
          </p>}

          <TextField
            name="email"
            label="E-mail"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.email}
          </p>}

          <TextField
            name="owner_name"
            label="Owner Name"
            value={formik.values.owner_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.owner_name && formik.errors.owner_name && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.owner_name}
          </p>}

          <TextField
            type='password'
            name="password"
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.password}
          </p>}

          <TextField
            type='password'
            name="confirm_password"
            label="Confirm Password"
            value={formik.values.confirm_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.confirm_password && formik.errors.confirm_password && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.confirm_password}
          </p>}

          <Button type='submit' variant='contained'>Submit</Button>
        </Box>
      </Paper>
    </Box>
  );
}
