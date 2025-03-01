import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../context/AuthContext.jsx';

export default function LogOut() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate("/login");
    }, []);

    return (
        <>LogOut</>
    )
}
