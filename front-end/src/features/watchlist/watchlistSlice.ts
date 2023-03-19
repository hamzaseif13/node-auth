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

function saveToLocal(key:string,items:StoredMovie[]){
    localStorage.setItem(key,JSON.stringify(items))
}
function isStored(key:string,item:StoredMovie):boolean{
    const items = localStorage.getItem(key)
    if(items){
        const parsed = JSON.parse(items);
        return parsed.some((itm:any)=>item.id==itm.id)
    }
    return false;
}
export default watchlistSlice.reducer

export const selectLang = (state:RootState) => state.watchlistReducer.lang
export const {changeLang} = watchlistSlice.actions