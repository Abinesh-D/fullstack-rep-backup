import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authLoad: false,
        invalidErrMsg: "",
    },
    reducers: {
        setauthLoad: (state, action) => {
            state.authLoad = action.payload
        },
        setInvalidErrMsg: (state, action) => {
            state.invalidErrMsg = action.payload
        },
    },
});






// export const getConfiguration = () => async (dispatch) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await urlSocket.post('apiurl/apiendpoint');
//             if (response.status === 200) {
//                 resolve(response.data);
//             }
//         } catch (error) {
//             reject(error);
//         }
//     });
// }


export const {
    setauthLoad,
    setInvalidErrMsg,
} = authSlice.actions;
export const authReducer = authSlice.reducer;