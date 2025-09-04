import axios from "axios";

export const dataAvailability_1 =
    "Documents from non-English countries was restricted to the availability of the text in free and commercial databases (most of the cases only Title and Abstract are available in English)";

export const dataAvailability_2 =
    "Search was performed with English keywords and their synonyms. Any language other than English such as French, Korean, and Chinese was not considered for the key string.";

export const appendix2_Patents = "Orbit, Google Patent, Espacenet, USPTO, etc.";

export const appendi2_Npl = "General Google search, Google Scholar, Science direct, ASME, IEEE, Springer, etc.";

export const Additional_Search_Text = "Semantic Search,Similarity Search,Backward & Forward Citations";

export const normalizeField = (val) => {
    if (Array.isArray(val)) {
        return val.join(", ");
    }
    if (val === null || val === undefined) {
        return "";
    }
    return String(val);
};

// Appendix2.js
// API call for Appendix2 - Patents
export const saveAppendix2Patents = async (id, appendix2Patents) => {
    if (!appendix2Patents) return;

    try {
        const response = await axios.post(
            `http://localhost:8080/live/projectname/update-appendix2-patents/${id}`,
            { patents: appendix2Patents },
            { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
        }
    } catch (err) {
        console.error("❌ Error saving Appendix 2 - Patents:", err);
    }
};

//API call for Appendix2 - NPL
export const saveAppendix2NPL = async (id, appendix2NPL) => {
    if (!appendix2NPL) return;

    try {
        const response = await axios.post(
            `http://localhost:8080/live/projectname/update-appendix2-npl/${id}`,
            { nonPatentLiterature: appendix2NPL },
            { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
        }
    } catch (err) {
        console.error("❌ Error saving Appendix 2 - NPL:", err);
    }
};

// Appendix1.js
// Data Availability API Call
export const staticSaveDataAvailability = async (
    id,
    dataAvailableText,
    setDataAvailability,
    setDataAvailabilityValue
) => {
    try {
        const response = await axios.post(
            `http://localhost:8080/live/projectname/add-data-availability/${id}`,
            { dataAvailableText: dataAvailableText },
            { headers: { "Content-Type": "application/json" } }
        );

        const appendixData = response.data.stages.appendix1[0]?.dataAvailability;
        setDataAvailabilityValue(appendixData);
        setDataAvailability("");
    } catch (err) {
        console.error("Error saving dataAvailability:", err);
    }
};

// Additional Search api call 
export const handleSaveKeyStringAdditional = async ({
    id,
    keyStringAdditional,
    setKeyStringsAdditionalList,
    setKeyStringAdditional
}) => {

    try {
        const response = await axios.post(
            `http://localhost:8080/live/projectname/add-key-string-additional/${id}`, { keyStringsAdditionalText: keyStringAdditional },
            { headers: { "Content-Type": "application/json" } }

        );
        const appendixData = response.data.stages.appendix1[0]?.keyStringsAdditional;
        setKeyStringsAdditionalList(appendixData);
        setKeyStringAdditional("");
    } catch (err) {
        console.error("Error saving Additional:", err);
    }
};

// initiall keystrings database name
export const updateKeyStrings = async (projectId) => {
    console.log('projectId', projectId)
  try {
    const response = await axios.post(`http://localhost:8080/live/projectname/${projectId}/init-databases`);
    return response.data;
  } catch (error) {
    console.error("Error updating keyStrings:", error.response?.data || error.message);
    throw error;
  }
};
