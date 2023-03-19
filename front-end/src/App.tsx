import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import { fetchUserDetails, selectToken } from './features/auth/authSlice'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import Homepage from './features/movies/Homepage'
import MoviesSearch from './features/movies/MoviesLanding'
import SearchPage from './features/movies/SearchPage'
import SingleMovie from './features/movies/SingleMovie'
import History from './features/watchlist/History'
import { AppDispatch } from './store/store'

function App() {

  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector(selectToken)
  useEffect(()=>{
      dispatch(fetchUserDetails())
  },[token])
  return (
    <BrowserRouter>
      <Navbar/>
        <Routes>
            <Route element={<ProtectedRoute/>}>
              <Route path='/' element={<Homepage/>} />
              <Route path='/movies/:id' element={<SingleMovie/>}/>
              <Route path='history' element={<History/>}/>
              <Route path='search' element={<SearchPage/>}/>
              <Route path='stored' element={<History/>}/>
            </Route>
            <Route path='login' element={<Login/>}/>
            <Route path='register' element={<Register/>}/>
            <Route path='*' element={<NotFound />} />
        </Routes>
      <Footer/>

    </BrowserRouter>
  )
}

export default App
