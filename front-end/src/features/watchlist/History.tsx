import { Box, Flex, Menu, MenuButton } from '@chakra-ui/react'
import { Badge, CircularProgress } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUserInfo } from '../auth/authSlice'
import MovieCard from '../movies/MovieCard'

function History() {
  const [isHistory, setIsHistory] = useState(true)
  const userInfo = useSelector(selectUserInfo)
  if(!userInfo)return <CircularProgress/> 
  const list = isHistory ? userInfo?.savedMovies.filter((m)=>m.list=='watchList') : userInfo?.savedMovies.filter((m)=>m.list=='history') ;
  return (
    <main className=' m-auto max-w-main px-10 mt-10 min-h-[50vh]'>
      <div className=' border-darkblue border rounded-full flex w-fit mb-10'>
        <button onClick={() => setIsHistory(true)} className={`rounded-full py-1 px-5  block ${isHistory && 'text-[rgb(30,213,169)] bg-darkblue'}`}>Watch list</button>
        <button onClick={() => setIsHistory(false)} className={`rounded-full py-1 px-5  block ${!isHistory && 'text-[rgb(30,213,169)] bg-darkblue'}`} >History</button>
      </div>
      <div className='flex flex-wrap gap-1'>

        {list!.map(movie => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
        
      </div>
    </main>
  )
}

export default History