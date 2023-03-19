import { createAsyncThunk } from '@reduxjs/toolkit'

const backendURL = 'http://127.0.0.1:5000'

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ name, email, password }: { name: string, email: string, password: string },{rejectWithValue}) => {
        try {
            const req = await fetch('/api/signup', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password
                })
            })
            if(req.ok){
                return req.json();
            }
            rejectWithValue("Email already Exists")
        } catch (error) {
            console.log(error);
        }
    }
)