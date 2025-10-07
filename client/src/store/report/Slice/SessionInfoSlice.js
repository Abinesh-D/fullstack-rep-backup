import { createSlice } from "@reduxjs/toolkit";



const sessionSlice = createSlice({
    name:"sessioninfo",
    initialState:{
        dbInfo : JSON.parse(sessionStorage.getItem("db_info")),
        pageInfo:JSON.parse(sessionStorage.getItem("page_data")),
        authUser : JSON.parse(sessionStorage.getItem("authUser")),
    },
    reducers:{
        updateSessionInfo:(state,action)=>{
            state.pageInfo = action.payload
        }

    }

})



export const { updateSessionInfo } = sessionSlice.actions;

export const sessionSliceReducer = sessionSlice.reducer;