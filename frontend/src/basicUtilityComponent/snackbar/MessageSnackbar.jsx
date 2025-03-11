import * as React from 'react';
import { Alert, Snackbar } from '@mui/material';

export default function MessageSnackbar({ message, messageType, handleClose }) {
  return (
    <div>
      <Snackbar open={true} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert onClose={handleClose} severity={messageType} variant="filled"
          sx={{ width: '100%', boxShadow: 3, borderRadius: 2, fontSize: '1rem', fontWeight: 'bold', p: 2 }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
