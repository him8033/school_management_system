import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './utilityComponent/navbar/Navbar.jsx'
import Footer from './utilityComponent/footer/Footer.jsx'
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
