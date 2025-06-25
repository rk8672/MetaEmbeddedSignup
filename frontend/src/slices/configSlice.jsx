import {createSlice} from "@reduxjs/toolkit";

const initialState={
baseUrl:import.meta.env.VITE_API_BASE_URL ||""
}

const configSlice=createSlice({
    name:"config",
    initialState,
    reducers:{}
})

export default configSlice.reducer;