import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";




const API_KEY = import.meta.env.VITE_API_KEY

export const fetchDiscoverMovies = createAsyncThunk('movies/discover', async (time: string) => {
    const params = new URLSearchParams({
        sort_by: "popularity.desc", language: "en-US", api_key: API_KEY
    })
    const req = await fetch(`https://api.themoviedb.org/3/trending/movie/`+time+'?' + params)
    return req.json();
})
export const fetchGenres = createAsyncThunk('movies/genres', async (page?: number) => {
    const params = new URLSearchParams({ api_key: API_KEY, sort_by: "popularity.desc" })
    if (page) params.set('page', String(page))
    const req = await fetch(`https://api.themoviedb.org/3/genre/movie/list?` + params)
    return req.json()
})
interface FetchOptions {
    query?: string
    year?: string
    genreId?: number
    page?: number
}
export const fetchMovies = createAsyncThunk('movies/movies',
    async ({ query, year, genreId, page }: FetchOptions) => {
        const params = new URLSearchParams({ api_key: API_KEY, sort_by: "popularity.desc" })
        if (year) {
            params.set('year', String(year))
        }
        if (page) {
            params.set('page', String(page))
        }
        if (genreId) {
            params.set('with_genres', String(genreId))
            const req = await fetch(`https://api.themoviedb.org/3/discover/movie?` + params)
            return req.json()
        }
        if (query) {
            params.set('query', query)
        }
        const req = await fetch(`https://api.themoviedb.org/3/search/movie?` + params)
        return req.json();
    })
const initialState: MoviesState = {
    movies: [],
    genres: [],
    discoverMovies: [],
    status: 'IDLE',
    pageSettings: {
        page: 1
    }
}

interface MoviesState {
    movies: Movie[],
    discoverMovies: Movie[],
    genres: Genre[],
    selectedGenre?: Genre
    selectedDate?: string
    selectedRating?: number,
    data?: any,
    status: 'IDLE' | 'LOADING' | 'SUCCEEDED' | 'FAILED'
    pageSettings: IPagination
}
interface IPagination {
    page: number
    totalPages?: number
    totalEntries?: number
}
export interface Movie {
    posterPath?: string
    adult: boolean
    overview: string
    releaseDate: string
    genresIds: number[]
    id: number
    originalTitle: string
    originalLanguage: string
    title: string
    backdropPath?: string
    popularity: number
    voteCount: number
    video: boolean
    voteAverage: number
}
export interface Genre {
    name: string
    id: number
}
const moviesSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchDiscoverMovies.fulfilled, (state, action) => {
            state.status = 'SUCCEEDED'
            state.discoverMovies = apiParser(action.payload)
        }).
            addCase(fetchDiscoverMovies.pending, (state, action) => {
                state.status = 'LOADING'
            }).
            addCase(fetchDiscoverMovies.rejected, (state, action) => {
                state.status = 'FAILED'
            }).

            addCase(fetchGenres.fulfilled, (state, action) => {
                state.status = 'SUCCEEDED'
                state.genres = action.payload.genres as Genre[]
            }).
            addCase(fetchGenres.rejected, (state, action) => {
                state.status = 'FAILED'
            }).
            addCase(fetchGenres.pending, (state, action) => {
                state.status = 'LOADING'
            }).
            addCase(fetchMovies.fulfilled, (state, action) => {
                state.status = 'SUCCEEDED'
                const { page, total_results, total_pages } = action.payload
                state.pageSettings = {
                    page,
                    totalEntries: total_results,
                    totalPages: total_pages
                }
                state.movies = apiParser(action.payload).sort((a, b) => b.voteAverage - a.voteAverage)
            }).
            addCase(fetchMovies.pending, (state, action) => {
                state.status = 'LOADING'
            }).
            addCase(fetchMovies.rejected, (state, action) => {
                state.status = 'FAILED'
            })
    },
})
function apiParser(data: any): Movie[] {
    return data.results.map((movie: any) => (
        {
            posterPath: movie.poster_path,
            adult: movie.adult,
            overview: movie.overview,
            releaseDate: movie.release_date,
            genresIds: movie.genre_ids,
            id: movie.id,
            originalTitle: movie.original_title,
            originalLanguage: movie.original_language,
            title: movie.title,
            backdropPath: movie.backdrop_path,
            popularity: movie.popularity,
            voteCount: movie.vote_count,
            video: movie.video,
            voteAverage: movie.vote_average
        }
    ))
}
export const getDiscoverMovies = (state: RootState) => state.moviesReducer.discoverMovies
export const getStatus = (state: RootState) => state.moviesReducer.status
export const getGenres = (state: RootState) => state.moviesReducer.genres
export const getMovies = (state: RootState) => state.moviesReducer.movies
export const getPageSettings = (state: RootState) => state.moviesReducer.pageSettings

export default moviesSlice.reducer
