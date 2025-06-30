import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../../../config';
import { useDispatch } from 'react-redux';



const initialState = {
  espaceApiData: [],
  googleApiData: [],
  lensOrgApiData: [],
  lensPageUrl: '',
  freePatentApiData: [],
  patentLoading: null,

  fetchESPData: [],
  bulkESPData: [],

  espData: [],
  fetchLegalStatus: [],
  classifyData: [],
  chatBoxData: [],
  googlePatentData: [],
  releventBiblioGoogleData: [],
  relatedBiblioGoogleData: [],


};


const patentSlice = createSlice({
  name: 'patent',
  initialState,
  reducers: {
    setPatentData: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setEspaceApiData: (state, action) => {
      state.espaceApiData = action.payload;
    },
    setGoogleApiData: (state, action) => {
      state.googleApiData = action.payload;
    },
    setLensOrgApiData: (state, action) => {
      state.lensOrgApiData = action.payload;
    },
    setLensPageUrl: (state, action) => {
      state.lensPageUrl = action.payload;
    },
    setFreePatentApiData: (state, action) => {
      state.freePatentApiData = action.payload;
    },
    setPatentLoading: (state, action) => {
      state.patentLoading = action.payload;
    },

    setFetchESPData: (state, action) => {
      state.fetchESPData = action.payload;
    },
    setBulkESPData: (state, action) => {
      state.bulkESPData = action.payload;
    },

    setFetchLegalStatus: (state, action) => {
      state.fetchLegalStatus = action.payload;
    },
    setESPData: (state, action) => {
      state.espData = action.payload;
    },
    setClassifyData: (state, action) => {
      state.classifyData = action.payload;
    },
    setChatBoxData: (state, action) => {
      state.chatBoxData = action.payload;
    },
    setGooglePatentData: (state, action) => {
      state.googlePatentData = action.payload;
    },
    setReleventBiblioGoogleData: (state, action) => {
      state.releventBiblioGoogleData = action.payload;
    },
    setRelatedBiblioGoogleData: (state, action) => {
      state.relatedBiblioGoogleData = action.payload;
    },


    resetPatentData: () => initialState,
  },
});




// ChatBox API COHERE
export const retrieveChatBoxData = async (message, dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/chatbox/chat`, { message: message });

    console.log(response, 'responsefor chat')
    if (response.status === 200 && response.data) {
      dispatch(setChatBoxData(response.data));
    }

  } catch (error) {
    console.log(error, "ChatBox API not Triggered")
  }
};


// Cpc classification API
export const retrieveClassificationData = async (classifyNumber, dispatch, setShowAlert, setAlertType, setCustomAlertMessage) => {
  try {
    if (!classifyNumber) throw new Error("Patent number is required.");
    const response = await axios.get(`${BASE_URL}/cpc/classify/${encodeURIComponent(classifyNumber)}`);


    console.log('classifyNumberResponse', response.data);

    if (response.status === 200 && response.data) {
      dispatch(setClassifyData(response.data));
      return response.data;
    } else {
      throw new Error("Classification data not found or invalid response.");
    }
  } catch (error) {
    console.log(error, "Classification api not triggered");
    setAlertType("error");
    setCustomAlertMessage("Invalid cpc number please check it.");
    setShowAlert(true);
  };
}

export const retrieveEspacePatentData = async (patentNumber, dispatch, setShowAlert) => {
  try {
    const trimmedNumber = patentNumber.trim();
    if (!trimmedNumber) throw new Error("Patent number is required.");

    const response = await axios.get(`${BASE_URL}/api/espacenet/${trimmedNumber}`);

    console.log('retrieveEspacePatentData', response.data);

    if (response.status === 200 && response.data) {
      dispatch(setEspaceApiData(response.data));
      console.log('response.data :>> ', response.data);

      if (setShowAlert) setShowAlert(true);
      return response.data;
    } else {
      throw new Error("Patent data not found or invalid response.");
    }

  } catch (error) {
    console.error("❌ Patent fetch error:", error.message || error);
    if (setShowAlert) setShowAlert(false);
    throw error;
  }
};


export const retrieveLensPatentData = (patentNumber, dispatch, setShowAlert) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/lens/get-patent-data`, {
        patentNumber: patentNumber.trim()
      });
      console.log('res.data :>> ', res.data);

      const { formattedData, fullData, url } = res.data;
      if (res.status === 200) {
        dispatch(setLensOrgApiData(formattedData));
        dispatch(setLensPageUrl(url));
        resolve("success");
        setShowAlert(true);
      } else {
        reject("error");
      }
    } catch (err) {
      console.error('Error fetching patent:', err);
      reject("error");
    }
  });
};

