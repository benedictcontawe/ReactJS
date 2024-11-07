import React from 'react'
import { getUser } from '../../Network/userServices'
import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoute = () => {
  return getUser() ? <Outlet/> : <Navigate to='/login' />
}

export default ProtectedRoute