import { Box, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { baseApi } from '../../../environment.js'

export default function NoticeTeacher() {
  const [noticees, setNotices] = useState([]);

  const fetchAllNotices = () => {
    axios.get(`${baseApi}/notice/teacher`)
      .then(res => {
        setNotices(res.data.data);
        // console.log(res)
      }).catch(err => {
        console.log("Error in fetching all Notices", err)
      })
  }
  useEffect(() => {
    fetchAllNotices();
  }, [])

  return (
    <>
      <Typography variant='h3' sx={{ textAlign: 'center', fontWeight: '700' }}>Notice</Typography>

      <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {noticees && noticees.map(x => {
          return (<Paper key={x._id} sx={{ m: 2, p: 2 }}>
            <Box component={'div'}>
              <Typography variant='h6'><b>Title: </b>{x.title}</Typography>
              <Typography variant='h6'><b>Message: </b>{x.message}</Typography>
              <Typography variant='h6'><b>Audience: </b>{x.audience}</Typography>
            </Box>
          </Paper>)
        })}
      </Box>
    </>
  )
}