export const fetchGooglePatentData = async (patentNumber, dispatch) => {
  try {
    const response = await axios.get(`${BASE_URL}/patent/${patentNumber.trim()}`);

    console.log('fetchGooglePatentData', response.data);
    dispatch(setGoogleApiData(response.data));
  } catch (err) {
    console.error('Error fetching patent data:', err);
    throw err;
  }
};



// Google CPC fetch against Patent number
export const fetchGoogleCPCData = async (classNumber, setDefinitionData ) => {
  console.log(classNumber, 'fetchGoogleCPCData')
  try {
    const response = await axios.get(`${BASE_URL}/cpc/google/${classNumber.trim()}`);
    console.log(response.data, 'responseresponseresponse')
    setDefinitionData(response.data || []);

  } catch (err) {
    console.error('Error fetching patent data:', err);
    throw err;
  }
};



export const googleBiblioData = async (ptnNumber, dispatch, type) => {

  console.log('ptnNumber', ptnNumber, type)
  const trimmed = ptnNumber.trim();
  if (!trimmed) throw new Error("Invalid patent number for Google fallback");

  try {
    const response = await axios.get(`${BASE_URL}/cpc/google/${encodeURIComponent(trimmed)}`);

    if (type === 'relavent') {
      dispatch(setReleventBiblioGoogleData(response.data));

    } else if (type === 'related') {
      dispatch(setRelatedBiblioGoogleData(response.data));
    }
    console.log('response.datagoogleBiblioData', response.data)
    return response.data;
  } catch (err) {
    console.error('❌ googleBiblioData error:', err.message || err);
    throw err;
  }
};



export const fetchIpcDefinitions = async (commaSeparatedCodes) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/ipc-definition/${encodeURIComponent(commaSeparatedCodes)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching IPC definitions:", error);
    throw error;
  }
};



// Single Patent Biblio Data
export const fetchESPData = async (patentNumber, dispatch, type) => {
  try {
    const trimmedNumber = patentNumber.trim();
    if (!trimmedNumber) throw new Error("Patent number is required.");

    const response = await axios.get(`${BASE_URL}/esp/patentdata/${trimmedNumber}`);

    console.log('fetchESPData', response.data);

    if (response.status === 200 && response.data) {
      if (type === 'relavent') {
        dispatch(setFetchESPData(response.data));

      } else if (type === 'related') {
        dispatch(setESPData(response.data));
      }

      console.log('response.data :>> ', response.data);

      return response.data;
    } else {
      throw new Error("Patent data not found or invalid response.");
    }

  } catch (error) {

    if (type === 'relavent') {
      dispatch(setFetchESPData([]));
    } else if (type === 'related') {
      dispatch(setESPData([]));
    }

    // try {
    //   await dispatch(googleBiblioData(patentNumber, false, dispatch));

    // } catch (error) {
    //   console.log(error, "error")
    // }
    console.error("❌ Patent fetch error:", error.message || error);
    throw error;
  }
};



// Bulk Patent Biblio Data
export const fetchBulkESPData = async (patentNumber, dispatch, type) => {
  try {

    console.log(patentNumber, 'patentNum')
    // const trimmedNumber = patentNumber.trim();
    // if (!trimmedNumber) throw new Error("Patent number is required.");

    const response = await axios.get(`${BASE_URL}/bulk/biblio/${patentNumber}`);

    console.log('fetchESPData', response.data);

    if (response.status === 200 && response.data) {
      if (type === 'relavent') {
        dispatch(setBulkESPData(response.data));

      } else if (type === 'related') {
        dispatch(setESPData(response.data));
      }

      console.log('response.data :>> ', response.data);

      return response.data;
    } else {
      throw new Error("Patent data not found or invalid response.");
    }

  } catch (error) {

    if (type === 'relavent') {
      dispatch(setFetchESPData([]));
    } else if (type === 'related') {
      dispatch(setESPData([]));
    }

    console.error("❌ Patent fetch error:", error.message || error);
    throw error;
  }
};


