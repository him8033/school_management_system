import React from 'react'
import { Box, Paper, Typography } from '@mui/material'

export default function Footer() {
    return (
        <>
            <Paper sx={{ width: "100%", textAlign: "center", padding: 2, mb: '-20px', borderRadius: 0 }}>
                <Typography variant='h5'>School Management System</Typography>
                <Typography variant='p'>Copyright@2025</Typography>
            </Paper>
        </>
    )
}
