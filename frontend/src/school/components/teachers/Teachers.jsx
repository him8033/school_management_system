import * as React from 'react';
import { CardMedia, Button, Typography, FormControl, InputLabel, Select, MenuItem, Card, CardActionArea, CardContent, Box, TextField, Skeleton, Paper, InputAdornment } from '@mui/material';
import { useFormik } from 'formik';
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar.jsx';
import axios from 'axios';
import { teacherEditSchema, teacherSchema } from '../../../yupSchema/teacherSchema.js';
import { baseApi } from '../../../environment.js'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search';

export default function Teachers() {
  const [file, setFile] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  const [classes, setClasses] = React.useState([]);
  const [edit, setEdit] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [teachers, setTeachers] = React.useState([]);
  const [params, setParams] = React.useState({});
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');

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
      axios.delete(`${baseApi}/teacher/delete/${id}`)
        .then(res => {
          // console.log(res);
          setMessage(res.data.message);
          setMessageType('success');
        }).catch((error) => {
          console.error(
            `%c[ERROR in Deleting Teacher]:- ${error.name || "Unknown Error"} `,
            "color: red; font-weight: bold; font-size: 14px;", error
          );
          setMessage("Error in Deleting Teacher.");
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
    const filteredTeacher = teachers.filter(x => x._id === id)
    // console.log(filteredTeacher);
    formik.setFieldValue('email', filteredTeacher[0].email);
    formik.setFieldValue('name', filteredTeacher[0].name);
    formik.setFieldValue('qualification', filteredTeacher[0].qualification);
    formik.setFieldValue('age', filteredTeacher[0].age);
    formik.setFieldValue('gender', filteredTeacher[0].gender);

    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      fileInputRef.current?.focus();
    }, 500);
  }

  const initialValues = {
    email: "",
    name: "",
    qualification: "",
    age: "",
    gender: "",
    password: "",
    confirm_password: "",
  }

  const formik = useFormik({
    initialValues,
    validationSchema: edit ? teacherEditSchema : teacherSchema,
    onSubmit: (values) => {
      if (edit) {
        const fd = new FormData();
        fd.append("email", values.email);
        fd.append("name", values.name);
        fd.append("qualification", values.qualification);
        fd.append("age", values.age);
        fd.append("gender", values.gender);
        if (file) {
          fd.append("image", file, file.name);
        }
        if (values.password) {
          fd.append("password", values.password);
        }
        axios.patch(`${baseApi}/teacher/update/${editId}`, fd)
          .then(res => {
            // console.log(res);
            setMessage(res.data.message);
            setMessageType('success');
            formik.resetForm();
            handleClearFile();
            cancelEdit();
          }).catch((error) => {
            console.error(
              `%c[ERROR in Updating Teacher]:- ${error.name || "Unknown Error"} `,
              "color: red; font-weight: bold; font-size: 14px;", error
            );
            setMessage("Error in Updating Teacher.");
            setMessageType('error');
          })
      } else {
        if (file) {
          const fd = new FormData();
          fd.append("image", file, file.name);
          fd.append("email", values.email);
          fd.append("name", values.name);
          fd.append("qualification", values.qualification);
          fd.append("age", values.age);
          fd.append("gender", values.gender);
          fd.append("password", values.password);

          axios.post(`${baseApi}/teacher/register`, fd)
            .then(res => {
              // console.log(res);
              setMessage(res.data.message);
              setMessageType('success');
              formik.resetForm();
              handleClearFile();
            }).catch((error) => {
              console.error(
                `%c[ERROR in Adding Teacher]:- ${error.name || "Unknown Error"} `,
                "color: red; font-weight: bold; font-size: 14px;", error
              );
              setMessage("Error in Creating New Teacher.");
              setMessageType('error');
            })
        } else {
          setMessage("Please add Teacher Image.");
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

  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }))
  }

  const fetchTeachers = () => {
    axios.get(`${baseApi}/teacher/fetch-with-query`, { params })
      .then(res => {
        setTeachers(res.data.teachers);
        setLoading(false);
      }).catch((error) => {
        console.error(
          `%c[ERROR in Fetching Teachers]:- ${error.name || "Unknown Error"} `,
          "color: red; font-weight: bold; font-size: 14px;", error
        );
        setLoading(false);
      })
  }

  React.useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, [message, params])

  return (
    <Box component={'div'} sx={{
      height: "100%",
      // paddingTop: "50px",
      paddingBottom: "50px"
    }}>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}
      <Typography variant='h4' sx={{ fontWeight: '700' }}>Teachers</Typography>
      <Paper>
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1 }, display: 'flex', flexDirection: 'column', width: '50vw', minWidth: '230px', margin: 'auto', padding: 3 }}
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
          ref={formRef}
        >
          {edit ? <Typography variant='h4' sx={{ textAlign: "center", paddingBottom: "25px" }}>Edit Teacher</Typography> :
            <Typography variant='h4' sx={{ textAlign: "center", paddingBottom: "25px" }}>Add New Teacher</Typography>}
          <Typography>Add Teacher Image</Typography>
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
            label="Teacher Name"
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
            name="qualification"
            label="Qualification"
            value={formik.values.qualification}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.qualification && formik.errors.qualification && <p style={{ color: 'red', textTransform: 'capitalize' }}>
            {formik.errors.qualification}
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
          label="Search by Teacher Name"
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
        ) : teachers && teachers.length > 0 ?
          (teachers.map(teacher => {
            return (
              <Card key={teacher._id} sx={{ maxWidth: 345, ml: '25px' }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="340"
                    image={`${teacher.teacher_image}`}
                    alt={teacher.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: '700' }}>Name: </span>{teacher.name}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: '700' }}>E-mail: </span>{teacher.email}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: '700' }}>Qualification: </span>{teacher.qualification}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: '700' }}>Age: </span>{teacher.age}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: '700' }}>Gender: </span>{teacher.gender}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Button onClick={() => { handleEdit(teacher._id) }} sx={{ ml: '25px' }}><EditIcon /></Button>
                <Button onClick={() => { handleDelete(teacher._id) }} sx={{ ml: '25px', color: 'red' }}><DeleteIcon /></Button>
              </Card>
            );
          })) : (
            <Typography variant='h4' sx={{ m: 'auto' }}>No teachers available.</Typography>
          )}
      </Box>

    </Box>
  );
}
