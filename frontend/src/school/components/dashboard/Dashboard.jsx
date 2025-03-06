import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { baseApi } from '../../../environment.js'
import { Typography, Box, Button, TextField, CardMedia, Skeleton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar.jsx'

export default function Dashboard() {
  const [school, setSchool] = useState(null);
  const [schoolName, setSchoolName] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = React.useState(true);

  // Image Handling
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const addImage = (event) => {
    const file = event.target.files[0];
    setImageUrl(URL.createObjectURL(file));
    setFile(file);
  }

  const fileInputRef = useRef(null);
  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFile(null);
    setImageUrl(null);
  }

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const handleMessageClose = () => {
    setMessage('');
  }

  const handleEditSubmit = () => {
    const fd = new FormData();
    fd.append("school_name", schoolName);
    if (file) {
      fd.append("image", file, file.name)
    }

    axios.patch(`${baseApi}/school/update`, fd)
      .then(res => {
        setMessage(res.data.message);
        setMessageType('success');
        cancelEdit();
      }).catch(err => {
        console.log("Error: ", err);
        setMessage(err.response.data.message);
        setMessageType('error');
      })
  }

  const cancelEdit = () => {
    setEdit(false);
    setSchoolName(school.school_name);
    handleClearFile();
  }

  const fetchApi = () => {
    axios.get(`${baseApi}/school/fetch-single`)
      .then(res => {
        // console.log(res);
        setSchool(res.data.school);
        setSchoolName(res.data.school.school_name);
        setLoading(false);
      }).catch(err => {
        console.log("Error: ", err);
        setLoading(false);
      })
  }

  useEffect(() => {
    fetchApi();
  }, [message])

  return (
    <>
      <h1>Dashboard</h1>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}

      {edit &&
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1 }, display: 'flex', flexDirection: 'column', width: '50vw', minWidth: '230px', margin: 'auto', background: '#fff' }}
          noValidate
          autoComplete="off"
        >

          <Typography>Add School Image</Typography>
          <TextField
            type='file'
            inputRef={fileInputRef}
            onChange={(event) => { addImage(event) }}
          />
          {imageUrl && <Box>
            <CardMedia component={'img'} height={'240px'} image={imageUrl} />
          </Box>}

          <TextField
            label="School Name"
            value={schoolName}
            onChange={(e) => {
              setSchoolName(e.target.value)
            }}
          />

          <Button variant='contained' onClick={handleEditSubmit}>Submit Edit</Button>
          <Button variant='outlined' onClick={cancelEdit}>Cancel Edit</Button>
        </Box>
      }

      {loading ? (
        <>
          <Skeleton variant='rectangular' width='100%' height={500} />
          <Box sx={{ position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)" }}>
            <Skeleton variant='text' width={600} height={80} />
          </Box>
          <Box component={'div'} sx={{ position: 'absolute', bottom: '70px', right: '40px', height: '60px', width: '60px' }}>
            <Skeleton variant='circular' width={60} height={60} />
          </Box>
        </>
      ) : school &&
      <Box sx={{
        position: 'relative',
        height: '500px',
        width: '100%',
        background: `url(${school.school_image})`,
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box sx={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          color: 'white',
          transform: "translateX(-50%)",
          bgcolor: "rgba(0, 0, 0, 0.7)",
          padding: "10px 20px",
          borderRadius: 1,
        }}
        >
          <Typography variant="h5">{school.school_name}</Typography>
        </Box>

        <Box component={'div'} sx={{ position: 'absolute', bottom: '20px', right: '30px', height: '50px', width: '50px' }}>
          <Button sx={{ borderRadius: '50%', background: '#fff', color: 'black', height: '60px' }} onClick={() => { setEdit(true) }}>
            <EditIcon />
          </Button>
        </Box>
      </Box>
      }
    </>
  )
}
