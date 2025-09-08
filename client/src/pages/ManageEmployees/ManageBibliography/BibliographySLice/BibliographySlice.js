import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL, LINGVA_BASE_URL } from '../../../../config';
import urlSocket from '../../../../helpers/urlSocket';

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


  // LIVE INITIAL STATE
  liveEpoRelevantData: [],
  liveEpoRelatedData: [],
  liveGoogleRelevantData: [],
  liveGoogleRelatedData: [],
  relevantApiTrue: false,
  relatedApiTrue: false,
  singleProject: [],
  multiRelated: [],


  fullReportData: [],
  reportRowData: {},
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

    // LIVE SET STATE

    setLiveEpoRelevantData: (state, action) => {
      state.liveEpoRelevantData = action.payload;
    },
    setLiveEpoRelatedData: (state, action) => {
      state.liveEpoRelatedData = action.payload;
    },
    setLiveGoogleRelevantData: (state, action) => {
      state.liveGoogleRelevantData = action.payload;
    },
    setLiveGoogleRelatedData: (state, action) => {
      state.liveGoogleRelatedData = action.payload;
    },
    setFullReportData: (state, action) => {
      state.fullReportData = action.payload;
    },
      setReportRowData: (state, action) => {
      state.reportRowData = action.payload;
    },
     setRelevantApiTrue: (state, action) => {
      state.relevantApiTrue = action.payload;
    },
     setRelatedApiTrue: (state, action) => {
      state.relatedApiTrue = action.payload;
    },
    setMultiRelated: (state, action) => {
      state.multiRelated = action.payload;
    },
     setSingleProject: (state, action) => {
      state.singleProject = action.payload;
    },

    resetPatentData: () => initialState,
  },
});




