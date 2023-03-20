import { Alert, CircularProgress, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store/store';
import { registerUser, reset, selectError, selectStatus } from '../register/registerSlice';
import { selectToken, selectUserInfo } from './authSlice';

function Register() {
    const userToken = useSelector(selectToken);
    const status = useSelector(selectStatus)
    const error = useSelector(selectError)
    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const submit = async (data: any) => {
        dispatch(registerUser(data))
    }
    if(status==='success'){
        setTimeout(()=>{
            navigate('/login')
            dispatch(reset())
        },1500)
    }
    useEffect(() => {
        if (userToken)
            navigate('/')
    }, [])
    return (
        <main>
            <h1 className='text-3xl text-center mt-10'>Register</h1>
            <form onSubmit={handleSubmit(submit)} action="" className='max-w-[800px] m-auto rounded shadow-lg p-4'>
                <div className="my-3 ">
                    <label htmlFor="first-name" className="input-label">Name</label>
                    <input {...register('name')} type="text" id="first-name" className="input-feild" placeholder="Hamza" required />
                </div>
                <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={status==='success'} autoHideDuration={6000} >
                    <Alert severity="success" sx={{ width: '100%' }}>
                        Registration Successful you will be redirected shortly!
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
                    Already have an Account ?
                    <Link to='/login' className='ml-1 text-blue-500 hover:text-blue-300'>
                        Login.
                    </Link>
                </h4>
                {error && <Alert severity='error' className='mb-2'>{error} </Alert>}
                <button className='submit-btn ' type="submit">
                    {status ==='loading' ? <CircularProgress size={14} sx={{ color: 'white' }} /> : 'Save'}
                </button>
            </form>
        </main>

    )
}

export default Register