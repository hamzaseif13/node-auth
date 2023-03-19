import { Alert, CircularProgress, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store/store';
import { addUserInfo, addUserLoginInfo, selectToken, selectUserInfo } from './authSlice';

function Login() {
  const userToken = useSelector(selectToken);
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation();
  const submit = async (data: any) => {
    setLoading(true)
    try {
      const req = await fetch('/api/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      if (req.ok) {
        setSuccess(true)
        const data = await req.json();
        dispatch(addUserLoginInfo({ user: data.user, token: data.token }))
        setTimeout(() => {
          navigate('/')
        }, 1500)
      }
      else {
        setIncorrect(true)
      }
    } catch (error) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

    useEffect(() => {
      if (userToken) {
        navigate('/')
      }
    }, [])
    return (
      <main>
        {location.state?.message && <Alert severity={location.state.type}>
          {location.state.message}
        </Alert>}
        <h1 className='text-3xl text-center mt-10'>Log in</h1>
        <form onSubmit={handleSubmit(submit)} action="" className='max-w-[800px] m-auto rounded shadow-lg p-4'>

          <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={success} autoHideDuration={6000} >
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
          {error && <Alert className='mb-2' severity='error'>Something Went Wrong please Try again later</Alert>}
          {incorrect && <Alert className='mb-2' severity='error'>Incorrect Credentials </Alert>}
          <button className='submit-btn ' type="submit">
            {loading ? <CircularProgress size={14} sx={{ color: 'white' }} /> : 'Save'}
          </button>
        </form>
      </main>

    )
  }

  export default Login