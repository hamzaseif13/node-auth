import { Alert, CircularProgress, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store/store';
import { loginUser, resetStatus, selectError, selectStatus, selectUserInfo} from './authSlice';

function Login() {
  const { register, handleSubmit } = useForm()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation();
  const error = useSelector(selectError)
  const status = useSelector(selectStatus);
  const userInfo = useSelector(selectUserInfo)
  const submit = async (data: any) => {
    dispatch(loginUser(data))
  }
  const goHome = () => navigate("/")
  if(status==="success"){
    setTimeout(goHome,1500)
  }
  useEffect(() => {
    if (userInfo) {
      dispatch(resetStatus({}))
      goHome()
    }
  }, [])
  return (
    <main>
      {location.state?.message && <Alert severity={location.state.type}>
        {location.state.message}
      </Alert>}
      <h1 className='text-3xl text-center mt-10'>Log in</h1>
      <form onSubmit={handleSubmit(submit)} action="" className='max-w-[800px] m-auto rounded shadow-lg p-4'>

        <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={status === 'success'} autoHideDuration={6000} >
          <Alert severity="success" sx={{ width: '100%' }}>
            Login Successful you will be redirected shortly!
          </Alert>
        </Snackbar>
        <div className="mb-3">
          <label htmlFor="email" className="input-label">Email</label>
          <input type="email"{...register('email')} id="email" className="input-feild" placeholder="name@flowbite.com" required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="input-label">Password</label>
          <input type="password" {...register('password')} id="password" className="input-feild" placeholder="password" required />
        </div>
        <h4 className='mb-2'>
          Don't Have an Account ?
          <Link to='/register' className='ml-1 text-blue-500 hover:text-blue-300'>
            Register.
          </Link>
        </h4>
        {status === 'error' && <Alert className='mb-2' severity='error'>{error}</Alert>}
        <button className='submit-btn ' type="submit">
          {status === 'loading' ? <CircularProgress size={14} sx={{ color: 'white' }} /> : 'Save'}
        </button>
      </form>
    </main>

  )
}

export default Login