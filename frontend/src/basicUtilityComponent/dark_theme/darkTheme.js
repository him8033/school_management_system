import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1E90FF',
        },
        secondary: {
            main: '#FF4081',
        },
    },
    components: {
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: '#FFFFFF'
                },
                h1: {
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                },
                body1: {
                    fontSize: '1rem',
                    color: '#FFFFFF'
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#666666',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FFFFFF',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1E90FF',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#CCCCCC',
                    '&.Mui-focused': {
                        color: '#FFFFFF',
                    },
                },
            },
        },
    },
});

export default darkTheme;