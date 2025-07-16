import React, { useState, useEffect, useMemo } from "react";
import {
    Card, CardBody, Col, Container, Form, Input, Label, NavItem, NavLink, Row, TabContent, TabPane, Button, Spinner,
    Modal, ModalBody, ModalFooter, ModalHeader,
} from "reactstrap";
import classnames from "classnames";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
    GOOGLE_API_DATA, EPO_API_DATA, fetchProjects, fetchPublicationDetails, fetchProjectById, setRelevantApiTrue, setRelatedApiTrue,
    fetchRelatedReferences,
} from "../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice";
import { mapFamilyMemberData } from "../../ManagePriorFormat/ReusableComp/Functions";
import { FaFileWord } from "react-icons/fa";
import axios from "axios";
import RelevantRefComponent from "./ChildComponent/RelevantRefComponent";
import IntroductionTab from "./ChildComponent/IntroductionTab ";
import RelatedRefComponent from "./ChildComponent/RelatedrefComponent";
import Appendix1 from "./ChildComponent/Appendix1";
import Appendix2 from "./ChildComponent/Appendix2";
import ReusableDeleteComp from "../ReusableComponents/ResuableDeleteComp";
import { handleWordReportDownload } from "../ReusableComponents/handleWordReportDownload";

import { saveAs } from "file-saver";
import {
    Document, BorderStyle, Packer, Paragraph, TextRun, Table, TableRow, AlignmentType, TableCell, VerticalAlign, WidthType, ShadingType,
    ExternalHyperlink, TabStopType, HeadingLevel, ImageRun, 
} from "docx";
import { getSearchMethodology } from "../ReusableComponents/searchMethodology";
import { fileToBase64, formatBytes } from "../ReusableComponents/base64Convertion";


