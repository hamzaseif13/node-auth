import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../store/store"
import { StoredMovie } from "../watchlist/watchlistSlice"

const userToken = localStorage.getItem('token') ?? null
export const fetchUserDetails = createAsyncThunk('user/profile', async () => {
    if (!localStorage.getItem('token')) return
    try {
        const req = await fetch('/api/user/profile', {
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        })
        return req.json();
    } catch (error) {
        authSlice.actions.logout({})
    }
})
export const toggleMovie = createAsyncThunk('user/toggle', async({key,movie,add}:{key:string,movie:StoredMovie,add:boolean})=>{
    try{
        const req = await fetch(`/api/user/add-${key}`,{
            method:"post",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },body:JSON.stringify({movie,add})
        })
        return req.json()
    }catch(error){

    }
})
export interface IUSER {
    email: string
    name: string,
    _id: string,
    moviesWatchlist: StoredMovie[]
    moviesHistory: StoredMovie[]
}
interface AuthState {
    userToken: string | null
    userInfo?: IUSER
    loading: boolean
}
const initialState: AuthState = {
    userToken, loading: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addUserInfo: (state, action: PayloadAction<IUSER>) => {
            state.userInfo = action.payload
        },
        addUserLoginInfo: (state, action: PayloadAction<{ user: IUSER, token: string }>) => {
            state.userInfo = action.payload.user
            state.userToken = action.payload.token
            localStorage.setItem('token', action.payload.token)
        },
        logout: (state, action) => {
            state.userInfo = undefined;
            state.userToken = null;
            localStorage.setItem('token', '')
        },
        
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
            if (action.payload.user)
                state.userInfo = action.payload.user
            state.loading = false
        }).addCase(fetchUserDetails.rejected, (state, action) => {
            state.loading = false
            state.userInfo = undefined
            state.userToken = null
        }).addCase(fetchUserDetails.pending, (state, action) => {
            if(state.userToken){
                state.loading = true
            }
        }).addCase(toggleMovie.fulfilled,(state,action)=>{
            state.userInfo = action.payload
        })
    }

})
export const { addUserInfo, addUserLoginInfo, logout } = authSlice.actions
export const selectUserInfo = (state: RootState) => state.authReducer.userInfo
export const selectToken = (state: RootState) => state.authReducer.userToken
export const selectLoading = (state: RootState) => state.authReducer.loading
export default authSlice.reducer