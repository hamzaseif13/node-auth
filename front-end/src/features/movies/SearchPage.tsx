import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom'
import { AppDispatch } from '../../store/store';
import MovieCard from './MovieCard';
import { fetchGenres, fetchMovies, getGenres, getMovies, getStatus } from './moviesSlice';
import Pagination from './Pagination';

function SearchPage() {
    const location = useLocation()

    const [genreId, setGenreId] = useState<number>();
    const [year, setYear] = useState<string>()
    const [query, setQuery] = useState<string>('')
    const dispatch = useDispatch<AppDispatch>()
    const genres = useSelector(getGenres)
    const movies = useSelector(getMovies)
    const status = useSelector(getStatus)
    useEffect(() => {
        const pathQuery = location.state
        if (pathQuery) {
            setQuery(pathQuery)
            dispatch(fetchMovies({ query: pathQuery, genreId, year }))
        }
        dispatch(fetchGenres())

    }, [])
    const changeGenre = (event: any) => {
        setGenreId(Number(event.target.value))
    }
    const search = (e: any) => {
        e.preventDefault()
        dispatch(fetchMovies({ genreId, year, query }))
    }
    return (
        <main className='m-auto max-w-main px-10 my-5'>
            <form action="" onSubmit={search}>

                <h1 className='text-2xl text-dark'>Search For Your Favorite Movies !</h1>
                <div className='flex my-5 items-center gap-1 flex-wrap '>
                    <div className='w-full lg:flex-1'>
                        <input type="text" value={query} placeholder='Search for movies, keywords ...'
                            className='border w-full p-2 rounded' onChange={e => setQuery(e.target.value)} />
                    </div>
                    <div>
                        <select name="" id="" value={genreId} onChange={changeGenre}
                            className='border p-2 rounded'>
                            <option value={undefined}>Genre - All</option>
                            {genres && genres.map(genre => (<option
                                value={genre.id} key={genre.id}>{genre.name}</option>))}
                        </select>
                    </div>
                    <div >
                        <input type="text" pattern='[1-90]{4}' value={year} onChange={e => setYear((e.target.value))} placeholder='Year - All' className='border p-2 rounded mr-1  ' />
                        <button className='p-2 hover:opacity-80 bg-myblue text-white rounded' type='submit'>Search</button>
                    </div>
                </div>

                {status === 'LOADING' ? <h1>Loading ...</h1> : status === 'SUCCEEDED' ? (
                    <div className='flex flex-wrap gap-1'>
                        {movies.length>0 ? movies.slice(0,14).map(movie => {
                            return <MovieCard key={movie.id} movie={movie} />
                        }): <h1 className='text-center'>No results</h1>}
                    </div>


                ):status==='FAILED'?<h1>Something Went Wrong Please try again Later.</h1>:''  }

            </form>
            {movies.length > 0 && <Pagination query={query} year={year} genreId={genreId} />}

        </main>
    )
}

export default SearchPage