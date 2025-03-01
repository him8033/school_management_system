import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './utilityComponent/navbar/navbar'
import Footer from './utilityComponent/footer/footer'
import { Box } from '@mui/material'

export default function Client() {
  return (
    <>
        <Navbar/>
        <Box sx={{minHeight:'80vh'}} component={'div'}>
            <Outlet/>
        </Box>
        <Footer/>
    </>
  )
}
