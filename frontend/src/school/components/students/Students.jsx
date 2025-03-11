import * as React from 'react';
import Box from '@mui/material/Box';
import { CardMedia, Button, Typography, FormControl, InputLabel, Select, MenuItem, Card, CardActionArea, CardContent, Skeleton, Paper, InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar.jsx';
import axios from 'axios';
import { studentEditSchema, studentSchema } from '../../../yupSchema/studentSchema.js';
import { baseApi } from '../../../environment.js'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search';

export default function Students() {
  const [file, setFile] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  const [classes, setClasses] = React.useState([]);
  const [edit, setEdit] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [students, setStudents] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');
  const [params, setParams] = React.useState({});

  const addImage = (event) => {
    const file = event.target.files[0];
    setImageUrl(URL.createObjectURL(file));
    setFile(file);
  }

  const formRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFile(null);
    setImageUrl(null);
  }

  const handleDelete = (id) => {
    if (confirm("Are you sure! You want to Delete.")) {
      axios.delete(`${baseApi}/student/delete/${id}`)
        .then(res => {
          // console.log(res);
          setMessage(res.data.message);
          setMessageType('success');
        }).catch((error) => {
          console.error(
            `%c[ERROR in Deleting Student]:- ${error.name || "Unknown Error"} `,
            "color: red; font-weight: bold; font-size: 14px;", error
          );
          setMessage("Error in Deleting Student.");
          setMessageType('error');
        })
    }
  }

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    formik.resetForm();
  }

  const handleEdit = (id) => {
    setEdit(true);
    setEditId(id);
    const filteredStudent = students.filter(x => x._id === id)
    // console.log(filteredStudent);
    formik.setFieldValue('email', filteredStudent[0].email);
    formik.setFieldValue('name', filteredStudent[0].name);
    formik.setFieldValue('student_class', filteredStudent[0].student_class._id);
    formik.setFieldValue('age', filteredStudent[0].age);
    formik.setFieldValue('gender', filteredStudent[0].gender);
    formik.setFieldValue('guardian', filteredStudent[0].guardian);
    formik.setFieldValue('guardian_phone', filteredStudent[0].guardian_phone);

    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      fileInputRef.current?.focus();
    }, 500);
  }

  const initialValues = {
    email: "",
    name: "",
    student_class: "",
    age: "",
    gender: "",
    guardian: "",
    guardian_phone: "",
    password: "",
    confirm_password: "",
  }

  const formik = useFormik({
    initialValues,
    validationSchema: edit ? studentEditSchema : studentSchema,
    onSubmit: (values) => {
      if (edit) {
        const fd = new FormData();
        fd.append("email", values.email);
        fd.append("name", values.name);
        fd.append("student_class", values.student_class);
        fd.append("age", values.age);
        fd.append("gender", values.gender);
        fd.append("guardian", values.guardian);
        fd.append("guardian_phone", values.guardian_phone);
        if (file) {
          fd.append("image", file, file.name);
        }
        if (values.password) {
          fd.append("password", values.password);
        }
        axios.patch(`${baseApi}/student/update/${editId}`, fd)
          .then(res => {
            // console.log(res);
            setMessage(res.data.message);
            setMessageType('success');
            formik.resetForm();
            handleClearFile();
            cancelEdit();
          }).catch((error) => {
            console.error(
              `%c[ERROR in Updating Student]:- ${error.name || "Unknown Error"} `,
              "color: red; font-weight: bold; font-size: 14px;", error
            );
            setMessage("Error in Updating Student.");
            setMessageType('error');
          })
      } else {
        if (file) {
          const fd = new FormData();
          fd.append("image", file, file.name);
          fd.append("email", values.email);
          fd.append("name", values.name);
          fd.append("student_class", values.student_class);
          fd.append("age", values.age);
          fd.append("gender", values.gender);
          fd.append("guardian", values.guardian);
          fd.append("guardian_phone", values.guardian_phone);
          fd.append("password", values.password);

          axios.post(`${baseApi}/student/register`, fd)
            .then(res => {
              // console.log(res);
              setMessage(res.data.message);
              setMessageType('success');
              formik.resetForm();
              handleClearFile();
            }).catch((error) => {
              console.error(
                `%c[ERROR in Adding New Student]:- ${error.name || "Unknown Error"} `,
                "color: red; font-weight: bold; font-size: 14px;", error
              );
              setMessage("Error in Creating New Student.");
              setMessageType('error');
            })
        } else {
          setMessage("Please add Student Image.");
          setMessageType('error');
        }
      }
    }
  })

  const handleMessageClose = () => {
    setMessage('');
  }

  const fetchClasses = () => {
    axios.get(`${baseApi}/class/all`)
      .then(res => {
        setClasses(res.data.data);
      }).catch((error) => {
        console.error(
          `%c[ERROR in Fetching Classes]:- ${error.name || "Unknown Error"} `,
          "color: red; font-weight: bold; font-size: 14px;", error
        );
      })
  }

  const handleClass = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      student_class: e.target.value || undefined,
    }))
  }

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }))
  }

  const fetchStudents = () => {
    axios.get(`${baseApi}/student/fetch-with-query`, { params })
      .then(res => {
        setStudents(res.data.students);
        setLoading(false);
      }).catch((error) => {
        console.error(
          `%c[ERROR in Fetching Students]:- ${error.name || "Unknown Error"} `,
          "color: red; font-weight: bold; font-size: 14px;", error
        );
        setLoading(false);
      })
  }

  React.useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, [message, params])

  return (
    <Box component={'div'} sx={{
      height: "100%",
      // paddingTop: "50px",
      paddingBottom: "50px"
    }}>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}
      <Typography variant='h4' sx={{ fontWeight: '700' }}>Students</Typography>
      <Paper>
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1 }, display: 'flex', flexDirection: 'column', width: '50vw', minWidth: '230px', margin: 'auto', padding: 3 }}
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
          ref={formRef}
        >
          {edit ? <Typography variant='h4' sx={{ textAlign: "center", paddingBottom: "25px" }}>Edit Student</Typography> :
            <Typography variant='h4' sx={{ textAlign: "center", paddingBottom: "25px" }}>Add New Student</Typography>}
          <Typography>Add Student Image</Typography>
          <TextField
            type='file'
            inputRef={fileInputRef}
            onChange={(event) => { addImage(event) }}
          />
          {imageUrl && <Box>
            <CardMedia component={'img'} height={'240px'} image={imageUrl} />
          </Box>}

          <TextField
            name="name"
            label="Student Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.name}
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

          <FormControl>
            <InputLabel id="demo-simple-select-label">Student Class</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="student_class"
              label="Student Class"
              value={formik.values.student_class}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem>Select Class</MenuItem>
              {classes && classes.map(x => {
                return (<MenuItem key={x._id} value={x._id}>{x.class_text} [{x.class_num}]</MenuItem>)
              })}
            </Select>
          </FormControl>
          {formik.touched.student_class && formik.errors.student_class && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.student_class}
          </p>}

          <TextField
            name="age"
            label="Age"
            value={formik.values.age}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.age && formik.errors.age && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.age}
          </p>}

          <FormControl>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="gender"
              label="Gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value={'male'}>Male</MenuItem>
              <MenuItem value={'female'}>Female</MenuItem>
              <MenuItem value={'other'}>Other</MenuItem>
            </Select>
          </FormControl>
          {formik.touched.gender && formik.errors.gender && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.gender}
          </p>}

          <TextField
            name="guardian"
            label="Guardian Name"
            value={formik.values.guardian}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.guardian && formik.errors.guardian && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.guardian}
          </p>}

          <TextField
            type='number'
            name="guardian_phone"
            label="Guardian PHone"
            value={formik.values.guardian_phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.guardian_phone && formik.errors.guardian_phone && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.guardian_phone}
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
          {edit && <Button onClick={() => { cancelEdit() }} type='button' variant='outlined'>Cancel</Button>}

        </Box>
      </Paper>
      
      <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mt: '40px' }}>

        <TextField
          label="Search by Student Name"
          value={params.search ? params.search : ""}
          onChange={(e) => { handleSearch(e) }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ width: '180px', ml: '10px' }}>
          <InputLabel id="demo-simple-select-label">Student Class</InputLabel>
          <Select
            label="Student Class"
            value={params.student_class ? params.student_class : ""}
            onChange={(e) => { handleClass(e) }}
          >
            <MenuItem value="">Select Class</MenuItem>
            {classes && classes.map(x => {
              return (<MenuItem key={x._id} value={x._id}>{x.class_text} [{x.class_num}]</MenuItem>)
            })}
          </Select>
        </FormControl>
      </Box>

      <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', mt: '40px' }}>
        {loading ? (
          Array.from(new Array(5)).map((_, index) => (
            <Card key={index} sx={{ maxWidth: 345, ml: '25px' }}>
              <Skeleton variant='rectangular' width={345} height={340} />
              <CardContent>
                <Skeleton variant='text' width={200} height={40} />
                <Skeleton variant='text' width={250} height={30} />
                <Skeleton variant='text' width={150} height={30} />
                <Skeleton variant='text' width={100} height={30} />
              </CardContent>
            </Card>
          ))
        ) : students && students.length > 0 ?
          (students.map(student => {
            return (
              <Card key={student._id} sx={{ maxWidth: 345, ml: '25px' }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="340"
                    image={`${student.student_image}`}
                    alt={student.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: '700' }}>Name: </span>{student.name}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                      {/* maxWidth: '300px', wordBreak: 'break-word' */}
                      <span style={{ fontWeight: '700' }}>E-mail: </span>{student.email}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: '700' }}>Class: </span>{student.student_class.class_text}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: '700' }}>Age: </span>{student.age}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: '700' }}>Gender: </span>{student.gender}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: '700' }}>Guardian: </span>{student.guardian}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: '700' }}>Guardian Phone: </span>{student.guardian_phone}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Button onClick={() => { handleEdit(student._id) }} sx={{ ml: '25px' }}><EditIcon /></Button>
                <Button onClick={() => { handleDelete(student._id) }} sx={{ ml: '25px', color: 'red' }}><DeleteIcon /></Button>
              </Card>
            );
          })) : (
            <Typography variant='h4' sx={{ m: 'auto' }}>No studnets available.</Typography>
          )}
      </Box>
    </Box>
  );
}
