import * as React from 'react';
import axios from 'axios'
import { baseApi } from '../../../../environment.js'
import { Box, ImageList, ImageListItem, ImageListItemBar, Modal, Skeleton, Typography } from '@mui/material';

export default function Gallery() {
  const [open, setOpen] = React.useState(false);
  const [selectedSchool, setSelectedSchool] = React.useState(null);
  const [schools, setSchools] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const handleOpen = (school) => {
    setOpen(true);
    setSelectedSchool(school);
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedSchool(null);
  }

  const fetchSchools = () => {
    axios.get(`${baseApi}/school/all`)
      .then(res => {
        setSchools(res.data.schools);
        setLoading(false);
      }).catch(error => {
        console.error(
          `%c[ERROR in Fetching Schools]:- ${error.name || "Unknown Error"} `,
          "color: red; font-weight: bold; font-size: 14px;", error
        );
        setLoading(false);
      })
  }

  React.useEffect(() => {
    fetchSchools();
  }, [])

  return (
    <>
      <Box>
        {/* All images of School */}
        <Box>
          <Typography variant='h4' sx={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>Registered School</Typography>
          <ImageList sx={{ width: '100%', height: 'auto' }}>
            {loading
              ? [...Array(6)].map((_, index) => (
                <ImageListItem key={index}>
                  <Skeleton variant='rectangular' width='100%' sx={{ height: { xs: 180, sm: 220, md: 300, lg: 350 } }} />
                  <Skeleton variant='text' width='80%' height={30} sx={{ margin: '10px auto' }} />
                </ImageListItem>
              ))
              : schools.map((school) => (
                <ImageListItem key={school._id || school.school_image + Math.random()}>
                  <img
                    srcSet={`${school.school_image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${school.school_image}?w=248&fit=crop&auto=format`}
                    alt={school.school_name}
                    loading="lazy"
                    onClick={() => { handleOpen(school) }}
                  />
                  <ImageListItemBar
                    title={school.school_name}
                    position="below"
                  />
                </ImageListItem>
              ))}
          </ImageList>
        </Box>

        {/* Model Box of School */}
        <Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box component={'div'} sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fff',
              padding: '10px',
              border: 'none',
              borderRadius: '10px',
              outline: 'none',
            }}>
              <Typography id="modal-modal-description" sx={{ my: 2, textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
                {selectedSchool && selectedSchool.school_name}
              </Typography>
              <img
                srcSet={selectedSchool && `${selectedSchool.school_image}`}
                src={selectedSchool && `${selectedSchool.school_image}`}
                alt={"alt"}
                style={{ height: '35vw', width: '60vw', borderRadius: '10px' }}
              />
            </Box>
          </Modal>
        </Box>
      </Box>
    </>
  );
}
