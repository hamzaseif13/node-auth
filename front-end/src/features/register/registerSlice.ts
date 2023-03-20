import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";




export const registerUser = createAsyncThunk("user/register", async (
    { name, email, password }: { name: string, email: string, password: string },{rejectWithValue}
) => {
    try{
        const req = await fetch(import.meta.env.VITE_API_URL + '/api/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, name })
        })
        if (!req.ok) {
            return rejectWithValue("email already exists")
        } 
        return req.json();
    }catch(error:any){
        return error.message;
    }
    
})

interface State{
    status: "loading" | "error" | "success" | "idle"
    error?:string
}
const initialState:State={
    status:"idle"
}
const registerSlice = createSlice({
    name:"register",
    initialState,
    reducers:{
        reset:(state)=>{
            state.status='idle'
            state.error= undefined
        }
    },extraReducers:(builder)=>{
        builder.addCase(registerUser.pending,(state,action)=>{
            state.status = "loading"
        }).addCase(registerUser.fulfilled,(state,action)=>{
            state.status = "success"
        }).addCase(registerUser.rejected,(state,action)=>{
            state.status = "error"
            state.error = action.payload as string
        })
    }
})

export default registerSlice.reducer
export const selectStatus = (state:RootState) => state.registerReducer.status
export const selectError = (state:RootState) => state.registerReducer.error
export const {reset} = registerSlice.actions