const MappingProjectCreation = () => {
    document.title = "Project Form | MCRPL";
    const id = sessionStorage.getItem("_id");

    const location = useLocation();

    const { selectedProject } = location.state || {};
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

    const [baseSearchTerm, setBaseSearchTerm] = useState("");
    const [baseSearchTermsList, setBaseSearchTermsList] = useState([]);

    const [keyString, setKeyString] = useState("");
    const [keyStringsList, setKeyStringsList] = useState("");

    const [keyStringNpl, setKeyStringNpl] = useState("");
    const [keyStringsNplList, setKeyStringsNplList] = useState("");

    const [keyStringAdditional, setKeyStringAdditional] = useState("");
    const [keyStringsAdditionalList, setKeyStringsAdditionalList] = useState("");

    const [dataAvailability, setDataAvailability] = useState("")
    const [dataAvailabilityValue, setDataAvailabilityValue] = useState("");

    const [appendix2Patents, setAppendix2Patents] = useState("");

    const [appendix2NPL, setAppendix2NPL] = useState("");


    const [projectFormData, setProjectFormData] = useState({
        projectTitle: '',
        projectSubTitle: '',
        searchFeatures: '',
        projectImageUrl: [],
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

    const [showDeletePublicationModal, setShowDeletePublicationModal] = useState(false);
    const [showDeleteNonPatentModal, setShowDeleteNonPatentModal] = useState(false);
    const [showDeleteRelatedReferenceModal, setShowDeleteRelatedReferenceModal] = useState(false);
    const [showDeleteSearchTermModal, setShowDeleteSearchTermModal] = useState(false);
    const [showDeleteKeyStringModal, setShowDeleteKeyStringModal] = useState(false);
    const [showDeleteKeyStringNplModal, setShowDeleteKeyStringNplModal] = useState(false);
    const [showDeleteKeyStringAdditionalModal, setShowDeleteKeyStringAdditionalModal] = useState(false);
    const [showDeleteDataAvailabilityModal, setShowDeleteDataAvailabilityModal] = useState(false);


    const onDeleteClick = (rowData) => {
        setSelectedRow(rowData);
        setShowDeletePublicationModal(true);
    };

    const onNplDeleteClick = (rowData) => {
        setSelectedRow(rowData);
        setShowDeleteNonPatentModal(true);
    };

    const onRelatedDelete = (rowData) => {
        setSelectedRow(rowData);
        setShowDeleteRelatedReferenceModal(true);
    }

    const onSearchTermDelete = (rowData) => {
        setSelectedRow(rowData);
        setShowDeleteSearchTermModal(true);
    }

    const onKeyStringsDelete = (rowData) => {
        setSelectedRow(rowData);
        setShowDeleteKeyStringModal(true);
    }

    const onKeyStringsNplDelete = (rowData) => {
        setSelectedRow(rowData);
        setShowDeleteKeyStringNplModal(true);
    }
    const onKeyStringsAdditionalDelete = (rowData) => {
        setSelectedRow(rowData);
        setShowDeleteKeyStringAdditionalModal(true);
    }

    const onDataAvailabilityDelete = (rowData) => {
        setSelectedRow(rowData);
        setShowDeleteDataAvailabilityModal(true);
    }



    const handleRelatedReferenceDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/live/projectname/delete-related/${id}/${selectedRow._id}`);
            if (response.status === 200) {
                const updatedRelatedRef = response.data.stages.relatedReferences;
                setRelatedFormData(updatedRelatedRef);
            }
        } catch (error) {
            console.error("❌ Error deleting related reference:", error);
        } finally {
            setShowDeleteRelatedReferenceModal(false);
            setSelectedRow(null);
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
            console.error("❌ Error deleting NPL:", error);
        } finally {
            setShowDeleteNonPatentModal(false);
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
            console.error("❌ Error deleting publication detail:", error);
        } finally {
            setShowDeletePublicationModal(false);
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
                    setProjectFormData({
                        projectTitle: singleProject.stages.introduction?.[0]?.projectTitle || "",
                        projectSubTitle: singleProject.stages.introduction?.[0]?.projectSubTitle || "",
                        searchFeatures: singleProject.stages.introduction?.[0]?.searchFeatures || "",
                        projectImageUrl: singleProject.stages.introduction?.[0]?.projectImageUrl || [],
                    });

                    setrelevantFormData(singleProject.stages.relevantReferences?.publicationDetails || []);
                    setNonPatentFormData(singleProject.stages.relevantReferences?.nonPatentLiteratures || []);
                    setOverallSummary(singleProject.stages.relevantReferences?.overallSummary || "");
                    setBaseSearchTermsList(singleProject.stages.appendix1?.[0]?.baseSearchTerms || []);
                    setKeyStringsList(singleProject.stages.appendix1?.[0]?.keyStrings || []);
                    setKeyStringsNplList(singleProject.stages.appendix1?.[0]?.keyStringsNpl || []);
                    setKeyStringsAdditionalList(singleProject.stages.appendix1?.[0]?.keyStringsAdditional || []);
                    setDataAvailabilityValue(singleProject.stages.appendix1?.[0]?.dataAvailability || "");
                    setAppendix2Patents(singleProject.stages.appendix2?.[0]?.patents || []);
                    setAppendix2NPL(singleProject.stages.appendix2?.[0]?.nonPatentLiterature || []);
                }
            } catch (error) {
                console.error("❌ Error fetching project data:", error);
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
            console.error("❌ Error saving Base Search Term:", err);

            if (err.response) {
                console.error("Server responded with:", err.response.data);
            } else if (err.request) {
                console.error("No response received:", err.request);
            } else {
                console.error("Error setting up request:", err.message);
            }
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
            console.error("❌ Error deleting Base Search Term:", err);
        } finally {
            setShowDeleteSearchTermModal(false);
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
            console.error("❌ Error saving Key String:", err);
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
            console.error("❌ Error deleting Key String:", err);
        } finally {
            setShowDeleteKeyStringModal(false);
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
            console.error("❌ Error saving Key String:", err);
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
            console.error("❌ Error deleting Key String Npl:", err);
        } finally {
            setShowDeleteKeyStringNplModal(false);
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
            console.error("❌ Error saving Additional:", err);
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
            console.error("❌ Error deleting Additional Key String:", err);
        } finally {
            setShowDeleteKeyStringAdditionalModal(false);
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
            console.error("❌ Error saving dataAvailability:", err);
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
            console.error("❌ Error deleting dataAvailability:", err);
        } finally {
            setShowDeleteDataAvailabilityModal(false);
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
        if (!appendix2Patents.trim()) return;

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
            console.error("❌ Error saving Appendix 2 - Patents:", err);
        }
    };

    const handleSaveAppendix2NPL = async () => {
        if (!appendix2NPL.trim()) return;

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
            console.error("❌ Error saving Appendix 2 - NPL:", err);
        }
    };


    const getCleanPartyNames = (partyArray = [], nameKey = '') => {
        if (!Array.isArray(partyArray) || !nameKey) return '';

        const priority = { epodoc: 1, original: 2, docdb: 3 };

        const cleanedNames = [...partyArray]
            .sort((a, b) =>
                (priority[a?.$?.['data-format']] || 999) - (priority[b?.$?.['data-format']] || 999)
            )
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
                console.error("❌ Google fallback failed:", googleError);
            }

            console.error("Espacenet fetch error:", error);
        } finally {
            setLoading(false);
        }
    };



    function getEnglishAbstract(biblio) {
        const abstractArray = biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.abstract;
        if (Array.isArray(abstractArray)) {
            const englishEntry = abstractArray.find(entry => entry?.$?.lang === 'en');
            return englishEntry?.p || 'No English abstract found.';
        } else if (typeof abstractArray === 'object') {
            return abstractArray.p;
        }

        return null;
    }

    const abstractData = getEnglishAbstract(data.biblio);


    function convertDescriptionToKeyValue(descriptionText) {
        const result = {};
        const text = descriptionText || '';

        const matches = text.matchAll(/\[\d{4}\][\s\S]*?(?=\[\d{4}\]|$)/g);

        for (const match of matches) {
            const entry = match[0].trim();
            const keyMatch = entry.match(/^\[(\d{4})\]/);
            if (keyMatch) {
                const key = keyMatch[1];
                const value = entry.replace(/^\[\d{4}\]/, '').trim();
                result[key] = value;
            }
        }

        return result;
    };

    const descArray = data.descriptionData?.['world-patent-data']?.['fulltext-documents']?.['fulltext-document']?.description.p;

    const descriptionText = descArray?.join('\n') || '';
    const formattedDescriptions = convertDescriptionToKeyValue(descriptionText);

    const famFilterFunction = () => {
        if (data?.patentNumber !== undefined) {
            let familyIDs = [];
            const familyMember = data.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];
            if (Array.isArray(familyMember)) {
                familyIDs = data.familyData["world-patent-data"]?.["patent-family"]?.["family-member"][0]?.["$"]?.["family-id"];
            } else if (typeof familyMember === 'object') {
                familyIDs = data.familyData["world-patent-data"]?.["patent-family"]?.["family-member"]?.["$"]?.["family-id"];
            }
            return `https://worldwide.espacenet.com/patent/search/family/0${familyIDs}/publication/${data?.patentNumber}?q=${data?.patentNumber}`;
        }
    };

    const publicationUrl = famFilterFunction();

    const biblioData = data?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['bibliographic-data'];
    const inventorsData = biblioData?.parties?.inventors?.inventor;

    const inventorNames = useMemo(() => {
        const inventorsArray = Array.isArray(inventorsData) ? inventorsData : inventorsData ? [inventorsData] : [];
        return getCleanPartyNames(inventorsArray, 'inventor-name.name');
    }, [inventorsData]);

    const applicantsData = biblioData?.parties?.applicants?.applicant

    const applicantNames = useMemo(() => {
        const applicantsArray = Array.isArray(applicantsData) ? applicantsData : applicantsData ? [applicantsData] : [];

        return getCleanPartyNames(applicantsArray, 'applicant-name.name');
    }, [applicantsData]);


    const inventionTitle = () => {
        const titleData = biblioData?.['invention-title'];

        if (Array.isArray(titleData)) {
            const enTitle = titleData.find(t => t?.$?.lang === 'en');
            if (enTitle) {
                return enTitle._ || '';
            }
            return titleData[0]._ || '';
        }
        else if (titleData?.$?.lang === 'en') {
            return titleData._ || '';
        }
        return titleData?._ || '';
    }

    const title = inventionTitle();

    const applicationDate = () => {
        const docIds = biblioData?.['application-reference']?.['document-id'];

        const epodocDate = Array.isArray(docIds)
            ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
            : docIds?.$?.['document-id-type'] === 'epodoc'
                ? docIds.date
                : null;

        const formatDate = (dateStr) =>
            dateStr && /^\d{8}$/.test(dateStr)
                ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
                : '';

        return formatDate(epodocDate);
    }

    const aplDate = applicationDate();

    const publicationDate = () => {
        const docIds = biblioData?.['publication-reference']?.['document-id'];

        const epodocDate = Array.isArray(docIds)
            ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
            : docIds?.$?.['document-id-type'] === 'epodoc'
                ? docIds.date
                : null;

        const formatDate = (dateStr) =>
            dateStr && /^\d{8}$/.test(dateStr)
                ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
                : '';

        return formatDate(epodocDate);
    }

    const pubDate = publicationDate();


    const getPriorityDates = (biblioData) => {
        let claims = biblioData?.['priority-claims']?.['priority-claim'];
        if (!claims) return '';

        if (!Array.isArray(claims)) claims = [claims];

        for (const claim of claims) {
            let doc = claim?.['document-id'];
            if (!doc) continue;

            if (!Array.isArray(doc)) doc = [doc];

            const epodoc = doc.find(d => d?.$?.['document-id-type'] === 'epodoc');
            const rawDate = epodoc?.date?.trim();

            if (rawDate && /^\d{8}$/.test(rawDate)) {
                return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
            }
        }
        return '';
    };

    const priorityDates = getPriorityDates(biblioData);

    const classifications = () => {
        const patentClassifications = biblioData?.['patent-classifications']?.['patent-classification'];

        if (!Array.isArray(patentClassifications)) {
            return { cpc: '', US_Classification: '' };
        }

        const cpcSet = new Set();
        const usSet = new Set();

        patentClassifications.forEach((item) => {
            const { 'classification-scheme': scheme, section, class: classValue, subclass, 'main-group': mainGroup, subgroup } = item;

            if (scheme?.$?.scheme === 'CPCI' && section && classValue && subclass && mainGroup && subgroup) {
                const cpcCode = `${section}${classValue}${subclass}${mainGroup}/${subgroup}`;
                cpcSet.add(cpcCode);
            }

            if (scheme?.$?.scheme === 'UC') {
                const classificationSymbol = item['classification-symbol'];
                if (classificationSymbol) {
                    usSet.add(classificationSymbol);
                }
            }
        });

        return {
            cpc: cpcSet.size ? Array.from(cpcSet).join(', ') : '',
            US_Classification: usSet.size ? Array.from(usSet).join(', ') : ''
        };
    };

    const classData = classifications();

    const ipcrRaw = biblioData?.['classifications-ipcr']?.['classification-ipcr'];
    const ipc = biblioData?.['classification-ipc']?.text || '';

    const extractIPCCode = (text) => {
        const match = text?.match(/[A-H][0-9]{2}[A-Z]\s*\d+\/\s*\d+/);
        return match ? match[0].replace(/\s+/g, '') : '';
    };

    const ipcrText = Array.isArray(ipcrRaw)
        ? ipcrRaw.map(item => extractIPCCode(item?.text)).filter(Boolean).join(', ')
        : extractIPCCode(ipcrRaw?.text) || '';

    const ipcFormatted = ipc ? `${ipc}, ` : '';
    const ipcrFormatted = ipcrText ? `${ipcrText}, ` : '';

    const classificationsSymbol = `${ipcrFormatted}${ipcFormatted}${classData.cpc}`;

    const famData = mapFamilyMemberData(data);

    const familyMemData = famData?.map(f => f?.familyPatent).join(', ');

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
                    console.error('❌ Google fallback failed:', googleError);
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
        const trimmedNumber = relatedForm.publicationNumber.trim();
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
                console.error("❌ Google fallback related failed:", googleError);
            }

            console.error("Espacenet fetch error:", error);
        } finally {
            setRelatedLoading(false);
        }
    };

    const relatedFamilyFilterFunction = () => {
        if (relatedData?.patentNumber) {
            const familyMember = relatedData.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];
            const firstFamily = Array.isArray(familyMember) ? familyMember[0] : familyMember;
            const familyId = firstFamily?.["$"]?.["family-id"];
            if (familyId) {
                return `https://worldwide.espacenet.com/patent/search/family/0${familyId}/publication/${relatedData?.patentNumber}?q=${relatedData?.patentNumber}`;
            }
        }
    }

    const relatedPublicationUrl = relatedFamilyFilterFunction();



    const relatedBiblioData = relatedData?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['bibliographic-data'];

    const relatedPriority = getPriorityDates(relatedBiblioData);


