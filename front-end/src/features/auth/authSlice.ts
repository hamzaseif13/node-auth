import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../store/store"
import { StoredMovie } from "../watchlist/watchlistSlice"




export const loginUser = createAsyncThunk("user/login", async (
    { email, password }: {email: string, password: string },{rejectWithValue}
) => {
    try{
        const req = await fetch(import.meta.env.VITE_API_URL + '/api/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        if (!req.ok) {
            return rejectWithValue("Incorrect Credentials")
        } 
        return req.json();
    }catch(error:any){
        return error.message;
    }
    
})

export const toggleMovie = createAsyncThunk('user/toggle', async ({ list, movie, add }: { list: string, movie: StoredMovie, add: boolean }) => {
    try {
        const req = await fetch(import.meta.env.VITE_API_URL + `/api/user/save-movie`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }, body: JSON.stringify({ movie:{...movie,list:list}, add })
        })
        return req.json()
    } catch (error) {

    }
})
export interface IUSER {
    email: string
    name: string,
    _id: string,
    savedMovies: StoredMovie[]
}
interface AuthState {
    userToken: string | null
    userInfo?: IUSER
    loading: boolean
    registering: boolean
    status: "loading" | "error" | "success" | "idle"
    error?:string
}
const initialState: AuthState = {
    userToken:localStorage.getItem("token"), loading: false,
    registering: false,
    status:"idle"
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
        },
        logout: (state, action) => {
            state.userInfo = undefined;
            state.userToken = null;
            localStorage.setItem('token', '')
        },
        resetStatus:(state,action)=>{
            state.status='idle'
        }

    },
    extraReducers: (builder) => {
        builder.addCase(toggleMovie.fulfilled, (state, action) => {
            state.userInfo = action.payload
        }).addCase(loginUser.pending,(state,action)=>{
            state.status = "loading"
        }).addCase(loginUser.fulfilled,(state,action)=>{
            if(action.payload.token){
                localStorage.setItem('token', action.payload.token)
                state.userInfo = action.payload.user
                state.userToken = action.payload.token
                state.status="success"
            }else{
                state.status="error"
                state.error="Error Please Try again Later"
            }
        }).addCase(loginUser.rejected,(state,action)=>{
            state.status = "error"
            state.error = action.payload as string
        })
    }

})
export const { addUserInfo, resetStatus ,addUserLoginInfo, logout } = authSlice.actions
export const selectUserInfo = (state: RootState) => state.authReducer.userInfo
export const selectToken = (state: RootState) => state.authReducer.userToken
export const selectLoading = (state: RootState) => state.authReducer.loading
export const selectStatus = (state:RootState) => state.authReducer.status
export const selectError = (state:RootState) => state.authReducer.error
export default authSlice.reducer