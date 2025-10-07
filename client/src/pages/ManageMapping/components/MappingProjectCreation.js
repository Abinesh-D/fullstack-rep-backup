import React, { useState, useEffect, useMemo } from "react";
import {
    Card, CardBody, Col, Container, NavItem, NavLink, Row, TabContent, TabPane,
} from "reactstrap";
import classnames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
    GOOGLE_API_DATA, EPO_API_DATA, fetchProjects, fetchPublicationDetails, fetchProjectById, setRelevantApiTrue, setRelatedApiTrue,
    fetchRelatedReferences,
    setSingleProject,
    handleNonPatentDeleteSlice,
} from "../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice";
import { FaFileWord } from "react-icons/fa";
import axios from "axios";
import RelevantRefComponent from "./ChildComponent/RelevantRefComponent";
import IntroductionTab from "./ChildComponent/IntroductionTab ";
import RelatedRefComponent from "./ChildComponent/RelatedrefComponent";
import Appendix1 from "./ChildComponent/Appendix1";
import Appendix2 from "./ChildComponent/Appendix2";
import { handleWordReportDownload } from "../ReusableComponents/handleWordReportDownload";
import DeleteModal from "../ReusableComponents/ResuableDeleteComp";
import usePatentData from "../ReusableFunctionsLogic/usePatentData";


