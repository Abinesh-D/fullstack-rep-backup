import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
const initialState = {
    sortedData: [],
    linesorted: [],
    horstack: [],
    vertilinesorted: [],
    areasorted: [],
    horbarsorted: [],
    verticalbarsorted: [],
    name: ""
};
export const SortingSlice = createSlice({
    name: 'SortArr',
    initialState,
    reducers: {
        sortInfo: (state, action) => {
            // state.sortedData = action.payload;
            const { chart_id, sortedData } = action.payload;
            state[chart_id] = sortedData;
        },
        sortLine: (state, action) => {
            const { chart_id, sortedData } = action.payload;
            // Update the state with sorted data for the specific chart ID
            state[chart_id] = sortedData;
        },

        sorthorstack: (state, action) => {
            const { chart_id, sortedData } = action.payload;
            // Update the state with sorted data for the specific chart ID
            state[chart_id] = sortedData;
        },

        sortverticalline: (state, action) => {
            const { chart_id, sortedData } = action.payload;
            // Update the state with sorted data for the specific chart ID
            state[chart_id] = sortedData;
        },
        sortarea: (state, action) => {
            const { chart_id, sortedData } = action.payload;
            // Update the state with sorted data for the specific chart ID
            state[chart_id] = sortedData;
        },

        sortBar: (state, action) => {
            const { chart_id, sortedData } = action.payload;
            state[chart_id] = sortedData;
        },
        verticalbar: (state, action) => {
            const { chart_id, sortedData } = action.payload;
            state[chart_id] = sortedData;

        },

        sortFunc: (state, action) => {
            const { data, arr_values, chart_id } = action.payload;

            // Perform sorting
            const sortedData = [...data].sort((a, b) => {
                for (const value of arr_values) {
                    if (a[value] !== b[value]) {
                        return a[value] - b[value];
                    }
                }
                return 0;
            });

            // Update state with the sorted data for the specific chart_id
            state[chart_id] = { ...state[chart_id], linesorted: sortedData, sortedData, horstack: sortedData, vertilinesorted: sortedData, areasorted: sortedData, barsorted: sortedData };
        },
        sortDescending: (state, action) => {
            const { chartData, arrValues, ID } = action.payload;
            const sortedData = [...chartData].sort((a, b) => {
                for (const value of arrValues) {
                    if (a[value] !== b[value]) {
                        return b[value] - a[value];
                    }
                }
                return 0;
                
            });
            state[ID] = { ...state[ID], linesorted: sortedData, sortedData, horstack: sortedData, vertilinesorted: sortedData, areasorted: sortedData, barsorted: sortedData };
        },

        barsorting: (state, action) => {
            const { data, chart_id } = action.payload;
            const sortedData = [...data].sort((a, b) => a.value - b.value);
            state[chart_id] = { ...state[chart_id], horbarsorted: sortedData, verticalbarsorted: sortedData };
        },

        bardescending: (state, action) => {
            const { data, chart_id } = action.payload;
            const sortedData = [...data].sort((a, b) => b.value - a.value);
            state[chart_id] = { ...state[chart_id], horbarsorted: sortedData, verticalbarsorted: sortedData };
        },
    }
});
export const { sortInfo, sortFunc, sortLine, sortDescending, sorthorstack, sortverticalline, sortarea, areasorted, horbarsorted, sortBar, barsorting, bardescending, verticalbar, verticalbarsorted } = SortingSlice.actions;
export default SortingSlice.reducer;