export const fetchLegalStatusData = async (patentNumber, dispatch) => {
  try {
    if (!patentNumber) throw new Error("Patent number is required.");

    const response = await axios.get(`${BASE_URL}/esp/legalStatus/${patentNumber}`);

    if (response.status === 200 && response.data) {
      dispatch(setFetchLegalStatus(response.data));
      return response.data;
    } else {
      throw new Error("Patent data not found or invalid response.");
    }
  } catch (error) {
    console.error("❌ Patent fetch error:", error.message || error);
    throw error;
  }
};


export const { setPatentData, setEspaceApiData, setBulkESPData, resetPatentData, setGoogleApiData, setLensOrgApiData, setFreePatentApiData,
  setPatentLoading, setLensPageUrl, setFetchESPData, setESPData, setFetchLegalStatus, setClassifyData, setChatBoxData,
  setGooglePatentData, setReleventBiblioGoogleData, setRelatedBiblioGoogleData, 
} = patentSlice.actions;
export default patentSlice.reducer;


















// import { createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';

// const initialState = {
//   // patentNumber: '',
//   // url: '',
//   // country: '',
//   // title: '',
//   // inventors: '',
//   // assignee: '',
//   // abstract: [],
//   // claims: '',
//   // description: '',
//   // publicationDate: '',
//   // applicationDate: '',
//   // priorityDate: '',
//   // ipc: '',
//   // cpc: '',
//   // simple_family: [],
//   // extended_family: [],
//   // sequence_listing: '',
//   // publication_type: '',
//   // legal_status: '',
//   // usClassification: '',
//   espaceApiData: [],
//   googleApiData: [],
//   lensOrgApiData: [],
//   lensPageUrl: '',
//   freePatentApiData: [],
//   patentLoading: null,
//   fetchESPData: [],
//   espData: [],
//   fetchLegalStatus: [],
//   classifyData: [],
//   chatBoxData: [],

// };


// const patentSlice = createSlice({
//   name: 'patent',
//   initialState,
//   reducers: {
//     setPatentData: (state, action) => {
//       return {
//         ...state,
//         ...action.payload,
//       };
//     },
//     setEspaceApiData : (state, action) => {
//       state.espaceApiData = action.payload;
//     },
//     setGoogleApiData : (state, action) => {
//       state.googleApiData = action.payload;
//     },
//     setLensOrgApiData : (state, action) => {
//       state.lensOrgApiData = action.payload;
//     },
//     setLensPageUrl : (state, action) => {
//       state.lensPageUrl = action.payload;
//     },
//     setFreePatentApiData : (state, action) => {
//       state.freePatentApiData = action.payload;
//     },
//     setPatentLoading : (state, action) => {
//       state.patentLoading = action.payload;
//     },
//     setFetchESPData : (state, action) => {
//       state.fetchESPData = action.payload;
//     },
//     setFetchLegalStatus: (state, action) => {
//       state.fetchLegalStatus = action.payload;
//     },
//     setESPData: (state, action) => {
//       state.espData = action.payload;
//     },
//     setClassifyData: (state, action) => {
//       state.classifyData = action.payload;
//     },
//     setChatBoxData: (state, action) => {
//       state.chatBoxData = action.payload;
//     },



//     resetPatentData: () => initialState,
//   },
// });

// // ChatBox API COHERE
// export const retrieveChatBoxData = async (message, dispatch) => {
//   try {
//     const response = await axios.post('http://localhost:8080/api/chatbox/chat', { message: message });


//     console.log(response, 'responsefor chat')
//     if (response.status === 200 && response.data) {
//       dispatch(setChatBoxData(response.data));
//     }

//   } catch (error) {
//     console.log(error, "ChatBox API not Triggered")
//   }
// };


// // Cpc classification API
// export const retrieveClassificationData = async (classifyNumber, dispatch, setShowAlert, setAlertType, setCustomAlertMessage) => {


//   try {
//     if (!classifyNumber) throw new Error("Patent number is required.");
//     // const response = await axios.get(`http://localhost:8080/api/ipc-definition/${classifyNumber}`);
//     const response = await axios.get(`http://localhost:8080/cpc/classify/${encodeURIComponent(classifyNumber)}`);
    

//     console.log('classifyNumberResponse', response.data);

