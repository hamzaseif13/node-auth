import { Movie } from "./moviesSlice"
import image404 from '../../assets/404image.png'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { useEffect, useRef, useState } from "react";
import { BookmarkIcon, EllipsisHorizontalIcon, HeartIcon, ListBulletIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {  StoredMovie } from "../watchlist/watchlistSlice";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { selectUserInfo, toggleMovie } from "../auth/authSlice";

interface Props {
  movie: Movie | StoredMovie
}
function MovieCard({ movie }: Props) {
  const percentage = (movie.voteAverage * 10).toPrecision(2);
  const color = movie.voteAverage > 7 ? "#0FF207" : "#EBF305"
  const userInfo = useSelector(selectUserInfo)
  const dispatch = useDispatch<AppDispatch>()
 
  const isHistory = () => userInfo!.savedMovies.some(mvs => mvs.id == movie.id && mvs.list=="history")
  const isWatchlist = () => userInfo!.savedMovies.some(mvs => mvs.id == movie.id && mvs.list=="watchList")

  const toggleLocal = (list: string) => {
    const movieDetails = {
      id: movie.id, title: movie.title,
      releaseDate: movie.releaseDate, 
      voteAverage: movie.voteAverage,
      posterPath: movie.posterPath
    }
    dispatch(toggleMovie({list,movie:movieDetails,add:(isHistory()||isWatchlist())}))
  }
 
  return (
    //155 225
    <div className=' shadow-sm rounded-lg relative   min-w-[150px] w-[150px] ' >
      <Link to={`/movies/${movie.id}`}>
        <img className=' rounded-lg  h-[14rem]'
          src={movie.posterPath ? `https://image.tmdb.org/t/p/original/${movie.posterPath}` : image404} alt="" loading="lazy" />
      </Link>
      <div className="w-10 absolute top-[13rem] left-2">
        <CircularProgressbar
          value={(Number(percentage))}
          text={`${percentage}`}
          background
          backgroundPadding={3}
          styles={buildStyles({
            backgroundColor: "rgba(0,0,0,0.9)",
            textSize: '2rem',
            textColor: "white",
            pathColor: color,
            trailColor: "transparent"
          })}
        />
      </div>
      <div className="absolute top-1 rtl:-left-1 ltr:-right-1 z-10">
        <Menu   >
          {({ isOpen }) => (
            <>
              <MenuButton isActive={isOpen}  as={Button} rightIcon={<ChevronDownIcon />}>
                <EllipsisHorizontalIcon className="w-6 h-6 bg-gray-300 rounded-full " />
              </MenuButton>
              <MenuList  marginInlineStart={"-96"} >
                <MenuItem onClick={() => toggleLocal('watchList')}roundedTop="5" backgroundColor={"white"} _hover={{ backgroundColor: "gray" }} p='10px'>
                <BookmarkIcon className="w-4 mx-2 " color={isWatchlist() ? 'red' : 'black'} />
                Watchlist
                </MenuItem>
                <MenuItem onClick={() => toggleLocal('history')} roundedBottom="5" backgroundColor={"white"} _hover={{ backgroundColor: "gray" }} p='10px' >
                  <HeartIcon className="w-4 mx-2 " color={isHistory() ? 'red' : 'black'} />
                  Mark watched
                </MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
      </div>
     

      <div className='p-2 mt-5'>
        <Link to={`/movies/${movie.id}`}>
          <a className=' text-[1em] hover:text-myblue'>{movie.title}</a>
        </Link>
        <p className="opacity-60">{movie.releaseDate}</p>
      </div>
    </div>
  )
}

export default MovieCard