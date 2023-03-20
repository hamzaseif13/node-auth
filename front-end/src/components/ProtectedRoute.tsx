import { CircularProgress } from '@mui/material';
import {  useSelector } from 'react-redux'
import { Navigate,  Outlet, useNavigate } from 'react-router-dom';
import {  selectUserInfo } from '../features/auth/authSlice'
import useAuth from '../hooks/useAuth';

function ProtectedRoute() {
   const userInfo = useSelector(selectUserInfo)
   const navigate = useNavigate()
   if(!userInfo){
    return <Navigate to="/login"/>
}
    return <Outlet />
}

export default ProtectedRoute