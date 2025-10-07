import { createSlice } from "@reduxjs/toolkit";



const reportUserSlice = createSlice({

    name :"reportUser",
    initialState:{
        report_users:[],
        selected_users:[],
        my_report:[],
        my_report_tree:[]
    },
    reducers:{
        setReportUsers:(state,action)=>{
            state.report_users = action.payload
        },
        setSelectedReportUser:(state,action)=>{
            state.selected_users = action.payload
        },
        setMyReportSlice:(state,action)=>{
            state.my_report = action.payload
        },
        setMyreportTree:(state,action)=>{
            state.my_report_tree = action.payload
        }


    }
})


export const {setReportUsers,setSelectedReportUser,setMyReportSlice,setMyreportTree} = reportUserSlice.actions

export const reportUserSliceReducer = reportUserSlice.reducer