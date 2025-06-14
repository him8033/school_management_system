import * as React from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar.jsx';
import axios from 'axios';
import { loginSchema } from '../../../yupSchema/loginSchema.js';
import { AuthContext } from '../../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { baseApi } from '../../../environment.js';

export default function Login() {
  const [role, setRole] = React.useState('student');
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');

  const handleMessageClose = () => {
    setMessage('');
  }

  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);
  const initialValues = {
    email: "",
    password: "",
  }

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      let URL;
      if (role === 'student') {
        URL = `${baseApi}/student/login`;
      } else if (role === 'teacher') {
        URL = `${baseApi}/teacher/login`;
      } else if (role === 'school') {
        URL = `${baseApi}/school/login`;
      }
      axios.post(URL, { ...values })
        .then(res => {
          const token = res.headers.get("Authorization");
          if (token) {
            localStorage.setItem("token", token);
          }

          const user = res.data.user;
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            login(user);
          }

          setMessage(res.data.message);
          setMessageType('success');
          formik.resetForm();
          navigate(`/${role}`);

        }).catch(error => {
          console.error(
            `%c[ERROR in Login Page]:- ${error.name || "Unknown Error"} `,
            "color: red; font-weight: bold; font-size: 14px;", error
          );
          setMessage(error.response.data.message);
          setMessageType('error');
        })
    }
  })

  return (
    <Box component={'div'} sx={{
      background: "url(https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      height: "100%",
      minHeight: "80vh",
      paddingTop: "50px",
      paddingBottom: "50px"
    }}>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}
      <Paper sx={{ width: '55vw', minWidth: '230px', margin: 'auto', padding: '2.5vw', borderRadius: '1rem' }}>
        <Typography variant='h2' sx={{ textAlign: "center", paddingBottom: "25px" }}>Login</Typography>
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1 }, display: 'flex', flexDirection: 'column', width: '50vw', minWidth: '230px', margin: 'auto' }}
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >

          <FormControl sx={{ mt: '10px' }}>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              label="Role"
              value={role}
              onChange={(e) => { setRole(e.target.value) }}
            >
              <MenuItem value="">Select Role</MenuItem>
              <MenuItem value="school">College</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="student">Student</MenuItem>
            </Select>
          </FormControl>

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

          <Button type='submit' variant='contained'>Submit</Button>
        </Box>
      </Paper>
    </Box>
  );
}