const MappingProjectCreation = () => {
    document.title = "Project Form | MCRPL";
    const id = sessionStorage.getItem("_id");
    const reportData = JSON.parse(sessionStorage.getItem("reportData"));

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const data = useSelector(state => state.patentSlice.liveEpoRelevantData);
    const relatedData = useSelector(state => state.patentSlice.liveEpoRelatedData);

    const fullReportData = useSelector(state => state.patentSlice.fullReportData);
    const introduction = fullReportData.filter(fil => fil._id === id)[0]?.stages?.introduction || [];

    const releventBiblioGoogleData = useSelector(state => state.patentSlice.liveGoogleRelevantData);
    const relatedBiblioGoogleData = useSelector(state => state.patentSlice.liveGoogleRelatedData);


    // Control screen here
    const [activeTab, setactiveTab] = useState(1);
    const [passedSteps, setPassedSteps] = useState([1]);

    const [relevantForm, setRelevantForm] = useState({
        patentNumber: '',
        publicationUrl: '',
        googlePublicationUrl: '',
        title: '',
        abstract: '',
        filingDate: '',
        assignee: '',
        grantDate: '',
        inventors: '',
        priorityDate: '',
        classifications: '',

        ipcClassifications: '',
        cpcClassifications: '',
        
        usClassification: '',
        familyMembers: '',
        analystComments: '',
        relevantExcerpts: ''
    });

    const [relevantRefSaved, setRelevantRefSaved] = useState(false);

    const resetRelevantForm = () => {
        setRelevantForm({
            patentNumber: '',
            publicationUrl: '',
            googlePublicationUrl: '',
            title: '',
            abstract: '',
            filingDate: '',
            assignee: '',
            grantDate: '',
            inventors: '',
            priorityDate: '',
            classifications: '',

            ipcClassifications: '',
            cpcClassifications: '',

            usClassification: '',
            familyMembers: '',
            analystComments: '',
            relevantExcerpts: ''
        });
    };

    const [loading, setLoading] = useState(false);
    const [relatedLoading, setRelatedLoading] = useState(false);

    const [errorValidation, setErrorValidation] = useState(false);
    const [relatedErrorValidation, setRelatedErrorValidation] = useState(false);

    const [overallSummary, setOverallSummary] = useState("");
    const [summarySaved, setSummarySaved] = useState(false);

    const [baseSearchTerm, setBaseSearchTerm] = useState("");
    const [baseSearchTermsList, setBaseSearchTermsList] = useState([]);

    const [relevantWords, setRelevantWords] = useState("");
    const [relevantWordsList, setRelevantWordsList] = useState([]);
    const [findLoading, setFindLoading] = useState(false);

    const [relevantAndNplUpdatedData, setRelevantAndNplUpdatedData] = useState([]);
    const [relatedAndNplCombined, setRelatedAndNplCombined] = useState([]);

    const [appendix1KeyStringsLevelValue, setAppendix1KeyStringsLevelValue] = useState([]);

    const [keyString, setKeyString] = useState("");
    const [keyStringsList, setKeyStringsList] = useState([]);

    const [keyStringNpl, setKeyStringNpl] = useState("");
    const [keyStringsNplList, setKeyStringsNplList] = useState("");

    const [keyStringAdditional, setKeyStringAdditional] = useState("");
    const [keyStringsAdditionalList, setKeyStringsAdditionalList] = useState("");

    const [dataAvailability, setDataAvailability] = useState("")
    const [dataAvailabilityValue, setDataAvailabilityValue] = useState([]);

    const [appendix2Patents, setAppendix2Patents] = useState([]);
    const [appendix2PatentsSaved, setAppendix2PatentsSaved] = useState("");

    const [appendix2NPL, setAppendix2NPL] = useState("");
    const [appendix2NPLSaved, setAppendix2NPLSaved] = useState("");

    const [projectFormData, setProjectFormData] = useState({
        projectTitle: '',
        projectSubTitle: '',
        projectId: "",
        searchFeatures: "",
        textEditor: "",
        executiveSummaryTotalColumn: "",
        // projectImageUrl: [],
    });

    // Relevant References - Non Patent Literature
    const [nplPatentFormData, setNplPatentFormData] = useState({
        nplDoi: "",
        nplTitle: "",
        url: "",
        nplPublicationDate: "",
        nplPublicationUrl: "",
        comments: "",
        excerpts: "",
    });

    const nonPatentLiteratureForm = () => {
        setNplPatentFormData({
            nplDoi: "",
            nplTitle: "",
            url: "",
            nplPublicationDate: "",
            nplPublicationUrl: "",
            comments: "",
            excerpts: "",
        });
    }

    // Related References - Non Patent Literature
    const [nplPublicationFormData, setNplPublicationFormData] = useState({
        nplDoi: "",
        nplTitle: "",
        url: "",
        nplPublicationDate: "",
        nplPublicationUrl: "",
        comments: "",
        excerpts: "",
    });

    const nonPublicationLiteratureForm = () => {
        setNplPublicationFormData({
            nplDoi: "",
            nplTitle: "",
            url: "",
            nplPublicationDate: "",
            nplPublicationUrl: "",
            comments: "",
            excerpts: "",
        });
    }

    const [nonPatentFormData, setNonPatentFormData] = useState([]);
    const [nonPublicationFormData, setNonPublicationFormData] = useState([]);

    const [relevantFormData, setrelevantFormData] = useState([]);
    const [relatedFormData, setRelatedFormData] = useState([]);

    const [relatedForm, setRelatedForm] = useState({
        publicationNumber: "",
        relatedPublicationUrl: "",
        relatedTitle: "",
        relatedAssignee: "",
        relatedInventor: "",
        relatedPublicationDate: "",
        relatedFamilyMembers: "",
        relatedPriorityDate: ""
    })

    const [relatedRefSaved, setRelatedRefSaved] = useState(false);

    const resetRelatedForm = () => {
        setRelatedForm({
            publicationNumber: "",
            relatedPublicationUrl: "",
            relatedTitle: "",
            relatedAssignee: "",
            relatedInventor: "",
            relatedPublicationDate: "",
            relatedFamilyMembers: "",
            relatedPriorityDate: ""
        })
    }


    const [selectedRow, setSelectedRow] = useState(null);

    const [selectedRows, setSelectedRows] = useState([]);

    const [activeModal, setActiveModal] = useState(null);

    const onDeleteClick = (rowData) => {
        setSelectedRow(rowData);
        setActiveModal("publication");
    };

    const onNplDeleteClick = (rowData) => {
        setSelectedRow(rowData);
        setActiveModal("nonPatent");
    };

    const onNplPublicationDeleteClick = (rowData) => {
        setSelectedRow(rowData);
        setActiveModal("nonPublication");
    }

    const onRelatedDelete = (rowData) => {
        setSelectedRow(rowData);
        console.log('rowData', rowData)
        setActiveModal("relatedReference");
    }

    const onSearchTermDelete = (rowData) => {
        setSelectedRow(rowData);
        setActiveModal("searchTerm");
    }

    const onKeyStringsDelete = (rowData) => {
        setSelectedRow(rowData);
        setActiveModal("keyString");
    }

    const onKeyStringsNplDelete = (rowData) => {
        setSelectedRow(rowData);
        setActiveModal("keyStringNpl");
    }
    const onKeyStringsAdditionalDelete = (rowData) => {
        setSelectedRow(rowData);
        setActiveModal("keyStringAdditional");
    }

    const onDataAvailabilityDelete = (rowData) => {
        setSelectedRow(rowData);
        setActiveModal("dataAvailability");
    }
      const onSourceDeleted = (rowData) => {
        setSelectedRow(rowData);
        setActiveModal("keyStringsLevel");
    }

    const onRelevantWordsDelete = (rowData) => {
        setSelectedRow(rowData);
        setActiveModal("relevantWords");
    }


    const handleRelatedReferenceDelete = async () => {

        try {
            const relatedIds = selectedRow?._id ? selectedRow._id : selectedRows;

            if (!relatedIds || (Array.isArray(relatedIds) && relatedIds.length === 0)) {
                console.warn("No rows selected for deletion");
                return;
            }

            const response = await axios.delete(
                `http://localhost:8080/live/projectname/delete-related/${id}`,
                {
                    data: { relatedIds },
                }
            );

            if (response.status === 200) {
                const updatedRelatedRef = response.data.stages.relatedReferences.publicationDetails || [];
                setRelatedFormData(updatedRelatedRef);
                setSelectedRows([]);
            }
        } catch (error) {
            console.error("Error deleting related reference(s):", error);
        } finally {
            setActiveModal(null);
            setSelectedRow(null);
        }
    };




    const handleAddSearchTerms = async () => {
        if (!baseSearchTerm.trim() || !relevantWords.trim()) {
            alert("Please fill both Key Word and Relevant Words before adding.");
            return;
        }
        const keyWordsData = {
            baseSearchTerm,
            relevantWords
        }
        try {
            const response = await axios.post(
                `http://localhost:8080/live/projectname/add-keywordslist-term/${id}`, { searchTermText: keyWordsData },
                { headers: { "Content-Type": "application/json" } }
            );

            const updatedBaseSearchTerms = response.data.stages.appendix1[0]?.baseSearchTerms || [];
            setRelevantWordsList(updatedBaseSearchTerms);
            setBaseSearchTerm("");
            setRelevantWords("");
        } catch (err) {
            console.error("Error saving Base Search Term:", err);
        }
    };

    const handleFindRelevantWord = async () => {
        if (!baseSearchTerm.trim()) {
            alert("Please enter a search term.");
            return;
        }
        setFindLoading(true);

        try {
            const encodedTerm = encodeURIComponent(baseSearchTerm.trim());
            const response = await fetch(`https://api.datamuse.com/words?ml=${encodedTerm}&max=10`);

            if (!response.ok) {
                throw new Error("API request failed");
            }

            const data = await response.json();
            const words = data.map(item => item.word).join(", ");
            setRelevantWords(words || "No relevant words found.");
        } catch (error) {
            console.error("Error fetching relevant words:", error);
            setRelevantWords("Error fetching relevant words.");
        } finally {
            setFindLoading(false);
        }
    };

    const handleNonPatentDelete = async (relatedDelete) => {
        console.log('relatedDelete', relatedDelete)
        try {
            const response = await handleNonPatentDeleteSlice(id, selectedRow._id, relatedDelete);
            console.log('response.data', response.data)
            if (response.status === 200) {
                const updatedNPLs = response.data.deletedNpls;

                if (response.data.type) {
                    setNonPublicationFormData(updatedNPLs);
                } else {
                    setNonPatentFormData(updatedNPLs);
                }
            }
        } catch (error) {
            console.error("Error deleting NPL:", error);
        } finally {
            setActiveModal(null);
            setSelectedRow(null);
        }
    };


    // const handleNonPatentDelete = async () => {
    //     try {
    //         const response = await axios.delete(
    //             `http://localhost:8080/live/projectname/delete-npl/${id}/${selectedRow._id}`
    //         );

    //         if (response.status === 200) {
    //             const updatedNPLs = response.data.stages.relevantReferences.nonPatentLiteratures;
    //             setNonPatentFormData(updatedNPLs);
    //         }
    //     } catch (error) {
    //         console.error("Error deleting NPL:", error);
    //     } finally {
    //         setActiveModal(null);
    //         setSelectedRow(null);
    //     }
    // };

    const handlePublicationDelete = async () => {
        if (!selectedRow) return;

        const documentId = id;
        const publicationId = selectedRow._id;

        try {
            const response = await axios.delete(
                `http://localhost:8080/live/projectname/delete-publication/${documentId}/${selectedRow._id}`
            );

            if (response.status === 200) {

                setrelevantFormData(prev =>
                    prev.filter(item => item._id !== publicationId)
                );
            }
        } catch (error) {
            console.error("Error deleting publication detail:", error);
        } finally {
            setActiveModal(null);
            setSelectedRow(null);
        }
    };



    useEffect(() => {
        const getPublicationDetails = async () => {
            const response = await fetchPublicationDetails(id);
            setrelevantFormData(response);
        };
        const getRelatedData = async () => {
            const response = await fetchRelatedReferences(id);
            setRelatedFormData(response);
        }

        getPublicationDetails();
        getRelatedData();

    }, [id]);




    useEffect(() => {
        const getProject = async () => {
            try {
                const singleProject = await fetchProjectById(id);
                if (singleProject) {
                    dispatch(setSingleProject(singleProject));
                    setProjectFormData({
                        projectTitle: singleProject.stages.introduction?.[0]?.projectTitle || "",
                        projectSubTitle: singleProject.stages.introduction?.[0]?.projectSubTitle || "",
                        projectId: singleProject.stages.introduction?.[0]?.projectId || "",
                        executiveSummaryTotalColumn: singleProject.stages.introduction?.[0]?.executiveSummaryTotalColumn || "",
                        searchFeatures: singleProject.stages.introduction?.[0]?.searchFeatures || [],
                        textEditor: singleProject.stages.introduction?.[0]?.textEditor || "",
                        // projectImageUrl: singleProject.stages.introduction?.[0]?.projectImageUrl || [],
                    });
                    setRelevantAndNplUpdatedData(singleProject.stages.relevantReferences?.relevantAndNplCombined);
                    setRelatedAndNplCombined(singleProject.stages.relatedReferences?.relatedAndNplCombined);
                    
                    setrelevantFormData(singleProject.stages.relevantReferences?.publicationDetails || []);
                    setNonPatentFormData(singleProject.stages.relevantReferences?.nonPatentLiteratures || []);
                    setNonPublicationFormData(singleProject.stages.relatedReferences?.nonPatentLiteratures || []);
                    setOverallSummary(singleProject.stages.relevantReferences?.overallSummary || "");
                    setBaseSearchTermsList(singleProject.stages.appendix1?.[0]?.baseSearchTerms || []);
                    setRelevantWordsList(singleProject.stages.appendix1?.[0]?.baseSearchTerms || []);
                    setKeyStringsList(singleProject.stages.appendix1?.[0]?.keyStrings || []);
                    setKeyStringsNplList(singleProject.stages.appendix1?.[0]?.keyStringsNpl || []);
                    setKeyStringsAdditionalList(singleProject.stages.appendix1?.[0]?.keyStringsAdditional || []);
                    setDataAvailabilityValue(singleProject.stages.appendix1?.[0]?.dataAvailability || []);

                    setAppendix1KeyStringsLevelValue(singleProject.stages.appendix1?.[0]?.keyStrings || []);

                    setAppendix2Patents(singleProject.stages.appendix2?.[0]?.patents || appendix2Patents);
                    setAppendix2NPL(singleProject.stages.appendix2?.[0]?.nonPatentLiterature || appendix2NPL);
                }
            } catch (error) {
                console.error("Error fetching project data:", error);
            }
        };

        getProject();
    }, []);




    // const onKeyStringsLevelDeletes = async () => {
    //     try {
    //         const response = await axios.delete(
    //             `http://localhost:8080/live/projectname/appendix1/keystring/${id}/${selectedRow.fieldName}/${selectedRow._id}`
    //         );
    //         setAppendix1KeyStringsLevelValue(response.data || []);

    //     } catch (err) {
    //         console.error("Error deleting key string:", err);
    //     }
    // };


    const onKeyStringsLevelDeletes = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/live/projectname/${id}/databases/${selectedRow.parentId}/keystrings/${selectedRow._id}/delete-key-string`
            );
            setKeyStringsList(response.data.allKeyStrings);
        } catch (error) {
            console.error("Error deleting key string:", error);
            alert(error.response?.data?.message || "Failed to delete key string");
        }
    };








    useEffect(() => {
        fetchProjects(dispatch);
    }, []);

    const handleNplChange = (e) => {
        const { id, value } = e.target;
        const key = id.replace("npl-", "");
        setNplPatentFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };
    const handleNplPublicationChange = (e) => {
        const { id, value } = e.target;
        const key = id.replace("npl-", "");
        setNplPublicationFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };



    const handleSaveBaseSearchTerm = async () => {
        if (!baseSearchTerm.trim()) return;

        try {
            const response = await axios.post(
                `http://localhost:8080/live/projectname/add-base-search-term/${id}`, { searchTermText: baseSearchTerm },
                { headers: { "Content-Type": "application/json" } }
            );

            const updatedBaseSearchTerms = response.data.stages.appendix1[0]?.baseSearchTerms || [];
            setBaseSearchTermsList(updatedBaseSearchTerms);
            setBaseSearchTerm("");
        } catch (err) {
            console.error("Error saving Base Search Term:", err);

            if (err.response) {
                console.error("Server responded with:", err.response.data);
            } else if (err.request) {
                console.error("No response received:", err.request);
            } else {
                console.error("Error setting up request:", err.message);
            }
        }
    };

    const handleRelevantWordsDelete = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/live/projectname/delete-keywordslist-term/${id}/${selectedRow._id}`
            );

            if (response.status === 200) {
                setRelevantWordsList(response.data.stages.appendix1[0].baseSearchTerms);
            }
        } catch (err) {
            console.error("Error deleting Base Search Term:", err);
        } finally {
            setActiveModal(null);
            setSelectedRow(null);
        }
    };

    const handleSearchTermDelete = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/live/projectname/delete-base-search-term/${id}/${selectedRow._id}`
            );

            if (response.status === 200) {
                setBaseSearchTermsList(response.data.stages.appendix1[0].baseSearchTerms);
            }
        } catch (err) {
            console.error("Error deleting Base Search Term:", err);
        } finally {
            setActiveModal(null);
            setSelectedRow(null);
        }
    };

    // const handleSaveKeyString = async () => {
    //     if (!keyString.trim()) return;

    //     try {
    //         const response = await axios.post(
    //             `http://localhost:8080/live/projectname/add-key-string/${id}`, { keyStringsText: keyString },
    //             { headers: { "Content-Type": "application/json" } }

    //         );

    //         const appendixData = response.data.stages.appendix1[0]?.keyStrings;
    //         setKeyStringsList(appendixData);
    //         setKeyString("");
    //     } catch (err) {
    //         console.error("Error saving Key String:", err);
    //     }
    // };

    // const handleDeleteKeyString = async () => {
    //     try {
    //         const response = await axios.delete(
    //             `http://localhost:8080/live/projectname/delete-key-string/${id}/${selectedRow._id}`
    //         );

    //         if (response.status === 200) {
    //             setKeyStringsList(response.data.stages.appendix1[0].keyStrings);

    //         }
    //     } catch (err) {
    //         console.error("Error deleting Key String:", err);
    //     } finally {
    //         setActiveModal(null);
    //         setSelectedRow(null);
    //     }
    // };


    const onRelatedAndNplDelete = async ()=> {
        try {
            
        } catch (error) {
            
        }
    }

    const handleSaveKeyStringNpl = async () => {
        if (!keyStringNpl.trim()) return;

        try {
            const response = await axios.post(
                `http://localhost:8080/live/projectname/add-key-string-npl/${id}`, { keyStringsNplText: keyStringNpl },
                { headers: { "Content-Type": "application/json" } }

            );

            const appendixData = response.data.stages.appendix1[0]?.keyStringsNpl;
            setKeyStringsNplList(appendixData);
            setKeyStringNpl("");
        } catch (err) {
            console.error("Error saving Key String:", err);
        }
    };

    const handleDeleteKeyStringNpl = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/live/projectname/delete-key-string-npl/${id}/${selectedRow._id}`
            );

            if (response.status === 200) {
                setKeyStringsNplList(response.data.stages.appendix1[0].keyStringsNpl);

            }
        } catch (err) {
            console.error("Error deleting Key String Npl:", err);
        } finally {
            setActiveModal(null);
            setSelectedRow(null);
        }
    };

    const handleSaveKeyStringAdditional = async () => {
        if (!keyStringAdditional.trim()) return;

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

    const handleDeleteKeyStringAdditional = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/live/projectname/delete-key-string-additional/${id}/${selectedRow._id}`
            );

            if (response.status === 200) {
                setKeyStringsAdditionalList(response.data.stages.appendix1[0].keyStringsAdditional);

            }
        } catch (err) {
            console.error("Error deleting Additional Key String:", err);
        } finally {
            setActiveModal(null);
            setSelectedRow(null);
        }
    };

    const handleSaveDataAvailability = async () => {
        if (!dataAvailability.trim()) return;

        try {
            const response = await axios.post(
                `http://localhost:8080/live/projectname/add-data-availability/${id}`, { dataAvailableText: dataAvailability },
                { headers: { "Content-Type": "application/json" } }

            );

            const appendixData = response.data.stages.appendix1[0]?.dataAvailability;
            setDataAvailabilityValue(appendixData);
            setDataAvailability("");
        } catch (err) {
            console.error("Error saving dataAvailability:", err);
        }
    };

    const handleDeleteDataAvailability = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/live/projectname/delete-data-availability/${id}/${selectedRow._id}`
            );

            if (response.status === 200) {
                setDataAvailabilityValue(response.data.stages.appendix1[0].dataAvailability);

            }
        } catch (err) {
            console.error("Error deleting dataAvailability:", err);
        } finally {
            setActiveModal(null);
            setSelectedRow(null);
        }
    };


    const handleProjectChange = (e) => {
        const { name, value } = e.target;
        setProjectFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };



    const handleRelatedInputChange = (e) => {
        const { id, value } = e.target;
        const key = id.replace("related-", "");
        setRelatedForm((prev) => ({
            ...prev,
            [key]: value
        }));
    };


   
    const handleSaveAppendix2Patents = async () => {
        if (!appendix2Patents) return;

        try {
            const response = await axios.post(
                `http://localhost:8080/live/projectname/update-appendix2-patents/${id}`,
                { patents: appendix2Patents },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200) {
                setAppendix2Patents(response.data.stages.appendix2[0].patents);
                setAppendix2PatentsSaved(true);
                setTimeout(() => setAppendix2PatentsSaved(false), 2000);
            }
        } catch (err) {
            console.error("Error saving Appendix 2 - Patents:", err);
        }
    };

    const handleSaveAppendix2NPL = async () => {
        if (!appendix2NPL) return;

        try {
            const response = await axios.post(
                `http://localhost:8080/live/projectname/update-appendix2-npl/${id}`,
                { nonPatentLiterature: appendix2NPL },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200) {
                setAppendix2NPL(response.data.stages.appendix2[0].nonPatentLiterature);
                setAppendix2NPLSaved(true);
                setTimeout(() => setAppendix2NPLSaved(false), 2000);
            }
        } catch (err) {
            console.error("Error saving Appendix 2 - NPL:", err);
        }
    };


    // ------------------ Relevant -------------------------

    const handleFetchPatentData = async () => {
        const trimmedNumber = relevantForm.patentNumber.trim();
        setLoading(true);
        setErrorValidation(false);
        try {
            await EPO_API_DATA(trimmedNumber, dispatch, 'relevant');
        } catch (error) {
            // setErrorValidation(true);
            // setRelevantForm({ publicationUrl: "" });

            try {
                // setErrorValidation(false);
                await GOOGLE_API_DATA(trimmedNumber, dispatch, 'relevant');

            } catch (googleError) {
                setErrorValidation(true);
                console.error("Google fallback failed:", googleError);
            }

            console.error("Espacenet fetch error:", error);
        } finally {
            setLoading(false);
        }
    };



    // const { title, publicationUrl, googlePublicationUrl, abstractData, aplDate, pubDate, priorityDates, inventorNames, applicantNames,
    //     classData, familyMemData, formattedDescriptions, ipcClass, cpcClass, classificationsSymbol 
    // } = usePatentData(data, "relevant", relevantForm.patentNumber);



    





    useEffect(() => {
        const isAnyMissing = [
            data.inventorNames,
            data.title,
            data.applicantNames,
            data.pubDate,
            data.aplDate,
            data.priorityDates,
            data.classData,
            // data.familyMemData,
            data.abstractData,
            // data.filteredDescriptions
        ].some(
            (val) =>
                val === undefined ||
                val === null ||
                (typeof val === 'string' && val.trim() === '') ||
                (Array.isArray(val) && val.length === 0)
        );

        if (data.biblio && isAnyMissing) {
            (async () => {
                try {
                    setErrorValidation(false);
                    await GOOGLE_API_DATA(relevantForm.patentNumber.trim(), dispatch, 'relevant');
                } catch (googleError) {
                    setErrorValidation(true);
                    console.error('Google fallback failed:', googleError);
                }
            })();
        }
    }, [
        data.inventorNames,
        data.title,
        data.applicantNames,
        data.pubDate,
        data.aplDate,
        data.priorityDates,
        data.classData,
        // data.familyMemData,
        data.abstractData,
        // data.filteredDescriptions
    ]);

    const googleClassCPC = releventBiblioGoogleData.classifications?.map(map => map.leafCode).join(', ');


    // -------------------------- Related --------------------------



    const handleRelatedFetchPatentData = async () => {
        const trimmedNumber = relatedForm.publicationNumber?.trim();
        setRelatedLoading(true);
        try {
            await EPO_API_DATA(trimmedNumber, dispatch, 'related');
        } catch (error) {
            setRelatedErrorValidation(true);
            setRelatedForm({ relatedPublicationUrl: "" });

            try {
                setRelatedErrorValidation(false);
                await GOOGLE_API_DATA(trimmedNumber, dispatch, 'related');
            } catch (googleError) {
                setRelatedErrorValidation(true);
                console.error("Google fallback related failed:", googleError);
            }

            console.error("Espacenet fetch error:", error);
        } finally {
            setRelatedLoading(false);
        }
    };

    // const relatedData = usePatentData(relatedData, "related");

    useEffect(() => {
        const isAnyMissing = [
            // assigneeAndInventorsName,
            // memoInventionTitle,
            // relatedFamilyData,
            // memoPubDate,

            relatedData.relatedPublicationUrl,
            relatedData.relatedTitle,
            relatedData.relatedAssignee,
            relatedData.relatedInventor,
            relatedData.relatedPublicationDate,
            relatedData.relatedPriorityDate,
            relatedData.relatedFamilyMembers,

            // applicantNames,
            // aplDate,
            // priorityDates,
            // classData,
            // abstractData,
            // filteredDescriptions
        ].some(
            (val) =>
                val === undefined ||
                val === null ||
                (typeof val === 'string' && val.trim() === '') ||
                (Array.isArray(val) && val.length === 0)
        );

        if (relatedData.biblio && isAnyMissing) {
            (async () => {
                try {
                    setRelatedErrorValidation(false);
                    await GOOGLE_API_DATA(relevantForm.patentNumber.trim(), dispatch, 'related');
                } catch (googleError) {
                    setRelatedErrorValidation(true);
                    console.error('Google fallback failed:', googleError);
                }
            })();
        }
    }, [

        relatedData.relatedPublicationUrl,
        relatedData.relatedTitle,
        relatedData.relatedAssignee,
        relatedData.relatedInventor,
        relatedData.relatedPublicationDate,
        relatedData.relatedPriorityDate,
        relatedData.relatedFamilyMembers,




        // assigneeAndInventorsName,
        // memoInventionTitle,
        // relatedFamilyData,
        // memoPubDate,

        // applicantNames,
        // aplDate,
        // priorityDates,
        // classData,
        // abstractData,
        // filteredDescriptions
    ]);






    useEffect(() => {
        const allFieldsExceptPatentEmpty = Object.entries(relevantForm).every(
            ([key, value]) => key === "patentNumber" || value === ""
        );
        // const cpcArray = data?.cpcClass?.split(",").map(item => item.trim()).filter(Boolean);
        // const ipcArray = data?.ipcClass?.split(",").map(item => item.trim()).filter(Boolean);

        // const filteredCPC = cpcArray?.filter(cpc => !ipcArray.includes(cpc))?.join(', ');
 
        if (
            (data?.patentNumber || releventBiblioGoogleData?.patentNumber) &&
            relevantForm.patentNumber &&
            allFieldsExceptPatentEmpty
        ) {

            const combinedForm = {
                patentNumber: relevantForm.patentNumber.trim(),

                publicationUrl:
                    data.publicationUrl ||
                    releventBiblioGoogleData?.pageUrl ||
                    "",
                googlePublicationUrl:
                    data.googlePublicationUrl ||
                    releventBiblioGoogleData?.pageUrl ||
                    "",

                title:
                    data.title ||
                    releventBiblioGoogleData?.title?.trim() ||
                    "",

                abstract:
                    data.abstractData?.trim() ||
                    releventBiblioGoogleData?.abstract?.trim() ||
                    "",

                filingDate:
                    data.aplDate ||
                    releventBiblioGoogleData?.applicationDate ||
                    "",

                grantDate:
                    data.pubDate ||
                    releventBiblioGoogleData?.publicationDate ||
                    "",

                priorityDate:
                    data.priorityDates ||
                    releventBiblioGoogleData?.priorityDate ||
                    "",

                assignee: (data.applicantNames ||
                    releventBiblioGoogleData?.assignees ||
                    "")
                    .split(";")
                    .map(a => a.trim())
                    .filter(Boolean)
                    .join("; "),

                inventors: typeof (data.inventorNames || releventBiblioGoogleData?.inventors) === "string"
                    ? (data.inventorNames || releventBiblioGoogleData?.inventors)
                        .split(",")
                        .map(i => i.trim())
                        .filter(Boolean)
                        .join("; ")
                    : [],

                ipcClassifications: (
                    data?.ipcClass ||
                    googleClassCPC ||
                    "")
                    .split(",")
                    .map(c => c.trim())
                    .filter(Boolean),

                cpcClassifications: (
                    data?.finalCPC ||
                    googleClassCPC ||
                    "")
                    .split(",")
                    .map(c => c.trim())
                    .filter(Boolean),

                usClassification: (data?.classData?.US_Classification ||
                    releventBiblioGoogleData?.usClassification ||
                    "")
                    .split(",")
                    .map(u => u.trim())
                    .filter(Boolean),

                familyMembers: (data?.familyMemData || [])
                    .map(f => f.familyPatent)
                    .filter(Boolean)
                    .map(f => f.trim())
                    .join("; "),

                analystComments: relevantForm.analystComments || "",
                relevantExcerpts: relevantForm.relevantExcerpts || ""
            };

            setRelevantForm(combinedForm);
        }
    }, [data, releventBiblioGoogleData]);


        //  useEffect(() => {
        //    const allFieldsExceptPatentEmpty = Object.entries(
        //      relevantForm
        //    ).every(([key, value]) => key === "patentNumber" || value === "");

        //    if (
        //      (data?.patentNumber || releventBiblioGoogleData?.patentNumber) &&
        //      relevantForm.patentNumber &&
        //      allFieldsExceptPatentEmpty
        //    ) {
        //      console.log(
        //        "✅ Populating relevantForm from bibliographic sources..."
        //      );

        //      const combinedForm = {
        //        patentNumber: relevantForm.patentNumber.trim(),

        //        publicationUrl:
        //          publicationUrl || releventBiblioGoogleData?.pageUrl || "",
        //        googlePublicationUrl:
        //          googlePublicationUrl ||
        //          releventBiblioGoogleData?.pageUrl ||
        //          "",

        //        title: title || releventBiblioGoogleData?.title?.trim() || "",

        //        abstract:
        //          abstractData?.trim() ||
        //          releventBiblioGoogleData?.abstract?.trim() ||
        //          "",

        //        filingDate:
        //          aplDate || releventBiblioGoogleData?.applicationDate || "",

        //        grantDate:
        //          pubDate || releventBiblioGoogleData?.publicationDate || "",

        //        priorityDate:
        //          priorityDates || releventBiblioGoogleData?.priorityDate || "",

        //        assignee: (
        //          applicantNames ||
        //          releventBiblioGoogleData?.assignees ||
        //          ""
        //        )
        //          .split(",")
        //          .map((a) => a.trim())
        //          .filter(Boolean),

        //        inventors:
        //          typeof (
        //            inventorNames || releventBiblioGoogleData?.inventors
        //          ) === "string"
        //            ? (inventorNames || releventBiblioGoogleData?.inventors)
        //                .split(";")
        //                .map((i) => i.trim())
        //                .filter(Boolean)
        //            : [],

        //        classifications: (classificationsSymbol || googleClassCPC || "")
        //          .split(",")
        //          .map((c) => c.trim())
        //          .filter(Boolean),

        //        ipcClassifications: (ipcClass || googleClassCPC || "")
        //          .split(",")
        //          .map((c) => c.trim())
        //          .filter(Boolean),

        //        cpcClassifications: (cpcClass || googleClassCPC || "")
        //          .split(",")
        //          .map((c) => c.trim())
        //          .filter(Boolean),

        //        usClassification: (
        //          classData?.US_Classification ||
        //          releventBiblioGoogleData?.usClassification ||
        //          ""
        //        )
        //          .split(",")
        //          .map((u) => u.trim())
        //          .filter(Boolean),

        //        familyMembers: (familyMemData || "")
        //          .split(",")
        //          .map((f) => f.trim())
        //          .filter(Boolean),

        //        analystComments: relevantForm.analystComments || "",
        //        relevantExcerpts: relevantForm.relevantExcerpts || "",
        //      };

        //      setRelevantForm(combinedForm);
        //    }
        //  }, [data, releventBiblioGoogleData]);



    useEffect(() => {
        const allFieldsExceptPatentEmpty = Object.entries(relatedForm).every(
            ([key, value]) => key === "publicationNumber" || value === ""
        );

        if (
            (relatedData?.publicationNumber || releventBiblioGoogleData?.publicationNumber) &&
            relatedForm.publicationNumber && allFieldsExceptPatentEmpty
        ) {
            const combinedForm = {
                publicationNumber: relatedData.publicationNumber,

                relatedPublicationUrl:
                    relatedData.relatedPublicationUrl ||
                    relatedBiblioGoogleData?.pageUrl ||
                    "",

                relatedTitle:
                    relatedData.relatedTitle ||
                    relatedBiblioGoogleData?.title?.trim() ||
                    "",

                relatedPublicationDate:
                    relatedData.relatedPublicationDate ||
                    relatedBiblioGoogleData?.publicationDate ||
                    "",

                relatedAssignee: (relatedData.relatedAssignee ||
                    relatedBiblioGoogleData?.assignees ||
                    ""
                )
                    .split(",")
                    .map(a => a.trim())
                    .filter(Boolean),

                relatedInventor: (relatedData.relatedInventor ||
                    relatedBiblioGoogleData?.inventors ||
                    "")
                    .split(";")
                    .map(i => i.trim())
                    .filter(Boolean),


                relatedFamilyMembers: (relatedData.relatedFamilyMembers || "")
                    .map(f => f.familyPatent.trim())
                    .filter(Boolean)
                    .join("; "),

                relatedPriorityDate: (relatedData.relatedPriorityDate ||
                    relatedBiblioGoogleData.priorityDate || ""
                )
            };

            setRelatedForm(combinedForm);
        }
    }, [relatedData, relatedBiblioGoogleData]);


    const handleRelevantSubmit = async (e) => {
        e.preventDefault();
        if (!relevantForm.patentNumber) return;

        try {
            const response = await axios.post(
                `http://localhost:8080/live/projectname/add-relevant-data/${id}`, relevantForm,
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.status === 200) {
                resetRelevantForm();
                const updatedDetails = response.data.stages.relevantReferences.publicationDetails;
                setrelevantFormData(updatedDetails);
                setRelevantRefSaved(true);
                setTimeout(() => setRelevantRefSaved(false), 2000);
            }

        } catch (error) {
            console.error("Error saving publication detail:", error);
        } finally {
            dispatch(setRelevantApiTrue(false));
        }
    };

    const handleNplSubmit = async (e, relatedSubmit) => {
        e.preventDefault();
        console.log('relatedSubmit', relatedSubmit);
        const nplCommonData = relatedSubmit ? nplPublicationFormData : nplPatentFormData;
        console.log('nplCommonData', nplCommonData)
        if (!nplCommonData.nplTitle.trim()) return;

        try {
            const response = await axios.post(`http://localhost:8080/live/projectname/add-npl/${id}`,
                {
                    nplData: nplCommonData,
                    relatedSubmit: relatedSubmit
                },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log('response.data', response.data);
            if (response.status === 200) {
                const updatedNplData = response.data.updProject;
                if (response.data.type) {
                    setNonPublicationFormData(updatedNplData);
                    nonPublicationLiteratureForm()
                } else {
                    setNonPatentFormData(updatedNplData);
                    nonPatentLiteratureForm();
                }
            }
        } catch (error) {
            console.error("Error saving NPL:", error);
        }
    };

    const handleOverAllSummarySave = async () => {
        const summaryData = {
            overallSummary: overallSummary || "",
        };
        try {
            await axios.post(
                `http://localhost:8080/live/projectname/update-overall-summary/${id}`,
                summaryData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            setSummarySaved(true);
            setTimeout(() => setSummarySaved(false), 2000);
        } catch (error) {
            console.error("Error saving Overall Summary:", error);
            if (error.response) {
                console.error("Server responded with:", error.response.data);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Axios error:", error.message);
            }
        }
    };


    const handleRelevatFormInputChange = (e) => {
        const { id, value } = e.target;
        setRelevantForm(prev => ({
            ...prev,
            [id]: value
        }));
    };



    const handleRelatedSubmit = async (e) => {
        e.preventDefault();
        if (!relatedForm.publicationNumber) return;

        try {
            const response = await axios.post(`http://localhost:8080/live/projectname/add-related/${id}`, relatedForm,
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200) {
                resetRelatedForm();
                setRelatedFormData(response.data.stages.relatedReferences?.publicationDetails || []);
                setRelatedRefSaved(true);
                setTimeout(() => setRelatedRefSaved(false), 2000);
            }
        } catch (error) {
            console.error("Error saving related reference:", error);

            if (error.response) {
                console.error("Server responded with:", error.response.data);
            } else {
                console.error("No response received:", error.request);
            }
        } finally {
            dispatch(setRelatedApiTrue(false));
        }
    };

    const handleReportDownload = async () => {
        try {
            const getProjectValue = await fetchProjectById(id);
            console.log('getProjectValue', getProjectValue);
            handleWordReportDownload({
                introduction: getProjectValue.stages.introduction[0] || [],
                relevantReferences: getProjectValue.stages.relevantReferences || [],
                relatedReferences: getProjectValue.stages.relatedReferences || [],
                appendix1: getProjectValue.stages.appendix1[0] || [],
                appendix2: getProjectValue.stages.appendix2[0] || [],
                projectTypeId: getProjectValue.projectTypeId,
            });
        } catch (error) {
            console.error("Error in handleReportDownload:", error);
        }
    };


    const modalConfig = {
        publication: {
            message: "Are you sure you want to delete this publication?",
            onConfirm: handlePublicationDelete,
        },
        nonPatent: {
            message: "Are you sure you want to delete this Non-Patent?",
            onConfirm: handleNonPatentDelete,
        },
        nonPublication: {
            message: "Are you sure you want to delete this Non-Patent?",
            onConfirm: () => handleNonPatentDelete("relatedTrue"),
        },
        relatedReference: {
            message: "Are you sure you want to delete this Related reference?",
            onConfirm: handleRelatedReferenceDelete,
        },
        searchTerm: {
            message: "Are you sure you want to delete this Search Term Text?",
            onConfirm: handleSearchTermDelete,
        },
        relevantWords: {
            message: "Are you sure you want to delete this Key word and its relevant text?",
            onConfirm: handleRelevantWordsDelete,
        },
        // keyString: {
        //     message: "Are you sure you want to delete this Key String?",
        //     onConfirm: handleDeleteKeyString,
        // },
        keyStringNpl: {
            message: "Are you sure you want to delete this Key String (Npl)?",
            onConfirm: handleDeleteKeyStringNpl,
        },
        keyStringAdditional: {
            message: "Are you sure you want to delete this Additional Key String?",
            onConfirm: handleDeleteKeyStringAdditional,
        },
        dataAvailability: {
            message: "Are you sure you want to delete this Data Availability Value?",
            onConfirm: handleDeleteDataAvailability,
        },
        keyStringsLevel: {
            message: "Are you sure you want to delete this Data keyStringsLevel Value?",
            onConfirm: onKeyStringsLevelDeletes,
        },

    };




    function toggleTab(tab) {
        if (activeTab !== tab) {
            var modifiedSteps = [...passedSteps, tab]
            if (tab >= 1 && tab <= 5) {
                setactiveTab(tab)
                setPassedSteps(modifiedSteps)
            }
        }
    }

    const gotoBack = () => {
        navigate("/manage-mapping");
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Creating Mapping Project" labelName="Back" isBackButtonEnable={true} gotoBack={gotoBack} />
                    <Row >
                        <Col lg="12">
                            <Card>
                                <CardBody style={{position: "relative"}}>

                                    {/* {
                                        reportData && (
                                            <Row>
                                                <Col lg="6">
                                                    <p style={{ fontSize: "10px", color: "#198754", fontWeight: "600", backgroundColor: "#f1fdf7", padding: "8px 12px", borderRadius: "6px", display: "inline-block", }}>
                                                        {reportData.projectName} /-- {reportData.projectType}
                                                    </p>
                                                </Col>
                                                {!relevantFormData.length > 0 && (
                                                    <Col lg="1" style={{ padding: "0 6px" }}>
                                                        <div style={{
                                                            background: "#f3e8ff",
                                                            color: "#6b21a8",
                                                            padding: "4px 8px",
                                                            borderRadius: "4px",
                                                            fontWeight: 600,
                                                            textAlign: "center"
                                                        }}>
                                                            Relevant Ref - {relevantFormData.length}
                                                        </div>
                                                    </Col>
                                                )}

                                                {nonPatentFormData.length > 0 && (
                                                    <Col lg="1" style={{ padding: "0 6px" }}>
                                                        <div style={{
                                                            background: "#fff4e5",
                                                            color: "#d97706",
                                                            padding: "4px 8px",
                                                            borderRadius: "4px",
                                                            fontWeight: 600,
                                                            textAlign: "center"
                                                        }}>
                                                            NPL - {nonPatentFormData.length}
                                                        </div>
                                                    </Col>
                                                )}

                                                {!relatedFormData.length > 0 && (
                                                    <Col lg="1" style={{ padding: "0 6px" }}>
                                                        <div style={{
                                                            background: "#eef2ff",
                                                            color: "#4338ca",
                                                            padding: "4px 8px",
                                                            borderRadius: "4px",
                                                            fontWeight: 600,
                                                            textAlign: "center"
                                                        }}>
                                                            Related Ref - {relatedFormData.length}
                                                        </div>
                                                    </Col>
                                                )}
                                                <Col lg="1" style={{ padding: "0 6px" }}>
                                                    <div style={{
                                                        background: "#f3e8ff",
                                                        color: "#6b21a8",
                                                        padding: "4px 8px",
                                                        borderRadius: "4px",
                                                        fontWeight: 600,
                                                        textAlign: "center"
                                                    }}>
                                                        NPL(Related) - {23}
                                                    </div>
                                                </Col>
                                            </Row>
                                        )
                                    } */}

                                    {
                                        reportData && (
                                            <Row>
                                                <Col lg="4">
                                                    <p
                                                        style={{
                                                            fontSize: "10px",
                                                            color: "#198754",
                                                            fontWeight: "600",
                                                            backgroundColor: "#f1fdf7",
                                                            padding: "8px 12px",
                                                            borderRadius: "6px",
                                                            display: "inline-block",
                                                        }}
                                                    >
                                                        {reportData.projectName} /-- {reportData.projectType}
                                                    </p>
                                                </Col>

                                                {relevantFormData.length > 0 && (
                                                    <Col lg="2" style={{ padding: "0 6px" }}>
                                                        <div
                                                            style={{
                                                                background: "#f3e8ff",
                                                                color: "#6b21a8",
                                                                padding: "4px 8px",
                                                                borderRadius: "4px",
                                                                fontWeight: 600,
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            Relevant Ref - {relevantFormData.length}
                                                        </div>
                                                    </Col>
                                                )}

                                                {nonPatentFormData.length > 0 && (
                                                    <Col lg="2" style={{ padding: "0 6px" }}>
                                                        <div
                                                            style={{
                                                                background: "#fff4e5",
                                                                color: "#d97706",
                                                                padding: "4px 8px",
                                                                borderRadius: "4px",
                                                                fontWeight: 600,
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            NPL(Relevant) - {nonPatentFormData.length}
                                                        </div>
                                                    </Col>
                                                )}

                                                {relatedFormData.length > 0 && (
                                                    <Col lg="2" style={{ padding: "0 6px" }}>
                                                        <div
                                                            style={{
                                                                background: "#eef2ff",
                                                                color: "#4338ca",
                                                                padding: "4px 8px",
                                                                borderRadius: "4px",
                                                                fontWeight: 600,
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            Related Ref - {relatedFormData.length}
                                                        </div>
                                                    </Col>
                                                )}
                                                {
                                                    nonPublicationFormData.length > 0 && (
                                                        <Col lg="2" style={{ padding: "0 6px" }}>
                                                            <div
                                                                style={{
                                                                    background: "#E91E63",
                                                                    color: "#FFFFFF",
                                                                    padding: "4px 8px",
                                                                    borderRadius: "4px",
                                                                    fontWeight: 600,
                                                                    textAlign: "center",
                                                                }}
                                                            >
                                                                NPL(Related) - {nonPublicationFormData.length}
                                                            </div>
                                                        </Col>
                                                    )}
                                            </Row>
                                        )
                                    }

                                    <div className="wizard clearfix">
                                        <div className="steps clearfix">
                                            <ul>
                                                <NavItem
                                                    className={classnames({ current: activeTab === 1 })}
                                                >
                                                    <NavLink
                                                        className={classnames({ current: activeTab === 1 })}
                                                        onClick={() => {
                                                            setactiveTab(1)
                                                        }}
                                                        disabled={!(passedSteps || []).includes(1)}>
                                                        <span className="number">1.</span> Introduction
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem
                                                    className={classnames({ current: activeTab === 2 })}>
                                                    <NavLink
                                                        className={classnames({ active: activeTab === 2 })}
                                                        onClick={() => {
                                                            setactiveTab(2)
                                                        }}
                                                        disabled={!(passedSteps || []).includes(2)}>
                                                        <span className="number">2.</span> Relevant Ref
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem
                                                    className={classnames({ current: activeTab === 3 })}>
                                                    <NavLink
                                                        className={classnames({ active: activeTab === 3 })}
                                                        onClick={() => {
                                                            setactiveTab(3)
                                                        }}
                                                        disabled={!(passedSteps || []).includes(3)}>
                                                        <span className="number">3.</span> Related Ref
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem
                                                    className={classnames({ current: activeTab === 4 })}>
                                                    <NavLink
                                                        className={classnames({ active: activeTab === 4 })}
                                                        onClick={() => {
                                                            setactiveTab(4)
                                                        }}
                                                        disabled={!(passedSteps || []).includes(4)}>
                                                        <span className="number">4.</span> Appendix 1
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem
                                                    className={classnames({ current: activeTab === 5 })}>
                                                    <NavLink
                                                        className={classnames({ active: activeTab === 5 })}
                                                        onClick={() => {
                                                            setactiveTab(5)
                                                        }}
                                                        disabled={!(passedSteps || []).includes(5)}
                                                    >
                                                        <span className="number">5.</span> Appendix 2
                                                    </NavLink>
                                                </NavItem>

                                            </ul>
                                        </div>

                                        <div className="content clearfix">
                                            <TabContent activeTab={activeTab} className="body">
                                                <TabPane tabId={1}>
                                                    <IntroductionTab
                                                        projectFormData={projectFormData}
                                                        introduction={introduction}
                                                        handleProjectChange={handleProjectChange}
                                                        reportData={fullReportData.filter(fil => fil._id === id)}
                                                        id={id}
                                                        setProjectFormData={setProjectFormData}
                                                    />
                                                </TabPane>



                                                <TabPane tabId={2}>
                                                    <RelevantRefComponent
                                                        relevantForm={relevantForm}
                                                        relevantRefSaved={relevantRefSaved}
                                                        handleFetchPatentData={handleFetchPatentData}
                                                        handleRelevantSubmit={handleRelevantSubmit}
                                                        relevantFormData={relevantFormData}
                                                        onDeleteClick={onDeleteClick}
                                                        loading={loading}
                                                        errorValidation={errorValidation}
                                                        setErrorValidation={setErrorValidation}
                                                        handleNplSubmit={handleNplSubmit}
                                                        handleNplChange={handleNplChange}
                                                        onNplDeleteClick={onNplDeleteClick}
                                                        nonPatentFormData={nonPatentFormData}
                                                        nplPatentFormData={nplPatentFormData}
                                                        overallSummary={overallSummary}
                                                        summarySaved={summarySaved}
                                                        setOverallSummary={setOverallSummary}
                                                        handleOverAllSummarySave={handleOverAllSummarySave}
                                                        handleRelevatFormInputChange={handleRelevatFormInputChange}
                                                        resetRelevantForm={resetRelevantForm}
                                                        setrelevantFormData={setrelevantFormData}
                                                        // setRelevantAndNplUpdatedData={handleRelevantAndNplCombinedSubmit}
                                                        relevantAndNplUpdatedData={relevantAndNplUpdatedData}
                                                        setNplPatentFormData={setNplPatentFormData}

                                                    />

                                                </TabPane>

                                                <TabPane tabId={3}>
                                                    <RelatedRefComponent
                                                        relatedLoading={relatedLoading}
                                                        relatedForm={relatedForm}
                                                        relatedRefSaved={relatedRefSaved}
                                                        handleRelatedSubmit={handleRelatedSubmit}
                                                        handleRelatedFetchPatentData={handleRelatedFetchPatentData}
                                                        handleRelatedInputChange={handleRelatedInputChange}
                                                        relatedFormData={relatedFormData}
                                                        onRelatedDelete={onRelatedDelete}
                                                        setRelatedFormData={setRelatedFormData}
                                                        relatedErrorValidation={relatedErrorValidation}
                                                        setRelatedErrorValidation={setRelatedErrorValidation}
                                                        resetRelatedForm={resetRelatedForm}

                                                        selectedRows={selectedRows}
                                                        setSelectedRows={setSelectedRows}

                                                        nplPublicationFormData={nplPublicationFormData}
                                                        handleNplPublicationChange={handleNplPublicationChange}
                                                        // handleNplPublicationSubmit={handleNplPublicationSubmit}
                                                        handleNplSubmit={(e) => handleNplSubmit(e, "relatedTrue")}
                                                        nonPublicationFormData={nonPublicationFormData}
                                                        setNplPublicationFormData={setNplPublicationFormData}
                                                        onNplPublicationDeleteClick={onNplPublicationDeleteClick}
                                                        relatedAndNplCombined={relatedAndNplCombined}
                                                        onRelatedAndNplDelete={onRelatedAndNplDelete}
                                                    />
                                                </TabPane>

                                                <TabPane tabId={4}>
                                                    <Appendix1
                                                        baseSearchTerm={baseSearchTerm}
                                                        baseSearchTermsList={baseSearchTermsList}
                                                        setBaseSearchTerm={setBaseSearchTerm}
                                                        handleSaveBaseSearchTerm={handleSaveBaseSearchTerm}
                                                        onSearchTermDelete={onSearchTermDelete}
                                                        relevantWords={relevantWords}
                                                        setRelevantWords={setRelevantWords}
                                                        handleFindRelevantWord={handleFindRelevantWord}
                                                        handleAddSearchTerms={handleAddSearchTerms}
                                                        findLoading={findLoading}
                                                        relevantWordsList={relevantWordsList}
                                                        onRelevantWordsDelete={onRelevantWordsDelete}

                                                        keyString={keyString}
                                                        keyStringsList={keyStringsList}
                                                        setKeyStringsList={setKeyStringsList}
                                                        onKeyStringsDelete={onKeyStringsDelete}
                                                        setKeyString={setKeyString}
                                                        // handleSaveKeyString={handleSaveKeyString}

                                                        keyStringNpl={keyStringNpl}
                                                        setKeyStringNpl={setKeyStringNpl}
                                                        keyStringsNplList={keyStringsNplList}
                                                        handleSaveKeyStringNpl={handleSaveKeyStringNpl}
                                                        onKeyStringsNplDelete={onKeyStringsNplDelete}

                                                        keyStringAdditional={keyStringAdditional}
                                                        setKeyStringAdditional={setKeyStringAdditional}
                                                        handleSaveKeyStringAdditional={handleSaveKeyStringAdditional}
                                                        onKeyStringsAdditionalDelete={onKeyStringsAdditionalDelete}
                                                        keyStringsAdditionalList={keyStringsAdditionalList}

                                                        dataAvailability={dataAvailability}
                                                        setDataAvailability={setDataAvailability}
                                                        dataAvailabilityValue={dataAvailabilityValue}
                                                        handleSaveDataAvailability={handleSaveDataAvailability}
                                                        onDataAvailabilityDelete={onDataAvailabilityDelete}

                                                        onKeyStringsDeletes={onSourceDeleted}
                                                        appendix1KeyStringsLevelValue={appendix1KeyStringsLevelValue}
                                                        setAppendix1KeyStringsLevelValue={setAppendix1KeyStringsLevelValue}

                                                    />
                                                </TabPane>

                                                <TabPane tabId={5}>
                                                    <Appendix2
                                                        appendix2Patents={appendix2Patents}
                                                        appendix2PatentsSaved={appendix2PatentsSaved}
                                                        setAppendix2Patents={setAppendix2Patents}
                                                        handleSaveAppendix2Patents={handleSaveAppendix2Patents}
                                                        appendix2NPL={appendix2NPL}
                                                        appendix2NPLSaved={appendix2NPLSaved}
                                                        setAppendix2NPL={setAppendix2NPL}
                                                        handleSaveAppendix2NPL={handleSaveAppendix2NPL}

                                                        dynamicFieldValues={keyStringsList}

                                                    />
                                                </TabPane>


                                            </TabContent>
                                        </div>

                                        <div className="actions clearfix">
                                            <ul>
                                                <li
                                                    className={
                                                        activeTab === 1 ? "previous disabled" : "previous"
                                                    }
                                                >
                                                    <Link
                                                        to="#"
                                                        onClick={() => {
                                                            toggleTab(activeTab - 1)
                                                        }}
                                                    >
                                                        Previous
                                                    </Link>
                                                </li>
                                                {
                                                    activeTab === 5 ? (
                                                        <button disabled={false} style={{ height: '33.75px' }} onClick={handleReportDownload} className="btn btn-sm btn-outline-primary">
                                                            <FaFileWord size={15} /> Download
                                                        </button>
                                                    ) : (
                                                        <li
                                                            className={activeTab === 5 ? "next disabled" : "next"}
                                                        >
                                                            <Link
                                                                to="#"
                                                                onClick={() => {
                                                                    toggleTab(activeTab + 1)
                                                                }}
                                                            >
                                                                Next
                                                            </Link>
                                                        </li>
                                                    )
                                                }

                                            </ul>
                                        </div>

                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>                
            </div>

            <>
                {activeModal && (
                    <DeleteModal
                        show={true}
                        toggle={() => setActiveModal(null)}
                        message={modalConfig[activeModal].message}
                        onConfirm={() => {
                            modalConfig[activeModal].onConfirm();
                            setActiveModal(null);
                        }}
                    />
                )}
            </>
        </React.Fragment>
    )
}

export default MappingProjectCreation;