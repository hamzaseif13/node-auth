import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { AppDispatch } from '../../store/store'
import { fetchMovies, getPageSettings } from './moviesSlice'


interface Props {
    query?: string
    year?: string
    genreId?: number
}
function Pagination({ query, genreId, year }: Props) {
    const dispatch = useDispatch<AppDispatch>()
    const [searchParams, setSearchParams] = useSearchParams()
    const { page, totalPages, totalEntries } = useSelector(getPageSettings)
 
    const nextPage = () => {
        if (page < totalPages!) {
            searchParams.set('page', String(page + 1))
            dispatch(fetchMovies({ query, genreId, year, page: page + 1 }))
        }
    }
    const prePage = () => {
        if (page > 1) {
            searchParams.set('page', String(page - 1))
            dispatch(fetchMovies({ query, genreId, year, page: page - 1 }))
        }
    }
    return (
        <div className='flex  flex-col my-2 justify-between items-center'>
            <div className='my-2'>
                <h2 >page <span >{page}</span> of <span>{totalPages}</span> of <span>{totalEntries}</span> results </h2>
            </div>
            <div className='flex gap-2'>
                <button onClick={prePage} disabled={ page===totalPages || page===1 }   className='p-2  border rounded'>Previous</button>
                <button onClick={nextPage} disabled={page===totalPages } className='p-2  border rounded'>Next</button>
            </div>
        </div>
    )
}

export default Pagination