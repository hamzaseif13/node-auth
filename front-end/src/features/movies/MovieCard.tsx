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
  const [menuOpen, setMenuOpen] = useState(false)
  const percentage = (movie.voteAverage * 10).toPrecision(2);
  const color = movie.voteAverage > 7 ? "#0FF207" : "#EBF305"
  const userInfo = useSelector(selectUserInfo)
  const dispatch = useDispatch<AppDispatch>()
  document.documentElement.onclick = () => {
    if (menuOpen) {
      setMenuOpen(false)
    }
  }
  const isHistory = () => userInfo!.moviesHistory.some(mvs => mvs.id == movie.id)
  const isWatchlist = () => userInfo!.moviesWatchlist.some(mvs => mvs.id == movie.id)

  const toggleLocal = (key: string) => {
    const movieDetails = {
      id: movie.id, title: movie.title,
      releaseDate: movie.releaseDate, 
      voteAverage: movie.voteAverage,
      posterPath: movie.posterPath
    }
    dispatch(toggleMovie({key,movie:movieDetails,add:isAdded(key)}))
  }
  function isAdded(key:any){
    if(key=='watchList')return isWatchlist()
    return isHistory()
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
      {/* <div className=" inline-block   w-full" >
        <button   onClick={(ev) => {ev.stopPropagation();setMenuOpen(e => !e)}} className="w-6 h-6 hover:bg-blue-300 bg-slate-300  flex relative float-right top-2 right-2  justify-center items-center rounded-full hover:cursor-pointer">
          <EllipsisHorizontalIcon />
        </button>

        {menuOpen&&(<ul  className={`absolute text-left top-8 left-20 w-full z-10 text-gray-700 pt-1 `}>
          <li onClick={(e) => { toggleLocal('watchList');}} className="flex rounded-t items-center hover:bg-gray-400 bg-white">
            <BookmarkIcon className="w-4 ml-2 " color={isWatchlist() ? 'red' : 'black'} />
            <button className=" py-2 px-4 block whitespace-no-wrap" >
              Watchlist
            </button>

          </li>
          <li onClick={() => toggleLocal('history')} className="flex rounded-b  items-center hover:bg-gray-400 bg-white">
            <HeartIcon className="w-4 ml-2 " color={isHistory() ? 'red' : 'black'} />
            <button className=" py-2 px-4 block " >
              Mark Watched
            </button>
          </li>
        </ul>)}
      </div> */}
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