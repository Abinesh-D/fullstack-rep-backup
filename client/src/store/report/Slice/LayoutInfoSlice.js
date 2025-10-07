import { createSlice } from "@reduxjs/toolkit";



const LayoutSlice = createSlice({
    name: 'layoutslice',
    initialState: {
        pageNodeInfo:JSON.parse(sessionStorage.getItem("pageNodeInfo")),
    },
    reducers: {
        setNodeInfo: (state, action) => {
            state.pageNodeInfo = action.payload

        }
    }
})


export const { setNodeInfo } = LayoutSlice.actions
export const LayoutSliceReducer = LayoutSlice.reducer