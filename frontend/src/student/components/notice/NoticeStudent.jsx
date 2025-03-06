import { Box, Paper, Skeleton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { baseApi } from '../../../environment.js'

export default function NoticeStudent() {
  const [noticees, setNotices] = useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchAllNotices = () => {
    axios.get(`${baseApi}/notice/student`)
      .then(res => {
        setNotices(res.data.data);
        setLoading(false);
        // console.log(res)
      }).catch(err => {
        console.log("Error in fetching all Notices", err)
        setLoading(false);
      })
  }
  useEffect(() => {
    fetchAllNotices();
  }, [])

  return (
    <>
      <Typography variant='h3' sx={{ textAlign: 'center', fontWeight: '700' }}>Notice</Typography>

      <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {loading ? (
          [...Array(5)].map((_, index) => (
            <Paper key={index} sx={{ m: 2, p: 2 }}>
              <Box component={'div'}>
                <Typography variant='h6'><Skeleton width="150px" /></Typography>
                <Typography variant='h6'><Skeleton width="200px" /></Typography>
                <Typography variant='h6'><Skeleton width="180px" /></Typography>
              </Box>
            </Paper>
          ))
        ) : noticees && noticees.length > 0 ?
          (noticees.map(x => {
            return (<Paper key={x._id} sx={{ m: 2, p: 2 }}>
              <Box component={'div'}>
                <Typography variant='h6'><b>Title: </b>{x.title}</Typography>
                <Typography variant='h6'><b>Message: </b>{x.message}</Typography>
                <Typography variant='h6'><b>Audience: </b>{x.audience}</Typography>
              </Box>
            </Paper>)
          })) : (
            <Typography variant='h4' sx={{ m: 'auto' }}>No notices available.</Typography>
          )}
      </Box>
    </>
  )
}
