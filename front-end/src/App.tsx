import { CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import { addUserLoginInfo } from './features/auth/authSlice'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import Homepage from './features/movies/Homepage'
import MoviesSearch from './features/movies/MoviesLanding'
import SearchPage from './features/movies/SearchPage'
import SingleMovie from './features/movies/SingleMovie'
import History from './features/watchlist/History'

function App() {
  const [loading,setLoading] = useState(false)
  const [success,setSuccess] = useState(false)
  const navigate =useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchUser();
    }
    else navigate("/login")
    async function fetchUser() {
      setLoading(true)
      try {
        const req = await fetch(import.meta.env.VITE_API_URL + '/api/user/profile', {
          headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
        })
        if (!req.ok) {
            navigate("/login")          
        }
        const data = await req.json();
        dispatch( addUserLoginInfo(data))
      } catch (error: any) {
        navigate("/login")   
      }finally{
        setLoading(false)
      }
    }
  }, [])
  if(loading)return <CircularProgress/>
    return (
   <>
      <Navbar />
      <Routes>
        <Route element={<ProtectedRoute/>}>
          <Route path='/' element={<Homepage />} />
          <Route path='/movies/:id' element={<SingleMovie />} />
          <Route path='history' element={<History />} />
          <Route path='search' element={<SearchPage />} />
          <Route path='stored' element={<History />} />
        </Route>
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      <Footer />
   </>

  )
}

export default App
