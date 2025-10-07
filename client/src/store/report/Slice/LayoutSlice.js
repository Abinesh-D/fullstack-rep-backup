import { createSlice } from '@reduxjs/toolkit';
import urlSocket from '../../../helpers/urlSocket';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

// const initialState = {
//     layoutInfo: []
// };

const layoutSlice = createSlice({
    name: 'LayoutArray',
    initialState:{
        layoutInfo:[],
        // formatedWholeNumber: 0
    },
    reducers: {
        updateLayoutInfo: (state, action) => {
            state.layoutInfo = action.payload;
        },
        // crearting the layouts
        createLayout: (state, action) => {
            const val = action.payload;
            const layout = state.layoutInfo;
            const uniqueArr = _.uniqBy(layout, "y");
            const totalHeight = uniqueArr.reduce((acc, item) => acc + item.h, 0);
            const newY = totalHeight;
            let lay1;
            // Your layout creation logic here
            if (val === '1') {
                lay1 = [
                    ...layout,
                    { i: uuidv4(), x: 0, y: newY, w: 12, h: 3 },// minH  : 2
                ];
            } else if (val === '2') {
                lay1 = [
                    ...layout,
                    { i: uuidv4(), x: 0, y: newY, w: 6, h: 3 },
                    { i: uuidv4(), x: 6, y: newY, w: 6, h: 3 }
                ];
            } else if (val === '3') {
                lay1 = [
                    ...layout,
                    { i: uuidv4(), x: 0, y: newY, w: 4, h: 3 },
                    { i: uuidv4(), x: 4, y: newY, w: 4, h: 3 },
                    { i: uuidv4(), x: 8, y: newY, w: 4, h: 3 }
                ];
            } else if (val === '4') {
                lay1 = [
                    ...layout,
                    { i: uuidv4(), x: 0, y: newY, w: 3, h: 2 },
                    { i: uuidv4(), x: 3, y: newY, w: 3, h: 2 },
                    { i: uuidv4(), x: 6, y: newY, w: 3, h: 2 },
                    { i: uuidv4(), x: 9, y: newY, w: 3, h: 2 }
                ];
            } else if (val === '5') {
                lay1 = [
                    ...layout,
                    { i: uuidv4(), x: 0, y: newY, w: 3, h: 1 },
                    { i: uuidv4(), x: 3, y: newY, w: 3, h: 1 },
                    { i: uuidv4(), x: 6, y: newY, w: 2, h: 1 },
                    { i: uuidv4(), x: 8, y: newY, w: 2, h: 1 },
                    { i: uuidv4(), x: 10, y: newY, w: 2, h: 1 }
                ];
            }
            state.layoutInfo = lay1;
        },

        create_layouts: () => {
            console.error("create_layouts should not be used directly. Use createLayout instead.");
        },
        //creating the text block
        textBlock: (state, action) => {
            const indx = action.payload;
            let newHeader;
            if (indx === '1') {
                newHeader = { i: uuidv4(), x: 0, y: 0, w: 12, h: 1, type: 'text', value: 'Header 1', fontsize: '24px', isResizable: false };
            } else if (indx === '2') {
                newHeader = { i: uuidv4(), x: 0, y: 0, w: 12, h: 0.8, type: 'text', value: 'Header 2', fontsize: '20px', isResizable: false };
            } else if (indx === '3') {
                newHeader = { i: uuidv4(), x: 0, y: 0, w: 12, h: 0.7, type: 'text', value: 'Header 3', fontsize: '18px', isResizable: false };
            } else {
                newHeader = { i: uuidv4(), x: 0, y: 0, w: 12, h: 0.5, type: 'text', value: 'Header 4', fontsize: '14px', isResizable: false };
            }
            const totalHeaderHeight = newHeader.h;
            const updatedLayout = state.layoutInfo.map(item => ({ ...item, y: item.y + totalHeaderHeight }));
            const newLayout = [newHeader, ...updatedLayout];
            state.layoutInfo = newLayout;
        },
        formatedWholeNumber :( state, action )=>{
            let val = action.payload
            var formattedValue = (val % 1 === 0)
            ? val.toString()
            : val.toFixed(2);      
          return formattedValue
        }

    }
});

export const { updateLayoutInfo, createLayout, textBlock , formatedWholeNumber} = layoutSlice.actions;
export const updateChartData = (chart_data, dbInfo, layoutId, pageInfo) => async () => {
    try {
        await urlSocket.post('report/updt-chart-data', {
            chart_data: chart_data,
            encrypted_db_url: dbInfo.encrypted_db_url,
            layout_id: layoutId || '',
            page_id: pageInfo._id,
            page_name: pageInfo.name,
            chart_name: chart_data.name,

        }).then((response) => {
        })
    } catch (error) {
        console.error(error);
    }
};


export const getFormatedWholeNumber = (value) => async (dispatch) => {
    return new Promise((resolve) => {
        const formattedValue = (value % 1 === 0) ? value.toString() : value.toFixed(2);
        resolve(formattedValue);
    });
};




export const updateLayoutData = (layout, db) => async () => {
    try {
        await urlSocket.post('report/crud-report-layout', {
            layout: layout,
            encrypted_db_url: db.dbInfo.encrypted_db_url,
            page_id: db.pageInfo._id,
            page_name: db.pageInfo.name,
            created_by: db.userInfo._id,
            _id: db.layoutId == "" ||db.layoutId === undefined  ? undefined : db.layoutId
        }).then((response) => {
            // Perform additional actions after successful API call if needed
        });
    } catch (error) {
        console.error(error);
    }
};
// export default layoutSlice.reducer;
export const layoutSliceInfoReducer = layoutSlice.reducer;