const relatedInventorNames = useMemo(() => {
    const inventors = relatedBiblioData?.parties?.inventors?.inventor;
    const array = Array.isArray(inventors) ? inventors : inventors ? [inventors] : [];
    return getCleanPartyNames(array, 'inventor-name.name');
}, [relatedBiblioData]);



const relatedApplicantNames = useMemo(() => {
    const applicants = relatedBiblioData?.parties?.applicants?.applicant;
    const array = Array.isArray(applicants) ? applicants : applicants ? [applicants] : [];
    return getCleanPartyNames(array, 'applicant-name.name');
}, [relatedBiblioData]);






// const relatedInventorNames = useMemo(() => {
//     const inventors = relatedBiblioData?.parties?.inventors?.inventor;
//     const array = Array.isArray(inventors) ? inventors : inventors ? [inventors] : [];

//     // Define priority: epodoc > original > docdb
//     const priority = { epodoc: 1, original: 2, docdb: 3 };

// const cleanedInventors = [...array] // clone first
//     .sort((a, b) =>
//         priority[a?.$?.['data-format']] - priority[b?.$?.['data-format']]
//     )
//     .map(item =>
//         item?.['inventor-name']?.name
//             ?.replace(/\[.*?\]/g, '')      // Remove [US], [AT]
//             ?.replace(/[.,;]/g, '')        // Remove punctuation
//             ?.replace(/\s+/g, ' ')         // Collapse spaces
//             ?.trim()
//     )
//     .filter(Boolean);


//     // Deduplicate based on normalized string
//     const uniqueInventors = [...new Map(
//         cleanedInventors.map(name => [
//             name.toLowerCase(), // key (normalized)
//             name                // value (original casing)
//         ])
//     ).values()];

//     // Title Case
//     const titleCasedInventors = uniqueInventors.map(str =>
//         str.replace(/\b\w/g, char => char.toUpperCase())
//     );

//     return titleCasedInventors.join('; ');
// }, [relatedBiblioData]);

// const relatedApplicantNames = useMemo(() => {
//     const applicants = relatedBiblioData?.parties?.applicants?.applicant;
//     const array = Array.isArray(applicants) ? applicants : applicants ? [applicants] : [];

//     // Define priority: epodoc > original > docdb
//     const priority = { epodoc: 1, original: 2, docdb: 3 };

//     const cleanedApplicants = array
//         .sort((a, b) =>
//             priority[a?.$?.['data-format']] - priority[b?.$?.['data-format']]
//         )
//         .map(app =>
//             app?.['applicant-name']?.name
//                 ?.replace(/\[.*?\]/g, '')      // Remove [US], [AT]
//                 ?.replace(/[.,;]/g, '')        // Remove punctuation
//                 ?.replace(/\s+/g, ' ')         // Collapse spaces
//                 ?.trim()
//         )
//         .filter(Boolean);

//     // Deduplicate based on normalized string
//     const uniqueApplicants = [...new Map(
//         cleanedApplicants.map(name => [
//             name.toLowerCase(), // key (normalized)
//             name                // value (original casing)
//         ])
//     ).values()];

//     // Title Case
//     const titleCasedApplicants = uniqueApplicants.map(str =>
//         str.replace(/\b\w/g, char => char.toUpperCase())
//     );

