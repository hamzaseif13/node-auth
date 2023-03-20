import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";





const initialState:WatchListState ={
   lang:'EN'
}
interface WatchListState{
   
    lang:'AR'|'EN'
}
export interface StoredMovie{
    id:number
    title : string
    releaseDate:string
    voteAverage:number
    posterPath?:string
    list?:string
}
const watchlistSlice = createSlice({
    name:"watchlist",
    initialState,
    reducers:{
        changeLang:(state,action:PayloadAction<'AR'|'EN'>)=>{
            document.body.dir = action.payload=='AR' ? 'rtl' : 'ltr'
            state.lang = action.payload;
        },
       
    }
})


export default watchlistSlice.reducer

export const selectLang = (state:RootState) => state.watchlistReducer.lang
export const {changeLang} = watchlistSlice.actions