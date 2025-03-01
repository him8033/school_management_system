import { Button } from '@mui/material';
import React, { useContext, useRef } from 'react'
import Draggable from 'react-draggable'
import { AuthContext } from '../../context/AuthContext';
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

export default function DraggableButton() {
    const { dark, modeChange } = useContext(AuthContext);
    const draggableRef = useRef(null);
    return (
        <>
            <Draggable nodeRef={draggableRef} bounds="parent">
                <div ref={draggableRef} style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
                    <Button
                        onClick={modeChange}
                        sx={{
                            background: dark ? '#333' : '#eee',
                            color: dark ? 'white' : 'black',
                            display: 'flex',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            minWidth: 'unset',
                            ":hover": { background: dark ? '#555' : '#CCC' }
                        }}
                    >
                        {dark ? <DarkModeIcon /> : <LightModeIcon />}
                    </Button>
                </div>
            </Draggable>
        </>
    )
}
