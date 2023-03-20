import { BookmarkIcon, HeartIcon, PlayIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import Modal from '../../components/Modal';
import { AppDispatch } from '../../store/store';
import { Genre } from './moviesSlice';
import { selectUserInfo, toggleMovie } from '../auth/authSlice';

function SingleMovie() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState(false)
  const userInfo = useSelector(selectUserInfo)
  
  const dispatch = useDispatch<AppDispatch>()
  
  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true)
      setError(false)
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_API_KEY}`)
        if(res.ok){

          const data = await res.json()
          setMovie(data)
        }else{
            setError(true)
        }
      } catch (error) {
        setError(true)
      }
      setLoading(false);
    }
    fetchMovie();

  }, [id])
  const isHistory = () => userInfo!.savedMovies.some(mvs => mvs.id == movie.id && mvs.list=="history")
  const isWatchlist = () => userInfo!.savedMovies.some(mvs => mvs.id == movie.id && mvs.list=="watchList")
  if (loading) return <h1>Loading ...</h1>
  if (error) return <h1>Movie {id} Doesnt exist</h1>
  const toggleLocal= (list:string)=>{
    const movieDetails = {
      id: movie.id, 
      title: movie.title,
      releaseDate: movie.release_date, 
      voteAverage: movie.vote_average,
      posterPath: movie.poster_path
    }
       dispatch(toggleMovie({list,movie:movieDetails,add:(isHistory()||isWatchlist())}))
  }
 
  const openTrailer = () => {
    setShowModal(true)
  }
  return (
    <div>
      {
        movie &&
        <div className=" bg-img   bg-[]" style={{ backgroundImage: `linear-gradient(to right, rgba(31.5, 31.5, 31.5, 1) calc((50vw - 170px) - 340px), rgba(31.5, 31.5, 31.5, 0.84) 30%, rgba(31.5, 31.5, 31.5, 0.84) 100%), url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})` }}>
          <Modal setShowModal={setShowModal} showModal={showModal} movieId={movie.id} />
          <div className='flex flex-col md:flex-row justify-start md:items-center md:py-10 max-w-main px-10 m-auto text-white md:h-[32rem] bg-[#202020] py-4 md:bg-inherit '>
            <div className='w-full md:w-fit relative'>
              <img src={`https://www.themoviedb.org/t/p/original/${movie.poster_path}`} className='rounded-lg md:block hidden w-1/2 md:min-w-[300px] md:w-[300px]' alt="" />
              <img src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} className='rounded-lg  md:hidden my-4' alt="" />
              <div className='absolute top-1/2 p-1 hover:bg-slate-600 hover:cursor-pointer text-myblue rounded-lg left-1/2 bg-dark -translate-x-1/2 -translate-y-1/2'>
                <PlayIcon className=' md:hidden w-12' onClick={openTrailer} />
              </div>
            </div>
            <div className='md:ml-10'>
              <h1 className='text-4xl  font-extrabold'>{movie.title} <span className='opacity-70 font-light'>({movie.release_date.slice(0, 4)})</span></h1>
              <div className='opacity-75'>
                <span className='mr-2'>{movie.release_date} ({movie.production_countries[0]?.iso_3166_1})</span>
                <span>{(movie.genres as Genre[]).map(genre => genre.name).join(', ')}</span>
                <span className='ml-2'>{humanTime(movie.runtime as number)}</span>
              </div>
              <div className='flex items-center my-6 '>
                <div className="min-w-[7rem] w-[7rem] gap-2 items-center flex mr-4">
                  <CircularProgressbar
                    value={Number((movie.vote_average * 10).toPrecision(2))}
                    text={(movie.vote_average * 10).toPrecision(2)}
                    background
                    backgroundPadding={8}
                    styles={buildStyles({
                      backgroundColor: "#031d28",
                      textSize: '2rem',
                      textColor: "white",
                      pathColor: movie.vote_average > 7 ? "#21d07a" : "#d2d531",
                      trailColor: movie.vote_average > 7 ? '#204529' : "#423d0f",
                    })}
                  />
                  <h1 className='text-white text-base leading-5 font-extrabold'>User Score</h1>
                </div>
                <div className='flex gap-4'>
                  <button onClick={()=>toggleLocal('watchList')} className='bg-dark rounded-full w-fit p-3' title="add to watchlist">
                    <BookmarkIcon className='rounded-full w-4 hover:text-red-400' color={isWatchlist()?'red':'white'} />
                  </button>
                  <button onClick={()=>toggleLocal('history')}className='bg-dark rounded-full w-fit p-3' title="add to History">
                    <HeartIcon  className='rounded-full w-4 hover:text-red-400' color={isHistory()?'red':'white'} />
                  </button>
                </div>
                <div onClick={openTrailer} className=' hover:cursor-pointer hover:opacity-75 items-center ml-4 hidden md:flex'>
                  <PlayIcon className='rounded-full min-w-5 w-5 ' color='white' />
                  <span className='ml-1'>Play Trailer</span>
                </div>
              </div>
              {
                <h2 className='italic mb-2 opacity-75'>{movie.tagline}</h2>
              }
              <div>
                <h2 className='text-xl mb-2'> Overview</h2>
                <p className='font-light opacity-75'>{
                  movie.overview
                }
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
function humanTime(minutes: number): string {
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

export default SingleMovie