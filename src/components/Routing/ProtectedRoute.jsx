import React from 'react'
import { getUser } from '../../Network/userServices'
import { Outlet, Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = () => {
    const location = useLocation();
    console.log("ProtectedRoute", location)
    return getUser() ? 
        <Outlet/> 
            : 
        <Navigate to='/login' state={{ from: location.pathname }} />
}

export default ProtectedRoute