//     if (response.status === 200 && response.data) {
//       dispatch(setClassifyData(response.data));
//       return response.data;
//     } else {
//       throw new Error("Classification data not found or invalid response.");
//     }
//   } catch (error) {
//     console.log(error, "Classification api not triggered");
//     setAlertType("error");
//     setCustomAlertMessage("Invalid cpc number please check it.");
//     setShowAlert(true);
//   };
// }



// export const retrieveEspacePatentData = async (patentNumber, dispatch, setShowAlert) => {
//   try {
//     const trimmedNumber = patentNumber.trim();
//     if (!trimmedNumber) throw new Error("Patent number is required.");

//     const response = await axios.get(`http://localhost:8080/api/espacenet/${trimmedNumber}`);

//     console.log('retrieveEspacePatentData', response.data);

//     if (response.status === 200 && response.data) {
//       dispatch(setEspaceApiData(response.data));
//       console.log('response.data :>> ', response.data);

//       if (setShowAlert) setShowAlert(true);
//       return response.data;
//     } else {
//       throw new Error("Patent data not found or invalid response.");
//     }

//   } catch (error) {
//     console.error("❌ Patent fetch error:", error.message || error);
//     if (setShowAlert) setShowAlert(false);
//     throw error;
//   }
// };


// export const retrieveLensPatentData = (patentNumber, dispatch, setShowAlert) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const res = await axios.post('http://localhost:8080/api/lens/get-patent-data', {
//         patentNumber: patentNumber.trim()
//       });
//       console.log('res.data :>> ', res.data);

//       const { formattedData, fullData, url } = res.data;
//       if (res.status === 200) {
//         dispatch(setLensOrgApiData(formattedData));
//         dispatch(setLensPageUrl(url));
//         resolve("success");
//         setShowAlert(true);
//       } else {
//         reject("error");
//       }
//     } catch (err) {
//       console.error('Error fetching patent:', err);
//       reject("error");
//     }
//   });
// };

// export const fetchGooglePatentData = async (patentNumber, dispatch) => {
//   try {
//     const response = await axios.get(`http://localhost:8080/patent/${patentNumber.trim()}`);

//     console.log('fetchGooglePatentData', response.data);
//     dispatch(setGoogleApiData(response.data));
//   } catch (err) {
//     console.error('Error fetching patent data:', err);
//     throw err;
//   }
// };



// export const fetchESPData = async (patentNumber, dispatch, type) => {
//   try {
//     const trimmedNumber = patentNumber.trim();
//     if (!trimmedNumber) throw new Error("Patent number is required.");

//     const response = await axios.get(`http://localhost:8080/esp/patentdata/${trimmedNumber}`);

//     console.log('fetchESPData', response.data);

//     if (response.status === 200 && response.data) {
//       if (type === 'relavent') {
//         dispatch(setFetchESPData(response.data));

//       } else if (type === 'related') {
//         dispatch(setESPData(response.data));
//       }

//       console.log('response.data :>> ', response.data);

//       return response.data;
//     } else {
//       throw new Error("Patent data not found or invalid response.");
//     }

//   } catch (error) {

//     if (type === 'relavent') {
//       dispatch(setFetchESPData([]));
//     } else if (type === 'related') {
//       dispatch(setESPData([]));
//     }

//     console.error("❌ Patent fetch error:", error.message || error);
//     throw error;
//   }
// };



// export const fetchLegalStatusData = async (patentNumber, dispatch) => {
//   try {
//     if (!patentNumber) throw new Error("Patent number is required.");

//     const response = await axios.get(`http://localhost:8080/esp/legalStatus/${patentNumber}`);

//     if (response.status === 200 && response.data) {
//       dispatch(setFetchLegalStatus(response.data));
//       return response.data;
//     } else {
//       throw new Error("Patent data not found or invalid response.");
//     }
//   } catch (error) {
//     console.error("❌ Patent fetch error:", error.message || error);
//     throw error;
//   }
// };




// export const { setPatentData, setEspaceApiData, resetPatentData, setGoogleApiData, setLensOrgApiData, setFreePatentApiData,
//   setPatentLoading, setLensPageUrl, setFetchESPData, setESPData, setFetchLegalStatus, setClassifyData, setChatBoxData, 
// } = patentSlice.actions;
// export default patentSlice.reducer;