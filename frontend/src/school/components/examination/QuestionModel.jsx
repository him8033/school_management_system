import React from 'react'

export default function QuestionModel() {
  return (
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
  )
}