// ChatBox API COHERE
export const retrieveChatBoxData = async (message, dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/chatbox/chat`, { message: message });

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

    if (response.status === 200 && response.data) {
      dispatch(setEspaceApiData(response.data));

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

    dispatch(setGoogleApiData(response.data));
  } catch (err) {
    console.error('Error fetching patent data:', err);
    throw err;
  }
};



// Google CPC fetch against Patent number
export const fetchGoogleCPCData = async (classNumber, setDefinitionData ) => {
  try {
    const response = await axios.get(`${BASE_URL}/cpc/google/${classNumber.trim()}`);
    setDefinitionData(response.data || []);

  } catch (err) {
    console.error('Error fetching patent data:', err);
    throw err;
  }
};



export const googleBiblioData = async (ptnNumber, dispatch, type) => {

  const trimmed = ptnNumber.trim();
  if (!trimmed) throw new Error("Invalid patent number for Google fallback");

  try {
    const response = await axios.get(`${BASE_URL}/cpc/google/${encodeURIComponent(trimmed)}`);

    if (type === 'relevant') {
      dispatch(setReleventBiblioGoogleData(response.data));

    } else if (type === 'related') {
      dispatch(setRelatedBiblioGoogleData(response.data));
    }
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

    if (response.status === 200 && response.data) {
      if (type === 'relevant') {
        dispatch(setFetchESPData(response.data));

      } else if (type === 'related') {
        dispatch(setESPData(response.data));
      }

      return response.data;
    } else {
      throw new Error("Patent data not found or invalid response.");
    }

  } catch (error) {

    if (type === 'relevant') {
      dispatch(setFetchESPData([]));
    } else if (type === 'related') {
      dispatch(setESPData([]));
    }
    console.error("❌ Patent fetch error:", error.message || error);
    throw error;
  }
};


// Bulk Patent Biblio Data
export const fetchBulkESPData = async (patentNumber, dispatch, type) => {
  try {
    const response = await axios.get(`${BASE_URL}/bulk/biblio/${patentNumber}`);

    if (response.status === 200 && response.data) {
      if (type === 'relevant') {
        dispatch(setBulkESPData(response.data));

      } else if (type === 'excelrelated') {
        dispatch(setESPData(response.data));
      } else if (type === "multiRelated") {
        dispatch(setMultiRelated(response.data));
      }

      return response.data;
    } else {
      throw new Error("Patent data not found or invalid response.");
    }

  } catch (error) {

    if (type === 'relevant') {
      dispatch(setFetchESPData([]));
    } else if (type === 'excelrelated') {
      dispatch(setESPData([]));
    } else if (type === "multiRelated") {
      dispatch(setMultiRelated([]));
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



// ------------------ REPORT MAKING API'S ----------------------

// RELEVANT AND RELATED DATA API

export const EPO_API_DATA = async (patentNumber, dispatch, type) => {
  try {
    const trimmedNumber = patentNumber.trim();
    if (!trimmedNumber) throw new Error("Patent number is required.");

    const response = await axios.get(`${BASE_URL}/live/espbiblio/${trimmedNumber}?type=${encodeURIComponent(type)}`);
    console.log(response.data, "response for EPO API");

    if (response.status === 200 && response.data) {
      if (type === 'relevant') {
        dispatch(setRelevantApiTrue(true));
        dispatch(setLiveEpoRelevantData(response.data));

      } else if (type === 'related') {
        dispatch(setRelatedApiTrue(true));
        dispatch(setLiveEpoRelatedData(response.data));
      }

      return response.data;
    } else {
      throw new Error("Patent data not found or invalid response.");
    }

  } catch (error) {

    if (type === 'relevant') {
      dispatch(setLiveEpoRelevantData([]));
    } else if (type === 'related') {
      dispatch(setLiveEpoRelatedData([]));
    }
    console.error("❌ Patent fetch error:", error.message || error);
    throw error;
  }
};


// export const EPO_API_DATA = async (patentNumber, dispatch, type) => {
//   try {
//     const trimmedNumber = patentNumber.trim();
//     if (!trimmedNumber) throw new Error("Patent number is required.");

//     const response = await axios.get(`${BASE_URL}/live/espbiblio/${trimmedNumber}`);
//     console.log(response.data, "response for EPO API");

//     if (response.status === 200 && response.data) {
//       if (type === 'relevant') {
//         dispatch(setRelevantApiTrue(true));
//         dispatch(setLiveEpoRelevantData(response.data));

//       } else if (type === 'related') {
//         dispatch(setRelatedApiTrue(true));
//         dispatch(setLiveEpoRelatedData(response.data));
//       }

//       return response.data;
//     } else {
//       throw new Error("Patent data not found or invalid response.");
//     }

//   } catch (error) {

//     if (type === 'relevant') {
//       dispatch(setLiveEpoRelevantData([]));
//     } else if (type === 'related') {
//       dispatch(setLiveEpoRelatedData([]));
//     }
//     console.error("❌ Patent fetch error:", error.message || error);
//     throw error;
//   }
// };


// LIVE GOOGLE API CALL
export const GOOGLE_API_DATA = async (ptnNumber, dispatch, type) => {

  const trimmed = ptnNumber.trim();
  if (!trimmed) throw new Error("Invalid patent number for Google fallback");

  try {
    const response = await axios.get(`${BASE_URL}/live/googlebiblio/${encodeURIComponent(trimmed)}`);

    if (type === 'relevant') {
      dispatch(setRelevantApiTrue(true));
      dispatch(setLiveGoogleRelevantData(response.data));

    } else if (type === 'related') {
      dispatch(setRelatedApiTrue(true));
      dispatch(setLiveGoogleRelatedData(response.data));
    }
    return response.data;
  } catch (err) {
    console.error('❌ googleBiblioData error:', err.message || err);
    throw err;
  }
};



export const fetchProjects = async (dispatch) => {
  try {
    const res = await axios.get("http://localhost:8080/live/projectname");
    dispatch(setFullReportData(res.data));
  } catch (err) {
    console.error("❌ Error fetching:", err);
  }
};



export const fetchProjectById = async (id) => {
    try {
        const res = await axios.get(`http://localhost:8080/live/projectname/single-report/${id}`);
        
        return res.data;
    } catch (err) {
        console.error("❌ Error fetching project by id:", err);
        return null;
    }
};





export const fetchPublicationDetails = async (projectId) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/live/projectname/publication-details/${projectId}`
        );
        return response.data.publicationDetails;
    } catch (error) {
        console.error("❌ Error fetching publication details:", error);
        return [];
    }
};


// Save Related Ref
export const saveRelatedReference = async (relatedForm, id) => {
    try {
        await axios.post(`http://localhost:8080/live/projectname/add-related/${id}`,
            relatedForm,
            { headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("❌ Error saving related reference:", error);
    }
};

// Fetch related Ref
export const fetchRelatedReferences = async (id) => {
    try {
        const res = await axios.get(`http://localhost:8080/live/projectname/get-related/${id}`);
        if (res.status === 200) {
          return res.data || [] ;
        }
    } catch (error) {
        console.error("❌ Error fetching related references:", error);
    }
};


// Related Ref Bulk Excel Save APi
export const saveExcelRelatedReferences = async (id, relatedData) => {
  try {
    const res = await axios.post(`http://localhost:8080/live/projectname/add-related/${id}`, relatedData);
    return res.data.stages.relatedReferences.publicationDetails || [];
  } catch (err) {
    console.error("❌ Error saving related references:", err);
    alert("Failed to save references. Check console for details.");
  }
};


export const refreshData = async ({ projectId, setKeyStringsList }) => {
  const res = await axios.get(`/api/appendix1/${projectId}`);
  setKeyStringsList(res.data.keyStrings || []);
};


