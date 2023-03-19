import { CircularProgress } from '@mui/material';
import {  useSelector } from 'react-redux'
import { Navigate,  Outlet } from 'react-router-dom';
import {  selectUserInfo } from '../features/auth/authSlice'
import useAuth from '../hooks/useAuth';

function ProtectedRoute() {
    const [isAuth,loading] = useAuth();
    if (loading) return <CircularProgress />
    if (!isAuth && !loading) {
        return (
            <Navigate to="/login" state={{ message: "You need to be logged in", type: "error" }} />
        )
    }
    return <Outlet />
}

export default ProtectedRoute