//     return titleCasedApplicants.join('; ');
// }, [relatedBiblioData]);




    const assigneeAndInventorsName = useMemo(() => {
        return relatedApplicantNames && relatedInventorNames ? `${relatedApplicantNames} / ${relatedInventorNames}` : '';
    }, [relatedApplicantNames, relatedInventorNames]);

    const glAssigneesAndInventor = useMemo(() => {
        return relatedBiblioGoogleData.intentor && relatedBiblioGoogleData.assignees ? ` ${relatedBiblioGoogleData.assignees} / ${relatedBiblioGoogleData.inventors}` : ''

    }, [relatedBiblioGoogleData.intentors, relatedBiblioGoogleData.assignees]);

    const relatedInventionTitle = () => {
        const titleData = relatedBiblioData?.['invention-title'];
        if (Array.isArray(titleData)) {
            const enTitle = titleData.find(t => t?.$?.lang === 'en');
            return enTitle?._ || titleData[0]?._ || '';
        }
        return titleData?._ || '';
    };

    const relatedPublicationDate = () => {
        const docIds = relatedBiblioData?.['publication-reference']?.['document-id'];
        const date =
            Array.isArray(docIds)
                ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
                : docIds?.$?.['document-id-type'] === 'epodoc'
                    ? docIds.date
                    : null;
        return date && /^\d{8}$/.test(date) ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}` : '';
    };

    const relatedFamData = useMemo(() => {
        const familyMembers = relatedData.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];
        const familyArray = Array.isArray(familyMembers) ? familyMembers : familyMembers ? [familyMembers] : [];
        return familyArray.map(member => {
            const docs = member?.["publication-reference"]?.["document-id"] || [];
            const publicationInfo = (Array.isArray(docs) ? docs : [docs])
                .filter(doc => doc?.["$"]?.["document-id-type"] === "docdb")
                .map(doc => `${doc?.["country"]}${doc?.["doc-number"]}${doc?.["kind"]}`)
                .join('');
            return {
                familyId: member?.["$"]?.["family-id"],
                familyPatent: publicationInfo
            };
        });
    }, [relatedBiblioData]);

    const relatedFamilyData = relatedFamData?.map(f => f?.familyPatent).join(', ') || '';


    const memoInventionTitle = useMemo(() => relatedInventionTitle(), [relatedBiblioData]);
    const memoPubDate = useMemo(() => relatedPublicationDate(), [relatedBiblioData]);


    useEffect(() => {
        const isAnyMissing = [
            assigneeAndInventorsName,
            memoInventionTitle,
            relatedFamilyData,
            memoPubDate,

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
                    console.error('❌ Google fallback failed:', googleError);
                }
            })();
        }
    }, [
        assigneeAndInventorsName,
        memoInventionTitle,
        relatedFamilyData,
        memoPubDate,

        // applicantNames,
        // aplDate,
        // priorityDates,
        // classificationsSymbol,
        // abstractData,
        // filteredDescriptions
    ]);




    useEffect(() => {
        if (data?.patentNumber || releventBiblioGoogleData?.patentNumber) {
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
                abstract: (abstractData?.trim() ||
                    releventBiblioGoogleData?.abstract?.trim() ||
                    ""),

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
                    ""
                )
                    .split(",")
                    .map(a => a.trim())
                    .filter(Boolean),
                inventors: (inventorNames ||
                    releventBiblioGoogleData?.inventors ||
                    ""
                )
                    .split(";")
                    .map(i => i.trim())
                    .filter(Boolean),

                classifications: (classificationsSymbol ||
                    googleClassCPC ||
                    ""
                )
                    .split(",")
                    .map(c => c.trim())
                    .filter(Boolean),

                usClassification: (classData.US_Classification ||
                    releventBiblioGoogleData?.usClassification ||
                    ""
                )
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

        try {
            const response = await axios.post(
                `http://localhost:8080/live/projectname/add-relevant-data/${id}`, relevantForm,
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.status === 200) {
                resetRelevantForm();
                const updatedDetails = response.data.stages.relevantReferences.publicationDetails;
                setrelevantFormData(updatedDetails);

            }

        } catch (error) {
            console.error("❌ Error saving publication detail:", error);
        } finally {
            dispatch(setRelevantApiTrue(false));
        }
    };


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
            console.error("❌ Error saving NPL:", error);
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

        } catch (error) {
            console.error("❌ Error saving Overall Summary:", error);
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
        if (relatedData?.patentNumber || relatedBiblioGoogleData?.patentNumber) {
            const combinedForm = {
                publicationNumber: relatedData.patentNumber.trim(),

                relatedPublicationUrl:
                    relatedPublicationUrl ||
                    relatedBiblioGoogleData?.pageUrl ||
                    "",

                relatedTitle:
                    memoInventionTitle ||
                    relatedBiblioGoogleData?.title?.trim() ||
                    "",

                relatedPublicationDate:
                    memoPubDate ||
                    relatedBiblioGoogleData?.publicationDate ||
                    "",

                relatedAssignee: (relatedApplicantNames ||
                    relatedBiblioGoogleData?.assignees ||
                    ""
                )
                    .split(",")
                    .map(a => a.trim())
                    .filter(Boolean),

                relatedInventor: (relatedInventorNames ||
                    relatedBiblioGoogleData?.inventors ||
                    "")
                    .split(";")
                    .map(i => i.trim())
                    .filter(Boolean),


                relatedFamilyMembers: (relatedFamilyData || "")
                    .split(",")
                    .map(f => f.trim())
                    .filter(Boolean),
                relatedPriorityDate: (relatedPriority ||
                    relatedBiblioGoogleData.priorityDate || ""
                )
            };

            setRelatedForm(combinedForm);
        }
    }, [relatedData, relatedBiblioGoogleData]);


    const handleRelatedSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8080/live/projectname/add-related/${id}`, relatedForm,
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200) {
                resetRelatedForm();
                setRelatedFormData(response.data.stages.relatedReferences);

            }
        } catch (error) {
            console.error("❌ Error saving related reference:", error);

            if (error.response) {
                console.error("Server responded with:", error.response.data);
            } else {
                console.error("No response received:", error.request);
            }
        } finally {
            dispatch(setRelatedApiTrue(false));
        }
    };










    // const createPageProperties = (margin = 720, orientation = "portrait") => ({
    //     page: {
    //         margin: {
    //             top: margin,
    //             bottom: margin,
    //             left: margin,
    //             right: margin,
    //         },
    //         size: {
    //             orientation: orientation,
    //             width: 15840,
    //             height: 11573,
    //         },
    //     },
    // });

    // const textStyle = {
    //     arial24: { font: "Arial", size: 48 },
    //     arial14: { font: "Arial", size: 28 },
    //     arial11: { font: "Arial", size: 22 },
    //     arial10: { font: "Arial", size: 20 },
    // };

    // const createTextRun = (text, style = textStyle.arial11, overrides = {}) =>
    //     new TextRun({ text, ...style, ...overrides });



    // const commonBorders = {
    //     top: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
    //     bottom: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
    //     left: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
    //     right: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
    // };

    // const borderNone = {
    //     top: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
    //     bottom: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
    //     left: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
    //     right: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
    // };


    // const createSingleColumnTableRows = (rows) =>
    //     rows.map(({ label, value }) =>
    //         new TableRow({
    //             children: [
    //                 new TableCell({
    //                     children: [new Paragraph({ text: `${label}:`, bold: true })],
    //                     borders: borderNone,
    //                 }),
    //                 new TableCell({
    //                     children: [new Paragraph(value)],
    //                     borders: borderNone,
    //                 }),
    //             ],
    //         })
    //     );

    // const marginsStyle = { margins: { top: 100, bottom: 100, left: 100, right: 100, }, }
    // const margins150 = { margins: { top: 100, bottom: 100, left: 100, right: 100, }, }

    // function formatAssigneeOrInventor(str) {
    //     if (!str) return "";

    //     if (str.includes(";")) {
    //         return str.toLowerCase()
    //             .replace(/\b\w/g, char => char.toUpperCase());
    //     }

    //     return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    // }

    // function toTitleCase(str) {
    //     if (!str) return "";
    //     return String(str)
    //         .toLowerCase()
    //         .split(" ")
    //         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    //         .join(" ");
    // };

    // const sanitizeText = (text) =>
    //     (text || "").replace(/[&<>"]/g, (c) => ({
    //         "&": "&amp;",
    //         "<": "&lt;",
    //         ">": "&gt;",
    //         "\"": "&quot;"
    //     }[c]));

    // function cleanListWithEtc(input) {
    //     const items = input.split(",").map((item) => item.trim());
    //     const result = [];

    //     for (let i = 0; i < items.length; i++) {
    //         if (items[i].toLowerCase() === "etc." && i > 0) {
    //             result[result.length - 1] += ", etc.";
    //         } else if (items[i].toLowerCase().endsWith("etc.")) {
    //             result.push(items[i]);
    //         } else {
    //             result.push(items[i]);
    //         }
    //     }

    //     return result;
    // }

    // async function getImageArrayBufferFromUrl(url) {
    //     const response = await fetch(url);
    //     const blob = await response.blob();
    //     return blob.arrayBuffer();
    // }

    // const disclaimer = "This search report is based on the resources available in public domain such as published patents/applications, non-patent literature, products, blogs, technology news, company websites and available/accessible/downloadable. Furthermore, the report is based upon individual expert’s view/judgment & such analysis may vary from expert to expert. Kindly refrain concurring them as Molecular Connections’ views. The contents of this research is for general information purposes only. While Molecular Connections endeavor is to keep the information up to date and correct, Molecular Connections makes no representations OR warranties of any kind, express OR implied, about the completeness OR availability with respect to the contents of this research paper. Any reliance placed on such information is therefore strictly at user’s own risk."


    // const handleWordReportDownload = async ({
    //     projectTitle,
    //     projectSubTitle,
    //     searchFeatures,
    //     relevantReferences,
    //     relatedReferences,
    //     appendix1,
    //     appendix2,
    //     projectImageUrl,

    // }) => {

    //     const cloudinaryUrls = projectImageUrl.map(buf => buf.base64Url);

    //     const imageBuffers = await Promise.all(
    //         cloudinaryUrls.map(async (url) => await getImageArrayBufferFromUrl(url))
    //     );

    //     const relatedReferencesTable = new Table({
    //         width: { size: 100, type: WidthType.PERCENTAGE },
    //         rows: [
    //             new TableRow({
    //                 children: [
    //                     "S. No",
    //                     "Publication Number",
    //                     "Title",
    //                     "Assignee/Inventor",
    //                     "Priority Date",
    //                     "Publication Date",
    //                     "Family Members",
    //                 ].map((header) =>
    //                     new TableCell({
    //                         shading: {
    //                             fill: "BDD7EE",
    //                             type: ShadingType.CLEAR,
    //                             color: "auto",
    //                         },
    //                         verticalAlign: VerticalAlign.CENTER,
    //                         margins: margins150.margins,
    //                         children: [
    //                             new Paragraph({
    //                                 alignment: AlignmentType.CENTER,
    //                                 children: [
    //                                     createTextRun(header, textStyle.arial10, { bold: true }),
    //                                 ],
    //                             }),
    //                         ],
    //                         borders: commonBorders,
    //                     })
    //                 ),
    //             }),
    //             ...(relatedReferences || []).map((pub, index) =>
    //                 new TableRow({
    //                     children: [
    //                         new TableCell({
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             margins: margins150.margins,
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.LEFT,
    //                                     children: [
    //                                         createTextRun(String(index + 1), textStyle.arial10),
    //                                     ],
    //                                 }),
    //                             ],
    //                             borders: commonBorders,
    //                         }),
    //                         new TableCell({
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             margins: margins150.margins,
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.LEFT,
    //                                     children: [
    //                                         new ExternalHyperlink({
    //                                             link: pub.relatedPublicationUrl,
    //                                             children: [
    //                                                 createTextRun(
    //                                                     sanitizeText(pub.publicationNumber.toUpperCase()),
    //                                                     textStyle.arial10,
    //                                                     { style: "Hyperlink" }
    //                                                 ),
    //                                             ],
    //                                         }),
    //                                     ],
    //                                 }),
    //                             ],
    //                             borders: commonBorders,
    //                         }),
    //                         new TableCell({
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             margins: margins150.margins,
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.LEFT,
    //                                     children: [
    //                                         createTextRun(
    //                                             sanitizeText(toTitleCase(pub.relatedTitle)),
    //                                             textStyle.arial10
    //                                         ),
    //                                     ],
    //                                 }),
    //                             ],
    //                             borders: commonBorders,
    //                         }),
    //                         new TableCell({
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             margins: margins150.margins,
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.LEFT,
    //                                     children: [
    //                                         createTextRun(
    //                                             pub.relatedAssignee?.length
    //                                                 ? pub.relatedAssignee.map(formatAssigneeOrInventor).join('; ')
    //                                                 : pub.relatedInventor?.map(formatAssigneeOrInventor).join('; ') || 'N/A',
    //                                             textStyle.arial10
    //                                         ),
    //                                     ],
    //                                 }),
    //                             ],
    //                             borders: commonBorders,
    //                         }),
    //                         new TableCell({
    //                             width: { size: 10, type: WidthType.PERCENTAGE },
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             margins: margins150.margins,
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.LEFT,
    //                                     children: [
    //                                         createTextRun(
    //                                             sanitizeText(pub.relatedPriorityDate || "N/A"),
    //                                             textStyle.arial10
    //                                         ),
    //                                     ],
    //                                 }),
    //                             ],
    //                             borders: commonBorders,
    //                         }),
    //                         new TableCell({
    //                             width: { size: 10, type: WidthType.PERCENTAGE },
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             margins: margins150.margins,
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.LEFT,
    //                                     children: [
    //                                         createTextRun(
    //                                             sanitizeText(pub.relatedPublicationDate || "N/A"),
    //                                             textStyle.arial10
    //                                         ),
    //                                     ],
    //                                 }),
    //                             ],
    //                             borders: commonBorders,
    //                         }),
    //                         new TableCell({
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             margins: margins150.margins,
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.LEFT,
    //                                     children: [
    //                                         createTextRun(
    //                                             sanitizeText(
    //                                                 (pub.relatedFamilyMembers || []).join(", ") || "N/A"
    //                                             ),
    //                                             textStyle.arial10
    //                                         ),
    //                                     ],
    //                                 }),
    //                             ],
    //                             borders: commonBorders,
    //                         }),
    //                     ],
    //                 })
    //             ),
    //         ],
    //     });

    //     const doc = new Document({
    //         styles: {
    //             default: {
    //                 document: {
    //                     run: {
    //                         font: "Arial",
    //                         size: 20,
    //                     },
    //                     paragraph: {
    //                         spacing: {
    //                             after: 120,
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //         sections: [
    //             // Project Title
    //             {
    //                 properties: createPageProperties(),
    //                 children: [
    //                     new Paragraph({
    //                         children: [
    //                             createTextRun(projectTitle, textStyle.arial24, { bold: true }),
    //                         ],
    //                         alignment: AlignmentType.CENTER,
    //                         spacing: { after: 300 },
    //                     }),
    //                     new Paragraph({
    //                         children: [
    //                             createTextRun(projectSubTitle, textStyle.arial14, { bold: true }),
    //                         ],
    //                         alignment: AlignmentType.CENTER,
    //                         spacing: { before: 400, after: 800 },
    //                     }),
    //                 ],
    //             },
    //             // Search Features
    //             {
    //                 properties: createPageProperties(),
    //                 children: [
    //                     new Paragraph({
    //                         children: [
    //                             createTextRun("1. Search Features", textStyle.arial14, { bold: true, color: "000000" }),
    //                         ],
    //                         alignment: AlignmentType.LEFT,
    //                         spacing: { before: 200, after: 400 },
    //                         indent: { left: 720 },
    //                         heading: HeadingLevel.HEADING_1,
    //                     }),
    //                     ...searchFeatures
    //                         .filter((p) => p.trim() !== "")
    //                         .map((para) =>
    //                             new Paragraph({
    //                                 children: [
    //                                     createTextRun(sanitizeText(para.trim() + "."), textStyle.arial10),
    //                                 ],
    //                                 alignment: AlignmentType.JUSTIFIED,
    //                                 spacing: { before: 200, after: 200 },
    //                             })
    //                         ),

    //                     // ...imageBuffers.map((buffer) =>
    //                     //     new Paragraph({
    //                     //         children: [
    //                     //             new ImageRun({
    //                     //                 data: buffer,
    //                     //                 transformation: {
    //                     //                     width: 200,
    //                     //                     height: 150,
    //                     //                 },
    //                     //             }),
    //                     //         ],
    //                     //         alignment: AlignmentType.CENTER,
    //                     //         spacing: { after: 300 },
    //                     //     })
    //                     // ),
    //                 ],
    //             },
    //             // Search Methodology
    //             {
    //                 properties: createPageProperties(),
    //                 children: getSearchMethodology(projectTitle),
    //             },
    //             // Relevant
    //             {
    //                 properties: createPageProperties(),
    //                 children: [
    //                     new Paragraph({
    //                         children: [
    //                             createTextRun("3. Potentially Relevant References", textStyle.arial14, { bold: true, color: "000000" }),
    //                         ],
    //                         heading: HeadingLevel.HEADING_1,
    //                         spacing: { after: 400 },
    //                     }),

    //                     ...(Array.isArray(relevantReferences)
    //                         ? relevantReferences.flatMap((pub, pubIndex) => {
    //                             const leftTableRows = [
    //                                 { label: "Publication No", value: pub.patentNumber.toUpperCase() },
    //                                 { label: "Title", value: sanitizeText(pub.title) },
    //                                 { label: "Inventor", value: sanitizeText((pub.inventors || []).join(", ")) },
    //                                 { label: "Assignee", value: (pub.assignee || []).join(", ") },
    //                             ];

    //                             const rightTableRows = [
    //                                 { label: "Grant/Publication Date", value: sanitizeText(pub.grantDate) },
    //                                 { label: "Filing/Application Date", value: sanitizeText(pub.filingDate) },
    //                                 { label: "Priority Date", value: sanitizeText(pub.priorityDate) },
    //                                 { label: "IPC/CPC Classifications", value: sanitizeText((pub.classifications || []).join(", ")) },
    //                                 { label: "Family Member", value: sanitizeText((pub.familyMembers || []).join(", ")) },
    //                             ];

    //                             const ptnNumber = new Paragraph({
    //                                 alignment: AlignmentType.START,
    //                                 children: [
    //                                     createTextRun(` ${pubIndex + 1}. ${pub.patentNumber}`, textStyle.arial11, { bold: true, color: "000000" })
    //                                 ],
    //                                 heading: HeadingLevel.HEADING_2,
    //                                 spacing: { after: 200 },
    //                             });

    //                             const table = new Table({
    //                                 width: { size: 100, type: WidthType.PERCENTAGE },
    //                                 rows: [
    //                                     new TableRow({
    //                                         children: [
    //                                             new TableCell({
    //                                                 columnSpan: 2,
    //                                                 shading: {
    //                                                     fill: "BDD7EE",
    //                                                     type: ShadingType.CLEAR,
    //                                                     color: "auto",
    //                                                 },
    //                                                 verticalAlign: VerticalAlign.CENTER,
    //                                                 children: [
    //                                                     new Paragraph({
    //                                                         alignment: AlignmentType.CENTER,
    //                                                         children: [
    //                                                             createTextRun("Bibliographic Details", textStyle.arial10, { bold: true }),
    //                                                         ],
    //                                                     }),
    //                                                 ],
    //                                                 borders: commonBorders,
    //                                                 margins: marginsStyle.margins,
    //                                             }),

    //                                         ],
    //                                     }),
    //                                     new TableRow({
    //                                         margins: marginsStyle.margins,
    //                                         children: [
    //                                             new TableCell({
    //                                                 width: { size: 50, type: WidthType.PERCENTAGE },
    //                                                 borders: commonBorders,
    //                                                 margins: marginsStyle.margins,
    //                                                 children: [
    //                                                     new Table({
    //                                                         width: { size: 100, type: WidthType.PERCENTAGE },
    //                                                         rows: createSingleColumnTableRows(leftTableRows),
    //                                                     }),
    //                                                 ],
    //                                             }),
    //                                             new TableCell({
    //                                                 width: { size: 50, type: WidthType.PERCENTAGE },
    //                                                 borders: commonBorders,
    //                                                 margins: marginsStyle.margins,
    //                                                 children: [
    //                                                     new Table({
    //                                                         width: { size: 100, type: WidthType.PERCENTAGE },
    //                                                         rows: createSingleColumnTableRows(rightTableRows),
    //                                                     }),
    //                                                 ],
    //                                             }),
    //                                         ],
    //                                     }),
    //                                 ],
    //                             });

    //                             const analystComment = pub.analystComments
    //                                 ? new Paragraph({
    //                                     spacing: { before: 300, after: 300 },
    //                                     children: [
    //                                         createTextRun("Analyst Comments – ", textStyle.arial10, { bold: true }),
    //                                         createTextRun(sanitizeText(pub.analystComments), textStyle.arial10, { italics: true }),
    //                                     ],
    //                                 })
    //                                 : null;

    //                             const relevantExcerpts = [
    //                                 new Table({
    //                                     width: { size: 100, type: WidthType.PERCENTAGE },
    //                                     rows: [
    //                                         new TableRow({
    //                                             children: [
    //                                                 new TableCell({
    //                                                     columnSpan: 2,
    //                                                     shading: {
    //                                                         fill: "BDD7EE",
    //                                                         type: ShadingType.CLEAR,
    //                                                         color: "auto",
    //                                                     },
    //                                                     verticalAlign: VerticalAlign.CENTER,
    //                                                     children: [
    //                                                         new Paragraph({
    //                                                             alignment: AlignmentType.CENTER,
    //                                                             children: [
    //                                                                 createTextRun("Relevant Excerpts", textStyle.arial10, { bold: true }),
    //                                                             ],
    //                                                         }),
    //                                                     ],
    //                                                     borders: commonBorders,
    //                                                     margins: marginsStyle.margins,
    //                                                 }),
    //                                             ],
    //                                         }),
    //                                     ],
    //                                 }),
    //                                 new Paragraph({
    //                                     spacing: { before: 200, after: 400 },
    //                                     children: [
    //                                         createTextRun(sanitizeText("[Abstract]"), textStyle.arial10, { bold: true }),
    //                                     ],
    //                                     alignment: AlignmentType.LEFT,
    //                                 }),
    //                                 new Paragraph({
    //                                     spacing: { before: 200, after: 400 },
    //                                     children: [
    //                                         (pub.abstract || pub.relevantExcerpts) ?
    //                                             createTextRun(sanitizeText(pub.abstract || pub.relevantExcerpts), textStyle.arial10)
    //                                             :
    //                                             createTextRun(
    //                                                 '*Abstract is not available, please fill it yourself',
    //                                                 { ...textStyle.arial10, color: 'FF0000' }
    //                                             ),
    //                                     ],
    //                                     alignment: AlignmentType.LEFT,
    //                                 }),
    //                             ].filter(Boolean);
    //                             return [ptnNumber, table, ...(analystComment ? [analystComment] : []), ...relevantExcerpts];
    //                         })
    //                         : []
    //                     ),
    //                 ],
    //             },
    //             // Related
    //             {
    //                 properties: createPageProperties(),
    //                 children: [
    //                     new Paragraph({
    //                         children: [
    //                             createTextRun("4. Related References", textStyle.arial14, { bold: true, color: "000000" }),
    //                         ],
    //                         spacing: { after: 400 },
    //                         heading: HeadingLevel.HEADING_1,
    //                     }),
    //                     new Paragraph({
    //                         children: [
    //                             createTextRun(
    //                                 " (Note: Below references obtained from the quick search are listed as related, as these references fail to disclose at least one or more critical features)",
    //                                 textStyle.arial10,
    //                                 { italics: true }
    //                             ),
    //                         ],
    //                         spacing: { after: 400 },
    //                     }),
    //                     relatedReferencesTable
    //                 ],
    //             },
    //             // Appendix 1
    //             {
    //                 properties: createPageProperties(),
    //                 children: [
    //                     new Paragraph({
    //                         children: [
    //                             createTextRun("Appendix 1", textStyle.arial14, { bold: true, color: "000000" }),
    //                         ],
    //                         heading: HeadingLevel.HEADING_1,
    //                         alignment: AlignmentType.START,
    //                         spacing: { after: 50 },
    //                     }),

    //                     new Paragraph({
    //                         children: [
    //                             createTextRun("Search Terms & Search Strings", textStyle.arial10, { bold: true, color: "000000" }),
    //                         ],
    //                         heading: HeadingLevel.HEADING_2,
    //                         alignment: AlignmentType.START,
    //                         spacing: { after: 30 },
    //                         indent: { left: 520 },
    //                     }),

    //                     new Paragraph({
    //                         children: [
    //                             createTextRun(
    //                                 "The search terms and key strings to extract relevant patent publications and non-patent literature are provided below.",
    //                                 textStyle.arial10
    //                             ),
    //                         ],
    //                         alignment: AlignmentType.START,
    //                         spacing: { after: 30 },
    //                     }),

    //                     new Paragraph({
    //                         children: [
    //                             createTextRun("▶ Search Terms", textStyle.arial11, { bold: true }),
    //                         ],
    //                         alignment: AlignmentType.START,
    //                         spacing: { after: 100 },
    //                         indent: { left: 720 },
    //                     }),

    //                     new Paragraph({
    //                         children: [
    //                             createTextRun("▶ Search Strings", textStyle.arial11, { bold: true }),
    //                         ],
    //                         alignment: AlignmentType.START,
    //                         spacing: { after: 100 },
    //                         indent: { left: 720 },
    //                     }),

    //                     new Table({
    //                         width: {
    //                             size: 100,
    //                             type: WidthType.PERCENTAGE,
    //                         },
    //                         rows: [
    //                             // Header Row
    //                             new TableRow({
    //                                 tableHeader: true,
    //                                 children: [
    //                                     new TableCell({
    //                                         verticalAlign: VerticalAlign.CENTER, // ✅ Vertically center
    //                                         children: [
    //                                             new Paragraph({
    //                                                 alignment: AlignmentType.CENTER, // ✅ Horizontally center
    //                                                 children: [
    //                                                     createTextRun("S. No.", textStyle.arial10, { bold: true, color: "FFFFFF" }),
    //                                                 ],
    //                                             }),
    //                                         ],
    //                                         shading: {
    //                                             fill: "000000", // Black background
    //                                         },
    //                                     }),
    //                                     new TableCell({
    //                                         verticalAlign: VerticalAlign.CENTER, // ✅ Vertically center
    //                                         children: [
    //                                             new Paragraph({
    //                                                 alignment: AlignmentType.CENTER, // ✅ Horizontally center
    //                                                 children: [
    //                                                     createTextRun("Key strings (Patents/Patent Applications)", textStyle.arial10, { bold: true, color: "FFFFFF" }),
    //                                                 ],
    //                                             }),
    //                                         ],
    //                                         shading: {
    //                                             fill: "000000", // Black background
    //                                         },
    //                                     }),
    //                                 ],
    //                             }),

    //                             // Data Rows
    //                             ...appendix1?.keyStrings?.map((keyStr, index) =>
    //                                 new TableRow({
    //                                     children: [
    //                                         new TableCell({
    //                                             children: [
    //                                                 new Paragraph({
    //                                                     alignment: AlignmentType.CENTER,
    //                                                     children: [
    //                                                         createTextRun(`${index + 1}.`, textStyle.arial10),
    //                                                     ],
    //                                                 }),
    //                                             ],
    //                                         }),
    //                                         new TableCell({
    //                                             children: [
    //                                                 new Paragraph({
    //                                                     alignment: AlignmentType.LEFT,
    //                                                     children: [
    //                                                         createTextRun(keyStr.keyStringsText, textStyle.arial10),
    //                                                     ],
    //                                                 }),
    //                                             ],
    //                                         }),
    //                                     ],
    //                                 })
    //                             ),
    //                         ],
    //                         borders: {
    //                             top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                             bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                             left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                             right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                             insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                             insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                         },
    //                     }),


    //                     // new Table({
    //                     //     width: {
    //                     //         size: 100,
    //                     //         type: WidthType.PERCENTAGE,
    //                     //     },
    //                     //     rows: [
    //                     //         new TableRow({
    //                     //             tableHeader: true,
    //                     //             children: [
    //                     //                 new TableCell({
    //                     //                     children: [
    //                     //                         new Paragraph({
    //                     //                             children: [
    //                     //                                 createTextRun("S. No.", textStyle.arial10, { bold: true, color: "FFFFFF" }),
    //                     //                             ],
    //                     //                             alignment: AlignmentType.CENTER,
    //                     //                         }),
    //                     //                     ],
    //                     //                     shading: {
    //                     //                         fill: "000000",
    //                     //                     },
    //                     //                 }),
    //                     //                 new TableCell({
    //                     //                     children: [
    //                     //                         new Paragraph({
    //                     //                             children: [
    //                     //                                 createTextRun("Key strings (Patents/Patent Applications)", textStyle.arial10, { bold: true, color: "FFFFFF" }),
    //                     //                             ],
    //                     //                             alignment: AlignmentType.CENTER,
    //                     //                         }),
    //                     //                     ],
    //                     //                     shading: {
    //                     //                         fill: "000000",
    //                     //                     },
    //                     //                 }),
    //                     //             ],
    //                     //         }),

    //                     //         ...appendix1?.keyStrings?.map((keyStr, index) =>
    //                     //             new TableRow({
    //                     //                 children: [
    //                     //                     new TableCell({
    //                     //                         children: [
    //                     //                             new Paragraph({
    //                     //                                 children: [
    //                     //                                     createTextRun(`${index + 1}.`, textStyle.arial10),
    //                     //                                 ],
    //                     //                                 alignment: AlignmentType.CENTER,
    //                     //                             }),
    //                     //                         ],
    //                     //                     }),
    //                     //                     new TableCell({
    //                     //                         children: [
    //                     //                             new Paragraph({
    //                     //                                 children: [
    //                     //                                     createTextRun(keyStr.keyStringsText, textStyle.arial10),
    //                     //                                 ],
    //                     //                                 alignment: AlignmentType.LEFT,
    //                     //                             }),
    //                     //                         ],
    //                     //                     }),
    //                     //                 ],
    //                     //             })
    //                     //         ),
    //                     //     ],
    //                     //     borders: {
    //                     //         top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                     //         bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                     //         left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                     //         right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                     //         insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                     //         insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                     //     },
    //                     // }),

    //                     new Paragraph({
    //                         children: [
    //                             createTextRun("Data Availability", textStyle.arial11, { bold: true }),
    //                         ],
    //                         alignment: AlignmentType.START,
    //                         spacing: { after: 100 },
    //                         indent: { left: 520 },
    //                     }),
    //                     ...appendix1.dataAvailability.map((mapData) =>
    //                         new Paragraph({
    //                             children: [
    //                                 createTextRun(`✓ ${mapData.dataAvailableText.trim()}`, textStyle.arial10),
    //                             ],
    //                             alignment: AlignmentType.START,
    //                             spacing: { after: 100 },
    //                             indent: { left: 720 },
    //                         }),
    //                     )
    //                 ],
    //             },
    //             // Appendix 2
    //             {
    //                 properties: createPageProperties(),
    //                 children: [
    //                     new Paragraph({
    //                         children: [
    //                             createTextRun("Appendix 2", textStyle.arial14, { bold: true, color: "000000" }),
    //                         ],
    //                         heading: HeadingLevel.HEADING_1,
    //                         alignment: AlignmentType.START,
    //                         spacing: { after: 100 },
    //                     }),

    //                     new Paragraph({
    //                         children: [
    //                             createTextRun("Databases", textStyle.arial11, { bold: true, color: "000000" }),
    //                         ],
    //                         heading: HeadingLevel.HEADING_2,
    //                         alignment: AlignmentType.START,
    //                         spacing: { after: 200 },
    //                         indent: { left: 520 },
    //                     }),

    //                     new Table({
    //                         width: {
    //                             size: 100,
    //                             type: WidthType.PERCENTAGE,
    //                         },
    //                         borders: {
    //                             top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    //                             bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    //                             left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    //                             right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    //                             insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    //                             insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    //                         },
    //                         rows: [
    //                             new TableRow({
    //                                 children: [
    //                                     new TableCell({
    //                                         borders: {
    //                                             top: { style: BorderStyle.NONE },
    //                                             bottom: { style: BorderStyle.NONE },
    //                                             left: { style: BorderStyle.NONE },
    //                                             right: { style: BorderStyle.NONE },
    //                                         },
    //                                         children: [
    //                                             new Paragraph({
    //                                                 children: [
    //                                                     createTextRun("Patents", textStyle.arial10, { bold: true }),
    //                                                 ],
    //                                                 spacing: { after: 100 },
    //                                                 indent: { left: 520 }
    //                                             }),
    //                                             ...cleanListWithEtc(appendix2.patents)
    //                                                 .map((item) =>
    //                                                     new Paragraph({
    //                                                         children: [
    //                                                             createTextRun(`✓ ${item.trim()}`, textStyle.arial10),
    //                                                         ],
    //                                                         indent: { left: 520 }
    //                                                     })
    //                                                 ),
    //                                         ],
    //                                     }),
    //                                     new TableCell({
    //                                         borders: {
    //                                             top: { style: BorderStyle.NONE },
    //                                             bottom: { style: BorderStyle.NONE },
    //                                             left: { style: BorderStyle.NONE },
    //                                             right: { style: BorderStyle.NONE },
    //                                         },
    //                                         children: [
    //                                             new Paragraph({
    //                                                 children: [
    //                                                     createTextRun("Non-patent Literature", textStyle.arial10, { bold: true }),
    //                                                 ],
    //                                                 spacing: { after: 100 },
    //                                             }),
    //                                             ...appendix2.nonPatentLiterature
    //                                                 .split("\n")
    //                                                 .map((item) =>
    //                                                     new Paragraph({
    //                                                         children: [
    //                                                             createTextRun(`✓ ${item.trim()}`, textStyle.arial10),
    //                                                         ],
    //                                                     })
    //                                                 ),
    //                                         ],
    //                                     }),
    //                                 ],
    //                             }),
    //                         ],
    //                     })
    //                 ],
    //             },
    //             // Disclaimer
    //             {
    //                 properties: createPageProperties(),
    //                 children: [
    //                     new Paragraph({
    //                         children: [
    //                             createTextRun("Disclaimer", textStyle.arial14, { bold: true, color: "000000" }),
    //                         ],
    //                         heading: HeadingLevel.HEADING_1,
    //                         alignment: AlignmentType.START,
    //                         spacing: { after: 100 },
    //                     }),

    //                     new Paragraph({
    //                         children: [
    //                             createTextRun(disclaimer, textStyle.arial10,),
    //                         ],
    //                         alignment: AlignmentType.START,
    //                         spacing: { after: 200 },
    //                     }),
    //                 ],
    //             },
    //         ],
    //     });

    //     const blob = await Packer.toBlob(doc);
    //     saveAs(blob, `${projectTitle || "StaticData"}.docx`);
    // };


    const handleReportDownload = async () => {
        try {
            const getProjectValue = await fetchProjectById(id);
            handleWordReportDownload({
                projectTitle: getProjectValue.stages.introduction[0]?.projectTitle || "ProjectTitle",
                projectSubTitle: getProjectValue.stages.introduction[0]?.projectSubTitle || "projectSubTitle",
                searchFeatures: getProjectValue.stages.introduction[0]?.searchFeatures || "searchFeatures",
                relevantReferences: getProjectValue.stages.relevantReferences.publicationDetails || [],
                relatedReferences: getProjectValue.stages.relatedReferences || "relatedReferences",
                appendix1: getProjectValue.stages.appendix1[0] || "Appendix 1",
                appendix2: getProjectValue.stages.appendix2[0] || "Appendix 2",
                projectImageUrl: getProjectValue.stages.introduction[0].projectImageUrl || "projectImageUrl",
                overallSummary: getProjectValue.stages.relevantReferences.overallSummary || "overallSummary",
            });
        } catch (error) {
            console.error("❌ Error in handleReportDownload:", error);
        }
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
                                        selectedProject && (
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
                                                {selectedProject.projectName} /-- {selectedProject.projectType}
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
                                                        setOverallSummary={setOverallSummary}
                                                        handleOverAllSummarySave={handleOverAllSummarySave}
                                                        handleRelevatFormInputChange={handleRelevatFormInputChange}
                                                        resetRelevantForm={resetRelevantForm}

                                                    />

                                                </TabPane>

                                                <>
                                                    <>
                                                        <ReusableDeleteComp
                                                            show={showDeletePublicationModal}
                                                            toggle={() => setShowDeletePublicationModal(false)}
                                                            message="Are you sure you want to delete this publication?"
                                                            onConfirm={handlePublicationDelete}
                                                        />

                                                        <ReusableDeleteComp
                                                            show={showDeleteNonPatentModal}
                                                            toggle={() => setShowDeleteNonPatentModal(false)}
                                                            message="Are you sure you want to delete this Non-Patent?"
                                                            onConfirm={handleNonPatentDelete}
                                                        />

                                                        <ReusableDeleteComp
                                                            show={showDeleteRelatedReferenceModal}
                                                            toggle={() => setShowDeleteRelatedReferenceModal(false)}
                                                            message="Are you sure you want to delete this Related reference?"
                                                            onConfirm={handleRelatedReferenceDelete}
                                                        />

                                                        <ReusableDeleteComp
                                                            show={showDeleteSearchTermModal}
                                                            toggle={() => setShowDeleteSearchTermModal(false)}
                                                            message="Are you sure you want to delete this Search Term Text?"
                                                            onConfirm={handleSearchTermDelete}
                                                        />

                                                        <ReusableDeleteComp
                                                            show={showDeleteKeyStringModal}
                                                            toggle={() => setShowDeleteKeyStringModal(false)}
                                                            message="Are you sure you want to delete this Key String?"
                                                            onConfirm={handleDeleteKeyString}
                                                        />
                                                        <ReusableDeleteComp
                                                            show={showDeleteKeyStringNplModal}
                                                            toggle={() => setShowDeleteKeyStringNplModal(false)}
                                                            message="Are you sure you want to delete this Key String(Npl)?"
                                                            onConfirm={handleDeleteKeyStringNpl}
                                                        />

                                                         <ReusableDeleteComp
                                                            show={showDeleteKeyStringAdditionalModal}
                                                            toggle={() => setShowDeleteKeyStringAdditionalModal(false)}
                                                            message="Are you sure you want to delete this Additional Key String?"
                                                            onConfirm={handleDeleteKeyStringAdditional}
                                                        />

                                                        <ReusableDeleteComp
                                                            show={showDeleteDataAvailabilityModal}
                                                            toggle={() => setShowDeleteDataAvailabilityModal(false)}
                                                            message="Are you sure you want to delete this Data Availability Value?"
                                                            onConfirm={handleDeleteDataAvailability}
                                                        />
                                                    </>
                                                </>
                                                <TabPane tabId={3}>
                                                    <RelatedRefComponent
                                                        relatedLoading={relatedLoading}
                                                        relatedForm={relatedForm}
                                                        handleRelatedSubmit={handleRelatedSubmit}
                                                        handleRelatedFetchPatentData={handleRelatedFetchPatentData}
                                                        handleRelatedInputChange={handleRelatedInputChange}
                                                        relatedFormData={relatedFormData}
                                                        onRelatedDelete={onRelatedDelete}
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