export const onKeyStringsEdit = async (_id, itemId, fieldName, newValue, setEditingItem, setEditValue) => {
  try {
    await axios.put(`/api/appendix1/${_id}/${fieldName}/${itemId}`, {
      value: newValue
    });
    refreshData();
    setEditingItem(null);
    setEditValue("");
  } catch (err) {
    console.error(err);
  }
};



export const handleSaveKeyString = async ({
  _id,
  selectedSource,
  textValue,
  setAppendix1KeyStringsLevelValue,
  hitCount="",
}) => {


  if (!textValue.trim()) {
    alert("Please enter a key string");
    return;
  }

  try {
    const res = await urlSocket.post(`/live/projectname/appendix1/keystring/${_id}`,
      {
        value: textValue.trim(),
        fieldName: selectedSource,
        hitCount: hitCount,
      }
    );
    console.log('res.data', res.data)
    setAppendix1KeyStringsLevelValue(res.data);
  } catch (err) {
    console.error("Error saving key string:", err);
    alert("Failed to save key string");
  }
};


// export const handleSaveKeyString = async ({ _id, selectedSource, keyStrings, setKeyStrings, sourceFieldMap }) => {

//   const backendField = sourceFieldMap[selectedSource];
//   const value = keyStrings[selectedSource].trim();

//   if (!value) {
//     alert("Please enter a key string");
//     return;
//   }
//   if (!backendField) {
//     alert("Invalid source selection");
//     return;
//   }

//   try {
//     const res = await urlSocket.post(`/live/projectname/appendix1/${_id}/${backendField}`, { value });

//     console.log("Saved:", res.data.keyStrings);

//     setKeyStrings({ ...keyStrings, [selectedSource]: "" });

//   } catch (err) {
//     console.error("Error saving key string:", err);
//     alert("Failed to save key string");
//   }
// };


export const handleNonPatentDeleteSlice = async (id, _id, relatedDelete) => {
  try {
    const response = await urlSocket.delete(`/live/projectname/delete-npl/${id}/${_id}`,
      {
        data: { relatedDelete } ,
        headers: { "Content-Type": "application/json" }
      }
    );
    return response;
  } catch (error) {
    console.error("Error deleting NPL:", error);
    throw error;
  }
};





export const handleTranslateText = async (text) => {
  if (!text) {
    return "";
  }

  try {
    const url = `${LINGVA_BASE_URL}/auto/en/${encodeURIComponent(text)}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error translating text:", error);
    throw error;
  }
};



export const nplReusableDataFetch = async ({
  nplPatentFormData,
  setError,
  doiNumber,
  handleCrossrefSuccess,
  endpoint,
  queryParam,
  onSuccess,
  loadingSetter
}) => {

  if (!queryParam) return;

  try {
    setError("");
    const response = await axios.get(
      `http://localhost:8080/live/projectname/${endpoint}/${encodeURIComponent(queryParam)}`
    );

    const data = response.data.data;
    if (data) loadingSetter(false);
    if (onSuccess) onSuccess(data);
  } catch (err) {
    console.error("Fetch error:", err);
    setError("Failed to fetch data. Please check input.");
  }

  // const doiNumber = (nplPatentFormData["nplDoi"] || "").trim();
  // if (!doiNumber) return;
  // try {
  //   setError("");
  //   const response = await axios.get(
  //     `http://localhost:8080/live/projectname/nplcorssref/${encodeURIComponent(doiNumber)}`
  //   );
  //   const data = response.data.data;
  //   if (handleCrossrefSuccess) handleCrossrefSuccess(data);
  // } catch (err) {
  //   setError("Failed to fetch data. Please check DOI.");
  // }
};

export const bulkBiblioTRanlsation = async (text) => {
  try {
    const response = await urlSocket.post("/translation/bulk", {
      text: text,
    });

    return response.data.translated || text;
  } catch (err) {
    console.error("Translation fetch error:", err);
    return text;
  }
};





















export const { setPatentData, setEspaceApiData, setBulkESPData, resetPatentData, setGoogleApiData, setLensOrgApiData, setFreePatentApiData,
  setPatentLoading, setLensPageUrl, setFetchESPData, setESPData, setFetchLegalStatus, setClassifyData, setChatBoxData,
  setGooglePatentData, setReleventBiblioGoogleData, setRelatedBiblioGoogleData, setFullReportData, setReportRowData,
  
  // LIVE STATE EXPORT
  setLiveEpoRelevantData, setLiveEpoRelatedData, setLiveGoogleRelevantData, setLiveGoogleRelatedData, setRelevantApiTrue, setRelatedApiTrue,
  setMultiRelated, setSingleProject, 
} = patentSlice.actions;
export default patentSlice.reducer;
