import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976D2',
        },
        secondary: {
            main: '#FF4081',
        },
        background: {
            default: '#F5F5F5',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#333333',
            secondary: '#666666',
        },
    },
    components: {
        MuiTypography: {
            fontFamily: 'Roboto, Arial, sans-serif',
            h1: {
                fontSize: '2rem',
                fontWeight: 700,
            },
            body1: {
                fontSize: '1rem',
                color: '#333'
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    color: '#333333',
                    '& .MuiOutlinedInput-notchedOutline' : {
                        borderColor: '#CCCCCC',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline' : {
                        borderColor: '#1976D2',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline' : {
                        borderColor: '#1976D2',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#666666',
                    '&.Mui-focused': {
                        color: '#1976D2',
                    },
                },
            },
        },
    },
});

export default lightTheme;