
import { useState } from 'react'
import MovieCard from './MovieCard'
import { Movie } from './moviesSlice'


interface Props{
  status:"IDLE" | "LOADING" | "SUCCEEDED" | "FAILED"
  discoverMovies:Movie[]
}
function MovieList({discoverMovies,status}:Props) {
  const [cardMenuOpen,setCard] = useState(false)
  return (
    <div className='flex overflow-x-auto gap-2 mb-5  '>
      
      {status === 'FAILED' ? <h1>Sorry Somthing Went Wrong Please Try Again Later</h1> :
        status === 'LOADING' ? <h1>Loading ...</h1> :
        discoverMovies.map((movie)=>(
          <MovieCard  movie={movie} key={movie.id}/>
        ))
      }
      
    </div>

  )
}

export default MovieList