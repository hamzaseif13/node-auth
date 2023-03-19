import React, { useEffect, useState } from 'react'
import MoviesLanding from './MoviesLanding'
import MovieList from './MovieList'
import { ArrowRightIcon} from '@heroicons/react/20/solid'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDiscoverMovies, getDiscoverMovies, getStatus } from './moviesSlice'
import { AppDispatch } from '../../store/store'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
function Homepage() {
  const discoverMovies = useSelector(getDiscoverMovies)
  const status = useSelector(getStatus)
  const dispatch = useDispatch<AppDispatch>();
  const [active,setActive] = useState(true)
  useEffect(() => {
    dispatch(fetchDiscoverMovies(active?'day':'week'))
  }, [active])  
  
  return (
    <main className=''>
      <MoviesLanding />
      <section className='max-w-main  min-h-[32rem] ltr:pl-10 rtl:pr-10 m-auto fade-aw fade-aw-ar  ltr:after:right-0   rtl:after:left-0 relative'>
        <div className='flex  items-center'>
          <h2 className='text-2xl font-extrabold my-6 '>Trending</h2>
          <div className=' rtl:mr-5 ltr:ml-5 border-darkblue border rounded-full flex'>
            <button onClick={()=>setActive(true)} className={`rounded-full py-1 px-5  block ${active && 'text-[rgb(30,213,169)] bg-darkblue'}`} >Today</button>
            <button onClick={()=>setActive(false)} className={`rounded-full py-1 px-5  block ${!active && 'text-[rgb(30,213,169)] bg-darkblue'}`}>This Week</button>
          </div>
        </div>
        <MovieList discoverMovies={discoverMovies} status={status} />
      </section>
    </main>
  )
}

export default Homepage