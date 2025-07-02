import React, { useState, useEffect, useMemo } from "react";
import { Card, CardBody, Col, Container, Form, Input, Label, NavItem, NavLink, Row, TabContent, TabPane, Button, Spinner } from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { GOOGLE_API_DATA, EPO_API_DATA } from "../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice";
import { mapFamilyMemberData } from "../../ManagePriorFormat/ReusableComp/Functions";
import { FaFileWord } from "react-icons/fa";


const MappingProjectCreation = () => {

    const dispatch = useDispatch();
    const data = useSelector(state => state.patentSlice.liveEpoRelevantData);
    const relatedData = useSelector(state => state.patentSlice.liveEpoRelatedData);

    const releventBiblioGoogleData = useSelector(state => state.patentSlice.liveGoogleRelevantData);
    const relatedBiblioGoogleData = useSelector(state => state.patentSlice.liveGoogleRelatedData);

    console.log(releventBiblioGoogleData, "releventBiblioGoogleData")

    //meta title
    document.title = "Project Form | MCRPL";

    const [activeTab, setactiveTab] = useState(1);
    const [passedSteps, setPassedSteps] = useState([1]);

    const [analystComments, setAnalystComments] = useState('');
    const [relevantExcerpts, setRelevantExcerpts] = useState('');

    const [patentNumber, setPatentNumber] = useState('');
    const [relatedPatentNumber, setRelatedPatentNumber] = useState('');

    const [famId, setfamId] = useState("");
    const [relatedFamId, setRelatedFamId] = useState("");

    const [loading, setLoading] = useState(false);
    const [relatedLoading, setRelatedLoading] = useState(false);

    const [filteredDescriptions, setFilteredDescriptions] = useState({});

    const [errorValidation, setErrorValidation] = useState(false);
    const [relatedErrorValidation, setRelatedErrorValidation] = useState(false);

    const [usClassification, setUsClassification] = useState('');

    const [overallSummary, setOverallSummary] = useState("");


    const [baseSearchTerm, setBaseSearchTerm] = useState("");
    const [keyString, setKeyString] = useState("");
    const [dataAvailabilityValue, setDataAvailabilityValue] = useState("");

    const [appendix2Patents, setAppendix2Patents] = useState("");
    const [appendix2NPL, setAppendix2NPL] = useState("");


    const [projectFormData, setProjectFormData] = useState({
        projectTitle: '',
        projectSubTitle: '',
        searchFeatures: ''
    });

    const [nplPatentFormData, setNplPatentFormData] = useState({
        title: "",
        url: "",
        publicationDate: "",
        comments: "",
        excerpts: "",
    });


    const handleNplChange = (e) => {
        const { id, value } = e.target;

        const key = id.replace("npl-", "");

        setNplPatentFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const handleSaveBaseSearchTerm = () => {
        console.log("Base Search Term:", baseSearchTerm);
        // Save to DB or State array logic here
    };

    const handleSaveKeyString = () => {
        console.log("Key String:", keyString);
        // Save to DB or State array logic here
    };

    const handleSaveDataAvailability = () => {
        console.log("Data Availability Value:", dataAvailabilityValue);
        // Save to DB or State array logic here
    };




    const handleRelevantChange = (e) => {
        const { name, value } = e.target;
        setProjectFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSaveAppendix2Patents = () => {
        console.log("Appendix 2 - Patents:", appendix2Patents);
        // Save to backend or state array here
    };

    const handleSaveAppendix2NPL = () => {
        console.log("Appendix 2 - Non-Patent Literature:", appendix2NPL);
        // Save to backend or state array here
    };



    // ------------------ Relevant -------------------------

    const handleFetchPatentData = async () => {
        const trimmedNumber = patentNumber.trim();
        setLoading(true);
        try {
            await EPO_API_DATA(trimmedNumber, dispatch, 'relavent');
        } catch (error) {
            setErrorValidation(true);
            setfamId("");

            try {
                setErrorValidation(false);
                await GOOGLE_API_DATA(trimmedNumber, dispatch, 'relavent');
                console.log("✅ Google fallback succeeded");
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

    useEffect(() => {
        if (data?.patentNumber !== undefined) {
            let familyIDs = [];
            const familyMember = data.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];
            if (Array.isArray(familyMember)) {
                familyIDs = data.familyData["world-patent-data"]?.["patent-family"]?.["family-member"][0]?.["$"]?.["family-id"];
            } else if (typeof familyMember === 'object') {
                familyIDs = data.familyData["world-patent-data"]?.["patent-family"]?.["family-member"]?.["$"]?.["family-id"];
            }
            setfamId(`https://worldwide.espacenet.com/patent/search/family/0${familyIDs}/publication/${data?.patentNumber}?q=${data?.patentNumber}`);
        }
    }, [data])

    const biblioData = data?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['bibliographic-data'];
    console.log(biblioData, "biblioDatabiblioData")
    const inventorsData = biblioData?.parties?.inventors?.inventor;

    const inventorsArray = Array.isArray(inventorsData) ? inventorsData : inventorsData ? [inventorsData] : [];

    const inventorNames = inventorsArray.filter(item =>
        ['epodoc', 'original', 'docdb'].includes(item?.$?.['data-format'])).map(item => item?.['inventor-name']?.name
            ?.replace(/,\s*;/g, ';')?.replace(/,\s*$/, '')?.trim()).filter(Boolean).join('; ');

    const applicantsData = biblioData?.parties?.applicants?.applicant;

    const applicantsArray = Array.isArray(applicantsData) ? applicantsData : applicantsData ? [applicantsData] : [];

    const applicantNames = applicantsArray.filter(app => ['epodoc', 'original', 'docdb'].includes(app?.$?.['data-format']))
        .map(app => app?.['applicant-name']?.name?.replace(/,+$/, '').trim()).filter(Boolean).join(', ');

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
            // abstractData,
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
                    await GOOGLE_API_DATA(patentNumber.trim(), dispatch, 'relavent');
                    console.log('✅ Google fallback relevant succeeded');
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
        // abstractData,
        // filteredDescriptions
    ]);

    const googleClassCPC = releventBiblioGoogleData.classifications?.map(map => map.leafCode).join(', ');

    console.log(title, "title", applicantNames, "applicantNames", inventorNames, "inventorNames")

    // -------------------------- Related --------------------------




    const handleRelatedFetchPatentData = async () => {
        const trimmedNumber = relatedPatentNumber.trim();
        setRelatedLoading(true);
        try {
            await EPO_API_DATA(trimmedNumber, dispatch, 'related');
        } catch (error) {
            setRelatedErrorValidation(true);
            setRelatedFamId("");

            try {
                setRelatedErrorValidation(false);
                await GOOGLE_API_DATA(trimmedNumber, dispatch, 'related');
                console.log("✅ Google fallback related succeeded");
            } catch (googleError) {
                setRelatedErrorValidation(true);
                console.error("❌ Google fallback related failed:", googleError);
            }

            console.error("Espacenet fetch error:", error);
        } finally {
            setRelatedLoading(false);
        }
    };



    useEffect(() => {
        if (relatedData?.patentNumber) {
            const familyMember = relatedData.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];
            const firstFamily = Array.isArray(familyMember) ? familyMember[0] : familyMember;
            const familyId = firstFamily?.["$"]?.["family-id"];
            if (familyId) {
                setRelatedFamId(`https://worldwide.espacenet.com/patent/search/family/0${familyId}/publication/${relatedData?.patentNumber}?q=${relatedData?.patentNumber}`);
            }
        }
    }, [relatedData]);

    const relatedBiblioData = relatedData?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['bibliographic-data'];

    const relatedInventorNames = useMemo(() => {
        const inventors = relatedBiblioData?.parties?.inventors?.inventor;
        const array = Array.isArray(inventors) ? inventors : inventors ? [inventors] : [];
        return array
            .filter(item => ['epodoc', 'original', 'docdb'].includes(item?.$?.['data-format']))
            .map(item => item?.['inventor-name']?.name?.replace(/,\s*;/g, ';')?.replace(/,\s*$/, '')?.trim())
            .filter(Boolean)
            .join('; ');
    }, [relatedBiblioData]);

    const relatedApplicantNames = useMemo(() => {
        const applicants = relatedBiblioData?.parties?.applicants?.applicant;
        const array = Array.isArray(applicants) ? applicants : applicants ? [applicants] : [];
        return array
            .filter(app => ['epodoc', 'original', 'docdb'].includes(app?.$?.['data-format']))
            .map(app => app?.['applicant-name']?.name?.replace(/,+$/, '').trim())
            .filter(Boolean)
            .join('; ');
    }, [relatedBiblioData]);

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

    const relatedFamilyData = relatedFamData?.map(f => f?.familyPatent).join(', ') || ''

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
                    await GOOGLE_API_DATA(patentNumber.trim(), dispatch, 'related');
                    console.log('✅ Google fallback related succeeded');
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


    const handleNplSubmit = (e) => {
        e.preventDefault();
        console.log("NPL Patent Form Data:", nplPatentFormData);

        // Optionally reset the form after submit:
        // setNplPatentFormData({
        //   title: "",
        //   url: "",
        //   publicationDate: "",
        //   comments: "",
        //   excerpts: "",
        // });
    };



    const handleOverAllSummarySave = (e) => {
        e.preventDefault();
        console.log("Form Data:", {
            ...overallSummary,
            overallSummary,
        });
    };




    const handleRelevantSubmit = (e) => {
        e.preventDefault();

        const relevantFormData = {
            patentNumber: patentNumber,
            familyID :famId || releventBiblioGoogleData.pageUrl,
            title: title || releventBiblioGoogleData.title?.trim(),
            applicationDate: aplDate || releventBiblioGoogleData.applicationDate,
            publicationDate: pubDate || releventBiblioGoogleData.publicationDate,
            priorityDate: priorityDates || releventBiblioGoogleData.priorityDate,
            assignee: applicantNames || releventBiblioGoogleData.assignees,
            inventors: inventorNames || releventBiblioGoogleData.inventors,
            classifications: classificationsSymbol || googleClassCPC,
            usClassification: usClassification,
            familyMemData: familyMemData,
            analystComments: analystComments,
            relevantExcerpts: relevantExcerpts,

        }
        console.log('relevantFormData', relevantFormData)        
    };

    const handleRelatedSubmit = (e) => {
        e.preventDefault();

        const relatedFormData = {
            patentNumber: patentNumber,
            familyID :famId || releventBiblioGoogleData.pageUrl,
            title: title || releventBiblioGoogleData.title?.trim(),
            publicationDate: pubDate || releventBiblioGoogleData.publicationDate,
            // assignee: applicantNames || releventBiblioGoogleData.assignees,
            // inventors: inventorNames || releventBiblioGoogleData.inventors,
            assigneesOrInventors: `${applicantNames || releventBiblioGoogleData.assignees} / ${inventorNames || releventBiblioGoogleData.inventors} `,
            familyMemData: familyMemData,

        }
        console.log('relatedFormData', relatedFormData)
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


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Creating Mapping Project" breadcrumbItem="Form Wizard" />
                    <Row >
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <h4 className="card-title mb-4">Project Creation</h4>
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
                                                    <Row>
                                                        <Col lg="6">
                                                            <div className="mb-3">
                                                                <Label for="project-title-input">Project Title</Label>
                                                                <Input
                                                                    type="text"
                                                                    name="projectTitle"
                                                                    className="form-control"
                                                                    id="project-title-input"
                                                                    placeholder="Enter Project Title"
                                                                    value={projectFormData.projectTitle}
                                                                    onChange={handleRelevantChange}
                                                                />
                                                            </div>
                                                        </Col>

                                                        <Col lg="6">
                                                            <div className="mb-3">
                                                                <Label for="project-subtitle-input">Project Sub Title</Label>
                                                                <Input
                                                                    type="text"
                                                                    name="projectSubTitle"
                                                                    className="form-control"
                                                                    id="project-subtitle-input"
                                                                    placeholder="Enter Project Sub Title"
                                                                    value={projectFormData.projectSubTitle}
                                                                    onChange={handleRelevantChange}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col lg="12">
                                                            <div className="mb-3">
                                                                <Label for="search-features-input">Search Features</Label>
                                                                <textarea
                                                                    id="search-features-input"
                                                                    className="form-control"
                                                                    rows="3"
                                                                    name="searchFeatures"
                                                                    placeholder="Describe search features here"
                                                                    value={projectFormData.searchFeatures}
                                                                    onChange={handleRelevantChange}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <p className="text-danger">
                                                        ⚠️ Please click the <strong>Save</strong> button before clicking <strong>Next</strong>. Unsaved changes will be lost.
                                                    </p>


                                                    <Col lg="2">
                                                        <div className="mb-3">
                                                            <Button color="success" className="w-100">Save</Button>
                                                        </div>
                                                    </Col>

                                                </TabPane>

                                                <TabPane tabId={2}>
                                                    <h4 className="fw-bold mb-4">1. Publication Details</h4>
                                                    {loading ?
                                                        <div className="blur-loading-overlay text-center mt-4">
                                                            <Spinner color="primary" />
                                                            <p className="mt-2 text-primary">Loading Relevant References...</p>
                                                        </div> :
                                                        <Form onSubmit={handleRelevantSubmit}>
                                                            <Row>
                                                                <p className="text-info">
                                                                    ℹ️ Enter the <strong>Patent Number</strong> and click <strong>Submit</strong> to automatically fetch and fill the bibliographic information.
                                                                </p>

                                                                <Col lg="4">
                                                                    <div className="mb-3">
                                                                        <Label for="publication-number">Publication Number</Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="publication-number"
                                                                            className="form-control"
                                                                            placeholder="Enter Publication Number"
                                                                            value={patentNumber}
                                                                            onChange={(e) => { setPatentNumber(e.target.value); setErrorValidation(false) }}
                                                                            style={{ border: errorValidation ? '1px solid red' : '' }}
                                                                        />

                                                                    </div>
                                                                </Col>
                                                                <Col className="d-grid align-items-end">
                                                                    <div className="mb-3">
                                                                        <Button color="success" onClick={handleFetchPatentData} className="w-100">Submit</Button>
                                                                    </div>
                                                                </Col>

                                                                <Col lg="6">
                                                                    <div className="mb-3">
                                                                        <Label for="publication-url">Publication Number (URL)</Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="publication-url"
                                                                            className="form-control"
                                                                            placeholder="Enter Publication Number URL"
                                                                            value={famId || releventBiblioGoogleData.pageUrl}
                                                                        />
                                                                    </div>
                                                                </Col>

                                                            </Row>

                                                            <Row>
                                                                <Col lg="6">
                                                                    <div className="mb-3">
                                                                        <Label for="title">Title</Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="title"
                                                                            className="form-control"
                                                                            placeholder="Enter Title"
                                                                            value={title || releventBiblioGoogleData.title?.trim()}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col lg="6">
                                                                    <div className="mb-3">
                                                                        <Label for="filing-date">Filing/Application Date (Optional)</Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="filing-date"
                                                                            className="form-control"
                                                                            placeholder="dd-mm-yyyy"
                                                                            value={aplDate || releventBiblioGoogleData.applicationDate}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col lg="6">
                                                                    <div className="mb-3">
                                                                        <Label for="assignees">Assignee(s)</Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="assignees"
                                                                            className="form-control"
                                                                            placeholder="Enter Assignees: Comma(,) Separated Values"
                                                                            value={applicantNames || releventBiblioGoogleData.assignees}
                                                                        />
                                                                    </div>
                                                                </Col>

                                                                <Col lg="6">
                                                                    <div className="mb-3">
                                                                        <Label for="grant-date">Grant/Publication Date</Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="grant-date"
                                                                            className="form-control"
                                                                            placeholder="dd-mm-yyyy"
                                                                            value={pubDate || releventBiblioGoogleData.publicationDate}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col lg="6">
                                                                    <div className="mb-3">
                                                                        <Label for="inventors">Inventor(s)</Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="inventors"
                                                                            className="form-control"
                                                                            placeholder="Enter Inventors: Semicolon(;) Separated Values"
                                                                            value={inventorNames || releventBiblioGoogleData.inventors}
                                                                        />
                                                                    </div>
                                                                </Col>

                                                                <Col lg="6">
                                                                    <div className="mb-3">
                                                                        <Label for="priority-date">Priority Date (Optional)</Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="priority-date"
                                                                            className="form-control"
                                                                            placeholder="dd-mm-yyyy"
                                                                            value={priorityDates || releventBiblioGoogleData.priorityDate}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col lg="6">
                                                                    <div className="mb-3">
                                                                        <Label for="ipc-cpc">IPC/CPC Classification</Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="ipc-cpc"
                                                                            className="form-control"
                                                                            placeholder="Enter IPC/CPC Classification: Comma(,) Separated Values"
                                                                            value={classificationsSymbol || googleClassCPC}
                                                                        />
                                                                    </div>
                                                                </Col>

                                                                <Col lg="6">
                                                                    <div className="mb-3">
                                                                        <Label for="us-classification">US Classification (Optional)</Label>
                                                                        <Input
                                                                            type="text"
                                                                            id="us-classification"
                                                                            className="form-control"
                                                                            placeholder="Enter US Classification: Comma(,) Separated Values"
                                                                            value={usClassification}
                                                                            onChange={(e) => setUsClassification(e.target.value)}
                                                                        />
                                                                    </div>

                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col lg="12">
                                                                    <div className="mb-3">
                                                                        <Label for="family-members">Family Member(s)</Label>
                                                                        <textarea
                                                                            id="family-members"
                                                                            className="form-control"
                                                                            rows="3"
                                                                            placeholder="Enter Family Members: Comma(,) Separated Values"
                                                                            value={familyMemData}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col lg="12">
                                                                    <div className="mb-3">
                                                                        <Label for="analyst-comments">Analyst Comments</Label>
                                                                        <textarea
                                                                            id="analyst-comments"
                                                                            className="form-control"
                                                                            rows="3"
                                                                            placeholder="Enter Comments"
                                                                            value={analystComments}
                                                                            onChange={(e) => setAnalystComments(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col lg="12">
                                                                    <div className="mb-3">
                                                                        <Label for="relevant-excerpts">Relevant Excerpts</Label>
                                                                        <textarea
                                                                            id="relevant-excerpts"
                                                                            className="form-control"
                                                                            rows="3"
                                                                            placeholder="Enter Relevant Excerpts"
                                                                            value={relevantExcerpts}
                                                                            onChange={(e) => setRelevantExcerpts(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Col lg="2">
                                                                <div className="mb-3">
                                                                    <Button color="info" type="submit" className="w-100">+ Add Relevant </Button>
                                                                </div>
                                                            </Col>
                                                        </Form>
                                                    }

                                                    <p>TableContainer for relevant</p>


                                                    <h4 className="fw-bold mb-4">2. Non-Patent Literatures(NPL)</h4>

                                                    <Form onSubmit={handleNplSubmit}>
                                                        <Row>
                                                            <Col lg="4">
                                                                <div className="mb-3">
                                                                    <Label for="npl-title">Title / Product Name</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="npl-title"
                                                                        className="form-control"
                                                                        placeholder="Enter Title / Product Name"
                                                                        value={nplPatentFormData.title}
                                                                        onChange={handleNplChange}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col lg="4">
                                                                <div className="mb-3">
                                                                    <Label for="npl-url">URL</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="npl-url"
                                                                        className="form-control"
                                                                        placeholder="Enter NPL URL"
                                                                        value={nplPatentFormData.url}
                                                                        onChange={handleNplChange}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col lg="4">
                                                                <div className="mb-3">
                                                                    <Label for="npl-pub-date">Publication Date</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="npl-publicationDate"
                                                                        className="form-control"
                                                                        placeholder="dd-mm-yyyy"
                                                                        value={nplPatentFormData.publicationDate}
                                                                        onChange={handleNplChange}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="npl-comments">Analyst Comments</Label>
                                                                    <textarea
                                                                        id="npl-comments"
                                                                        className="form-control"
                                                                        rows="3"
                                                                        placeholder="Enter Comments"
                                                                        value={nplPatentFormData.comments}
                                                                        onChange={handleNplChange}
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="npl-excerpts">Relevant Excerpts</Label>
                                                                    <textarea
                                                                        id="npl-excerpts"
                                                                        className="form-control"
                                                                        rows="3"
                                                                        placeholder="Enter Relevant Excerpts"
                                                                        value={nplPatentFormData.excerpts}
                                                                        onChange={handleNplChange}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        <Col lg="2">
                                                            <div className="mb-3">
                                                                <Button color="info" className="w-100" type="submit">
                                                                    + Non-Patent Literature
                                                                </Button>
                                                            </div>
                                                        </Col>
                                                    </Form>
                                                    <p>TableContainer for Npl</p>


                                                    <h4 className="fw-bold mb-4">2. Overall Summary of Search and Prior Arts</h4>
                                                    <Row>
                                                        <Col lg="12">
                                                            <div className="mb-3">
                                                                <Label for="overall-summary">Overall Summary</Label>
                                                                <textarea
                                                                    id="overall-summary"
                                                                    className="form-control"
                                                                    rows="3"
                                                                    placeholder="Enter Overall Summary"
                                                                    value={overallSummary}
                                                                    onChange={(e) => setOverallSummary(e.target.value)}
                                                                />
                                                            </div>

                                                        </Col>
                                                    </Row>
                                                    <Col lg="2">
                                                        <div className="mb-3">
                                                            <Button onClick={handleOverAllSummarySave} color="warning" className="w-100">Save Summary</Button>
                                                        </div>
                                                    </Col>




                                                </TabPane>

                                                <TabPane tabId={3}>

                                                    <h4 className="fw-bold mb-3">Related References</h4>
                                                    <p className="text-muted mb-4">
                                                        <i> <strong>Note:</strong> Below references are listed as related references as these references fail to disclose at least one or more features of the objective.</i>
                                                    </p>

                                                    {
                                                        relatedLoading ? (
                                                            <div className="blur-loading-overlay text-center mt-4">
                                                                <Spinner color="primary" />
                                                                <p className="mt-2 text-primary">Loading Related References...</p>
                                                            </div>
                                                        ) : (
                                                            <Form onSubmit={handleRelatedSubmit}>
                                                                <Row>
                                                                    <Col lg="4">
                                                                        <div className="mb-3">
                                                                            <Label for="related-publication-number">Publication Number</Label>
                                                                            <Input
                                                                                type="text"
                                                                                id="related-publication-number"
                                                                                className="form-control"
                                                                                placeholder="Enter Publication Number"
                                                                                value={relatedPatentNumber || ""}
                                                                                onChange={(e) => { setRelatedPatentNumber(e.target.value); setRelatedErrorValidation(false) }}
                                                                                style={{ border: relatedErrorValidation ? '1px solid red' : '' }}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                    <Col lg="2 d-grid align-items-end">
                                                                        <div className="mb-3">
                                                                            <Button color="success" className="w-100" onClick={handleRelatedFetchPatentData}>Submit</Button>
                                                                        </div>
                                                                    </Col>

                                                                    <Col lg="6">
                                                                        <div className="mb-3">
                                                                            <Label for="related-publication-url">Publication Number (URL)</Label>
                                                                            <Input
                                                                                type="text"
                                                                                id="related-publication-url"
                                                                                className="form-control"
                                                                                placeholder="Enter Publication Number URL"
                                                                                value={relatedFamId || relatedBiblioGoogleData.pageUrl}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col lg="6">
                                                                        <div className="mb-3">
                                                                            <Label for="related-title">Title</Label>
                                                                            <Input
                                                                                type="text"
                                                                                id="related-title"
                                                                                className="form-control"
                                                                                placeholder="Enter Title"
                                                                                value={memoInventionTitle || relatedBiblioGoogleData.title}
                                                                            />
                                                                        </div>
                                                                    </Col>

                                                                    <Col lg="6">
                                                                        <div className="mb-3">
                                                                            <Label for="related-assignee-inventor">Assignee(s) / Inventor(s)</Label>
                                                                            <Input
                                                                                type="text"
                                                                                id="related-assignee-inventor"
                                                                                className="form-control"
                                                                                placeholder="Enter Assignees/Inventors: Semicolon(;) Separated Values"
                                                                                value={assigneeAndInventorsName || glAssigneesAndInventor}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                </Row>

                                                                <Row>
                                                                    <Col lg="6">
                                                                        <div className="mb-3">
                                                                            <Label for="related-family-members">Family Member(s)</Label>
                                                                            <textarea
                                                                                id="related-family-members"
                                                                                className="form-control"
                                                                                rows="3"
                                                                                placeholder="Enter Family Members: Comma(,) Separated Values"
                                                                                value={relatedFamilyData}
                                                                            />
                                                                        </div>
                                                                    </Col>
                                                                    <Col lg="6">
                                                                        <div className="mb-3">
                                                                            <Label for="related-pub-date">Publication Date (Optional)</Label>
                                                                            <Input
                                                                                type="text"
                                                                                id="related-pub-date"
                                                                                className="form-control"
                                                                                placeholder="dd-mm-yyyy"
                                                                                value={memoPubDate || relatedBiblioGoogleData.publicationDate}
                                                                            />
                                                                        </div>
                                                                        <div className="">
                                                                            <Button color="info" type="submit" className="w-100">+ Add Related </Button>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </Form>
                                                        )
                                                    }

                                                    <p>TableContainer for Related</p>

                                                </TabPane>

                                                <TabPane tabId={4}>
                                                    <h4 className="fw-bold mb-3">Appendix 1</h4>
                                                    <p className="text-muted mb-4">
                                                        <i>The search terms and key strings to extract relevant patent publications and non-patent literature are provided below.</i>
                                                    </p>

                                                    <h5 className="fw-semibold">1. Base Search Terms</h5>
                                                    <Row>
                                                        <Col lg="12">
                                                            <div className="mb-3">
                                                                <Label for="base-search-terms">Enter Terms</Label>
                                                                <textarea
                                                                    id="base-search-terms"
                                                                    className="form-control"
                                                                    rows="3"
                                                                    placeholder="Enter search terms like: patents, live, alive, etc."
                                                                    value={baseSearchTerm}
                                                                    onChange={(e) => setBaseSearchTerm(e.target.value)}
                                                                />

                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Col lg={2}>
                                                        <div className="mb-3">
                                                            <Button color="info" className="w-100" onClick={handleSaveBaseSearchTerm}>
                                                                + Base Search Terms
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                    <p>TableContainer for Base Search Terms</p>

                                                    <h5 className="fw-semibold">2. Search Strings</h5>
                                                    <Row>
                                                        <Col lg="12">
                                                            <div className="mb-3">
                                                                <Label for="key-strings">Key Strings</Label>
                                                                <textarea
                                                                    id="key-strings"
                                                                    className="form-control"
                                                                    rows="3"
                                                                    placeholder="Enter key strings (Orbit, USPTO, PatSeer, Google Patent, Scholar, IEEE, etc.)"
                                                                    value={keyString}
                                                                    onChange={(e) => setKeyString(e.target.value)}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Col lg={2}>
                                                        <div className="mb-3">
                                                            <Button color="info" className="w-100" onClick={handleSaveKeyString}>
                                                                + Key Strings
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                    <p>TableContainer for Search Strings</p>


                                                    <h5 className="fw-semibold">3. Data Availability</h5>
                                                    <Row>
                                                        <Col lg="12">
                                                            <div className="mb-3">
                                                                <Label for="data-availability-value">Value</Label>
                                                                <Input
                                                                    type="text"
                                                                    id="data-availability-value"
                                                                    className="form-control"
                                                                    placeholder="Enter value"
                                                                    value={dataAvailabilityValue}
                                                                    onChange={(e) => setDataAvailabilityValue(e.target.value)}
                                                                />

                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Col lg={2}>
                                                        <div className="mb-3">
                                                            <Button color="info" className="w-100" onClick={handleSaveDataAvailability}>
                                                                + Add Value
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                    <p>TableContainer for Data Availability</p>


                                                </TabPane>

                                                <TabPane tabId={5}>
                                                    <h4 className="fw-bold mb-3">Appendix 2</h4>

                                                    <Row>
                                                        <Col lg="12">
                                                            <div className="mb-3">
                                                                <Label for="appendix2-patents">Patents</Label>
                                                                <textarea
                                                                    id="appendix2-patents"
                                                                    className="form-control"
                                                                    rows="4"
                                                                    placeholder="Enter relevant patent references or notes here"
                                                                    value={appendix2Patents}
                                                                    onChange={(e) => setAppendix2Patents(e.target.value)}
                                                                />

                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Col lg="2">
                                                        <div className="mb-3">
                                                            <Button color="warning" className="w-100" onClick={handleSaveAppendix2Patents}>
                                                                Save Summary
                                                            </Button>
                                                        </div>
                                                    </Col>

                                                    <Row>
                                                        <Col lg="12">
                                                            <div className="mb-3">
                                                                <Label for="appendix2-npl">Non-Patent Literature</Label>
                                                                <textarea
                                                                    id="appendix2-npl"
                                                                    className="form-control"
                                                                    rows="4"
                                                                    placeholder="Enter non-patent literature references or notes here"
                                                                    value={appendix2NPL}
                                                                    onChange={(e) => setAppendix2NPL(e.target.value)}
                                                                />

                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Col lg="2">
                                                        <div className="mb-3">
                                                            <Button color="warning" className="w-100" onClick={handleSaveAppendix2NPL}>
                                                                Save Summary
                                                            </Button>
                                                        </div>
                                                    </Col>

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
                                                        <button style={{ height:'33.75px' }} className="btn btn-sm btn-outline-primary">
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