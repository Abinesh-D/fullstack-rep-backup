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
    handleWordDownloadFrontend,
} from "../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice";
import { mapFamilyMemberData } from "../../ManagePriorFormat/ReusableComp/Functions";
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

    const [activeTab, setactiveTab] = useState(1);
    const [passedSteps, setPassedSteps] = useState([1]);

    const [relevantForm, setRelevantForm] = useState({
        patentNumber: '',
        publicationUrl: '',
        title: '',
        abstract: "",
        filingDate: '',
        assignee: '',
        grantDate: '',
        inventors: '',
        priorityDate: '',
        classifications: '',
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
            title: '',
            abstract: "",
            filingDate: '',
            assignee: '',
            grantDate: '',
            inventors: '',
            priorityDate: '',
            classifications: '',
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


    const [keyString, setKeyString] = useState("");
    const [keyStringsList, setKeyStringsList] = useState("");

    const [keyStringNpl, setKeyStringNpl] = useState("");
    const [keyStringsNplList, setKeyStringsNplList] = useState("");

    const [keyStringAdditional, setKeyStringAdditional] = useState("");
    const [keyStringsAdditionalList, setKeyStringsAdditionalList] = useState("");

    const [dataAvailability, setDataAvailability] = useState("")
    const [dataAvailabilityValue, setDataAvailabilityValue] = useState([]);

    const [appendix2Patents, setAppendix2Patents] = useState("");

    const [appendix2NPL, setAppendix2NPL] = useState("");


    const [projectFormData, setProjectFormData] = useState({
        projectTitle: '',
        projectSubTitle: '',
        searchFeatures: "",
        // projectImageUrl: [],
    });

    const [nplPatentFormData, setNplPatentFormData] = useState({
        nplTitle: "",
        url: "",
        nplPublicationDate: "",
        comments: "",
        excerpts: "",
    });

    const nonPatentLiteratureForm = () => {
        setNplPatentFormData({
            nplTitle: "",
            url: "",
            nplPublicationDate: "",
            comments: "",
            excerpts: "",
        });
    }

    const [nonPatentFormData, setNonPatentFormData] = useState([]);

    const [relevantFormData, setrelevantFormData] = useState([]);

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

    const [relatedFormData, setRelatedFormData] = useState([]);

    const [selectedRow, setSelectedRow] = useState(null);

    const [activeModal, setActiveModal] = useState(null);

    const onDeleteClick = (rowData) => {
        setSelectedRow(rowData);
        setActiveModal("publication");
    };

    const onNplDeleteClick = (rowData) => {
        setSelectedRow(rowData);
        setActiveModal("nonPatent");
    };

    const onRelatedDelete = (rowData) => {
        setSelectedRow(rowData);
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
    const onRelevantWordsDelete = (rowData) => {
        setSelectedRow(rowData);
        setActiveModal("relevantWords");
    }



    const handleRelatedReferenceDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/live/projectname/delete-related/${id}/${selectedRow._id}`);
            if (response.status === 200) {
                const updatedRelatedRef = response.data.stages.relatedReferences;
                setRelatedFormData(updatedRelatedRef);
            }
        } catch (error) {
            console.error("Error deleting related reference:", error);
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




    const handleNonPatentDelete = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/live/projectname/delete-npl/${id}/${selectedRow._id}`
            );

            if (response.status === 200) {
                const updatedNPLs = response.data.stages.relevantReferences.nonPatentLiteratures;
                setNonPatentFormData(updatedNPLs);
            }
        } catch (error) {
            console.error("Error deleting NPL:", error);
        } finally {
            setActiveModal(null);
            setSelectedRow(null);
        }
    };

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
                        searchFeatures: singleProject.stages.introduction?.[0]?.searchFeatures || [],
                        // projectImageUrl: singleProject.stages.introduction?.[0]?.projectImageUrl || [],
                    });
                    setRelevantAndNplUpdatedData(singleProject.stages.relevantReferences?.relevantAndNplCombined);

                    setrelevantFormData(singleProject.stages.relevantReferences?.publicationDetails || []);
                    setNonPatentFormData(singleProject.stages.relevantReferences?.nonPatentLiteratures || []);
                    setOverallSummary(singleProject.stages.relevantReferences?.overallSummary || "");
                    setBaseSearchTermsList(singleProject.stages.appendix1?.[0]?.baseSearchTerms || []);
                    setRelevantWordsList(singleProject.stages.appendix1?.[0]?.baseSearchTerms || []);
                    setKeyStringsList(singleProject.stages.appendix1?.[0]?.keyStrings || []);
                    setKeyStringsNplList(singleProject.stages.appendix1?.[0]?.keyStringsNpl || []);
                    setKeyStringsAdditionalList(singleProject.stages.appendix1?.[0]?.keyStringsAdditional || []);
                    setDataAvailabilityValue(singleProject.stages.appendix1?.[0]?.dataAvailability || []);
                    setAppendix2Patents(singleProject.stages.appendix2?.[0]?.patents || []);
                    setAppendix2NPL(singleProject.stages.appendix2?.[0]?.nonPatentLiterature || []);
                }
            } catch (error) {
                console.error("Error fetching project data:", error);
            }
        };

        getProject();
    }, []);



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

    const handleSaveKeyString = async () => {
        if (!keyString.trim()) return;

        try {
            const response = await axios.post(
                `http://localhost:8080/live/projectname/add-key-string/${id}`, { keyStringsText: keyString },
                { headers: { "Content-Type": "application/json" } }

            );

            const appendixData = response.data.stages.appendix1[0]?.keyStrings;
            setKeyStringsList(appendixData);
            setKeyString("");
        } catch (err) {
            console.error("Error saving Key String:", err);
        }
    };

    const handleDeleteKeyString = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/live/projectname/delete-key-string/${id}/${selectedRow._id}`
            );

            if (response.status === 200) {
                setKeyStringsList(response.data.stages.appendix1[0].keyStrings);

            }
        } catch (err) {
            console.error("Error deleting Key String:", err);
        } finally {
            setActiveModal(null);
            setSelectedRow(null);
        }
    };

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
                setAppendix2Patents(response.data.stages.appendix2[0].patents)
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
                setAppendix2NPL(response.data.stages.appendix2[0].nonPatentLiterature)
            }
        } catch (err) {
            console.error("Error saving Appendix 2 - NPL:", err);
        }
    };


    const getCleanPartyNames = (partyArray = [], nameKey = '') => {
        if (!Array.isArray(partyArray) || !nameKey) return '';

        const priority = ['epodoc', 'original', 'docdb'];

        const availableFormat = priority.find(format =>
            partyArray.some(item => item?.$?.['data-format'] === format)
        );

        if (!availableFormat) return '';
        const filteredArray = partyArray.filter(
            item => item?.$?.['data-format'] === availableFormat
        );

        const cleanedNames = filteredArray
            .map(item =>
                nameKey.split('.').reduce((obj, key) => obj?.[key], item)
                    ?.replace(/\[.*?\]/g, '')
                    ?.replace(/[.,;]/g, '')
                    ?.replace(/\s+/g, ' ')
                    ?.trim()
            )
            .filter(Boolean);

        const uniqueNames = [...new Map(
            cleanedNames.map(name => [name.toLowerCase(), name])
        ).values()];

        const titleCasedNames = uniqueNames.map(str =>
            str.replace(/\b\w/g, char => char.toUpperCase())
        );

        return titleCasedNames.join('; ');
    };




    // const getCleanPartyNames = (partyArray = [], nameKey = '') => {
    //     if (!Array.isArray(partyArray) || !nameKey) return '';

    //     const priority = { epodoc: 1, original: 2, docdb: 3 };

    //     const cleanedNames = [...partyArray]
    //         .sort((a, b) =>
    //             (priority[a?.$?.['data-format']] || 999) - (priority[b?.$?.['data-format']] || 999)
    //         )
    //         .map(item =>
    //             nameKey.split('.').reduce((obj, key) => obj?.[key], item)
    //                 ?.replace(/\[.*?\]/g, '')
    //                 ?.replace(/[.,;]/g, '')
    //                 ?.replace(/\s+/g, ' ')
    //                 ?.trim()
    //         )
    //         .filter(Boolean);

    //     const uniqueNames = [...new Map(
    //         cleanedNames.map(name => [name.toLowerCase(), name])
    //     ).values()];

    //     const titleCasedNames = uniqueNames.map(str =>
    //         str.replace(/\b\w/g, char => char.toUpperCase())
    //     );

    //     return titleCasedNames.join('; ');
    // };


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


    const { title, publicationUrl, abstractData, aplDate, pubDate, priorityDates, inventorNames, applicantNames, classificationsSymbol,
        classData, familyMemData, formattedDescriptions, } = usePatentData(data, "relevant");

    // function getEnglishAbstract(biblio) {
    //     const abstractArray = biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.abstract;
    //     if (Array.isArray(abstractArray)) {
    //         const englishEntry = abstractArray.find(entry => entry?.$?.lang === 'en');
    //         return englishEntry?.p || 'No English abstract found.';
    //     } else if (typeof abstractArray === 'object') {
    //         return abstractArray.p;
    //     }

    //     return null;
    // }
    // const abstractData = getEnglishAbstract(data.biblio);

    // function convertDescriptionToKeyValue(descriptionText) {
    //     const result = {};
    //     const text = descriptionText || '';

    //     const matches = text.matchAll(/\[\d{4}\][\s\S]*?(?=\[\d{4}\]|$)/g);

    //     for (const match of matches) {
    //         const entry = match[0].trim();
    //         const keyMatch = entry.match(/^\[(\d{4})\]/);
    //         if (keyMatch) {
    //             const key = keyMatch[1];
    //             const value = entry.replace(/^\[\d{4}\]/, '').trim();
    //             result[key] = value;
    //         }
    //     }

    //     return result;
    // };
    // const descArray = data.descriptionData?.['world-patent-data']?.['fulltext-documents']?.['fulltext-document']?.description.p;

    // const descriptionText = descArray?.join('\n') || '';
    // const formattedDescriptions = convertDescriptionToKeyValue(descriptionText);

    // const famFilterFunction = () => {
    //     if (data?.patentNumber !== undefined) {
    //         let familyIDs = [];
    //         const familyMember = data.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];
    //         if (Array.isArray(familyMember)) {
    //             familyIDs = data.familyData["world-patent-data"]?.["patent-family"]?.["family-member"][0]?.["$"]?.["family-id"];
    //         } else if (typeof familyMember === 'object') {
    //             familyIDs = data.familyData["world-patent-data"]?.["patent-family"]?.["family-member"]?.["$"]?.["family-id"];
    //         }
    //         return `https://worldwide.espacenet.com/patent/search/family/0${familyIDs}/publication/${data?.patentNumber}?q=${data?.patentNumber}`;
    //     }
    // };

    // const publicationUrl = famFilterFunction();

    // const biblioData = data?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['bibliographic-data'];
    // const inventorsData = biblioData?.parties?.inventors?.inventor;

    // const inventorNames = useMemo(() => {
    //     const inventorsArray = Array.isArray(inventorsData) ? inventorsData : inventorsData ? [inventorsData] : [];
    //     return getCleanPartyNames(inventorsArray, 'inventor-name.name');
    // }, [inventorsData]);

    // const applicantsData = biblioData?.parties?.applicants?.applicant

    // const applicantNames = useMemo(() => {
    //     const applicantsArray = Array.isArray(applicantsData) ? applicantsData : applicantsData ? [applicantsData] : [];

    //     return getCleanPartyNames(applicantsArray, 'applicant-name.name');
    // }, [applicantsData]);


    // const inventionTitle = () => {
    //     const titleData = biblioData?.['invention-title'];

    //     if (Array.isArray(titleData)) {
    //         const enTitle = titleData.find(t => t?.$?.lang === 'en');
    //         if (enTitle) {
    //             return enTitle._ || '';
    //         }
    //         return titleData[0]._ || '';
    //     }
    //     else if (titleData?.$?.lang === 'en') {
    //         return titleData._ || '';
    //     }
    //     return titleData?._ || '';
    // }

    // const title = inventionTitle();

    // const applicationDate = () => {
    //     const docIds = biblioData?.['application-reference']?.['document-id'];

    //     const epodocDate = Array.isArray(docIds)
    //         ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
    //         : docIds?.$?.['document-id-type'] === 'epodoc'
    //             ? docIds.date
    //             : null;

    //     const formatDate = (dateStr) =>
    //         dateStr && /^\d{8}$/.test(dateStr)
    //             ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
    //             : '';

    //     return formatDate(epodocDate);
    // }

    // const aplDate = applicationDate();

    // const publicationDate = () => {
    //     const docIds = biblioData?.['publication-reference']?.['document-id'];

    //     const epodocDate = Array.isArray(docIds)
    //         ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
    //         : docIds?.$?.['document-id-type'] === 'epodoc'
    //             ? docIds.date
    //             : null;

    //     const formatDate = (dateStr) =>
    //         dateStr && /^\d{8}$/.test(dateStr)
    //             ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
    //             : '';

    //     return formatDate(epodocDate);
    // }

    // const pubDate = publicationDate();


    // const getPriorityDates = (biblioData) => {
    //     let claims = biblioData?.['priority-claims']?.['priority-claim'];
    //     if (!claims) return '';

    //     if (!Array.isArray(claims)) claims = [claims];

    //     for (const claim of claims) {
    //         let doc = claim?.['document-id'];
    //         if (!doc) continue;

    //         if (!Array.isArray(doc)) doc = [doc];

    //         const epodoc = doc.find(d => d?.$?.['document-id-type'] === 'epodoc');
    //         const rawDate = epodoc?.date?.trim();

    //         if (rawDate && /^\d{8}$/.test(rawDate)) {
    //             return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
    //         }
    //     }
    //     return '';
    // };

    // const priorityDates = getPriorityDates(biblioData);

    // const classifications = () => {
    //     const patentClassifications = biblioData?.['patent-classifications']?.['patent-classification'];

    //     if (!Array.isArray(patentClassifications)) {
    //         return { cpc: '', US_Classification: '' };
    //     }

    //     const cpcSet = new Set();
    //     const usSet = new Set();

    //     patentClassifications.forEach((item) => {
    //         const { 'classification-scheme': scheme, section, class: classValue, subclass, 'main-group': mainGroup, subgroup } = item;

    //         if (scheme?.$?.scheme === 'CPCI' && section && classValue && subclass && mainGroup && subgroup) {
    //             const cpcCode = `${section}${classValue}${subclass}${mainGroup}/${subgroup}`;
    //             cpcSet.add(cpcCode);
    //         }

    //         if (scheme?.$?.scheme === 'UC') {
    //             const classificationSymbol = item['classification-symbol'];
    //             if (classificationSymbol) {
    //                 usSet.add(classificationSymbol);
    //             }
    //         }
    //     });

    //     return {
    //         cpc: cpcSet.size ? Array.from(cpcSet).join(', ') : '',
    //         US_Classification: usSet.size ? Array.from(usSet).join(', ') : ''
    //     };
    // };

    // const classData = classifications();

    // const ipcrRaw = biblioData?.['classifications-ipcr']?.['classification-ipcr'];
    // const ipc = biblioData?.['classification-ipc']?.text || '';

    // const extractIPCCode = (text) => {
    //     const match = text?.match(/[A-H][0-9]{2}[A-Z]\s*\d+\/\s*\d+/);
    //     return match ? match[0].replace(/\s+/g, '') : '';
    // };

    // const ipcrText = Array.isArray(ipcrRaw)
    //     ? ipcrRaw.map(item => extractIPCCode(item?.text)).filter(Boolean).join(', ')
    //     : extractIPCCode(ipcrRaw?.text) || '';

    // const ipcFormatted = ipc ? `${ipc}, ` : '';
    // const ipcrFormatted = ipcrText ? `${ipcrText}, ` : '';

    // const classificationsSymbol = `${ipcrFormatted}${ipcFormatted}${classData.cpc}`;

    // const famData = mapFamilyMemberData(data);

    // const familyMemData = famData?.map(f => f?.familyPatent).join(', ');




    useEffect(() => {
        const isAnyMissing = [
            inventorNames,
            title,
            applicantNames,
            pubDate,
            aplDate,
            priorityDates,
            classificationsSymbol,
            // familyMemData,
            abstractData,
            // filteredDescriptions
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
        inventorNames,
        title,
        applicantNames,
        pubDate,
        aplDate,
        priorityDates,
        classificationsSymbol,
        // familyMemData,
        abstractData,
        // filteredDescriptions
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






    // const relatedFamilyFilterFunction = () => {
    //     if (relatedData?.patentNumber) {
    //         const familyMember = relatedData.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];
    //         const firstFamily = Array.isArray(familyMember) ? familyMember[0] : familyMember;
    //         const familyId = firstFamily?.["$"]?.["family-id"];
    //         if (familyId) {
    //             return `https://worldwide.espacenet.com/patent/search/family/0${familyId}/publication/${relatedData?.patentNumber}?q=${relatedData?.patentNumber}`;
    //         }
    //     }
    // }

    // const relatedPublicationUrl = relatedFamilyFilterFunction();



    // const relatedBiblioData = relatedData?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['bibliographic-data'];


    // const relatedPriority = getPriorityDates(relatedBiblioData);




    // const relatedInventorNames = useMemo(() => {
    //     const inventors = relatedBiblioData?.parties?.inventors?.inventor;
    //     const array = Array.isArray(inventors) ? inventors : inventors ? [inventors] : [];
    //     return getCleanPartyNames(array, 'inventor-name.name');
    // }, [relatedBiblioData]);



    // const relatedApplicantNames = useMemo(() => {
    //     const applicants = relatedBiblioData?.parties?.applicants?.applicant;
    //     const array = Array.isArray(applicants) ? applicants : applicants ? [applicants] : [];
    //     return getCleanPartyNames(array, 'applicant-name.name');
    // }, [relatedBiblioData]);


    // const assigneeAndInventorsName = useMemo(() => {
    //     return relatedApplicantNames && relatedInventorNames ? `${relatedApplicantNames} / ${relatedInventorNames}` : '';
    // }, [relatedApplicantNames, relatedInventorNames]);


    // console.log('relatedApplicantNames', relatedApplicantNames);
    // console.log('relatedInventorNames', relatedInventorNames)



    // const glAssigneesAndInventor = useMemo(() => {
    //     return relatedBiblioGoogleData.intentor && relatedBiblioGoogleData.assignees ? ` ${relatedBiblioGoogleData.assignees} / ${relatedBiblioGoogleData.inventors}` : ''

    // }, [relatedBiblioGoogleData.intentors, relatedBiblioGoogleData.assignees]);

    // console.log('glAssigneesAndInventor', glAssigneesAndInventor);

    // const relatedInventionTitle = () => {
    //     const titleData = relatedBiblioData?.['invention-title'];
    //     if (Array.isArray(titleData)) {
    //         const enTitle = titleData.find(t => t?.$?.lang === 'en');
    //         return enTitle?._ || titleData[0]?._ || '';
    //     }
    //     return titleData?._ || '';
    // };

    // const relatedPublicationDate = () => {
    //     const docIds = relatedBiblioData?.['publication-reference']?.['document-id'];
    //     const date =
    //         Array.isArray(docIds)
    //             ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
    //             : docIds?.$?.['document-id-type'] === 'epodoc'
    //                 ? docIds.date
    //                 : null;
    //     return date && /^\d{8}$/.test(date) ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}` : '';
    // };

    // const relatedFamData = useMemo(() => {
    //     const familyMembers = relatedData.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];
    //     const familyArray = Array.isArray(familyMembers) ? familyMembers : familyMembers ? [familyMembers] : [];
    //     return familyArray.map(member => {
    //         const docs = member?.["publication-reference"]?.["document-id"] || [];
    //         const publicationInfo = (Array.isArray(docs) ? docs : [docs])
    //             .filter(doc => doc?.["$"]?.["document-id-type"] === "docdb")
    //             .map(doc => `${doc?.["country"]}${doc?.["doc-number"]}${doc?.["kind"]}`)
    //             .join('');
    //         return {
    //             familyId: member?.["$"]?.["family-id"],
    //             familyPatent: publicationInfo
    //         };
    //     });
    // }, [relatedBiblioData]);

    // const relatedFamilyData = relatedFamData?.map(f => f?.familyPatent).join(', ') || '';


    // const memoInventionTitle = useMemo(() => relatedInventionTitle(), [relatedBiblioData]);
    // const memoPubDate = useMemo(() => relatedPublicationDate(), [relatedBiblioData]);

    const relatedApiData = usePatentData(relatedData, "related");

    useEffect(() => {
        const isAnyMissing = [
            // assigneeAndInventorsName,
            // memoInventionTitle,
            // relatedFamilyData,
            // memoPubDate,

            relatedApiData.relatedPublicationUrl,
            relatedApiData.relatedTitle,
            relatedApiData.relatedAssignee,
            relatedApiData.relatedInventor,
            relatedApiData.relatedPublicationDate,
            relatedApiData.relatedPriorityDate,
            relatedApiData.relatedFamilyMembers,

            // applicantNames,
            // aplDate,
            // priorityDates,
            // classificationsSymbol,
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

        relatedApiData.relatedPublicationUrl,
        relatedApiData.relatedTitle,
        relatedApiData.relatedAssignee,
        relatedApiData.relatedInventor,
        relatedApiData.relatedPublicationDate,
        relatedApiData.relatedPriorityDate,
        relatedApiData.relatedFamilyMembers,




        // assigneeAndInventorsName,
        // memoInventionTitle,
        // relatedFamilyData,
        // memoPubDate,

        // applicantNames,
        // aplDate,
        // priorityDates,
        // classificationsSymbol,
        // abstractData,
        // filteredDescriptions
    ]);


    useEffect(() => {
        const allFieldsExceptPatentEmpty = Object.entries(relevantForm).every(
            ([key, value]) => key === "patentNumber" || value === ""
        );

        if (
            (data?.patentNumber || releventBiblioGoogleData?.patentNumber) &&
            relevantForm.patentNumber &&
            allFieldsExceptPatentEmpty
        ) {
            console.log('✅ Populating relevantForm from bibliographic sources...');

            const combinedForm = {
                patentNumber: relevantForm.patentNumber.trim(),

                publicationUrl:
                    publicationUrl ||
                    releventBiblioGoogleData?.pageUrl ||
                    "",

                title:
                    title ||
                    releventBiblioGoogleData?.title?.trim() ||
                    "",

                abstract:
                    abstractData?.trim() ||
                    releventBiblioGoogleData?.abstract?.trim() ||
                    "",

                filingDate:
                    aplDate ||
                    releventBiblioGoogleData?.applicationDate ||
                    "",

                grantDate:
                    pubDate ||
                    releventBiblioGoogleData?.publicationDate ||
                    "",

                priorityDate:
                    priorityDates ||
                    releventBiblioGoogleData?.priorityDate ||
                    "",

                assignee: (applicantNames ||
                    releventBiblioGoogleData?.assignees ||
                    "")
                    .split(",")
                    .map(a => a.trim())
                    .filter(Boolean),

                inventors: typeof (inventorNames || releventBiblioGoogleData?.inventors) === "string"
                    ? (inventorNames || releventBiblioGoogleData?.inventors)
                        .split(";")
                        .map(i => i.trim())
                        .filter(Boolean)
                    : [],

                classifications: (classificationsSymbol ||
                    googleClassCPC ||
                    "")
                    .split(",")
                    .map(c => c.trim())
                    .filter(Boolean),

                usClassification: (classData?.US_Classification ||
                    releventBiblioGoogleData?.usClassification ||
                    "")
                    .split(",")
                    .map(u => u.trim())
                    .filter(Boolean),

                familyMembers: (familyMemData || "")
                    .split(",")
                    .map(f => f.trim())
                    .filter(Boolean),

                analystComments: relevantForm.analystComments || "",
                relevantExcerpts: relevantForm.relevantExcerpts || ""
            };

            setRelevantForm(combinedForm);
        }
    }, [data, releventBiblioGoogleData]);



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

    // const handleRelevantAndNplCombinedSubmit = async (e) => {
    //     e.preventDefault();

    //     console.log('relevantAndNplUpdatedData', relevantAndNplUpdatedData)

    //     try {
    //         const response = await axios.post(
    //             `http://localhost:8080/live/projectname/add-relevantandnpl-data/${id}`, relevantAndNplUpdatedData,
    //             { headers: { "Content-Type": "application/json" } }
    //         );
    //         if (response.status === 200) {
    //             const updatedDetails = response.data.stages.relevantReferences.relevantAndNplCombined;
    //             setRelevantAndNplUpdatedData(updatedDetails);

    //         }

    //     } catch (error) {
    //         console.error("Error saving publication detail:", error);
    //     } finally {
    //         // dispatch(setRelevantApiTrue(false));
    //     }
    // };

    const handleNplSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `http://localhost:8080/live/projectname/add-npl/${id}`,
                nplPatentFormData,
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200) {
                nonPatentLiteratureForm();
                const updatedNplData = response.data.stages.relevantReferences.nonPatentLiteratures;
                setNonPatentFormData(updatedNplData);

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

    useEffect(() => {
        const allFieldsExceptPatentEmpty = Object.entries(relatedForm).every(
            ([key, value]) => key === "publicationNumber" || value === ""
        );

        if (
            (relatedData?.patentNumber || releventBiblioGoogleData?.patentNumber) &&
            relatedForm.publicationNumber && allFieldsExceptPatentEmpty
        ) {
            const combinedForm = {
                publicationNumber: relatedData.patentNumber.trim(),

                relatedPublicationUrl:
                    relatedApiData.relatedPublicationUrl ||
                    relatedBiblioGoogleData?.pageUrl ||
                    "",

                relatedTitle:
                    relatedApiData.relatedTitle ||
                    relatedBiblioGoogleData?.title?.trim() ||
                    "",

                relatedPublicationDate:
                    relatedApiData.relatedPublicationDate ||
                    relatedBiblioGoogleData?.publicationDate ||
                    "",

                relatedAssignee: (relatedApiData.relatedAssignee ||
                    relatedBiblioGoogleData?.assignees ||
                    ""
                )
                    .split(",")
                    .map(a => a.trim())
                    .filter(Boolean),

                relatedInventor: (relatedApiData.relatedInventor ||
                    relatedBiblioGoogleData?.inventors ||
                    "")
                    .split(";")
                    .map(i => i.trim())
                    .filter(Boolean),


                relatedFamilyMembers: (relatedApiData.relatedFamilyMembers || "")
                    .split(",")
                    .map(f => f.trim())
                    .filter(Boolean),
                relatedPriorityDate: (relatedApiData.relatedPriorityDate ||
                    relatedBiblioGoogleData.priorityDate || ""
                )
            };

            setRelatedForm(combinedForm);
        }
    }, [relatedData, relatedBiblioGoogleData]);


    const handleRelatedSubmit = async (e) => {
        e.preventDefault();
        if (!relatedForm.publicationNumber) return;

        try {
            const response = await axios.post(`http://localhost:8080/live/projectname/add-related/${id}`, relatedForm,
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200) {
                resetRelatedForm();
                setRelatedFormData(response.data.stages.relatedReferences);
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
            // const payload = {
            //     id: id,
            //     projectTitle: getProjectValue.stages.introduction[0]?.projectTitle || "",
            //     projectSubTitle: getProjectValue.stages.introduction[0]?.projectSubTitle || "",
            //     searchFeatures: getProjectValue.stages.introduction[0]?.searchFeatures || [],
            //     relevantReferences: getProjectValue.stages.relevantReferences.publicationDetails || [],
            //     nonPatentLiteratures: getProjectValue.stages.relevantReferences.nonPatentLiteratures || [],
            //     relatedReferences: getProjectValue.stages.relatedReferences || [],
            //     appendix1: getProjectValue.stages.appendix1[0] || [],
            //     appendix2: getProjectValue.stages.appendix2[0] || [],
            //     overallSummary: getProjectValue.stages.relevantReferences.overallSummary || "",
            //     getProjectValue: getProjectValue,
            //     relevantAndNplCombined: getProjectValue.stages.relevantReferences.relevantAndNplCombined || [],
            // };

            // Dispatch the thunk and handle promise
            // dispatch(handleWordDownloadFrontend(id))
            //     .then((res) => {
            //         console.log("Download completed:", res);
            //     })
            //     .catch((err) => {
            //         console.error("Download error:", err);
            //     });






            handleWordReportDownload({
                projectTitle: getProjectValue.stages.introduction[0]?.projectTitle || "",
                projectSubTitle: getProjectValue.stages.introduction[0]?.projectSubTitle || "",
                searchFeatures: getProjectValue.stages.introduction[0]?.searchFeatures || [],
                relevantReferences: getProjectValue.stages.relevantReferences.publicationDetails || [],
                nonPatentLiteratures: getProjectValue.stages.relevantReferences.nonPatentLiteratures || [],
                relatedReferences: getProjectValue.stages.relatedReferences || [],
                appendix1: getProjectValue.stages.appendix1[0] || [],
                appendix2: getProjectValue.stages.appendix2[0] || [],
                // projectImageUrl: getProjectValue.stages.introduction[0]?.projectImageUrl || ["Image"],
                overallSummary: getProjectValue.stages.relevantReferences.overallSummary || "",
                getProjectValue: getProjectValue,
                relevantAndNplCombined: getProjectValue.stages.relevantReferences.relevantAndNplCombined || [],
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
        keyString: {
            message: "Are you sure you want to delete this Key String?",
            onConfirm: handleDeleteKeyString,
        },
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
                                <CardBody>
                                    {
                                        reportData && (
                                            <p style={{ fontSize: "10px", color: "#198754", fontWeight: "600", backgroundColor: "#f1fdf7", padding: "8px 12px", borderRadius: "6px", display: "inline-block", }}>
                                                {reportData.projectName} /-- {reportData.projectType}
                                            </p>
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

                                                    />

                                                </TabPane>

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
                                                        onKeyStringsDelete={onKeyStringsDelete}
                                                        setKeyString={setKeyString}
                                                        handleSaveKeyString={handleSaveKeyString}

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
                                                    />
                                                </TabPane>

                                                <TabPane tabId={5}>
                                                    <Appendix2
                                                        appendix2Patents={appendix2Patents}
                                                        setAppendix2Patents={setAppendix2Patents}
                                                        handleSaveAppendix2Patents={handleSaveAppendix2Patents}
                                                        appendix2NPL={appendix2NPL}
                                                        setAppendix2NPL={setAppendix2NPL}
                                                        handleSaveAppendix2NPL={handleSaveAppendix2NPL}
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
                                                        <button style={{ height: '33.75px' }} onClick={handleReportDownload} className="btn btn-sm btn-outline-primary">
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
        </React.Fragment>
    )
}

export default MappingProjectCreation;